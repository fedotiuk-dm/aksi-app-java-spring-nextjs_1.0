package com.aksi.service.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import com.aksi.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Facade implementation of UserService. Delegates to specialized Query and Command services. */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserQueryService queryService;
  private final UserCommandService commandService;
  private final UserFactory userFactory;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  // Domain entity methods - delegate to query service
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
  @Transactional(readOnly = true)
  public Page<User> findAll(Pageable pageable) {
    return userRepository.findAll(pageable);
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

  // API DTO methods - delegate to appropriate services
  @Override
  @Transactional(readOnly = true)
  public UserDetail getUserDetailById(UUID userId) {
    return queryService.getUserDetailById(userId);
  }

  @Override
  public UserDetail createUserAndReturnDetail(CreateUserRequest request) {
    return commandService.createUser(request);
  }

  @Override
  public UserDetail updateUserAndReturnDetail(UUID userId, UpdateUserRequest request) {
    return commandService.updateUser(userId, request);
  }

  @Override
  public UserDetail activateUserAndReturnDetail(UUID userId) {
    return commandService.activateUser(userId);
  }

  @Override
  public UserDetail deactivateUserAndReturnDetail(UUID userId) {
    return commandService.deactivateUser(userId);
  }

  @Override
  public UserDetail updateUserRolesAndReturnDetail(UUID userId, UpdateRolesRequest request) {
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
}
