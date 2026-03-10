package com.smartcampus.maintenance.nativeopt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class NativeOptimizationGatewayFactory {

    private static final Logger logger = LoggerFactory.getLogger(NativeOptimizationGatewayFactory.class);

    private NativeOptimizationGatewayFactory() {
    }

    public static NativeOptimizationGateway create(boolean enabled, boolean strict, String libraryName) {
        if (!enabled) {
            return NoopNativeOptimizationGateway.INSTANCE;
        }

        try {
            NativeOptimizationGateway gateway = new JniNativeOptimizationGateway(libraryName);
            logger.info("Native optimization enabled using library '{}'.", libraryName);
            return gateway;
        } catch (UnsatisfiedLinkError | SecurityException ex) {
            if (strict) {
                throw new IllegalStateException(
                        "Native optimization is enabled but the library '%s' could not be loaded."
                                .formatted(libraryName),
                        ex);
            }
            logger.warn(
                    "Native optimization library '{}' is unavailable. Falling back to Java behavior.",
                    libraryName,
                    ex);
            return NoopNativeOptimizationGateway.INSTANCE;
        }
    }
}
