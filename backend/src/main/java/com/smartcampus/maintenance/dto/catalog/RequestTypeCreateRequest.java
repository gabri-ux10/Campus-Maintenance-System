package com.smartcampus.maintenance.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record RequestTypeCreateRequest(
        @NotBlank(message = "Service domain is required")
        @Size(max = 40, message = "Service domain key must be at most 40 characters")
        String serviceDomainKey,

        @NotBlank(message = "Request type label is required")
        @Size(max = 120, message = "Request type label must be at most 120 characters")
        String label,

        @PositiveOrZero(message = "Sort order must be zero or greater")
        Integer sortOrder) {
}
