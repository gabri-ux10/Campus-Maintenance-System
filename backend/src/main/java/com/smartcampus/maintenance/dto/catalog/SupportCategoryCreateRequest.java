package com.smartcampus.maintenance.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SupportCategoryCreateRequest(
        @NotBlank(message = "Support category label is required")
        @Size(max = 120, message = "Support category label must be at most 120 characters")
        String label,

        @PositiveOrZero(message = "Sort order must be zero or greater")
        Integer sortOrder) {
}
