package com.aksi.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisIndexedHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Unified Redis configuration for sessions, rate limiting, and security event logging. Consolidates
 * RedisConfig and SessionRedisConfig to avoid bean conflicts.
 */
@Configuration
@EnableRedisIndexedHttpSession(maxInactiveIntervalInSeconds = 3600) // 1 hour session timeout
public class SessionRedisConfig {

  /** Configure cookie serializer for secure httpOnly cookies. */
  @Bean
  public CookieSerializer cookieSerializer() {
    DefaultCookieSerializer serializer = new DefaultCookieSerializer();
    serializer.setCookieName("AKSISESSIONID");
    serializer.setCookiePath("/");
    serializer.setCookieMaxAge(3600); // 1 hour
    serializer.setUseHttpOnlyCookie(true); // Security: prevent JavaScript access
    serializer.setSameSite("Lax"); // Balance between security and usability
    return serializer;
  }

  /**
   * Primary RedisTemplate with optimized serialization for complex objects (rate limiting,
   * security).
   */
  @Bean
  @Primary
  @ConditionalOnProperty(
      name = "app.security.rate-limiting.enabled",
      havingValue = "true",
      matchIfMissing = true)
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);

    // Configure key serializer
    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    // Configure value serializer with Jackson for complex objects
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.findAndRegisterModules();

    GenericJackson2JsonRedisSerializer jsonSerializer =
        new GenericJackson2JsonRedisSerializer(objectMapper);

    template.setValueSerializer(jsonSerializer);
    template.setHashValueSerializer(jsonSerializer);

    template.setDefaultSerializer(jsonSerializer);
    template.afterPropertiesSet();

    return template;
  }

  /** Simple RedisTemplate for sessions (fallback if rate limiting disabled). */
  @Bean
  @ConditionalOnProperty(name = "app.security.rate-limiting.enabled", havingValue = "false")
  public RedisTemplate<String, Object> sessionRedisTemplate(
      RedisConnectionFactory connectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);
    return template;
  }

  /** Disable Redis CONFIG command for AWS ElastiCache compatibility. */
  @Bean
  public ConfigureRedisAction configureRedisAction() {
    return ConfigureRedisAction.NO_OP;
  }
}
