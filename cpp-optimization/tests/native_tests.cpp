#include "assignment_algorithm.h"
#include "image_compressor.h"

#include <jpeglib.h>
#include <png.h>
#include <webp/encode.h>

#include <csetjmp>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <vector>

namespace {

struct PngWriteState {
    std::vector<std::uint8_t>* bytes = nullptr;
};

void PngWriteCallback(png_structp png_ptr, png_bytep data, png_size_t length) {
    auto* state = reinterpret_cast<PngWriteState*>(png_get_io_ptr(png_ptr));
    state->bytes->insert(state->bytes->end(), data, data + length);
}

void PngFlushCallback(png_structp) {
}

std::vector<std::uint8_t> MakeRgbaPattern(int width, int height) {
    std::vector<std::uint8_t> rgba(static_cast<std::size_t>(width) * static_cast<std::size_t>(height) * 4U);
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            const std::size_t offset = static_cast<std::size_t>(y * width + x) * 4U;
            const std::uint8_t tone = static_cast<std::uint8_t>((x + y) % 2 == 0 ? 32 : 220);
            rgba[offset] = tone;
            rgba[offset + 1] = static_cast<std::uint8_t>(255 - tone);
            rgba[offset + 2] = 128;
            rgba[offset + 3] = 255;
        }
    }
    return rgba;
}

std::vector<std::uint8_t> EncodePngWithCompressionLevel(
    const std::vector<std::uint8_t>& rgba,
    int width,
    int height,
    int compression_level) {
    png_structp png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
    png_infop info_ptr = png_create_info_struct(png_ptr);
    if (png_ptr == nullptr || info_ptr == nullptr) {
        std::abort();
    }
    if (setjmp(png_jmpbuf(png_ptr)) != 0) {
        std::abort();
    }

    std::vector<std::uint8_t> bytes;
    PngWriteState state { &bytes };
    png_set_write_fn(png_ptr, &state, PngWriteCallback, PngFlushCallback);
    png_set_IHDR(
        png_ptr,
        info_ptr,
        static_cast<png_uint_32>(width),
        static_cast<png_uint_32>(height),
        8,
        PNG_COLOR_TYPE_RGBA,
        PNG_INTERLACE_NONE,
        PNG_COMPRESSION_TYPE_BASE,
        PNG_FILTER_TYPE_BASE);
    png_set_compression_level(png_ptr, compression_level);
    png_write_info(png_ptr, info_ptr);

    std::vector<png_bytep> rows(height);
    for (int y = 0; y < height; ++y) {
        rows[y] = reinterpret_cast<png_bytep>(
            const_cast<std::uint8_t*>(rgba.data() + static_cast<std::size_t>(y) * static_cast<std::size_t>(width) * 4U));
    }
    png_write_image(png_ptr, rows.data());
    png_write_end(png_ptr, info_ptr);
    png_destroy_write_struct(&png_ptr, &info_ptr);
    return bytes;
}

std::vector<std::uint8_t> EncodeJpegWithQuality(
    const std::vector<std::uint8_t>& rgba,
    int width,
    int height,
    int quality) {
    std::vector<std::uint8_t> rgb(static_cast<std::size_t>(width) * static_cast<std::size_t>(height) * 3U);
    for (int i = 0; i < width * height; ++i) {
        rgb[i * 3] = rgba[i * 4];
        rgb[i * 3 + 1] = rgba[i * 4 + 1];
        rgb[i * 3 + 2] = rgba[i * 4 + 2];
    }

    jpeg_compress_struct cinfo {};
    jpeg_error_mgr jerr {};
    cinfo.err = jpeg_std_error(&jerr);
    jpeg_create_compress(&cinfo);

    unsigned char* output = nullptr;
    unsigned long output_size = 0;
    jpeg_mem_dest(&cinfo, &output, &output_size);
    cinfo.image_width = width;
    cinfo.image_height = height;
    cinfo.input_components = 3;
    cinfo.in_color_space = JCS_RGB;
    jpeg_set_defaults(&cinfo);
    jpeg_set_quality(&cinfo, quality, TRUE);
    jpeg_start_compress(&cinfo, TRUE);
    while (cinfo.next_scanline < cinfo.image_height) {
        JSAMPROW row = reinterpret_cast<JSAMPROW>(
            rgb.data() + static_cast<std::size_t>(cinfo.next_scanline) * static_cast<std::size_t>(width) * 3U);
        jpeg_write_scanlines(&cinfo, &row, 1);
    }
    jpeg_finish_compress(&cinfo);
    std::vector<std::uint8_t> bytes(output, output + output_size);
    free(output);
    jpeg_destroy_compress(&cinfo);
    return bytes;
}

