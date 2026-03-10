#include "jni_bindings.h"

#include "assignment_algorithm.h"
#include "image_compressor.h"

#include <string>
#include <vector>

namespace {

std::vector<int> CopyIntArray(JNIEnv* env, jintArray source) {
    if (source == nullptr) {
        return {};
    }
    const jsize length = env->GetArrayLength(source);
    std::vector<int> result(static_cast<std::size_t>(length));
    env->GetIntArrayRegion(source, 0, length, reinterpret_cast<jint*>(result.data()));
    return result;
}

std::vector<std::uint8_t> CopyByteArray(JNIEnv* env, jbyteArray source) {
    if (source == nullptr) {
        return {};
    }
    const jsize length = env->GetArrayLength(source);
    std::vector<std::uint8_t> result(static_cast<std::size_t>(length));
    env->GetByteArrayRegion(source, 0, length, reinterpret_cast<jbyte*>(result.data()));
    return result;
}

std::string CopyString(JNIEnv* env, jstring source) {
    if (source == nullptr) {
        return {};
    }
    const char* utf_chars = env->GetStringUTFChars(source, nullptr);
    if (utf_chars == nullptr) {
        return {};
    }
    std::string value(utf_chars);
    env->ReleaseStringUTFChars(source, utf_chars);
    return value;
}

jobject BuildOptimizedImageResult(JNIEnv* env, const campusfix::ImageOptimizationResult& result) {
    jclass result_class = env->FindClass("com/smartcampus/maintenance/nativeopt/OptimizedImageResult");
    if (result_class == nullptr) {
        return nullptr;
    }

    jmethodID constructor = env->GetMethodID(
        result_class,
        "<init>",
        "([BLjava/lang/String;IIII)V");
    if (constructor == nullptr) {
        return nullptr;
    }

    jbyteArray bytes = env->NewByteArray(static_cast<jsize>(result.bytes.size()));
    if (bytes == nullptr) {
        return nullptr;
    }
    env->SetByteArrayRegion(
        bytes,
        0,
        static_cast<jsize>(result.bytes.size()),
        reinterpret_cast<const jbyte*>(result.bytes.data()));
    jstring content_type = env->NewStringUTF(result.content_type.c_str());
    if (content_type == nullptr) {
        return nullptr;
    }

    return env->NewObject(
        result_class,
        constructor,
        bytes,
        content_type,
        result.original_dimensions.width,
        result.original_dimensions.height,
        result.optimized_dimensions.width,
        result.optimized_dimensions.height);
}

}  // namespace

JNIEXPORT jdoubleArray JNICALL
Java_com_smartcampus_maintenance_nativeopt_JniNativeOptimizationGateway_nativeScoreCandidates(
    JNIEnv* env,
    jobject,
    jintArray active_open_tickets,
    jintArray same_domain_resolved_tickets,
    jintArray same_building_resolved_tickets,
    jintArray recent_resolved_tickets) {
    const std::vector<int> active = CopyIntArray(env, active_open_tickets);
    const std::vector<int> domain = CopyIntArray(env, same_domain_resolved_tickets);
    const std::vector<int> building = CopyIntArray(env, same_building_resolved_tickets);
    const std::vector<int> recent = CopyIntArray(env, recent_resolved_tickets);

    if (active.size() != domain.size() || active.size() != building.size() || active.size() != recent.size()) {
        return nullptr;
    }

    std::vector<campusfix::AssignmentCandidateSignal> candidates;
    candidates.reserve(active.size());
    for (std::size_t index = 0; index < active.size(); ++index) {
        candidates.push_back({
            active[index],
            domain[index],
            building[index],
            recent[index],
        });
    }

    const std::vector<double> scores = campusfix::ScoreCandidates(candidates);
    jdoubleArray output = env->NewDoubleArray(static_cast<jsize>(scores.size()));
    if (output == nullptr) {
        return nullptr;
    }
    env->SetDoubleArrayRegion(output, 0, static_cast<jsize>(scores.size()), scores.data());
    return output;
}

JNIEXPORT jobject JNICALL
Java_com_smartcampus_maintenance_nativeopt_JniNativeOptimizationGateway_nativeOptimizeImage(
    JNIEnv* env,
    jobject,
    jbyteArray input_bytes,
    jstring content_type,
    jint min_savings_percent,
    jint jpeg_quality,
    jint webp_quality) {
    const std::vector<std::uint8_t> bytes = CopyByteArray(env, input_bytes);
    campusfix::ImageOptimizationOptions options {};
    options.content_type = CopyString(env, content_type);
    options.min_savings_percent = min_savings_percent;
    options.jpeg_quality = jpeg_quality;
    options.webp_quality = webp_quality;

    const campusfix::ImageOptimizationResult result = campusfix::OptimizeImage(bytes, options);
    if (!result.success) {
        return nullptr;
    }
    return BuildOptimizedImageResult(env, result);
}
