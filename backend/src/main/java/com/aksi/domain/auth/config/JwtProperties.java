package com.aksi.domain.auth.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** JWT configuration properties */
@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "application.security.jwt")
public class JwtProperties {

  /** JWT secret key for signing tokens Should be loaded from environment variable */
  @NotBlank private String secret;

  /** Access token expiration time Default: 15 minutes */
  @NotNull private Duration accessTokenExpiration = Duration.ofMinutes(15);

  /** Refresh token expiration time Default: 7 days */
  @NotNull private Duration refreshTokenExpiration = Duration.ofDays(7);

  /** Token issuer */
  private String issuer = "AKSI Dry Cleaning System";

  /** Get access token expiration in seconds */
  public long getAccessTokenExpirationSeconds() {
    return accessTokenExpiration.getSeconds();
  }

  /** Get refresh token expiration in seconds */
  public long getRefreshTokenExpirationSeconds() {
    return refreshTokenExpiration.getSeconds();
  }
}
