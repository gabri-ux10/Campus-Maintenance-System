package com.smartcampus.maintenance.nativeopt;

import java.util.List;
import java.util.Optional;

public interface NativeOptimizationGateway {

    Optional<double[]> scoreCandidates(List<AssignmentCandidateMetrics> candidates);

    Optional<OptimizedImageResult> optimizeImage(ImageOptimizationRequest request);

    boolean isAvailable();
}
