package com.aksi.domain.user.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.user.entity.UserEntity;

/**
 * Репозиторій для роботи з користувачами системи.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    /**
     * Пошук користувача за username.
     * @param username ім'я користувача
     * @return користувач (якщо знайдено)
     */
    Optional<UserEntity> findByUsername(String username);

    /**
     * Пошук користувача за email.
     * @param email електронна пошта
     * @return користувач (якщо знайдено)
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Перевірка чи існує користувач з вказаним username.
     * @param username ім'я користувача
     * @return true, якщо існує
     */
    boolean existsByUsername(String username);

    /**
     * Перевірка чи існує користувач з вказаним email.
     * @param email електронна пошта
     * @return true, якщо існує
     */
    boolean existsByEmail(String email);
}
