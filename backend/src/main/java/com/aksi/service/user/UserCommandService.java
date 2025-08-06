package com.aksi.service.user;

import java.util.List;
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
import com.aksi.domain.user.UserBranchAssignmentEntity;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.exception.UnauthorizedException;
import com.aksi.mapper.UserMapper;
import com.aksi.repository.BranchRepository;
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

  private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;

  private final UserRepository userRepository;
  private final BranchRepository branchRepository;
  private final UserQueryService userQueryService;
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

    // Create user from request
    UserEntity userEntityEntity = createUserFromRequest(request);

    // Save and return
    userEntityEntity = userRepository.save(userEntityEntity);
    log.info("Created user with ID: {}", userEntityEntity.getId());

    return userMapper.toUserDetail(userEntityEntity);
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

    UserEntity userEntityEntity = getUserOrThrow(userId);

    // Validate email uniqueness if changing
    if (request.getEmail() != null
        && userQueryService.existsByEmailExcludingCurrent(
            userEntityEntity.getEmail(), request.getEmail())) {
      throw new ConflictException("Email already exists: " + request.getEmail());
    }

    // Update fields using mapper
    userMapper.updateUserFromDto(request, userEntityEntity);

    userEntityEntity = userRepository.save(userEntityEntity);
    log.info("Updated user: {}", userId);

    return userMapper.toUserDetail(userEntityEntity);
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

    UserEntity userEntityEntity = getUserOrThrow(userId);

    if (userEntityEntity.isActive()) {
      throw new ConflictException("User account is already active");
    }

    userEntityEntity.setActive(true);
    userEntityEntity.setFailedLoginAttempts(0); // Reset failed attempts on activation
    log.info("Activated user account: {}", userEntityEntity.getUsername());

    userEntityEntity = userRepository.save(userEntityEntity);
    return userMapper.toUserDetail(userEntityEntity);
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

    UserEntity userEntityEntity = getUserOrThrow(userId);

    if (!userEntityEntity.isActive()) {
      throw new ConflictException("User account is already inactive");
    }

    userEntityEntity.setActive(false);
    log.info("Deactivated user account: {}", userEntityEntity.getUsername());

    userEntityEntity = userRepository.save(userEntityEntity);
    return userMapper.toUserDetail(userEntityEntity);
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

    UserEntity userEntityEntity = getUserOrThrow(userId);

    // Verify current password if provided (self password change)
    if (request.getCurrentPassword() != null
        && !passwordEncoder.matches(
            request.getCurrentPassword(), userEntityEntity.getPasswordHash())) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Update password
    userEntityEntity.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(userEntityEntity);

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

    UserEntity userEntityEntity =
        userRepository
            .findByIdWithRoles(userId)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

    // Clear existing roles and add new ones
    userEntityEntity.getRoles().clear();
    userEntityEntity.getRoles().addAll(request.getRoles());
    log.debug(
        "Updated roles for user '{}': {}", userEntityEntity.getUsername(), request.getRoles());

    userEntityEntity = userRepository.save(userEntityEntity);
    return userMapper.toUserDetail(userEntityEntity);
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
    log.info("Updating branch assignments for user: {}", userId);

    UserEntity userEntityEntity = getUserOrThrow(userId);

    // Validate all branch IDs exist
    List<UUID> branchIds = request.getBranchIds();
    if (!branchIds.isEmpty()) {
      long existingBranchesCount = branchRepository.countByIdIn(branchIds);
      if (existingBranchesCount != branchIds.size()) {
        throw new NotFoundException("One or more branch IDs are invalid");
      }
    }

    // Validate primary branch is in the list if specified
    UUID primaryBranchId = request.getPrimaryBranchId();
    if (primaryBranchId != null && !branchIds.contains(primaryBranchId)) {
      throw new ConflictException("Primary branch must be in the assigned branches list");
    }

    // Clear existing assignments
    userEntityEntity.getBranchAssignments().clear();

    // Add new assignments
    for (UUID branchId : branchIds) {
      UserBranchAssignmentEntity assignment = new UserBranchAssignmentEntity();
      assignment.setUserEntityEntity(userEntityEntity);
      assignment.setBranchId(branchId);
      assignment.setPrimary(branchId.equals(primaryBranchId));
      assignment.setActive(true);
      userEntityEntity.getBranchAssignments().add(assignment);
    }

    // If no primary branch specified but branches exist, make the first one primary
    if (primaryBranchId == null && !branchIds.isEmpty()) {
      userEntityEntity.getBranchAssignments().iterator().next().setPrimary(true);
    }

    userEntityEntity = userRepository.save(userEntityEntity);
    log.info("Updated branch assignments for user '{}'", userEntityEntity.getUsername());

    return userQueryService.getUserBranches(userId);
  }

  /**
   * Record failed login attempt.
   *
   * @param userEntityEntity the user who failed to login
   */
  public void recordFailedLogin(UserEntity userEntityEntity) {
    int attempts = userEntityEntity.getFailedLoginAttempts() + 1;
    userEntityEntity.setFailedLoginAttempts(attempts);

    if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      userEntityEntity.setActive(false);
      log.warn(
          "User '{}' has been deactivated after {} failed login attempts",
          userEntityEntity.getUsername(),
          attempts);
    } else {
      log.debug("Failed login attempt {} for user '{}'", attempts, userEntityEntity.getUsername());
    }

    userRepository.save(userEntityEntity);
  }

  /**
   * Reset failed login attempts after successful login.
   *
   * @param userEntityEntity the user who logged in successfully
   */
  public void resetFailedLogins(UserEntity userEntityEntity) {
    if (userEntityEntity.getFailedLoginAttempts() > 0) {
      userEntityEntity.setFailedLoginAttempts(0);
      log.debug("Reset failed login attempts for user '{}'", userEntityEntity.getUsername());
      userRepository.save(userEntityEntity);
    }
  }

  /**
   * Helper method to get user or throw exception.
   *
   * @param userId user ID
   * @return user entity
   * @throws NotFoundException if user not found
   */
  private UserEntity getUserOrThrow(UUID userId) {
    return userQueryService
        .findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
  }

  /**
   * Create user entity from request.
   *
   * @param request create user request
   * @return new user entity
   */
  private UserEntity createUserFromRequest(CreateUserRequest request) {
    // MapStruct does all the mapping including defaults from OpenAPI
    UserEntity userEntityEntity = userMapper.toUser(request);

    // Only handle password encoding - the one thing that can't be in DTO
    userEntityEntity.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    // These are always the same for new users - no need for config
    userEntityEntity.setFailedLoginAttempts(0);

    return userEntityEntity;
  }
}
