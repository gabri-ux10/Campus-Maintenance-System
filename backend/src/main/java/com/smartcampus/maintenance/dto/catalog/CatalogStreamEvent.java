package com.smartcampus.maintenance.dto.catalog;

import java.time.LocalDateTime;
import java.util.List;

public record CatalogStreamEvent(
        String resource,
        long version,
        String action,
        List<Long> changedIds,
        LocalDateTime changedAt) {
}
