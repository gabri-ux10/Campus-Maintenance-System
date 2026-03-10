#pragma once

#include <jni.h>

extern "C" {

JNIEXPORT jdoubleArray JNICALL
Java_com_smartcampus_maintenance_nativeopt_JniNativeOptimizationGateway_nativeScoreCandidates(
    JNIEnv* env,
    jobject self,
    jintArray active_open_tickets,
    jintArray same_domain_resolved_tickets,
    jintArray same_building_resolved_tickets,
    jintArray recent_resolved_tickets);

JNIEXPORT jobject JNICALL
Java_com_smartcampus_maintenance_nativeopt_JniNativeOptimizationGateway_nativeOptimizeImage(
    JNIEnv* env,
    jobject self,
    jbyteArray input_bytes,
    jstring content_type,
    jint min_savings_percent,
    jint jpeg_quality,
    jint webp_quality);

}
