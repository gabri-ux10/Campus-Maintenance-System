#include "image_compressor.h"

#include <jpeglib.h>
#include <png.h>
#include <webp/encode.h>
#include <webp/decode.h>

#include <algorithm>
#include <cstdlib>
#include <csetjmp>
#include <cstring>
#include <memory>
#include <string>
#include <vector>

namespace campusfix {

namespace {

struct DecodedImage {
    int width = 0;
    int height = 0;
    int channels = 0;
    std::vector<std::uint8_t> pixels;
};

struct JpegErrorManager {
    jpeg_error_mgr pub;
    jmp_buf jump_buffer;
};

void JpegErrorExit(j_common_ptr cinfo) {
    auto* error = reinterpret_cast<JpegErrorManager*>(cinfo->err);
    longjmp(error->jump_buffer, 1);
}

struct PngReaderState {
    const std::uint8_t* data = nullptr;
    std::size_t size = 0;
    std::size_t offset = 0;
};

struct PngWriterState {
    std::vector<std::uint8_t>* bytes = nullptr;
};

void PngReadCallback(png_structp png_ptr, png_bytep out_bytes, png_size_t byte_count) {
    auto* state = reinterpret_cast<PngReaderState*>(png_get_io_ptr(png_ptr));
    if (state->offset + byte_count > state->size) {
        png_error(png_ptr, "Unexpected end of PNG input");
        return;
    }
    std::memcpy(out_bytes, state->data + state->offset, byte_count);
    state->offset += byte_count;
}

void PngWriteCallback(png_structp png_ptr, png_bytep data, png_size_t length) {
    auto* state = reinterpret_cast<PngWriterState*>(png_get_io_ptr(png_ptr));
    state->bytes->insert(state->bytes->end(), data, data + length);
}

void PngFlushCallback(png_structp) {
}

int ClampQuality(int quality) {
    return std::max(1, std::min(100, quality));
}

bool IsSupportedContentType(const std::string& content_type) {
    return content_type == "image/jpeg" || content_type == "image/jpg" || content_type == "image/png" ||
           content_type == "image/webp";
}

std::vector<std::uint8_t> EnsureRgb(const DecodedImage& image) {
    if (image.channels == 3) {
        return image.pixels;
    }
    if (image.channels == 1) {
        std::vector<std::uint8_t> rgb(image.width * image.height * 3);
        for (int i = 0; i < image.width * image.height; ++i) {
            rgb[i * 3] = image.pixels[i];
            rgb[i * 3 + 1] = image.pixels[i];
            rgb[i * 3 + 2] = image.pixels[i];
        }
        return rgb;
    }

    std::vector<std::uint8_t> rgb(image.width * image.height * 3);
    for (int i = 0; i < image.width * image.height; ++i) {
        rgb[i * 3] = image.pixels[i * image.channels];
        rgb[i * 3 + 1] = image.pixels[i * image.channels + 1];
        rgb[i * 3 + 2] = image.pixels[i * image.channels + 2];
    }
    return rgb;
}

std::vector<std::uint8_t> EnsureRgba(const DecodedImage& image) {
    if (image.channels == 4) {
        return image.pixels;
    }

    std::vector<std::uint8_t> rgba(image.width * image.height * 4);
    if (image.channels == 3) {
        for (int i = 0; i < image.width * image.height; ++i) {
            rgba[i * 4] = image.pixels[i * 3];
            rgba[i * 4 + 1] = image.pixels[i * 3 + 1];
            rgba[i * 4 + 2] = image.pixels[i * 3 + 2];
            rgba[i * 4 + 3] = 255;
        }
        return rgba;
    }

    for (int i = 0; i < image.width * image.height; ++i) {
        const std::uint8_t value = image.pixels[i];
        rgba[i * 4] = value;
        rgba[i * 4 + 1] = value;
        rgba[i * 4 + 2] = value;
        rgba[i * 4 + 3] = 255;
    }
    return rgba;
}

bool DecodeJpeg(const std::vector<std::uint8_t>& input_bytes, DecodedImage* output, std::string* error) {
    jpeg_decompress_struct cinfo {};
    JpegErrorManager jerr {};
    cinfo.err = jpeg_std_error(&jerr.pub);
    jerr.pub.error_exit = JpegErrorExit;
    if (setjmp(jerr.jump_buffer) != 0) {
        jpeg_destroy_decompress(&cinfo);
        if (error != nullptr) {
            *error = "Failed to decode JPEG input.";
        }
        return false;
    }

    jpeg_create_decompress(&cinfo);
    jpeg_mem_src(&cinfo, input_bytes.data(), static_cast<unsigned long>(input_bytes.size()));
    jpeg_read_header(&cinfo, TRUE);
    jpeg_start_decompress(&cinfo);

    output->width = static_cast<int>(cinfo.output_width);
    output->height = static_cast<int>(cinfo.output_height);
    output->channels = static_cast<int>(cinfo.output_components);
    output->pixels.resize(static_cast<std::size_t>(output->width) * static_cast<std::size_t>(output->height) *
                          static_cast<std::size_t>(output->channels));

    while (cinfo.output_scanline < cinfo.output_height) {
        JSAMPROW row_pointer = reinterpret_cast<JSAMPROW>(output->pixels.data() +
            static_cast<std::size_t>(cinfo.output_scanline) * static_cast<std::size_t>(output->width) *
                static_cast<std::size_t>(output->channels));
        jpeg_read_scanlines(&cinfo, &row_pointer, 1);
    }

    jpeg_finish_decompress(&cinfo);
    jpeg_destroy_decompress(&cinfo);
    return true;
}

bool EncodeJpeg(const DecodedImage& image, int quality, std::vector<std::uint8_t>* output, std::string* error) {
    jpeg_compress_struct cinfo {};
    JpegErrorManager jerr {};
    cinfo.err = jpeg_std_error(&jerr.pub);
    jerr.pub.error_exit = JpegErrorExit;
    if (setjmp(jerr.jump_buffer) != 0) {
        jpeg_destroy_compress(&cinfo);
        if (error != nullptr) {
            *error = "Failed to encode JPEG output.";
        }
        return false;
    }

    std::vector<std::uint8_t> rgb = EnsureRgb(image);
    unsigned char* destination = nullptr;
    unsigned long destination_size = 0;

    jpeg_create_compress(&cinfo);
    jpeg_mem_dest(&cinfo, &destination, &destination_size);
    cinfo.image_width = image.width;
    cinfo.image_height = image.height;
    cinfo.input_components = 3;
    cinfo.in_color_space = JCS_RGB;
    jpeg_set_defaults(&cinfo);
    jpeg_set_quality(&cinfo, ClampQuality(quality), TRUE);
    jpeg_start_compress(&cinfo, TRUE);

    while (cinfo.next_scanline < cinfo.image_height) {
        JSAMPROW row_pointer = reinterpret_cast<JSAMPROW>(
            rgb.data() + static_cast<std::size_t>(cinfo.next_scanline) * static_cast<std::size_t>(image.width) * 3U);
        jpeg_write_scanlines(&cinfo, &row_pointer, 1);
    }

    jpeg_finish_compress(&cinfo);
    output->assign(destination, destination + destination_size);
    free(destination);
    jpeg_destroy_compress(&cinfo);
    return true;
}

bool DecodePng(const std::vector<std::uint8_t>& input_bytes, DecodedImage* output, std::string* error) {
    png_structp png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
    if (png_ptr == nullptr) {
        if (error != nullptr) {
            *error = "Failed to create PNG reader.";
        }
        return false;
    }

    png_infop info_ptr = png_create_info_struct(png_ptr);
    if (info_ptr == nullptr) {
        png_destroy_read_struct(&png_ptr, nullptr, nullptr);
        if (error != nullptr) {
            *error = "Failed to create PNG info block.";
        }
        return false;
    }

    if (setjmp(png_jmpbuf(png_ptr)) != 0) {
        png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
        if (error != nullptr) {
            *error = "Failed to decode PNG input.";
        }
        return false;
    }

    PngReaderState state { input_bytes.data(), input_bytes.size(), 0 };
    png_set_read_fn(png_ptr, &state, PngReadCallback);
    png_read_info(png_ptr, info_ptr);

    output->width = static_cast<int>(png_get_image_width(png_ptr, info_ptr));
    output->height = static_cast<int>(png_get_image_height(png_ptr, info_ptr));
    png_byte color_type = png_get_color_type(png_ptr, info_ptr);
    png_byte bit_depth = png_get_bit_depth(png_ptr, info_ptr);

    if (bit_depth == 16) {
        png_set_strip_16(png_ptr);
    }
    if (color_type == PNG_COLOR_TYPE_PALETTE) {
        png_set_palette_to_rgb(png_ptr);
    }
    if (color_type == PNG_COLOR_TYPE_GRAY && bit_depth < 8) {
        png_set_expand_gray_1_2_4_to_8(png_ptr);
    }
    if (png_get_valid(png_ptr, info_ptr, PNG_INFO_tRNS) != 0) {
        png_set_tRNS_to_alpha(png_ptr);
    }
    if ((color_type & PNG_COLOR_MASK_ALPHA) == 0) {
        png_set_add_alpha(png_ptr, 0xFF, PNG_FILLER_AFTER);
    }
    if (color_type == PNG_COLOR_TYPE_GRAY || color_type == PNG_COLOR_TYPE_GRAY_ALPHA) {
        png_set_gray_to_rgb(png_ptr);
    }

    png_read_update_info(png_ptr, info_ptr);
    output->channels = 4;
    output->pixels.resize(static_cast<std::size_t>(output->width) * static_cast<std::size_t>(output->height) * 4U);

    std::vector<png_bytep> rows(output->height);
    for (int y = 0; y < output->height; ++y) {
        rows[y] = output->pixels.data() + static_cast<std::size_t>(y) * static_cast<std::size_t>(output->width) * 4U;
    }
    png_read_image(png_ptr, rows.data());
    png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
    return true;
}

bool EncodePng(const DecodedImage& image, std::vector<std::uint8_t>* output, std::string* error) {
    png_structp png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
    if (png_ptr == nullptr) {
        if (error != nullptr) {
            *error = "Failed to create PNG writer.";
        }
        return false;
    }

    png_infop info_ptr = png_create_info_struct(png_ptr);
    if (info_ptr == nullptr) {
        png_destroy_write_struct(&png_ptr, nullptr);
        if (error != nullptr) {
            *error = "Failed to create PNG output info block.";
        }
        return false;
    }

    if (setjmp(png_jmpbuf(png_ptr)) != 0) {
        png_destroy_write_struct(&png_ptr, &info_ptr);
        if (error != nullptr) {
            *error = "Failed to encode PNG output.";
        }
        return false;
    }

    std::vector<std::uint8_t> rgba = EnsureRgba(image);
    PngWriterState state { output };
    output->clear();

    png_set_write_fn(png_ptr, &state, PngWriteCallback, PngFlushCallback);
    png_set_IHDR(
        png_ptr,
        info_ptr,
        static_cast<png_uint_32>(image.width),
        static_cast<png_uint_32>(image.height),
        8,
        PNG_COLOR_TYPE_RGBA,
        PNG_INTERLACE_NONE,
        PNG_COMPRESSION_TYPE_BASE,
        PNG_FILTER_TYPE_BASE);
    png_set_compression_level(png_ptr, 6);
    png_write_info(png_ptr, info_ptr);

    std::vector<png_bytep> rows(image.height);
    for (int y = 0; y < image.height; ++y) {
        rows[y] = rgba.data() + static_cast<std::size_t>(y) * static_cast<std::size_t>(image.width) * 4U;
    }
    png_write_image(png_ptr, rows.data());
    png_write_end(png_ptr, info_ptr);
    png_destroy_write_struct(&png_ptr, &info_ptr);
    return true;
}

bool DecodeWebp(const std::vector<std::uint8_t>& input_bytes, DecodedImage* output, std::string* error) {
    int width = 0;
    int height = 0;
    if (WebPGetInfo(input_bytes.data(), input_bytes.size(), &width, &height) == 0) {
        if (error != nullptr) {
            *error = "Failed to inspect WEBP input.";
        }
        return false;
    }

    std::uint8_t* decoded = WebPDecodeRGBA(input_bytes.data(), input_bytes.size(), &width, &height);
    if (decoded == nullptr) {
        if (error != nullptr) {
            *error = "Failed to decode WEBP input.";
        }
        return false;
    }

    output->width = width;
    output->height = height;
    output->channels = 4;
    output->pixels.assign(decoded, decoded + static_cast<std::size_t>(width) * static_cast<std::size_t>(height) * 4U);
    WebPFree(decoded);
    return true;
}

bool EncodeWebp(const DecodedImage& image, int quality, std::vector<std::uint8_t>* output, std::string* error) {
    std::vector<std::uint8_t> rgba = EnsureRgba(image);
    std::uint8_t* encoded = nullptr;
    const float clamped_quality = static_cast<float>(ClampQuality(quality));
    size_t encoded_size = WebPEncodeRGBA(
        rgba.data(),
        image.width,
        image.height,
        image.width * 4,
        clamped_quality,
        &encoded);
    if (encoded_size == 0 || encoded == nullptr) {
        if (error != nullptr) {
            *error = "Failed to encode WEBP output.";
        }
        return false;
    }

    output->assign(encoded, encoded + encoded_size);
    WebPFree(encoded);
    return true;
}

int ComputeSavingsPercent(std::size_t original_size, std::size_t optimized_size) {
    if (original_size == 0 || optimized_size >= original_size) {
        return 0;
    }
    return static_cast<int>(((original_size - optimized_size) * 100U) / original_size);
}

}  // namespace

ImageOptimizationResult OptimizeImage(
    const std::vector<std::uint8_t>& input_bytes,
    const ImageOptimizationOptions& options) {
    ImageOptimizationResult result {};
    result.content_type = options.content_type;

    if (input_bytes.empty()) {
        result.error = "Input bytes are empty.";
        return result;
    }
    if (!IsSupportedContentType(options.content_type)) {
        result.error = "Unsupported content type.";
        return result;
    }

    DecodedImage decoded {};
    std::string error;
    bool decoded_ok = false;

    if (options.content_type == "image/png") {
        decoded_ok = DecodePng(input_bytes, &decoded, &error);
    } else if (options.content_type == "image/webp") {
        decoded_ok = DecodeWebp(input_bytes, &decoded, &error);
    } else {
        decoded_ok = DecodeJpeg(input_bytes, &decoded, &error);
        result.content_type = "image/jpeg";
    }

    if (!decoded_ok) {
        result.error = error;
        return result;
    }

    result.original_dimensions = { decoded.width, decoded.height };
    result.optimized_dimensions = { decoded.width, decoded.height };

    std::vector<std::uint8_t> optimized_bytes;
    bool encoded_ok = false;
    if (result.content_type == "image/png") {
        encoded_ok = EncodePng(decoded, &optimized_bytes, &error);
    } else if (result.content_type == "image/webp") {
        encoded_ok = EncodeWebp(decoded, options.webp_quality, &optimized_bytes, &error);
    } else {
        encoded_ok = EncodeJpeg(decoded, options.jpeg_quality, &optimized_bytes, &error);
    }

    if (!encoded_ok) {
        result.error = error;
        return result;
    }

    const int savings_percent = ComputeSavingsPercent(input_bytes.size(), optimized_bytes.size());
    if (optimized_bytes.size() >= input_bytes.size() ||
        savings_percent < std::max(0, options.min_savings_percent)) {
        result.error = "Optimization did not improve the payload enough.";
        return result;
    }

    result.success = true;
    result.bytes = std::move(optimized_bytes);
    return result;
}

}  // namespace campusfix
