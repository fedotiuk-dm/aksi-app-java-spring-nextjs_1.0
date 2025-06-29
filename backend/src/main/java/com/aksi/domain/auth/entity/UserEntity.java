package com.aksi.domain.auth.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.aksi.domain.auth.enums.UserRole;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Сутність користувача системи
 * Entity незалежна від API DTO
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_username", columnList = "username", unique = true),
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_is_active", columnList = "isActive")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends BaseEntity {

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @ElementCollection(targetClass = UserRole.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Builder.Default
    private List<UserRole> roles = new ArrayList<>();

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "failed_login_attempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    // Business Methods

    /**
     * Повне ім'я користувача
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Перевірка чи користувач активний та не заблокований
     */
    public boolean isActiveAndNotLocked() {
        return Boolean.TRUE.equals(isActive) &&
               (lockedUntil == null || lockedUntil.isBefore(LocalDateTime.now()));
    }

    /**
     * Перевірка чи користувач має конкретну роль
     */
    public boolean hasRole(UserRole role) {
        return roles.contains(role);
    }

    /**
     * Перевірка чи користувач може виконувати адміністративні дії
     */
    public boolean canAdministrate() {
        return roles.stream().anyMatch(UserRole::isAdministrative);
    }

    /**
     * Перевірка чи користувач може працювати з касою
     */
    public boolean canHandleCash() {
        return roles.stream().anyMatch(UserRole::canHandleCash);
    }

    /**
     * Перевірка чи користувач може приймати замовлення
     */
    public boolean canTakeOrders() {
        return roles.stream().anyMatch(UserRole::canTakeOrders);
    }

    /**
     * Додавання ролі користувачу
     */
    public void addRole(UserRole role) {
        if (!roles.contains(role)) {
            roles.add(role);
        }
    }

    /**
     * Видалення ролі користувача
     */
    public void removeRole(UserRole role) {
        roles.remove(role);
    }

    /**
     * Оновлення останнього входу
     */
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.failedLoginAttempts = 0; // скидаємо лічильник невдалих спроб
    }

        /**
     * Збільшення лічильника невдалих спроб входу
     */
    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts = Optional.ofNullable(this.failedLoginAttempts).orElse(0) + 1;

        // Блокування після 5 невдалих спроб на 1 хвилину (під час розробки)
        if (this.failedLoginAttempts >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(1);
        }
    }

    /**
     * Скидання блокування
     */
    public void unlockAccount() {
        this.lockedUntil = null;
        this.failedLoginAttempts = 0;
    }

    /**
     * Активація/деактивація користувача
     */
    public void setActiveStatus(boolean active) {
        this.isActive = active;
        if (active) {
            // При активації скидаємо блокування
            unlockAccount();
        }
    }
}
