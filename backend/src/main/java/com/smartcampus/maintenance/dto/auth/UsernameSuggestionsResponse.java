package com.smartcampus.maintenance.dto.auth;

import java.util.List;

public record UsernameSuggestionsResponse(
        String requestedUsername,
        List<String> suggestions) {
}
