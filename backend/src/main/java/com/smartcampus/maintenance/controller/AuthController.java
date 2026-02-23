package com.smartcampus.maintenance.controller;

import com.smartcampus.maintenance.dto.auth.AuthResponse;
import com.smartcampus.maintenance.dto.auth.AcceptStaffInviteRequest;
import com.smartcampus.maintenance.dto.auth.ForgotPasswordRequest;
import com.smartcampus.maintenance.dto.auth.LoginRequest;
import com.smartcampus.maintenance.dto.auth.ResendVerificationRequest;
import com.smartcampus.maintenance.dto.auth.RegisterRequest;
import com.smartcampus.maintenance.dto.auth.ResetPasswordRequest;
import com.smartcampus.maintenance.dto.auth.UsernameSuggestionsResponse;
import com.smartcampus.maintenance.dto.auth.VerifyEmailRequest;
import com.smartcampus.maintenance.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> register(@Valid @RequestBody RegisterRequest request) {
        authService.registerStudent(request);
        return Map.of("message", "Account created. Enter the verification code sent to your email.");
    }

    @PostMapping("/verify-email")
    public Map<String, String> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request.email(), request.code());
        return Map.of("message", "Email verified successfully. You can now sign in.");
    }

    @PostMapping("/resend-verification")
    public Map<String, String> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerificationCode(request.email());
        return Map.of("message", "If the account exists and is not verified, a new code has been sent.");
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return Map.of("message", "If an account exists with this email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return Map.of("message", "Password has been reset successfully.");
    }

    @PostMapping("/accept-staff-invite")
    public Map<String, String> acceptStaffInvite(@Valid @RequestBody AcceptStaffInviteRequest request) {
        authService.acceptStaffInvite(request);
        return Map.of("message", "Invite accepted successfully. You can now sign in.");
    }

    @GetMapping("/username-suggestions")
    public UsernameSuggestionsResponse getUsernameSuggestions(
            @RequestParam("username") @NotBlank String username,
            @RequestParam(value = "fullName", required = false) String fullName) {
        List<String> suggestions = authService.getUsernameSuggestions(username, fullName);
        return new UsernameSuggestionsResponse(username, suggestions);
    }
}
