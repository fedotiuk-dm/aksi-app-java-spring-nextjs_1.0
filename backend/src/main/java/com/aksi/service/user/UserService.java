package com.aksi.service.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateBranchesRequest;
import com.aksi.api.user.dto.UpdateRolesRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserBranchesResponse;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.UserEntity;

/**
 * Service interface for user management operations. Provides a unified API for all user-related
 * operations while internally delegating to specialized Query and Command services.
 */
public interface UserService {

  // Query methods for internal use (authentication, etc.)
  Optional<UserEntity> findById(UUID id);

  Optional<UserEntity> findByUsername(String username);

  /**
   * Find user by email. TODO: Reserved for future functionality (password recovery, duplicate check
   * during registration)
   */
  Optional<UserEntity> findByEmail(String email);

  boolean verifyPassword(UserEntity userEntity, String password);

  void recordFailedLogin(UserEntity userEntity);

  void resetFailedLogins(UserEntity userEntity);

  // API DTO methods (for Controller layer)
  UserDetail getUserById(UUID userId);

  UserDetail createUser(CreateUserRequest request);

  UserDetail updateUser(UUID userId, UpdateUserRequest request);

  UserDetail activateUser(UUID userId);

  UserDetail deactivateUser(UUID userId);

  UserDetail updateUserRoles(UUID userId, UpdateRolesRequest request);

  void changePassword(UUID userId, ChangePasswordRequest request);

  UserListResponse listUsers(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      String search,
      UserRole role,
      UUID branchId,
      Boolean active);

  UserBranchesResponse getUserBranches(UUID userId);

  UserBranchesResponse updateUserBranches(UUID userId, UpdateBranchesRequest request);

  /**
   * Get permissions for a user based on their roles.
   *
   * @param userId user ID
   * @return list of permissions
   */
  List<String> getUserPermissions(UUID userId);

  /**
   * Get permissions for a specific role.
   *
   * @param role user role
   * @return list of permissions
   */
  List<String> getRolePermissions(UserRole role);
}
