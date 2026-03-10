package com.smartcampus.maintenance.config;

import com.smartcampus.maintenance.nativeopt.NativeOptimizationGateway;
import com.smartcampus.maintenance.nativeopt.NativeOptimizationGatewayFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NativeOptimizationConfiguration {

    @Bean
    NativeOptimizationGateway nativeOptimizationGateway(
            @Value("${app.native.enabled:false}") boolean enabled,
            @Value("${app.native.strict:false}") boolean strict,
            @Value("${app.native.library-name:campusfix_native}") String libraryName) {
        return NativeOptimizationGatewayFactory.create(enabled, strict, libraryName);
    }
}
