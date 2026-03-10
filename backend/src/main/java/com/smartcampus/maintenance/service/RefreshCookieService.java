package com.smartcampus.maintenance.service;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class RefreshCookieService {

    private final String cookieName;
    private final String sameSite;
    private final boolean secure;
    private final String domain;

    public RefreshCookieService(
            @Value("${app.auth.refresh-cookie-name:campusfix_rt}") String cookieName,
            @Value("${app.auth.refresh-cookie-same-site:Lax}") String sameSite,
            @Value("${app.auth.refresh-cookie-secure:false}") boolean secure,
            @Value("${app.auth.refresh-cookie-domain:}") String domain) {
        this.cookieName = cookieName;
        this.sameSite = sameSite;
        this.secure = secure;
        this.domain = domain;
    }

    public String cookieName() {
        return cookieName;
    }

    public void writeRefreshCookie(HttpHeaders headers, String token, Duration maxAge) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(maxAge == null ? Duration.ZERO : maxAge);
        if (StringUtils.hasText(domain)) {
            builder.domain(domain.trim());
        }
        headers.add(HttpHeaders.SET_COOKIE, builder.build().toString());
    }

    public void clearRefreshCookie(HttpHeaders headers) {
        writeRefreshCookie(headers, "", Duration.ZERO);
    }
}
