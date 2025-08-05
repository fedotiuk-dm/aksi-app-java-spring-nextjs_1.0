package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.User;
import com.aksi.domain.user.UserBranchAssignment;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/** Specifications for User entity queries */
public class UserSpecification {

  private UserSpecification() {}

  /** Search by text in username, firstName, lastName, email or phone */
  public static Specification<User> searchByText(String search) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(search)) {
        return cb.conjunction();
      }

      String pattern = "%" + search.toLowerCase() + "%";

      return cb.or(
          cb.like(cb.lower(root.get("username")), pattern),
          cb.like(cb.lower(root.get("firstName")), pattern),
          cb.like(cb.lower(root.get("lastName")), pattern),
          cb.like(cb.lower(root.get("email")), pattern),
          cb.like(root.get("phone"), pattern));
    };
  }

  /** Filter by exact username */
  public static Specification<User> hasUsername(String username) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(username)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("username"), username);
    };
  }

  /** Filter by exact email (case-insensitive) */
  public static Specification<User> hasEmail(String email) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(email)) {
        return cb.conjunction();
      }
      return cb.equal(cb.lower(root.get("email")), email.toLowerCase());
    };
  }

  /** Filter by role */
  public static Specification<User> hasRole(UserRole role) {
    return (root, query, cb) -> {
      if (role == null) {
        return cb.conjunction();
      }
      return cb.isMember(role, root.get("roles"));
    };
  }

  /** Filter by branch ID */
  public static Specification<User> hasBranchId(java.util.UUID branchId) {
    return (root, query, cb) -> {
      if (branchId == null) {
        return cb.conjunction();
      }
      Join<User, UserBranchAssignment> branchJoin = root.join("branchAssignments", JoinType.LEFT);
      return cb.equal(branchJoin.get("branchId"), branchId);
    };
  }

  /** Filter only active users */
  public static Specification<User> isActive() {
    return (root, query, cb) -> cb.isTrue(root.get("active"));
  }

  /** Filter only email verified users */
  public static Specification<User> isEmailVerified() {
    return (root, query, cb) -> cb.isTrue(root.get("emailVerified"));
  }

  /** Combine all search criteria for listing users */
  public static Specification<User> searchUsers(
      String search,
      String username,
      String email,
      UserRole role,
      java.util.UUID branchId,
      Boolean active,
      Boolean emailVerified) {

    Specification<User> spec =
        Specification.allOf(
            searchByText(search),
            hasUsername(username),
            hasEmail(email),
            hasRole(role),
            hasBranchId(branchId));

    // Add active filter only if explicitly specified
    if (active != null && active) {
      spec = spec.and(isActive());
    }

    // Add email verified filter only if explicitly specified
    if (emailVerified != null && emailVerified) {
      spec = spec.and(isEmailVerified());
    }

    return spec;
  }
}
