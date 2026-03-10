package com.smartcampus.maintenance.dto.ticket;

import java.util.List;

public record TicketAssignmentRecommendationResponse(
        Long userId,
        String username,
        String fullName,
        double score,
        List<String> reasons) {
}
