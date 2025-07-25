package com.aksi.domain.auth.service;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.domain.auth.entity.RefreshTokenEntity;
import com.aksi.domain.auth.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for refresh token management */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtProperties jwtProperties;
  private final JwtTokenService jwtTokenService;

  /** Create new refresh token for user */
  public RefreshTokenEntity createRefreshToken(String username) {
    // Revoke all existing tokens for the user
    refreshTokenRepository.revokeAllUserTokens(username);

    RefreshTokenEntity refreshToken =
        RefreshTokenEntity.builder()
            .token(jwtTokenService.generateRefreshToken())
            .username(username)
            .expiryDate(Instant.now().plusSeconds(jwtProperties.getRefreshTokenExpirationSeconds()))
            .revoked(false)
            .build();

    refreshToken = refreshTokenRepository.save(refreshToken);
    log.info("Created new refresh token for user: {}", username);

    return refreshToken;
  }

  /** Find refresh token by token string */
  public RefreshTokenEntity findByToken(String token) {
    return refreshTokenRepository
        .findByToken(token)
        .orElseThrow(
            () -> {
              log.error("Refresh token not found: {}", token);
              return new IllegalArgumentException("Invalid refresh token");
            });
  }

  /** Verify token expiration */
  public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token) {
    if (token.isExpired()) {
      refreshTokenRepository.delete(token);
      log.error("Refresh token expired for user: {}", token.getUsername());
      throw new IllegalArgumentException("Refresh token expired");
    }

    if (token.isRevoked()) {
      log.error("Refresh token revoked for user: {}", token.getUsername());
      throw new IllegalArgumentException("Refresh token revoked");
    }

    return token;
  }

  /** Revoke all tokens for user */
  public void revokeUserTokens(String username) {
    refreshTokenRepository.revokeAllUserTokens(username);
    log.info("Revoked all refresh tokens for user: {}", username);
  }

  /** Delete expired tokens (cleanup job) */
  @Transactional
  public void deleteExpiredTokens() {
    refreshTokenRepository.deleteExpiredTokens(Instant.now());
    log.info("Cleaned up expired refresh tokens");
  }

  /** Count active tokens for user */
  public long countActiveTokens(String username) {
    return refreshTokenRepository.countActiveTokensByUsername(username, Instant.now());
  }

  /** Find active refresh token for user */
  public RefreshTokenEntity findActiveByUsername(String username) {
    return refreshTokenRepository.findActiveByUsername(username, Instant.now()).orElse(null);
  }
}
