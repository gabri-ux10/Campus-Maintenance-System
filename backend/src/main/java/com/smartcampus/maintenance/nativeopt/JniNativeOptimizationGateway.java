package com.smartcampus.maintenance.nativeopt;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class JniNativeOptimizationGateway implements NativeOptimizationGateway {

    private static final Logger logger = LoggerFactory.getLogger(JniNativeOptimizationGateway.class);

    private final AtomicBoolean runtimeWarningLogged = new AtomicBoolean(false);

    public JniNativeOptimizationGateway(String libraryName) {
        System.loadLibrary(libraryName);
    }

    @Override
    public Optional<double[]> scoreCandidates(List<AssignmentCandidateMetrics> candidates) {
        if (candidates == null || candidates.isEmpty()) {
            return Optional.of(new double[0]);
        }

        int[] active = new int[candidates.size()];
        int[] domain = new int[candidates.size()];
        int[] building = new int[candidates.size()];
        int[] recent = new int[candidates.size()];

        for (int i = 0; i < candidates.size(); i++) {
            AssignmentCandidateMetrics candidate = candidates.get(i);
            active[i] = candidate.activeOpenTickets();
            domain[i] = candidate.sameDomainResolvedTickets();
            building[i] = candidate.sameBuildingResolvedTickets();
            recent[i] = candidate.recentResolvedTickets();
        }

        try {
            double[] scores = nativeScoreCandidates(active, domain, building, recent);
            if (scores == null || scores.length != candidates.size()) {
                return Optional.empty();
            }
            return Optional.of(scores);
        } catch (RuntimeException | UnsatisfiedLinkError ex) {
            logRuntimeFailure("assignment scoring", ex);
            return Optional.empty();
        }
    }

    @Override
    public Optional<OptimizedImageResult> optimizeImage(ImageOptimizationRequest request) {
        if (request == null || request.bytes() == null || request.bytes().length == 0) {
            return Optional.empty();
        }

        try {
            return Optional.ofNullable(nativeOptimizeImage(
                    request.bytes(),
                    request.contentType(),
                    request.minSavingsPercent(),
                    request.jpegQuality(),
                    request.webpQuality()));
        } catch (RuntimeException | UnsatisfiedLinkError ex) {
            logRuntimeFailure("image optimization", ex);
            return Optional.empty();
        }
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    private void logRuntimeFailure(String operation, Throwable ex) {
        if (runtimeWarningLogged.compareAndSet(false, true)) {
            logger.warn("Native optimization {} failed. Falling back to Java behavior.", operation, ex);
        }
    }

    private native double[] nativeScoreCandidates(
            int[] activeOpenTickets,
            int[] sameDomainResolvedTickets,
            int[] sameBuildingResolvedTickets,
            int[] recentResolvedTickets);

    private native OptimizedImageResult nativeOptimizeImage(
            byte[] inputBytes,
            String contentType,
            int minSavingsPercent,
            int jpegQuality,
            int webpQuality);
}
