package com.aksi.domain.auth.util;

import java.time.Instant;

import com.aksi.domain.auth.entity.RefreshTokenEntity;

import lombok.experimental.UtilityClass;

/** Utility class for refresh token operations */
@UtilityClass
public final class RefreshTokenUtils {

  /**
   * Check if refresh token is expired
   *
   * @param token the refresh token entity
   * @return true if token is expired
   */
  public static boolean isExpired(RefreshTokenEntity token) {
    return Instant.now().isAfter(token.getExpiryDate());
  }

  /**
   * Check if refresh token is valid (not expired and not revoked)
   *
   * @param token the refresh token entity
   * @return true if token is valid
   */
  public static boolean isValid(RefreshTokenEntity token) {
    return !isExpired(token) && !token.isRevoked();
  }
}
