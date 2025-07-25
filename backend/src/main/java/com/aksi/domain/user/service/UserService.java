package com.aksi.domain.user.service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UpdateUserRoleRequest;
import com.aksi.api.user.dto.UpdateUserStatusRequest;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserResponse;
import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.exception.UserAlreadyExistsException;
import com.aksi.domain.user.exception.UserNotFoundException;
import com.aksi.domain.user.mapper.UserMapper;
import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for user management operations */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  private static final int MAX_FAILED_ATTEMPTS = 5;
  private static final Duration LOCK_DURATION = Duration.ofMinutes(30);

  /** Create a new user */
  @Transactional
  public UserResponse createUser(CreateUserRequest request) {
    // Check if username already exists
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new UserAlreadyExistsException("username", request.getUsername());
    }

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new UserAlreadyExistsException("email", request.getEmail());
    }

    // Create new user entity
    UserEntity user = userMapper.toEntity(request);
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    // Map role
    user.setRole(userMapper.mapApiRoleToEntityRole(request.getRole()));

    // Save user
    user = userRepository.save(user);
    log.info("Created new user: {}", user.getUsername());

    return userMapper.toResponse(user);
  }

  /** Get user by ID */
  @Transactional(readOnly = true)
  public UserResponse getUserById(UUID id) {
    UserEntity user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    return userMapper.toResponse(user);
  }

  /** Get user by username */
  @Transactional(readOnly = true)
  public UserResponse getUserByUsername(String username) {
    UserEntity user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException(username));
    return userMapper.toResponse(user);
  }

  /** Update user details */
  @Transactional
  public UserResponse updateUser(UUID id, UpdateUserRequest request) {
    UserEntity user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

    // Check if new email already exists (if changing email)
    if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
      if (userRepository.existsByEmail(request.getEmail())) {
        throw new UserAlreadyExistsException("email", request.getEmail());
      }
    }

    // Update user fields
    userMapper.updateEntityFromRequest(user, request);

    // Save changes
    user = userRepository.save(user);
    log.info("Updated user: {}", user.getUsername());

    return userMapper.toResponse(user);
  }

  /** Change user password */
  @Transactional
  public void changePassword(UUID id, ChangePasswordRequest request) {
    UserEntity user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

    // Verify current password
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
      throw new IllegalArgumentException("Current password is incorrect");
    }

    // Update password
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    log.info("Changed password for user: {}", user.getUsername());
  }

  /** Update user role */
  @Transactional
  public UserResponse updateUserRole(UUID id, UpdateUserRoleRequest request) {
    UserEntity user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

    // Update role
    user.setRole(userMapper.mapApiRoleToEntityRole(request.getRole()));
    user = userRepository.save(user);

    log.info("Updated role for user {} to {}", user.getUsername(), request.getRole());

    return userMapper.toResponse(user);
  }

  /** Update user status (activate/deactivate) */
  @Transactional
  public UserResponse updateUserStatus(UUID id, UpdateUserStatusRequest request) {
    UserEntity user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

    // Update status
    user.setActive(request.getIsActive());

    // If activating, also unlock the user
    if (request.getIsActive() && user.isLocked()) {
      user.unlock();
    }

    user = userRepository.save(user);

    log.info("Updated status for user {} to active={}", user.getUsername(), request.getIsActive());

    return userMapper.toResponse(user);
  }

  /** List users with filters and pagination */
  @Transactional(readOnly = true)
  public UserListResponse listUsers(
      Pageable pageable, UUID branchId, com.aksi.api.user.dto.UserRole role, Boolean isActive) {
    // Convert API role to entity role if provided
    com.aksi.domain.user.entity.UserRole entityRole =
        role != null ? userMapper.mapApiRoleToEntityRole(role) : null;

    // Find users with filters
    Page<UserEntity> usersPage =
        userRepository.findWithFilters(branchId, entityRole, isActive, pageable);

    // Convert to response
    UserListResponse response = new UserListResponse();
    response.setItems(userMapper.toResponseList(usersPage.getContent()));
    response.setCurrentPage(usersPage.getNumber());
    response.setPageSize(usersPage.getSize());
    response.setTotalElements(usersPage.getTotalElements());
    response.setTotalPages(usersPage.getTotalPages());

    return response;
  }

  /** Handle failed login attempt */
  @Transactional
  public void handleFailedLogin(String username) {
    userRepository
        .findByUsername(username)
        .or(() -> userRepository.findByEmail(username))
        .ifPresent(
            user -> {
              user.incrementFailedAttempts();

              // Lock user if exceeded max attempts
              if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil(Instant.now().plus(LOCK_DURATION));
                log.warn(
                    "User {} locked after {} failed attempts",
                    user.getUsername(),
                    MAX_FAILED_ATTEMPTS);
              }

              userRepository.save(user);
            });
  }

  /** Handle successful login */
  @Transactional
  public void handleSuccessfulLogin(String username) {
    userRepository
        .findByUsername(username)
        .or(() -> userRepository.findByEmail(username))
        .ifPresent(
            user -> {
              user.updateLastLogin();
              userRepository.save(user);
              log.info(
                  "User {} (role: {}) logged in successfully from branch: {}",
                  user.getUsername(),
                  user.getRole(),
                  user.getBranchId() != null ? user.getBranchId() : "N/A");
            });
  }
}
