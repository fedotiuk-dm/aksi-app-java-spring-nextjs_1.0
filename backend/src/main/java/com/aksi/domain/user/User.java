package com.aksi.domain.user;

import java.util.HashSet;
import java.util.Set;

import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User entity representing system users (employees). Manages user profile and authentication data.
 */
@Entity
@Table(
    name = "users",
    indexes = {
      @Index(name = "idx_user_username", columnList = "username", unique = true),
      @Index(name = "idx_user_email", columnList = "email", unique = true),
      @Index(name = "idx_user_active", columnList = "active")
    })
@Getter
@Setter
@ToString(exclude = {"passwordHash", "roles", "branchAssignments"})
public class User extends BaseEntity {

  @Column(name = "username", nullable = false, unique = true, length = 50)
  private String username;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @Column(name = "phone", length = 20)
  private String phone;

  @Column(name = "active", nullable = false)
  private boolean active = true;

  @Column(name = "email_verified", nullable = false)
  private boolean emailVerified;

  @Column(name = "failed_login_attempts")
  private int failedLoginAttempts;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name = "role")
  @Enumerated(EnumType.STRING)
  private Set<UserRole> roles = new HashSet<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<UserBranchAssignment> branchAssignments = new HashSet<>();
}
