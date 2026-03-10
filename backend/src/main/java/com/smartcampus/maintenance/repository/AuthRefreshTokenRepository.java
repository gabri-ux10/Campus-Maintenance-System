package com.smartcampus.maintenance.repository;

import com.smartcampus.maintenance.entity.AuthRefreshToken;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRefreshTokenRepository extends JpaRepository<AuthRefreshToken, Long> {

    Optional<AuthRefreshToken> findByTokenHash(String tokenHash);

    List<AuthRefreshToken> findByUser_IdAndRevokedAtIsNull(Long userId);

    List<AuthRefreshToken> findByTokenFamilyAndRevokedAtIsNull(String tokenFamily);

    long deleteByExpiresAtBefore(LocalDateTime expiresAt);

    long deleteByRevokedAtBefore(LocalDateTime revokedAt);
}
