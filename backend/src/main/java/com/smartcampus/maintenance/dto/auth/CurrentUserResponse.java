package com.smartcampus.maintenance.dto.auth;

public record CurrentUserResponse(
        String username,
        String fullName,
        String role) {
}
