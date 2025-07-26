package com.aksi.domain.user.entity;

import java.time.Instant;
import java.util.UUID;

import com.aksi.shared.BaseEntity;
import com.aksi.shared.validation.ValidationConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

  @Column(
      name = "username",
      unique = true,
      nullable = false,
      length = ValidationConstants.User.USERNAME_MAX_LENGTH)
  @NotBlank(message = ValidationConstants.Messages.USERNAME_CANNOT_BE_BLANK)
  @Size(
      min = ValidationConstants.User.USERNAME_MIN_LENGTH,
      max = ValidationConstants.User.USERNAME_MAX_LENGTH,
      message = ValidationConstants.Messages.USERNAME_SIZE_MESSAGE)
  private String username;

  @Column(
      name = "email",
      unique = true,
      nullable = false,
      length = ValidationConstants.User.EMAIL_MAX_LENGTH)
  @NotBlank(message = ValidationConstants.Messages.EMAIL_CANNOT_BE_BLANK)
  @Email(message = ValidationConstants.Messages.EMAIL_SHOULD_BE_VALID)
  @Pattern(
      regexp = ValidationConstants.User.EMAIL_PATTERN,
      message = ValidationConstants.Messages.EMAIL_INVALID_FORMAT)
  @Size(
      min = ValidationConstants.User.EMAIL_MIN_LENGTH,
      max = ValidationConstants.User.EMAIL_MAX_LENGTH,
      message = ValidationConstants.Messages.EMAIL_SIZE_MESSAGE)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Column(
      name = "first_name",
      nullable = false,
      length = ValidationConstants.User.FIRST_NAME_MAX_LENGTH)
  @NotBlank(message = ValidationConstants.Messages.FIRST_NAME_CANNOT_BE_BLANK)
  @Size(
      min = ValidationConstants.User.FIRST_NAME_MIN_LENGTH,
      max = ValidationConstants.User.FIRST_NAME_MAX_LENGTH,
      message = ValidationConstants.Messages.FIRST_NAME_SIZE_MESSAGE)
  private String firstName;

  @Column(
      name = "last_name",
      nullable = false,
      length = ValidationConstants.User.LAST_NAME_MAX_LENGTH)
  @NotBlank(message = ValidationConstants.Messages.LAST_NAME_CANNOT_BE_BLANK)
  @Size(
      min = ValidationConstants.User.LAST_NAME_MIN_LENGTH,
      max = ValidationConstants.User.LAST_NAME_MAX_LENGTH,
      message = ValidationConstants.Messages.LAST_NAME_SIZE_MESSAGE)
  private String lastName;

  @Column(name = "role", nullable = false, length = ValidationConstants.User.ROLE_MAX_LENGTH)
  @Enumerated(EnumType.STRING)
  private UserRole role;

  @Column(name = "is_active", nullable = false)
  private boolean active = true;

  @Column(name = "branch_id")
  private UUID branchId;

  @Column(name = "last_login_at")
  private Instant lastLoginAt;

  @Column(name = "failed_login_attempts", nullable = false)
  private int failedLoginAttempts;

  @Column(name = "locked_until")
  private Instant lockedUntil;
}
