package com.smartcampus.maintenance.nativeopt;

import java.util.List;
import java.util.Optional;

public final class NoopNativeOptimizationGateway implements NativeOptimizationGateway {

    public static final NoopNativeOptimizationGateway INSTANCE = new NoopNativeOptimizationGateway();

    private NoopNativeOptimizationGateway() {
    }

    @Override
    public Optional<double[]> scoreCandidates(List<AssignmentCandidateMetrics> candidates) {
        return Optional.empty();
    }

    @Override
    public Optional<OptimizedImageResult> optimizeImage(ImageOptimizationRequest request) {
        return Optional.empty();
    }

    @Override
    public boolean isAvailable() {
        return false;
    }
}
