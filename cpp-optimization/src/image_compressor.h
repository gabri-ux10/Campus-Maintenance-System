#pragma once

#include <cstdint>
#include <string>
#include <vector>

namespace campusfix {

struct ImageDimensions {
    int width = 0;
    int height = 0;
};

struct ImageOptimizationOptions {
    std::string content_type;
    int min_savings_percent = 5;
    int jpeg_quality = 85;
    int webp_quality = 85;
};

struct ImageOptimizationResult {
    bool success = false;
    std::string error;
    std::string content_type;
    std::vector<std::uint8_t> bytes;
    ImageDimensions original_dimensions;
    ImageDimensions optimized_dimensions;
};

ImageOptimizationResult OptimizeImage(
    const std::vector<std::uint8_t>& input_bytes,
    const ImageOptimizationOptions& options);

}  // namespace campusfix
