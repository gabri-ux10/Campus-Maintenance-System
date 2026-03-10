package com.smartcampus.maintenance.dto.user;

import java.time.LocalDateTime;

public record ScheduledBroadcastResponse(
        Long id,
        String title,
        String message,
        String audience,
        String status,
        LocalDateTime scheduledFor,
        int recipientCount,
        LocalDateTime createdAt,
        LocalDateTime sentAt) {
}
