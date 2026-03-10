package com.smartcampus.maintenance.service;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PublicEndpointSecurityService {

    private final RateLimitService rateLimitService;
    private final CaptchaVerificationService captchaVerificationService;
    private final int loginIpLimit;
    private final int loginAccountLimit;
    private final int registerIpLimit;
    private final int forgotPasswordIpLimit;
    private final int resendVerificationIpLimit;
    private final int supportIpLimit;
    private final Duration window;

    public PublicEndpointSecurityService(
            RateLimitService rateLimitService,
            CaptchaVerificationService captchaVerificationService,
            @Value("${app.security.rate-limit.window-seconds:60}") long windowSeconds,
            @Value("${app.security.rate-limit.login.ip-limit:20}") int loginIpLimit,
            @Value("${app.security.rate-limit.login.account-limit:10}") int loginAccountLimit,
            @Value("${app.security.rate-limit.register.ip-limit:8}") int registerIpLimit,
            @Value("${app.security.rate-limit.forgot-password.ip-limit:8}") int forgotPasswordIpLimit,
            @Value("${app.security.rate-limit.resend-verification.ip-limit:8}") int resendVerificationIpLimit,
            @Value("${app.security.rate-limit.support.ip-limit:6}") int supportIpLimit) {
        this.rateLimitService = rateLimitService;
        this.captchaVerificationService = captchaVerificationService;
        this.loginIpLimit = loginIpLimit;
        this.loginAccountLimit = loginAccountLimit;
        this.registerIpLimit = registerIpLimit;
        this.forgotPasswordIpLimit = forgotPasswordIpLimit;
        this.resendVerificationIpLimit = resendVerificationIpLimit;
        this.supportIpLimit = supportIpLimit;
        this.window = Duration.ofSeconds(Math.max(10, windowSeconds));
    }

    public void guardLogin(String username, String captchaToken, RequestMetadata metadata) {
        String ipKey = metadata == null ? null : metadata.ipAddress();
        rateLimitService.enforce("login-ip", ipKey, loginIpLimit, window);
        if (StringUtils.hasText(username)) {
            rateLimitService.enforce("login-account", username, loginAccountLimit, window);
        }
        captchaVerificationService.verify(captchaToken, ipKey);
    }

    public void guardRegistration(String email, String captchaToken, RequestMetadata metadata) {
        enforceCaptchaAndRateLimit("register-ip", email, captchaToken, metadata, registerIpLimit);
    }

    public void guardForgotPassword(String email, String captchaToken, RequestMetadata metadata) {
        enforceCaptchaAndRateLimit("forgot-password-ip", email, captchaToken, metadata, forgotPasswordIpLimit);
    }

    public void guardResendVerification(String email, String captchaToken, RequestMetadata metadata) {
        enforceCaptchaAndRateLimit("resend-verification-ip", email, captchaToken, metadata, resendVerificationIpLimit);
    }

    public void guardSupport(String email, String captchaToken, RequestMetadata metadata) {
        enforceCaptchaAndRateLimit("support-ip", email, captchaToken, metadata, supportIpLimit);
    }

    private void enforceCaptchaAndRateLimit(String scope, String email, String captchaToken, RequestMetadata metadata, int limit) {
        String ipKey = metadata == null ? null : metadata.ipAddress();
        rateLimitService.enforce(scope, ipKey, limit, window);
        if (StringUtils.hasText(email)) {
            rateLimitService.enforce(scope + "-email", email, Math.max(3, limit / 2), window);
        }
        captchaVerificationService.verify(captchaToken, ipKey);
    }
}
