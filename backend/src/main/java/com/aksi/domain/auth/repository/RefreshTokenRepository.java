package com.aksi.domain.auth.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.auth.entity.RefreshTokenEntity;

/** Repository для роботи з refresh токенами Управління сесіями користувачів. */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

  /** Пошук токену за значенням. */
  Optional<RefreshTokenEntity> findByToken(String token);

  /** Пошук активного токену за значенням. */
  @Query(
      "SELECT rt FROM RefreshTokenEntity rt WHERE rt.token = :token AND rt.isActive = true AND rt.expiresAt > :now")
  Optional<RefreshTokenEntity> findValidToken(
      @Param("token") String token, @Param("now") LocalDateTime now);

  /** Пошук всіх токенів користувача. */
  List<RefreshTokenEntity> findByUserId(Long userId);

  /** Пошук активних токенів користувача. */
  @Query(
      "SELECT rt FROM RefreshTokenEntity rt WHERE rt.userId = :userId AND rt.isActive = true AND rt.expiresAt > :now")
  List<RefreshTokenEntity> findActiveTokensByUserId(
      @Param("userId") Long userId, @Param("now") LocalDateTime now);

  /** Перевірка чи існує активний токен. */
  @Query(
      "SELECT COUNT(rt) > 0 FROM RefreshTokenEntity rt WHERE rt.token = :token AND rt.isActive = true AND rt.expiresAt > :now")
  boolean existsValidToken(@Param("token") String token, @Param("now") LocalDateTime now);

  /** Інвалідація токену. */
  @Modifying
  @Query("UPDATE RefreshTokenEntity rt SET rt.isActive = false WHERE rt.token = :token")
  void invalidateToken(@Param("token") String token);

  /** Інвалідація всіх токенів користувача. */
  @Modifying
  @Query("UPDATE RefreshTokenEntity rt SET rt.isActive = false WHERE rt.userId = :userId")
  void invalidateAllUserTokens(@Param("userId") Long userId);

  /** Видалення прострочених токенів. */
  @Modifying
  @Query("DELETE FROM RefreshTokenEntity rt WHERE rt.expiresAt < :now")
  void deleteExpiredTokens(@Param("now") LocalDateTime now);

  /** Видалення неактивних токенів. */
  @Modifying
  @Query("DELETE FROM RefreshTokenEntity rt WHERE rt.isActive = false")
  void deleteInactiveTokens();

  /** Пошук токенів що скоро закінчаться. */
  @Query(
      "SELECT rt FROM RefreshTokenEntity rt WHERE rt.isActive = true AND rt.expiresAt BETWEEN :now AND :threshold")
  List<RefreshTokenEntity> findTokensExpiringBetween(
      @Param("now") LocalDateTime now, @Param("threshold") LocalDateTime threshold);

  /** Оновлення часу останнього використання. */
  @Modifying
  @Query("UPDATE RefreshTokenEntity rt SET rt.lastUsedAt = :lastUsed WHERE rt.token = :token")
  void updateLastUsed(@Param("token") String token, @Param("lastUsed") LocalDateTime lastUsed);

  /** Підрахунок активних сесій користувача. */
  @Query(
      "SELECT COUNT(rt) FROM RefreshTokenEntity rt WHERE rt.userId = :userId AND rt.isActive = true AND rt.expiresAt > :now")
  long countActiveSessionsByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

  /** Статистика токенів по користувачах. */
  @Query(
      "SELECT rt.userId, COUNT(rt) FROM RefreshTokenEntity rt WHERE rt.isActive = true GROUP BY rt.userId")
  List<Object[]> getActiveTokenStatsByUser();
}
