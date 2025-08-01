package com.aksi.service.user;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.GetUserBranches200Response;
import com.aksi.api.user.dto.ListUsers200Response;
import com.aksi.api.user.dto.UpdateBranchesRequest;
import com.aksi.api.user.dto.UpdateRolesRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.Role;
import com.aksi.domain.user.User;

/** Service interface for user management operations. */
public interface UserService {

  // Domain entity methods (existing)
  Optional<User> findById(UUID id);

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  Page<User> findAll(Pageable pageable);

  User createUser(
      String username,
      String email,
      String password,
      String firstName,
      String lastName,
      String phone);

  void changePassword(UUID userId, String currentPassword, String newPassword);

  User updateUserRoles(UUID userId, Set<Role> roles);

  User activateUser(UUID userId);

  User deactivateUser(UUID userId);

  boolean verifyPassword(User user, String password);

  void recordFailedLogin(User user);

  void resetFailedLogins(User user);

  // API DTO methods (new - for Controller layer)
  UserDetail getUserDetailById(UUID userId);

  UserDetail createUserAndReturnDetail(CreateUserRequest request);

  UserDetail updateUserAndReturnDetail(UUID userId, UpdateUserRequest request);

  UserDetail activateUserAndReturnDetail(UUID userId);

  UserDetail deactivateUserAndReturnDetail(UUID userId);

  UserDetail updateUserRolesAndReturnDetail(UUID userId, UpdateRolesRequest request);

  void changePassword(UUID userId, ChangePasswordRequest request);

  ListUsers200Response listUsers(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      String search,
      UserRole role,
      UUID branchId,
      Boolean active);

  GetUserBranches200Response getUserBranches(UUID userId);

  GetUserBranches200Response updateUserBranches(UUID userId, UpdateBranchesRequest request);
}
