package com.aksi.domain.user.entity;

import java.time.Instant;
import java.util.UUID;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** User entity for system operators */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends BaseEntity {

  @Column(name = "username", unique = true, nullable = false, length = 50)
  private String username;

  @Column(name = "email", unique = true, nullable = false, length = 100)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Column(name = "first_name", nullable = false, length = 50)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 50)
  private String lastName;

  @Column(name = "role", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private UserRole role;

  @Column(name = "is_active", nullable = false)
  private boolean active = true;

  @Column(name = "branch_id")
  private UUID branchId;

  @Column(name = "last_login_at")
  private Instant lastLoginAt;

  @Column(name = "failed_login_attempts", nullable = false)
  private int failedLoginAttempts = 0;

  @Column(name = "locked_until")
  private Instant lockedUntil;

  /** Check if user account is locked */
  public boolean isLocked() {
    return lockedUntil != null && lockedUntil.isAfter(Instant.now());
  }

  /** Lock user account until specified time */
  public void lockUntil(Instant until) {
    this.lockedUntil = until;
  }

  /** Unlock user account */
  public void unlock() {
    this.lockedUntil = null;
    this.failedLoginAttempts = 0;
  }

  /** Increment failed login attempts */
  public void incrementFailedAttempts() {
    this.failedLoginAttempts++;
  }

  /** Reset failed login attempts */
  public void resetFailedAttempts() {
    this.failedLoginAttempts = 0;
  }

  /** Update last login time */
  public void updateLastLogin() {
    this.lastLoginAt = Instant.now();
    this.resetFailedAttempts();
  }
}
