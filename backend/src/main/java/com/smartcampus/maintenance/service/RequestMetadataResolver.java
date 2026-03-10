package com.smartcampus.maintenance.service;

import jakarta.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class RequestMetadataResolver {

    private final List<TrustedProxyMatcher> trustedProxies;

    public RequestMetadataResolver(@Value("${app.security.trusted-proxies:}") List<String> trustedProxies) {
        this.trustedProxies = (trustedProxies == null ? Stream.<String>empty() : trustedProxies.stream())
                .flatMap(value -> Stream.of(value.split(",")))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .map(this::parseMatcher)
                .filter(Objects::nonNull)
                .toList();
    }

    public RequestMetadata resolve(HttpServletRequest request) {
        if (request == null) {
            return new RequestMetadata(null, null);
        }
        String remoteAddress = normalizeIp(request.getRemoteAddr());
        String forwardedFor = firstForwardedIp(request.getHeader("X-Forwarded-For"));
        String realIp = normalizeIp(request.getHeader("X-Real-IP"));
        String ipAddress = remoteAddress;
        if (isTrustedProxy(remoteAddress)) {
            if (StringUtils.hasText(forwardedFor)) {
                ipAddress = forwardedFor;
            } else if (StringUtils.hasText(realIp)) {
                ipAddress = realIp;
            }
        }
        String userAgent = sanitize(request.getHeader("User-Agent"), 255);
        return new RequestMetadata(sanitize(ipAddress, 64), userAgent);
    }

    private boolean isTrustedProxy(String remoteAddress) {
        if (!StringUtils.hasText(remoteAddress)) {
            return false;
        }
        try {
            InetAddress address = InetAddress.getByName(remoteAddress);
            return trustedProxies.stream().anyMatch(matcher -> matcher.matches(address));
        } catch (Exception ex) {
            return false;
        }
    }

    private String firstForwardedIp(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return Arrays.stream(value.split(","))
                .map(this::normalizeIp)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);
    }

    private String sanitize(String value, int maxLength) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = value.trim();
        return normalized.length() > maxLength ? normalized.substring(0, maxLength) : normalized;
    }

    private String normalizeIp(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = stripPortAndBrackets(value.trim());
        try {
            return InetAddress.getByName(normalized).getHostAddress();
        } catch (Exception ex) {
            return null;
        }
    }

    private String stripPortAndBrackets(String value) {
        if (value.startsWith("[") && value.contains("]")) {
            return value.substring(1, value.indexOf(']'));
        }
        int colonCount = (int) value.chars().filter(ch -> ch == ':').count();
        if (colonCount == 1 && value.contains(".")) {
            int lastColon = value.lastIndexOf(':');
            String possiblePort = value.substring(lastColon + 1);
            if (possiblePort.chars().allMatch(Character::isDigit)) {
                return value.substring(0, lastColon);
            }
        }
        return value;
    }

    private TrustedProxyMatcher parseMatcher(String value) {
        try {
            if (!value.contains("/")) {
                return new ExactAddressMatcher(InetAddress.getByName(value));
            }
            String[] parts = value.split("/", 2);
            InetAddress network = InetAddress.getByName(parts[0]);
            int prefixLength = Integer.parseInt(parts[1]);
            return new CidrMatcher(network, prefixLength);
        } catch (Exception ex) {
            throw new IllegalStateException("Invalid trusted proxy entry: " + value, ex);
        }
    }

    private interface TrustedProxyMatcher {
        boolean matches(InetAddress address);
    }

    private record ExactAddressMatcher(byte[] addressBytes) implements TrustedProxyMatcher {
        ExactAddressMatcher(InetAddress address) {
            this(address.getAddress());
        }

        @Override
        public boolean matches(InetAddress address) {
            return Arrays.equals(addressBytes, address.getAddress());
        }
    }

    private record CidrMatcher(byte[] networkBytes, int prefixLength) implements TrustedProxyMatcher {
        CidrMatcher(InetAddress address, int prefixLength) {
            this(address.getAddress(), prefixLength);
        }

        @Override
        public boolean matches(InetAddress address) {
            byte[] candidate = address.getAddress();
            if (candidate.length != networkBytes.length || prefixLength < 0 || prefixLength > networkBytes.length * 8) {
                return false;
            }
            int fullBytes = prefixLength / 8;
            int remainingBits = prefixLength % 8;
            for (int i = 0; i < fullBytes; i++) {
                if (networkBytes[i] != candidate[i]) {
                    return false;
                }
            }
            if (remainingBits == 0) {
                return true;
            }
            int mask = (-1) << (8 - remainingBits);
            return (networkBytes[fullBytes] & mask) == (candidate[fullBytes] & mask);
        }
    }
}
