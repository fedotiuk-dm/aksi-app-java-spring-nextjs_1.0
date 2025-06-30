package com.aksi.domain.auth.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;

/** Repository для роботи з користувачами Spring Data JPA з custom query методами. */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

  /** Пошук користувача за username. */
  Optional<UserEntity> findByUsername(String username);

  /** Пошук користувача за email. */
  Optional<UserEntity> findByEmail(String email);

  /** Пошук користувача за username або email. */
  @Query(
      "SELECT u FROM UserEntity u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
  Optional<UserEntity> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

  /** Перевірка чи існує користувач з таким username. */
  boolean existsByUsername(String username);

  /** Перевірка чи існує користувач з таким email. */
  boolean existsByEmail(String email);

  /** Пошук активних користувачів. */
  List<UserEntity> findByIsActiveTrue();

  /** Пошук користувачів за роллю. */
  @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE r = :role AND u.isActive = true")
  List<UserEntity> findByRoleAndActive(@Param("role") UserRole role);

  /** Перевірка чи існують користувачі з певною роллю. */
  @Query(
      "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserEntity u JOIN u.roles r WHERE r = :role")
  boolean existsByRolesContaining(@Param("role") UserRole role);

  /** Пошук заблокованих користувачів. */
  @Query("SELECT u FROM UserEntity u WHERE u.lockedUntil IS NOT NULL AND u.lockedUntil > :now")
  List<UserEntity> findLockedUsers(@Param("now") LocalDateTime now);

  /** Пошук користувачів для розблокування (час блокування закінчився). */
  @Query("SELECT u FROM UserEntity u WHERE u.lockedUntil IS NOT NULL AND u.lockedUntil <= :now")
  List<UserEntity> findUsersToUnlock(@Param("now") LocalDateTime now);

  /** Пошук користувачів з багатьма невдалими спробами входу. */
  @Query(
      "SELECT u FROM UserEntity u WHERE u.failedLoginAttempts >= :threshold AND u.isActive = true")
  List<UserEntity> findUsersWithFailedAttempts(@Param("threshold") int threshold);

  /** Оновлення останнього входу користувача. */
  @Query(
      "UPDATE UserEntity u SET u.lastLoginAt = :loginTime, u.failedLoginAttempts = 0 WHERE u.id = :userId")
  void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);

  /** Скидання невдалих спроб входу. */
  @Query(
      "UPDATE UserEntity u SET u.failedLoginAttempts = 0, u.lockedUntil = null WHERE u.id = :userId")
  void resetFailedAttempts(@Param("userId") Long userId);

  /** Пошук адміністраторів системи. */
  @Query(
      "SELECT u FROM UserEntity u JOIN u.roles r WHERE r IN ('ADMIN', 'MANAGER') AND u.isActive = true")
  List<UserEntity> findAdministrators();

  /** Статистика користувачів по ролях. */
  @Query("SELECT r, COUNT(u) FROM UserEntity u JOIN u.roles r WHERE u.isActive = true GROUP BY r")
  List<Object[]> getUserStatsByRole();
}
