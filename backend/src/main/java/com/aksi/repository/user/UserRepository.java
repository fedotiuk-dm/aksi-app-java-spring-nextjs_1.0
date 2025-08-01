package com.aksi.repository.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.user.User;

/** Repository interface for User entity. */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
  Optional<User> findByIdWithRoles(@Param("id") UUID id);

  @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username")
  Optional<User> findByUsername(@Param("username") String username);

  @Query("SELECT u FROM User u LEFT JOIN FETCH u.branchAssignments WHERE u.id = :id")
  Optional<User> findByIdWithBranches(@Param("id") UUID id);

  default void validateUsernameUnique(String username) {
    if (existsByUsername(username)) {
      throw new IllegalArgumentException("Username already exists: " + username);
    }
  }

  default void validateEmailUnique(String email) {
    if (existsByEmail(email)) {
      throw new IllegalArgumentException("Email already exists: " + email);
    }
  }

  default void validateEmailUniqueForUpdate(String currentEmail, String newEmail) {
    if (!currentEmail.equals(newEmail) && existsByEmail(newEmail)) {
      throw new IllegalArgumentException("Email already exists: " + newEmail);
    }
  }
}
