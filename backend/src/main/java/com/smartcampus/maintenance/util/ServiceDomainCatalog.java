package com.smartcampus.maintenance.util;

import com.smartcampus.maintenance.entity.enums.TicketCategory;

public final class ServiceDomainCatalog {

    private ServiceDomainCatalog() {
    }

    public static String labelForKey(String key) {
        if (key == null) {
            return "Other";
        }
        return switch (key) {
            case "HVAC" -> "HVAC";
            case "IT" -> "IT";
            case "ELECTRICAL" -> "Electrical";
            case "PLUMBING" -> "Plumbing";
            case "CLEANING" -> "Cleaning";
            case "FURNITURE" -> "Furniture";
            case "STRUCTURAL" -> "Structural";
            case "SAFETY" -> "Safety";
            default -> "Other";
        };
    }

    public static String defaultRequestTypeLabel(String key) {
        return labelForKey(key) + " issue";
    }

    public static TicketCategory legacyCategoryForKey(String key) {
        if (key == null) {
            return TicketCategory.OTHER;
        }
        try {
            return TicketCategory.valueOf(key);
        } catch (IllegalArgumentException ex) {
            return TicketCategory.OTHER;
        }
    }
}
