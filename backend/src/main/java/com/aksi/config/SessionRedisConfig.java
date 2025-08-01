package com.aksi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisIndexedHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * Redis-based session configuration. Works with both embedded Redis (dev) and external Redis
 * (prod).
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

  /** Configure Redis template for session storage. */
  @Bean
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
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
