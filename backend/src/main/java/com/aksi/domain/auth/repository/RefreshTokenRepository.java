package com.aksi.domain.auth.repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.auth.entity.RefreshTokenEntity;

/** Repository for refresh token operations */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

  /** Find refresh token by token string */
  Optional<RefreshTokenEntity> findByToken(String token);

  /** Find active refresh token by username */
  @Query(
      "SELECT rt FROM RefreshTokenEntity rt WHERE rt.username = :username AND rt.revoked = false AND rt.expiryDate > :now")
  Optional<RefreshTokenEntity> findActiveByUsername(
      @Param("username") String username, @Param("now") Instant now);

  /** Revoke all user tokens */
  @Modifying
  @Query(
      "UPDATE RefreshTokenEntity rt SET rt.revoked = true WHERE rt.username = :username AND rt.revoked = false")
  void revokeAllUserTokens(@Param("username") String username);

  /** Delete expired tokens */
  @Modifying
  @Query("DELETE FROM RefreshTokenEntity rt WHERE rt.expiryDate < :now")
  void deleteExpiredTokens(@Param("now") Instant now);

  /** Count active tokens for user */
  @Query(
      "SELECT COUNT(rt) FROM RefreshTokenEntity rt WHERE rt.username = :username AND rt.revoked = false AND rt.expiryDate > :now")
  long countActiveTokensByUsername(@Param("username") String username, @Param("now") Instant now);
}