std::vector<std::uint8_t> EncodeWebpWithQuality(
    const std::vector<std::uint8_t>& rgba,
    int width,
    int height,
    float quality) {
    std::uint8_t* output = nullptr;
    const size_t size = WebPEncodeRGBA(rgba.data(), width, height, width * 4, quality, &output);
    if (size == 0 || output == nullptr) {
        std::abort();
    }
    std::vector<std::uint8_t> bytes(output, output + size);
    WebPFree(output);
    return bytes;
}

void Assert(bool condition, const char* message) {
    if (!condition) {
        std::cerr << message << std::endl;
        std::exit(1);
    }
}

void TestAssignmentScoringIsDeterministic() {
    const std::vector<campusfix::AssignmentCandidateSignal> candidates = {
        {2, 4, 1, 3},
        {2, 4, 1, 3},
        {5, 0, 0, 0},
    };
    const std::vector<double> scores = campusfix::ScoreCandidates(candidates);
    Assert(scores.size() == 3U, "Expected exactly three assignment scores.");
    Assert(scores[0] == scores[1], "Equivalent candidates should produce identical scores.");
    Assert(scores[0] > scores[2], "Higher experience and lower workload should score higher.");
}

void TestPngOptimizationPreservesDimensionsAndShrinksPayload() {
    const int width = 64;
    const int height = 64;
    const std::vector<std::uint8_t> rgba = MakeRgbaPattern(width, height);
    const std::vector<std::uint8_t> input = EncodePngWithCompressionLevel(rgba, width, height, 0);
    const campusfix::ImageOptimizationResult result = campusfix::OptimizeImage(
        input,
        {"image/png", 1, 85, 85});

    Assert(result.success, "PNG optimization should succeed.");
    Assert(result.original_dimensions.width == width, "PNG width should be preserved.");
    Assert(result.original_dimensions.height == height, "PNG height should be preserved.");
    Assert(result.optimized_dimensions.width == width, "Optimized PNG width should be preserved.");
    Assert(result.optimized_dimensions.height == height, "Optimized PNG height should be preserved.");
    Assert(result.bytes.size() < input.size(), "Optimized PNG should be smaller than the source.");
}

void TestJpegOptimizationPreservesDimensionsAndShrinksPayload() {
    const int width = 64;
    const int height = 64;
    const std::vector<std::uint8_t> rgba = MakeRgbaPattern(width, height);
    const std::vector<std::uint8_t> input = EncodeJpegWithQuality(rgba, width, height, 100);
    const campusfix::ImageOptimizationResult result = campusfix::OptimizeImage(
        input,
        {"image/jpeg", 1, 85, 85});

    Assert(result.success, "JPEG optimization should succeed.");
    Assert(result.original_dimensions.width == width, "JPEG width should be preserved.");
    Assert(result.original_dimensions.height == height, "JPEG height should be preserved.");
    Assert(result.bytes.size() < input.size(), "Optimized JPEG should be smaller than the source.");
}

void TestWebpOptimizationPreservesDimensionsAndShrinksPayload() {
    const int width = 64;
    const int height = 64;
    const std::vector<std::uint8_t> rgba = MakeRgbaPattern(width, height);
    const std::vector<std::uint8_t> input = EncodeWebpWithQuality(rgba, width, height, 100.0F);
    const campusfix::ImageOptimizationResult result = campusfix::OptimizeImage(
        input,
        {"image/webp", 1, 85, 85});

    Assert(result.success, "WEBP optimization should succeed.");
    Assert(result.original_dimensions.width == width, "WEBP width should be preserved.");
    Assert(result.original_dimensions.height == height, "WEBP height should be preserved.");
    Assert(result.bytes.size() < input.size(), "Optimized WEBP should be smaller than the source.");
}

}  // namespace

int main() {
    TestAssignmentScoringIsDeterministic();
    TestPngOptimizationPreservesDimensionsAndShrinksPayload();
    TestJpegOptimizationPreservesDimensionsAndShrinksPayload();
    TestWebpOptimizationPreservesDimensionsAndShrinksPayload();
    std::cout << "All native tests passed." << std::endl;
    return 0;
}
