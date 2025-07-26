package com.aksi.api.user.controller;

import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.user.UsersApi;
import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UpdateUserRoleRequest;
import com.aksi.api.user.dto.UpdateUserStatusRequest;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.service.UserService;
import com.aksi.shared.validation.ValidationConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for user management */
@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController implements UsersApi {

  private final UserService userService;

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<UserResponse> createUser(CreateUserRequest createUserRequest) {
    log.info(ValidationConstants.Controllers.CREATING_USER, createUserRequest.getUsername());
    UserResponse response = userService.createUser(createUserRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<UserListResponse> getUsers(
      Integer page, Integer size, UUID branchId, UserRole role, Boolean isActive) {
    log.info(
        ValidationConstants.Controllers.GETTING_USERS_LIST, page, size, branchId, role, isActive);

    // Create pageable
    Pageable pageable =
        PageRequest.of(
            page != null ? page : ValidationConstants.Controllers.DEFAULT_PAGE,
            size != null ? size : ValidationConstants.Controllers.DEFAULT_PAGE_SIZE);

    UserListResponse response = userService.listUsers(pageable, branchId, role, isActive);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<UserResponse> getCurrentUser() {
    // Get current authenticated user from SecurityContext
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
        || !authentication.isAuthenticated()
        || ValidationConstants.Messages.ANONYMOUS_USER.equals(authentication.getName())) {
      log.warn(ValidationConstants.Controllers.UNAUTHORIZED_ACCESS_ATTEMPT);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String username = authentication.getName();
    log.info(ValidationConstants.Controllers.GETTING_CURRENT_USER, username);
    UserResponse response = userService.getUserByUsername(username);
    return ResponseEntity.ok(response);
  }

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<UserResponse> getUserById(UUID userId) {
    log.info(ValidationConstants.Controllers.GETTING_USER_BY_ID, userId);
    UserResponse response = userService.getUserById(userId);
    return ResponseEntity.ok(response);
  }

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<UserResponse> updateUser(UUID userId, UpdateUserRequest updateUserRequest) {
    log.info(ValidationConstants.Controllers.UPDATING_USER, userId);
    UserResponse response = userService.updateUser(userId, updateUserRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<Void> changeUserPassword(
      UUID userId, ChangePasswordRequest changePasswordRequest) {
    log.info(ValidationConstants.Controllers.CHANGING_PASSWORD, userId);
    userService.changePassword(userId, changePasswordRequest);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<UserResponse> updateUserRole(
      UUID userId, UpdateUserRoleRequest updateUserRoleRequest) {
    log.info(
        ValidationConstants.Controllers.UPDATING_USER_ROLE,
        userId,
        updateUserRoleRequest.getRole());
    UserResponse response = userService.updateUserRole(userId, updateUserRoleRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  @PreAuthorize(ValidationConstants.Controllers.HAS_ROLE_ADMIN)
  public ResponseEntity<UserResponse> updateUserStatus(
      UUID userId, UpdateUserStatusRequest updateUserStatusRequest) {
    log.info(
        ValidationConstants.Controllers.UPDATING_USER_STATUS,
        userId,
        updateUserStatusRequest.getIsActive());
    UserResponse response = userService.updateUserStatus(userId, updateUserStatusRequest);
    return ResponseEntity.ok(response);
  }
}
