package com.aksi.service.user;

import java.util.Set;
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
import com.aksi.domain.user.User;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.UserMapper;
import com.aksi.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for user-related write operations. Handles all user modifications and state
 * changes.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserCommandService {

  private final UserRepository userRepository;
  private final UserQueryService userQueryService;
  private final UserFactory userFactory;
  private final UserAccountManager accountManager;
  private final UserAuthenticationManager authenticationManager;
  private final UserRoleManager roleManager;
  private final PasswordEncoder passwordEncoder;
  private final UserMapper userMapper;

  /**
   * Create a new user. Validation is handled by Spring Validation annotations on the DTO.
   *
   * @param request create user request
   * @return created user details
   * @throws ConflictException if username or email already exists
   */
  public UserDetail createUser(CreateUserRequest request) {
    log.info("Creating new user with username: {}", request.getUsername());

    // Validate username uniqueness
    if (userQueryService.existsByUsername(request.getUsername())) {
      throw new ConflictException("Username already exists: " + request.getUsername());
    }

    // Validate email uniqueness
    if (userQueryService.existsByEmail(request.getEmail())) {
      throw new ConflictException("Email already exists: " + request.getEmail());
    }

    // Create user using factory
    User user = userFactory.createFromRequest(request);

    // Save and return
    user = userRepository.save(user);
    log.info("Created user with ID: {}", user.getId());

    return userMapper.toUserDetail(user);
  }

  /**
   * Update user information.
   *
   * @param userId user ID
   * @param request update request
   * @return updated user details
   * @throws NotFoundException if user not found
   * @throws ConflictException if email already exists for another user
   */
  public UserDetail updateUser(UUID userId, UpdateUserRequest request) {
    log.info("Updating user with id: {}", userId);

    User user = getUserOrThrow(userId);

    // Validate email uniqueness if changing
    if (request.getEmail() != null
        && userQueryService.existsByEmailExcludingCurrent(user.getEmail(), request.getEmail())) {
      throw new ConflictException("Email already exists: " + request.getEmail());
    }

    // Update fields using mapper
    userMapper.updateUserFromDto(request, user);

    user = userRepository.save(user);
    log.info("Updated user: {}", userId);

    return userMapper.toUserDetail(user);
  }

  /**
   * Activate a user account.
   *
   * @param userId user ID
   * @return activated user details
   * @throws NotFoundException if user not found
   * @throws ConflictException if user is already active
   */
  public UserDetail activateUser(UUID userId) {
    log.info("Activating user: {}", userId);

    User user = getUserOrThrow(userId);
    accountManager.activateAccount(user);

    user = userRepository.save(user);
    return userMapper.toUserDetail(user);
  }

  /**
   * Deactivate a user account.
   *
   * @param userId user ID
   * @return deactivated user details
   * @throws NotFoundException if user not found
   * @throws ConflictException if user is already inactive
   */
  public UserDetail deactivateUser(UUID userId) {
    log.info("Deactivating user: {}", userId);

    User user = getUserOrThrow(userId);
    accountManager.deactivateAccount(user);

    user = userRepository.save(user);
    return userMapper.toUserDetail(user);
  }

  /**
   * Change user password.
   *
   * @param userId user ID
   * @param request password change request
   * @throws NotFoundException if user not found
   * @throws UnauthorizedException if current password is incorrect
   */
  public void changePassword(UUID userId, ChangePasswordRequest request) {
    log.info("Changing password for user: {}", userId);

    User user = getUserOrThrow(userId);

    // Verify current password if provided (self password change)
    if (request.getCurrentPassword() != null
        && !passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Update password
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    log.info("Password changed for user: {}", userId);
  }

  /**
   * Update user roles.
   *
   * @param userId user ID
   * @param request roles update request
   * @return updated user details
   * @throws NotFoundException if user not found
   */
  public UserDetail updateUserRoles(UUID userId, UpdateRolesRequest request) {
    log.info("Updating roles for user: {}", userId);

    User user =
        userRepository
            .findByIdWithRoles(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

    roleManager.setRoles(user, Set.copyOf(request.getRoles()));

    user = userRepository.save(user);
    return userMapper.toUserDetail(user);
  }

  /**
   * Update user branch assignments.
   *
   * @param userId user ID
   * @param request branch update request
   * @return updated branches response
   * @throws NotFoundException if user not found
   */
  public UserBranchesResponse updateUserBranches(UUID userId, UpdateBranchesRequest request) {
    // TODO: Implement branch assignment update
    // This requires Branch entity and proper relationship management

    log.warn("Branch assignment update not yet implemented for user ID: {}", userId);
    throw new UnsupportedOperationException("Branch assignment update not yet implemented");
  }

  /**
   * Record failed login attempt.
   *
   * @param user the user who failed to login
   * @return true if account was locked due to max attempts
   */
  public boolean recordFailedLogin(User user) {
    boolean wasLocked = authenticationManager.recordFailedLoginAttempt(user);
    userRepository.save(user);
    return wasLocked;
  }

  /**
   * Reset failed login attempts after successful login.
   *
   * @param user the user who logged in successfully
   */
  public void resetFailedLogins(User user) {
    authenticationManager.resetFailedLoginAttempts(user);
    userRepository.save(user);
  }

  /**
   * Helper method to get user or throw exception.
   *
   * @param userId user ID
   * @return user entity
   * @throws NotFoundException if user not found
   */
  private User getUserOrThrow(UUID userId) {
    return userQueryService
        .findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
  }
}
