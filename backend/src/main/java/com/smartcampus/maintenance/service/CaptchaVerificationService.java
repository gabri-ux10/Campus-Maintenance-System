package com.smartcampus.maintenance.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.maintenance.exception.BadRequestException;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class CaptchaVerificationService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final boolean enabled;
    private final String secretKey;
    private final String verifyUrl;

    public CaptchaVerificationService(
            ObjectMapper objectMapper,
            @Value("${app.security.captcha.enabled:false}") boolean enabled,
            @Value("${app.security.captcha.turnstile.secret-key:}") String secretKey,
            @Value("${app.security.captcha.turnstile.verify-url:https://challenges.cloudflare.com/turnstile/v0/siteverify}") String verifyUrl) {
        this.objectMapper = objectMapper;
        this.enabled = enabled;
        this.secretKey = secretKey;
        this.verifyUrl = verifyUrl;
        this.httpClient = HttpClient.newBuilder().build();
    }

    public void verify(String captchaToken, String remoteIp) {
        if (!enabled) {
            return;
        }
        if (!StringUtils.hasText(secretKey)) {
            throw new IllegalStateException("Captcha secret key must be configured when captcha is enabled.");
        }
        if (!StringUtils.hasText(captchaToken)) {
            throw new BadRequestException("Captcha verification is required.");
        }

        String body = "secret=" + encode(secretKey)
                + "&response=" + encode(captchaToken.trim())
                + (StringUtils.hasText(remoteIp) ? "&remoteip=" + encode(remoteIp.trim()) : "");
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(verifyUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode json = objectMapper.readTree(response.body());
            if (!json.path("success").asBoolean(false)) {
                throw new BadRequestException("Captcha verification failed.");
            }
        } catch (IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new BadRequestException("Captcha verification failed.");
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
