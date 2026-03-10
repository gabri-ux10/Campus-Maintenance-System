package com.smartcampus.maintenance.nativeopt;

public record ImageOptimizationRequest(
        String contentType,
        byte[] bytes,
        int minSavingsPercent,
        int jpegQuality,
        int webpQuality) {
}
