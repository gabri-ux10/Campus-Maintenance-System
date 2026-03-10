package com.smartcampus.maintenance.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SupportCategoryUpdateRequest(
        @NotBlank(message = "Support category label is required")
        @Size(max = 120, message = "Support category label must be at most 120 characters")
        String label,

        @NotNull(message = "Active flag is required")
        Boolean active,

        @NotNull(message = "Sort order is required")
        @PositiveOrZero(message = "Sort order must be zero or greater")
        Integer sortOrder) {
}
