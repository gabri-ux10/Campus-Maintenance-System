package com.smartcampus.maintenance.dto.catalog;

public record RequestTypeResponse(
        Long id,
        String label,
        boolean active,
        int sortOrder,
        Long serviceDomainId,
        String serviceDomainKey,
        String serviceDomainLabel) {
}
