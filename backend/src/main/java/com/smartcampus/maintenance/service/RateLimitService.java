package com.smartcampus.maintenance.service;

import com.smartcampus.maintenance.exception.ApiException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

    private record Counter(long windowStartMs, int count) {
    }

    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;
    private final boolean enabled;
    private final boolean redisEnabled;
    private final Map<String, Counter> inMemoryCounters = new ConcurrentHashMap<>();

    public RateLimitService(
            ObjectProvider<StringRedisTemplate> redisTemplateProvider,
            @Value("${app.security.rate-limit.enabled:true}") boolean enabled,
            @Value("${app.security.rate-limit.redis-enabled:false}") boolean redisEnabled) {
        this.redisTemplateProvider = redisTemplateProvider;
        this.enabled = enabled;
        this.redisEnabled = redisEnabled;
    }

    public void enforce(String scope, String key, int limit, Duration window) {
        if (!enabled || limit <= 0 || window == null || window.isZero() || window.isNegative()
                || key == null || key.isBlank()) {
            return;
        }

        String normalizedKey = "rate:" + scope + ":" + key.trim().toLowerCase();
        if (redisEnabled) {
            StringRedisTemplate redisTemplate = redisTemplateProvider.getIfAvailable();
            if (redisTemplate != null) {
                Long current = redisTemplate.opsForValue().increment(normalizedKey);
                if (current != null && current == 1L) {
                    redisTemplate.expire(normalizedKey, window);
                }
                if (current != null && current > limit) {
                    throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Please try again later.");
                }
                return;
            }
        }

        long now = System.currentTimeMillis();
        long windowMs = window.toMillis();
        inMemoryCounters.compute(normalizedKey, (ignored, existing) -> {
            if (existing == null || now - existing.windowStartMs >= windowMs) {
                return new Counter(now, 1);
            }
            if (existing.count + 1 > limit) {
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Please try again later.");
            }
            return new Counter(existing.windowStartMs, existing.count + 1);
        });
    }
}
