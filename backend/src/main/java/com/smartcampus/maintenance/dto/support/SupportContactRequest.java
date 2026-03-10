package com.smartcampus.maintenance.dto.support;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SupportContactRequest(
    @NotBlank(message = "Full name is required")
    @Size(max = 120, message = "Full name must be at most 120 characters")
    String fullName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 160, message = "Email must be at most 160 characters")
    String email,

    @NotNull(message = "Support category is required")
    @Positive(message = "Support category is required")
    Long supportCategoryId,

    @NotBlank(message = "Subject is required")
    @Size(max = 180, message = "Subject must be at most 180 characters")
    String subject,

    @NotBlank(message = "Message is required")
    @Size(min = 20, max = 5000, message = "Message must be between 20 and 5000 characters")
    String message,

    @Size(max = 2048, message = "Captcha token is too long")
    String captchaToken
) {
}
