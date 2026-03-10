package com.smartcampus.maintenance.nativeopt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class NativeOptimizationGatewayFactoryTest {

    @Test
    void returnsNoopGatewayWhenNativeSupportIsDisabled() {
        NativeOptimizationGateway gateway = NativeOptimizationGatewayFactory.create(false, false, "missing_library");

        assertThat(gateway).isSameAs(NoopNativeOptimizationGateway.INSTANCE);
        assertThat(gateway.isAvailable()).isFalse();
    }

    @Test
    void fallsBackToNoopGatewayWhenLibraryIsMissingAndStrictModeIsDisabled() {
        NativeOptimizationGateway gateway = NativeOptimizationGatewayFactory.create(
                true,
                false,
                "campusfix_native_missing");

        assertThat(gateway).isSameAs(NoopNativeOptimizationGateway.INSTANCE);
    }

    @Test
    void throwsWhenLibraryIsMissingAndStrictModeIsEnabled() {
        assertThatThrownBy(() -> NativeOptimizationGatewayFactory.create(
                true,
                true,
                "campusfix_native_missing"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("campusfix_native_missing");
    }
}
