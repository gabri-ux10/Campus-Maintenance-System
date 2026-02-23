package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.exception.BadRequestException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PasswordPolicyService {

    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SYMBOL = Pattern.compile("[^A-Za-z0-9]");
    private static final Pattern WHITESPACE = Pattern.compile("\\s");
    private static final Set<String> COMMON_PASSWORDS = Set.of(
            "password", "password123", "12345678", "qwerty123",
            "letmein", "welcome1", "admin123", "iloveyou");
    private static final int MIN_LENGTH = 10;

    public void enforce(String password, String username, String email, String fullName) {
        ValidationResult result = evaluate(password, username, email, fullName);
        if (!result.valid()) {
            throw new BadRequestException(result.message());
        }
    }

    public ValidationResult evaluate(String password, String username, String email, String fullName) {
        if (!StringUtils.hasText(password)) {
            return new ValidationResult(false, "Password is required.");
        }
        if (password.length() < MIN_LENGTH) {
            return new ValidationResult(false, "Password must be at least 10 characters.");
        }
        if (WHITESPACE.matcher(password).find()) {
            return new ValidationResult(false, "Password must not contain spaces.");
        }

        boolean hasLower = LOWERCASE.matcher(password).find();
        boolean hasUpper = UPPERCASE.matcher(password).find();
        boolean hasDigit = DIGIT.matcher(password).find();
        boolean hasSymbol = SYMBOL.matcher(password).find();

        if (!(hasLower && hasUpper && hasDigit && hasSymbol)) {
            return new ValidationResult(false,
                    "Password must include uppercase, lowercase, number, and special character.");
        }

        String normalized = password.toLowerCase(Locale.ROOT);
        if (COMMON_PASSWORDS.contains(normalized)) {
            return new ValidationResult(false, "Password is too common. Choose a unique password.");
        }

        Set<String> forbiddenTokens = new HashSet<>();
        addToken(forbiddenTokens, username);
        addToken(forbiddenTokens, email == null ? null : email.split("@")[0]);
        if (StringUtils.hasText(fullName)) {
            Arrays.stream(fullName.split("\\s+")).forEach(token -> addToken(forbiddenTokens, token));
        }
        for (String token : forbiddenTokens) {
            if (token.length() >= 3 && normalized.contains(token)) {
                return new ValidationResult(false, "Password must not contain personal identifiers.");
            }
        }

        return new ValidationResult(true, "");
    }

    private void addToken(Set<String> tokens, String value) {
        if (!StringUtils.hasText(value)) {
            return;
        }
        tokens.add(value.trim().toLowerCase(Locale.ROOT));
    }

    public record ValidationResult(boolean valid, String message) {
    }
}
