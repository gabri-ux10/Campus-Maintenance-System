package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.entity.AuthRefreshToken;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.exception.UnauthorizedException;
import com.smartcampus.maintenance.repository.AuthRefreshTokenRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthRefreshTokenService {

    public record IssuedRefreshToken(String rawToken, LocalDateTime expiresAt) {
    }

    private final AuthRefreshTokenRepository authRefreshTokenRepository;
    private final TokenHashService tokenHashService;
    private final long refreshTokenTtlDays;

    public AuthRefreshTokenService(
            AuthRefreshTokenRepository authRefreshTokenRepository,
            TokenHashService tokenHashService,
            @Value("${app.auth.refresh-token-ttl-days:14}") long refreshTokenTtlDays) {
        this.authRefreshTokenRepository = authRefreshTokenRepository;
        this.tokenHashService = tokenHashService;
        this.refreshTokenTtlDays = Math.max(1, refreshTokenTtlDays);
    }

    @Transactional
    public IssuedRefreshToken issue(User user, RequestMetadata metadata) {
        String rawToken = tokenHashService.generateUrlToken(48);
        AuthRefreshToken token = new AuthRefreshToken();
        token.setUser(user);
        token.setTokenHash(tokenHashService.hashSha256(rawToken));
        token.setTokenFamily(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusDays(refreshTokenTtlDays));
        applyMetadata(token, metadata);
        authRefreshTokenRepository.save(token);
        return new IssuedRefreshToken(rawToken, token.getExpiresAt());
    }

    @Transactional
    public User consumeForRefresh(String rawToken, RequestMetadata metadata) {
        AuthRefreshToken token = loadToken(rawToken);
        if (token.isRevoked()) {
            revokeFamily(token.getTokenFamily());
            throw new UnauthorizedException("Refresh token is no longer valid.");
        }
        if (token.isExpired()) {
            token.setRevokedAt(LocalDateTime.now());
            authRefreshTokenRepository.save(token);
            throw new UnauthorizedException("Refresh token has expired.");
        }
        token.setLastUsedAt(LocalDateTime.now());
        applyMetadata(token, metadata);
        authRefreshTokenRepository.save(token);
        return token.getUser();
    }

    @Transactional
    public IssuedRefreshToken rotate(String rawToken, User user, RequestMetadata metadata) {
        AuthRefreshToken currentToken = loadToken(rawToken);
        if (currentToken.isRevoked()) {
            revokeFamily(currentToken.getTokenFamily());
            throw new UnauthorizedException("Refresh token reuse detected.");
        }
        if (currentToken.isExpired()) {
            currentToken.setRevokedAt(LocalDateTime.now());
            authRefreshTokenRepository.save(currentToken);
            throw new UnauthorizedException("Refresh token has expired.");
        }

        String nextRawToken = tokenHashService.generateUrlToken(48);
        String nextHash = tokenHashService.hashSha256(nextRawToken);

        currentToken.setRevokedAt(LocalDateTime.now());
        currentToken.setRotatedAt(LocalDateTime.now());
        currentToken.setLastUsedAt(LocalDateTime.now());
        currentToken.setReplacedByTokenHash(nextHash);
        authRefreshTokenRepository.save(currentToken);

        AuthRefreshToken nextToken = new AuthRefreshToken();
        nextToken.setUser(user);
        nextToken.setTokenHash(nextHash);
        nextToken.setTokenFamily(currentToken.getTokenFamily());
        nextToken.setExpiresAt(LocalDateTime.now().plusDays(refreshTokenTtlDays));
        applyMetadata(nextToken, metadata);
        authRefreshTokenRepository.save(nextToken);
        return new IssuedRefreshToken(nextRawToken, nextToken.getExpiresAt());
    }

    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }
        authRefreshTokenRepository.findByTokenHash(tokenHashService.hashSha256(rawToken.trim()))
                .ifPresent(token -> {
                    if (!token.isRevoked()) {
                        token.setRevokedAt(LocalDateTime.now());
                        authRefreshTokenRepository.save(token);
                    }
                });
    }

    @Transactional
    public void revokeAllForUser(Long userId) {
        if (userId == null) {
            return;
        }
        List<AuthRefreshToken> tokens = authRefreshTokenRepository.findByUser_IdAndRevokedAtIsNull(userId);
        LocalDateTime now = LocalDateTime.now();
        tokens.forEach(token -> token.setRevokedAt(now));
        authRefreshTokenRepository.saveAll(tokens);
    }

    @Transactional
    public long cleanupExpiredOrRevoked(LocalDateTime expiredBefore, LocalDateTime revokedBefore) {
        long expired = authRefreshTokenRepository.deleteByExpiresAtBefore(expiredBefore);
        long revoked = authRefreshTokenRepository.deleteByRevokedAtBefore(revokedBefore);
        return expired + revoked;
    }

    private void revokeFamily(String tokenFamily) {
        List<AuthRefreshToken> familyTokens = authRefreshTokenRepository.findByTokenFamilyAndRevokedAtIsNull(tokenFamily);
        LocalDateTime now = LocalDateTime.now();
        familyTokens.forEach(token -> token.setRevokedAt(now));
        authRefreshTokenRepository.saveAll(familyTokens);
    }

    private AuthRefreshToken loadToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new UnauthorizedException("Refresh token is required.");
        }
        return authRefreshTokenRepository.findByTokenHash(tokenHashService.hashSha256(rawToken.trim()))
                .orElseThrow(() -> new UnauthorizedException("Refresh token is invalid."));
    }

    private void applyMetadata(AuthRefreshToken token, RequestMetadata metadata) {
        if (metadata == null) {
            return;
        }
        token.setIpAddress(metadata.ipAddress());
        token.setUserAgent(metadata.userAgent());
    }
}
