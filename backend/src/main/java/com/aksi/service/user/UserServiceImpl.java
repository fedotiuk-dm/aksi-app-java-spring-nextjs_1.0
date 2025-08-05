package com.aksi.service.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateBranchesRequest;
import com.aksi.api.user.dto.UpdateRolesRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserBranchesResponse;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of UserService. Provides a unified API while delegating to specialized
 * Query and Command services for better separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserQueryService queryService;
  private final UserCommandService commandService;
  private final PasswordEncoder passwordEncoder;
  private final UserPermissionService permissionService;

  // Query methods - delegate to UserQueryService
  @Override
  @Transactional(readOnly = true)
  public Optional<User> findById(UUID id) {
    return queryService.findById(id);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<User> findByUsername(String username) {
    return queryService.findByUsername(username);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<User> findByEmail(String email) {
    return queryService.findByEmail(email);
  }

  @Override
  public boolean verifyPassword(User user, String password) {
    return passwordEncoder.matches(password, user.getPasswordHash());
  }

  @Override
  public void recordFailedLogin(User user) {
    commandService.recordFailedLogin(user);
  }

  @Override
  public void resetFailedLogins(User user) {
    commandService.resetFailedLogins(user);
  }

  // API DTO methods
  @Override
  @Transactional(readOnly = true)
  public UserDetail getUserById(UUID userId) {
    return queryService.getUserDetailById(userId);
  }

  @Override
  public UserDetail createUser(CreateUserRequest request) {
    return commandService.createUser(request);
  }

  @Override
  public UserDetail updateUser(UUID userId, UpdateUserRequest request) {
    return commandService.updateUser(userId, request);
  }

  @Override
  public UserDetail activateUser(UUID userId) {
    return commandService.activateUser(userId);
  }

  @Override
  public UserDetail deactivateUser(UUID userId) {
    return commandService.deactivateUser(userId);
  }

  @Override
  public UserDetail updateUserRoles(UUID userId, UpdateRolesRequest request) {
    return commandService.updateUserRoles(userId, request);
  }

  @Override
  public void changePassword(UUID userId, ChangePasswordRequest request) {
    commandService.changePassword(userId, request);
  }

  @Override
  @Transactional(readOnly = true)
  public UserListResponse listUsers(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      String search,
      UserRole role,
      UUID branchId,
      Boolean active) {
    return queryService.listUsers(page, size, sortBy, sortOrder, search, role, branchId, active);
  }

  @Override
  @Transactional(readOnly = true)
  public UserBranchesResponse getUserBranches(UUID userId) {
    return queryService.getUserBranches(userId);
  }

  @Override
  public UserBranchesResponse updateUserBranches(UUID userId, UpdateBranchesRequest request) {
    return commandService.updateUserBranches(userId, request);
  }

  @Override
  @Transactional(readOnly = true)
  public List<String> getUserPermissions(UUID userId) {
    return queryService.getUserPermissions(userId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<String> getRolePermissions(UserRole role) {
    return permissionService.getPermissionsForRole(role);
  }
}
