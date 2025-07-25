package com.aksi.domain.user.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.entity.UserRole;

/** Repository interface for UserEntity */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

  /** Find user by username */
  Optional<UserEntity> findByUsername(String username);

  /** Find user by email */
  Optional<UserEntity> findByEmail(String email);

  /** Check if username exists */
  boolean existsByUsername(String username);

  /** Check if email exists */
  boolean existsByEmail(String email);

  /** Find users by role with pagination */
  @Query("SELECT u FROM UserEntity u WHERE u.role = :role")
  Page<UserEntity> findByRole(@Param("role") UserRole role, Pageable pageable);

  /** Find users with filters */
  @Query(
      "SELECT u FROM UserEntity u WHERE "
          + "(:branchId IS NULL OR u.branchId = :branchId) AND "
          + "(:role IS NULL OR u.role = :role) AND "
          + "(:isActive IS NULL OR u.active = :isActive)")
  Page<UserEntity> findWithFilters(
      @Param("branchId") UUID branchId,
      @Param("role") UserRole role,
      @Param("isActive") Boolean isActive,
      Pageable pageable);
}
