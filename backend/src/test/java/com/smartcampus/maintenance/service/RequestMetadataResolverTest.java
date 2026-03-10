package com.smartcampus.maintenance.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class RequestMetadataResolverTest {

    @Test
    void ignoresSpoofedForwardedHeadersFromUntrustedRemotes() {
        RequestMetadataResolver resolver = new RequestMetadataResolver(List.of("10.0.0.0/8"));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("198.51.100.10");
        request.addHeader("X-Forwarded-For", "203.0.113.9");
        request.addHeader("X-Real-IP", "203.0.113.10");

        RequestMetadata metadata = resolver.resolve(request);

        assertThat(metadata.ipAddress()).isEqualTo("198.51.100.10");
    }

    @Test
    void usesForwardedHeadersWhenRequestComesFromTrustedProxy() {
        RequestMetadataResolver resolver = new RequestMetadataResolver(List.of("10.0.0.0/8"));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("10.0.0.5");
        request.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.5");

        RequestMetadata metadata = resolver.resolve(request);

        assertThat(metadata.ipAddress()).isEqualTo("203.0.113.9");
    }
}
