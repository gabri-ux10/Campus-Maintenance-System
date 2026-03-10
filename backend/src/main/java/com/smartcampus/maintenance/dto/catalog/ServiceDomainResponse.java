package com.smartcampus.maintenance.dto.catalog;

public record ServiceDomainResponse(
        Long id,
        String key,
        String label,
        int sortOrder) {
}
