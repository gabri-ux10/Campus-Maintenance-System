package com.smartcampus.maintenance.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.StringUtils;

@Configuration
@ConditionalOnProperty(name = "app.security.rate-limit.redis-enabled", havingValue = "true")
public class RedisRateLimitConfiguration {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory(
            @Value("${spring.data.redis.host:}") String host,
            @Value("${spring.data.redis.port:6379}") int port,
            @Value("${spring.data.redis.password:}") String password) {
        if (!StringUtils.hasText(host)) {
            throw new IllegalStateException("REDIS_HOST must be set when APP_SECURITY_RATE_LIMIT_REDIS_ENABLED=true.");
        }

        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(host.trim(), port);
        if (StringUtils.hasText(password)) {
            configuration.setPassword(RedisPassword.of(password));
        }
        return new LettuceConnectionFactory(configuration);
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(LettuceConnectionFactory redisConnectionFactory) {
        return new StringRedisTemplate(redisConnectionFactory);
    }
}
