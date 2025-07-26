package com.aksi.domain.auth.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.auth.config.JwtProperties;
import com.aksi.domain.auth.entity.RefreshTokenEntity;
import com.aksi.domain.auth.repository.RefreshTokenRepository;
import com.aksi.domain.auth.util.RefreshTokenUtils;
import com.aksi.shared.validation.ValidationConstants;

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
    log.info(ValidationConstants.Messages.REFRESH_TOKEN_CREATED, username);

    return refreshToken;
  }

  /** Find refresh token by token string */
  public RefreshTokenEntity findByToken(String token) {
    return refreshTokenRepository
        .findByToken(token)
        .orElseThrow(
            () -> {
              log.error(ValidationConstants.Messages.REFRESH_TOKEN_NOT_FOUND, token);
              return new IllegalArgumentException(
                  ValidationConstants.Messages.INVALID_REFRESH_TOKEN_ERROR);
            });
  }

  /** Verify token expiration */
  public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token) {
    if (!RefreshTokenUtils.isValid(token)) {
      if (RefreshTokenUtils.isExpired(token)) {
        refreshTokenRepository.delete(token);
        log.error(ValidationConstants.Messages.REFRESH_TOKEN_EXPIRED_FOR_USER, token.getUsername());
        throw new IllegalArgumentException(ValidationConstants.Messages.REFRESH_TOKEN_EXPIRED);
      }
      if (token.isRevoked()) {
        log.error(ValidationConstants.Messages.REFRESH_TOKEN_REVOKED_FOR_USER, token.getUsername());
        throw new IllegalArgumentException(ValidationConstants.Messages.REFRESH_TOKEN_REVOKED);
      }
    }

    return token;
  }

  /** Revoke all tokens for user */
  public void revokeUserTokens(String username) {
    refreshTokenRepository.revokeAllUserTokens(username);
    log.info(ValidationConstants.Messages.REFRESH_TOKENS_REVOKED_FOR_USER, username);
  }

  /** Delete expired tokens (cleanup job) */
  @Transactional
  public void deleteExpiredTokens() {
    refreshTokenRepository.deleteExpiredTokens(Instant.now());
    log.info(ValidationConstants.Messages.EXPIRED_TOKENS_CLEANED);
  }

  /** Count active tokens for user */
  @Transactional(readOnly = true)
  public long countActiveTokens(String username) {
    return refreshTokenRepository.countActiveTokensByUsername(username, Instant.now());
  }

  /** Find active refresh token for user */
  @Transactional(readOnly = true)
  public Optional<RefreshTokenEntity> findActiveByUsername(String username) {
    return refreshTokenRepository.findActiveByUsername(username, Instant.now());
  }
}
