package com.aksi.domain.auth.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;

/**
 * Repository для роботи з користувачами. Містить тільки необхідні методи, які використовуються в
 * системі.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

  /** Пошук користувача за username або email. Використовується для автентифікації. */
  @Query(
      "SELECT u FROM UserEntity u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
  Optional<UserEntity> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

  /**
   * Перевірка чи існують користувачі з певною роллю. Використовується в DataInitializer для
   * перевірки наявності адмінів.
   */
  @Query(
      "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserEntity u JOIN u.roles r WHERE r = :role")
  boolean existsByRolesContaining(@Param("role") UserRole role);

  /** Оновлення останнього входу користувача. Використовується при успішній автентифікації. */
  @Modifying
  @Query(
      "UPDATE UserEntity u SET u.lastLoginAt = :loginTime, u.failedLoginAttempts = 0 WHERE u.id = :userId")
  void updateLastLogin(@Param("userId") UUID userId, @Param("loginTime") LocalDateTime loginTime);
}
