package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.dto.auth.AcceptStaffInviteRequest;
import com.smartcampus.maintenance.dto.auth.AuthResponse;
import com.smartcampus.maintenance.dto.auth.CurrentUserResponse;
import com.smartcampus.maintenance.dto.auth.LoginRequest;
import com.smartcampus.maintenance.dto.auth.RegisterRequest;
import com.smartcampus.maintenance.entity.EmailVerificationToken;
import com.smartcampus.maintenance.entity.PasswordResetToken;
import com.smartcampus.maintenance.entity.StaffInvite;
import com.smartcampus.maintenance.entity.User;
import com.smartcampus.maintenance.entity.enums.Role;
import com.smartcampus.maintenance.exception.BadRequestException;
import com.smartcampus.maintenance.exception.ConflictException;
import com.smartcampus.maintenance.exception.UnauthorizedException;
import com.smartcampus.maintenance.repository.EmailVerificationTokenRepository;
import com.smartcampus.maintenance.repository.PasswordResetTokenRepository;
import com.smartcampus.maintenance.repository.StaffInviteRepository;
import com.smartcampus.maintenance.repository.UserRepository;
import com.smartcampus.maintenance.security.JwtService;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final StaffInviteRepository staffInviteRepository;
    private final UserService userService;
    private final PasswordPolicyService passwordPolicyService;
    private final TokenHashService tokenHashService;
    private final EmailService emailService;
    private final AuthRefreshTokenService authRefreshTokenService;
    private final RefreshCookieService refreshCookieService;
    private final AuditEventService auditEventService;
    private final String frontendBaseUrl;
    private final long verificationCodeTtlMinutes;
    private final long resetTokenTtlMinutes;
    private final int verificationCodeMaxAttempts;
    private final long verificationResendCooldownSeconds;
    private final long resetRequestCooldownSeconds;
    private final long publicRequestMinDelayMs;
    private final SecureRandom secureRandom;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PasswordResetTokenRepository resetTokenRepository,
            EmailVerificationTokenRepository verificationTokenRepository,
            StaffInviteRepository staffInviteRepository,
            UserService userService,
            PasswordPolicyService passwordPolicyService,
            TokenHashService tokenHashService,
            EmailService emailService,
            AuthRefreshTokenService authRefreshTokenService,
            RefreshCookieService refreshCookieService,
            AuditEventService auditEventService,
            @Value("${app.frontend.base-url:http://localhost:5173}") String frontendBaseUrl,
            @Value("${app.auth.verification-code-ttl-minutes:15}") long verificationCodeTtlMinutes,
            @Value("${app.auth.reset-token-ttl-minutes:60}") long resetTokenTtlMinutes,
            @Value("${app.auth.verification-code-max-attempts:5}") int verificationCodeMaxAttempts,
            @Value("${app.auth.verification-resend-cooldown-seconds:60}") long verificationResendCooldownSeconds,
            @Value("${app.auth.reset-request-cooldown-seconds:60}") long resetRequestCooldownSeconds,
            @Value("${app.auth.public-request-min-delay-ms:350}") long publicRequestMinDelayMs) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.resetTokenRepository = resetTokenRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.staffInviteRepository = staffInviteRepository;
        this.userService = userService;
        this.passwordPolicyService = passwordPolicyService;
        this.tokenHashService = tokenHashService;
        this.emailService = emailService;
        this.authRefreshTokenService = authRefreshTokenService;
        this.refreshCookieService = refreshCookieService;
        this.auditEventService = auditEventService;
        this.frontendBaseUrl = frontendBaseUrl;
        this.verificationCodeTtlMinutes = verificationCodeTtlMinutes;
        this.resetTokenTtlMinutes = resetTokenTtlMinutes;
        this.verificationCodeMaxAttempts = verificationCodeMaxAttempts;
        this.verificationResendCooldownSeconds = verificationResendCooldownSeconds;
        this.resetRequestCooldownSeconds = resetRequestCooldownSeconds;
        this.publicRequestMinDelayMs = publicRequestMinDelayMs;
        this.secureRandom = new SecureRandom();
    }

    public AuthResponse login(LoginRequest request, RequestMetadata metadata, HttpHeaders responseHeaders) {
        String username = request.username().trim();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, request.password()));
        } catch (AuthenticationException ex) {
            auditEventService.record(
                    "auth.login.failed",
                    null,
                    "login",
                    username,
                    metadata,
                    Map.of("reason", "invalid_credentials"));
            throw new UnauthorizedException("Invalid credentials");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (!user.isEmailVerified()) {
            auditEventService.record(
                    "auth.login.failed",
                    user,
                    "user",
                    String.valueOf(user.getId()),
                    metadata,
                    Map.of("reason", "email_not_verified"));
            throw new UnauthorizedException("Email not verified. Enter your verification code first.");
        }

        AuthRefreshTokenService.IssuedRefreshToken refreshToken = authRefreshTokenService.issue(user, metadata);
        refreshCookieService.writeRefreshCookie(responseHeaders, refreshToken.rawToken(), durationUntil(refreshToken.expiresAt()));
        auditEventService.record(
                "auth.login.success",
                user,
                "user",
                String.valueOf(user.getId()),
                metadata,
                Map.of("role", user.getRole().name()));
        return buildAuthResponse(user);
    }

    public AuthResponse refreshSession(String rawRefreshToken, RequestMetadata metadata, HttpHeaders responseHeaders) {
        User user = authRefreshTokenService.consumeForRefresh(rawRefreshToken, metadata);
        AuthRefreshTokenService.IssuedRefreshToken rotatedToken = authRefreshTokenService.rotate(rawRefreshToken, user,
                metadata);
        refreshCookieService.writeRefreshCookie(responseHeaders, rotatedToken.rawToken(),
                durationUntil(rotatedToken.expiresAt()));
        auditEventService.record(
                "auth.refresh.success",
                user,
                "user",
                String.valueOf(user.getId()),
                metadata,
                Map.of("role", user.getRole().name()));
        return buildAuthResponse(user);
    }

    public void logout(String rawRefreshToken, RequestMetadata metadata, HttpHeaders responseHeaders) {
        authRefreshTokenService.revoke(rawRefreshToken);
        refreshCookieService.clearRefreshCookie(responseHeaders);
        auditEventService.record(
                "auth.logout",
                null,
                "refresh_token",
                null,
                metadata,
                Map.of("hadCookie", rawRefreshToken != null && !rawRefreshToken.isBlank()));
    }

    public CurrentUserResponse currentUser(User user) {
        return new CurrentUserResponse(user.getUsername(), user.getFullName(), user.getRole().name());
    }

    @Transactional
    public void registerStudent(RegisterRequest request, RequestMetadata metadata) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();
        String fullName = request.fullName().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            List<String> suggestions = userService.suggestAvailableUsernames(username, fullName, 5);
            throw new ConflictException("Username is already in use. Try: " + String.join(", ", suggestions));
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email is already in use");
        }
        passwordPolicyService.enforce(request.password(), username, email, fullName);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setRole(Role.STUDENT);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEmailVerified(false);
        User saved = userRepository.save(user);
        issueEmailVerificationCode(saved);
        auditEventService.record(
                "auth.registered",
                saved,
                "user",
                String.valueOf(saved.getId()),
                metadata,
                Map.of("email", saved.getEmail()));
    }

    @Transactional
    public void verifyEmail(String email, String code, RequestMetadata metadata) {
        String normalizedEmail = email.trim().toLowerCase();
        String normalizedCode = code.trim();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid verification code."));

        if (user.isEmailVerified()) {
            return;
        }

        EmailVerificationToken token = verificationTokenRepository
                .findTopByUser_IdAndUsedFalseOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new BadRequestException("Invalid verification code."));

        if (token.isExpired()) {
            token.setUsed(true);
            verificationTokenRepository.save(token);
            throw new BadRequestException("Verification code expired. Request a new code.");
        }

        if (!token.getCode().equals(normalizedCode)) {
            int attempts = token.getAttemptCount() + 1;
            token.setAttemptCount(attempts);
            if (attempts >= verificationCodeMaxAttempts) {
                token.setUsed(true);
            }
            verificationTokenRepository.save(token);

            if (attempts >= verificationCodeMaxAttempts) {
                auditEventService.record(
                        "auth.verify_email.locked",
                        user,
                        "user",
                        String.valueOf(user.getId()),
                        metadata,
                        Map.of("email", normalizedEmail));
                throw new BadRequestException("Too many invalid attempts. Request a new code.");
            }
            throw new BadRequestException("Invalid verification code.");
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        verificationTokenRepository.save(token);

        emailService.sendWelcomeEmail(user.getFullName(), user.getEmail(), buildLoginUrl());
        auditEventService.record(
                "auth.verify_email.success",
                user,
                "user",
                String.valueOf(user.getId()),
                metadata,
                Map.of("email", normalizedEmail));
    }

    @Transactional
    public void resendVerificationCode(String email, RequestMetadata metadata) {
        long startedAtNs = System.nanoTime();
        try {
            String normalizedEmail = email.trim().toLowerCase();
            User user = userRepository.findByEmail(normalizedEmail).orElse(null);
            if (user == null) {
                log.info("Verification resend requested for unknown email: {}", normalizedEmail);
                auditEventService.record(
                        "auth.verify_email.resend.unknown",
                        null,
                        "email",
                        normalizedEmail,
                        metadata,
                        Map.of());
                return;
            }
            if (user.isEmailVerified()) {
                log.info("Verification resend ignored for already-verified email: {}", normalizedEmail);
                return;
            }

            var activeToken = verificationTokenRepository.findTopByUser_IdAndUsedFalseOrderByCreatedAtDesc(user.getId());
            if (activeToken.isPresent() && isCooldownActive(activeToken.get().getCreatedAt(), verificationResendCooldownSeconds)
                    && !activeToken.get().isExpired()) {
                log.info("Verification resend cooldown active for user '{}'", user.getUsername());
                return;
            }
            issueEmailVerificationCode(user);
            auditEventService.record(
                    "auth.verify_email.resend",
                    user,
                    "user",
                    String.valueOf(user.getId()),
                    metadata,
                    Map.of("email", normalizedEmail));
        } finally {
            enforceMinimumPublicDelay(startedAtNs);
        }
    }

    @Transactional
    public void forgotPassword(String email, RequestMetadata metadata) {
        long startedAtNs = System.nanoTime();
        try {
            String normalizedEmail = email.trim().toLowerCase();
            User user = userRepository.findByEmail(normalizedEmail).orElse(null);

            if (user == null) {
                log.info("Password reset requested for unknown email: {}", normalizedEmail);
                auditEventService.record(
                        "auth.forgot_password.unknown",
                        null,
                        "email",
                        normalizedEmail,
                        metadata,
                        Map.of());
                return;
            }

            var latestResetToken = resetTokenRepository.findTopByUser_IdAndUsedFalseOrderByCreatedAtDesc(user.getId());
            if (latestResetToken.isPresent()
                    && isCooldownActive(latestResetToken.get().getCreatedAt(), resetRequestCooldownSeconds)
                    && !latestResetToken.get().isExpired()) {
                log.info("Password reset cooldown active for user '{}'", user.getUsername());
                return;
            }

            resetTokenRepository.deleteByUser_IdAndUsedFalse(user.getId());

            String rawToken = generateUniqueResetToken();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(tokenHashService.hashSha256(rawToken));
            resetToken.setUser(user);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(resetTokenTtlMinutes));
            resetTokenRepository.save(resetToken);

            String resetUrl = buildResetUrl(rawToken);
            emailService.sendPasswordResetEmail(user.getFullName(), user.getEmail(), resetUrl, resetTokenTtlMinutes);
            log.info("Password reset link generated for user '{}'", user.getUsername());
            auditEventService.record(
                    "auth.forgot_password.requested",
                    user,
                    "user",
                    String.valueOf(user.getId()),
                    metadata,
                    Map.of("email", user.getEmail()));
        } finally {
            enforceMinimumPublicDelay(startedAtNs);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword, RequestMetadata metadata) {
        String tokenHash = tokenHashService.hashSha256(token.trim());
        PasswordResetToken resetToken = resetTokenRepository.findByTokenAndUsedFalse(tokenHash)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token."));

        if (resetToken.isExpired()) {
            throw new BadRequestException("This reset link has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new BadRequestException("New password must be different from your current password.");
        }
        passwordPolicyService.enforce(newPassword, user.getUsername(), user.getEmail(), user.getFullName());
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
        authRefreshTokenService.revokeAllForUser(user.getId());

        emailService.sendPasswordChangedEmail(user.getFullName(), user.getEmail(), buildLoginUrl());
        log.info("Password successfully reset for user: {}", user.getUsername());
        auditEventService.record(
                "auth.password_reset.success",
                user,
                "user",
                String.valueOf(user.getId()),
                metadata,
                Map.of());
    }

    @Transactional
    public void acceptStaffInvite(AcceptStaffInviteRequest request, RequestMetadata metadata) {
        String rawToken = request.token().trim();
        StaffInvite invite = staffInviteRepository
                .findByTokenHashAndUsedFalse(tokenHashService.hashSha256(rawToken))
                .orElseThrow(() -> new BadRequestException("Invalid or expired invite token."));

        if (invite.isExpired()) {
            invite.setUsed(true);
            staffInviteRepository.save(invite);
            throw new BadRequestException("This invite has expired. Ask an admin to send a new one.");
        }

        if (userRepository.existsByUsernameIgnoreCase(invite.getUsername())) {
            throw new ConflictException("Username is already in use. Ask an admin to issue a new invite.");
        }
        if (userRepository.existsByEmailIgnoreCase(invite.getEmail())) {
            throw new ConflictException("Email is already in use. Ask an admin to issue a new invite.");
        }

        passwordPolicyService.enforce(request.password(), invite.getUsername(), invite.getEmail(), invite.getFullName());

        User user = new User();
        user.setUsername(invite.getUsername());
        user.setEmail(invite.getEmail());
        user.setFullName(invite.getFullName());
        user.setRole(Role.MAINTENANCE);
        user.setEmailVerified(true);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        invite.setUsed(true);
        invite.setAcceptedAt(LocalDateTime.now());
        staffInviteRepository.save(invite);

        emailService.sendWelcomeEmail(user.getFullName(), user.getEmail(), buildLoginUrl());
        auditEventService.record(
                "auth.staff_invite.accepted",
                user,
                "user",
                String.valueOf(user.getId()),
                metadata,
                Map.of("email", user.getEmail()));
    }

    @Transactional(readOnly = true)
    public List<String> getUsernameSuggestions(String preferredUsername, String fullName) {
        return userService.suggestAvailableUsernames(preferredUsername, fullName, 8);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        Instant expiresAt = jwtService.resolveExpirationInstant();
        return new AuthResponse(token, expiresAt.toString(), user.getUsername(), user.getFullName(), user.getRole().name());
    }

    private String buildLoginUrl() {
        return UriComponentsBuilder
                .fromUriString(frontendBaseUrl)
                .path("/login")
                .build()
                .toUriString();
    }

    private String buildResetUrl(String token) {
        return UriComponentsBuilder
                .fromUriString(frontendBaseUrl)
                .path("/reset-password")
                .queryParam("token", token)
                .build()
                .toUriString();
    }

    private String buildVerifyEmailUrl(String email) {
        return UriComponentsBuilder
                .fromUriString(frontendBaseUrl)
                .path("/verify-email")
                .queryParam("email", email)
                .build()
                .toUriString();
    }

    private String generateUniqueResetToken() {
        for (int i = 0; i < 5; i++) {
            String rawToken = tokenHashService.generateUrlToken(32);
            if (!resetTokenRepository.existsByToken(tokenHashService.hashSha256(rawToken))) {
                return rawToken;
            }
        }
        throw new IllegalStateException("Unable to generate unique reset token");
    }

    private void issueEmailVerificationCode(User user) {
        verificationTokenRepository.deleteByUser_IdAndUsedFalse(user.getId());

        String code = generateVerificationCode();
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setCode(code);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(verificationCodeTtlMinutes));
        verificationTokenRepository.save(token);

        emailService.sendVerificationCodeEmail(
                user.getFullName(),
                user.getEmail(),
                code,
                verificationCodeTtlMinutes,
                buildVerifyEmailUrl(user.getEmail()));
    }

    private String generateVerificationCode() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }

    private boolean isCooldownActive(LocalDateTime createdAt, long cooldownSeconds) {
        return cooldownSeconds > 0 && createdAt != null
                && createdAt.isAfter(LocalDateTime.now().minusSeconds(cooldownSeconds));
    }

    private Duration durationUntil(LocalDateTime expiresAt) {
        long seconds = Duration.between(LocalDateTime.now(), expiresAt).getSeconds();
        return Duration.ofSeconds(Math.max(0, seconds));
    }

    private void enforceMinimumPublicDelay(long startedAtNs) {
        if (publicRequestMinDelayMs <= 0) {
            return;
        }
        long elapsedMs = (System.nanoTime() - startedAtNs) / 1_000_000;
        long remainingMs = publicRequestMinDelayMs - elapsedMs;
        if (remainingMs <= 0) {
            return;
        }
        try {
            // Use LockSupport.parkNanos instead of Thread.sleep for a lighter
            // wait that doesn't hold a monitor.  In a virtual-thread environment
            // (Java 21+ with --enable-preview) this yields the carrier thread
            // automatically.  On platform threads the impact is the same as
            // Thread.sleep but signals intent more clearly.
            java.util.concurrent.locks.LockSupport.parkNanos(remainingMs * 1_000_000);
        } catch (Exception ex) {
            Thread.currentThread().interrupt();
        }
    }
}
