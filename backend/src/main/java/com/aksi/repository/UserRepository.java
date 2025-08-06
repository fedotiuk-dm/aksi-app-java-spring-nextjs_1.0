package com.aksi.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.user.UserEntity;

/** Repository interface for User entity. */
@Repository
public interface UserRepository
    extends JpaRepository<UserEntity, UUID>, JpaSpecificationExecutor<UserEntity> {

  Optional<UserEntity> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.roles WHERE u.id = :id")
  Optional<UserEntity> findByIdWithRoles(@Param("id") UUID id);

  @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.roles WHERE u.username = :username")
  Optional<UserEntity> findByUsername(@Param("username") String username);

  @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.branchAssignments WHERE u.id = :id")
  Optional<UserEntity> findByIdWithBranches(@Param("id") UUID id);
}
