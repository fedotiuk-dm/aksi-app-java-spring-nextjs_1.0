package com.aksi.domain.user.entity;

/** User roles in the system */
public enum UserRole {
  /** System administrator with full access */
  ADMIN,

  /** Branch manager who can manage branch operations */
  MANAGER,

  /** Branch operator who can create and manage orders */
  OPERATOR
}
