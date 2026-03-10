package com.smartcampus.maintenance.dto.catalog;

public record SupportCategoryResponse(
        Long id,
        String label,
        boolean active,
        int sortOrder) {
}
