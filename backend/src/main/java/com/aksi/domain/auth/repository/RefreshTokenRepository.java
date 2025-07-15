package com.aksi.domain.auth.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.auth.entity.RefreshTokenEntity;

/**
 * Repository для роботи з refresh токенами. Містить тільки необхідні методи, які використовуються в
 * системі.
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

  /**
   * Пошук активного токену за значенням. Використовується для валідації refresh токену при
   * оновленні access токену.
   */
  @Query(
      "SELECT rt FROM RefreshTokenEntity rt WHERE rt.token = :token AND rt.isActive = true AND rt.expiresAt > :now")
  Optional<RefreshTokenEntity> findValidToken(
      @Param("token") String token, @Param("now") LocalDateTime now);

  /** Інвалідація токену. Використовується при logout та після використання токену для оновлення. */
  @Modifying
  @Query("UPDATE RefreshTokenEntity rt SET rt.isActive = false WHERE rt.token = :token")
  void invalidateToken(@Param("token") String token);

  /**
   * Оновлення часу останнього використання. Використовується при refresh токену для трекінгу
   * активності.
   */
  @Modifying
  @Query("UPDATE RefreshTokenEntity rt SET rt.lastUsedAt = :lastUsed WHERE rt.token = :token")
  void updateLastUsed(@Param("token") String token, @Param("lastUsed") LocalDateTime lastUsed);
}
