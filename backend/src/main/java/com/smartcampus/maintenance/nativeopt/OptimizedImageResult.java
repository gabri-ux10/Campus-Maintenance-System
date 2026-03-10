package com.smartcampus.maintenance.nativeopt;

public record OptimizedImageResult(
        byte[] bytes,
        String contentType,
        int originalWidth,
        int originalHeight,
        int optimizedWidth,
        int optimizedHeight) {
}
