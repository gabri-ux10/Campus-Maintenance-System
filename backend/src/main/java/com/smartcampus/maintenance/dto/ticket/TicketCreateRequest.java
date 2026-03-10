package com.smartcampus.maintenance.dto.ticket;

import com.smartcampus.maintenance.entity.enums.UrgencyLevel;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;

public record TicketCreateRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    String title,

    @NotBlank(message = "Description is required")
    @Size(max = 4000, message = "Description must be at most 4000 characters")
    String description,

    @NotNull(message = "Request type is required")
    @Positive(message = "Request type is required")
    Long requestTypeId,

    @NotNull(message = "Building is required")
    @Positive(message = "Building is required")
    Long buildingId,

    @NotBlank(message = "Location is required")
    @Size(max = 120, message = "Location must be at most 120 characters")
    String location,

    @NotNull(message = "Urgency is required")
    UrgencyLevel urgency
) {
}
