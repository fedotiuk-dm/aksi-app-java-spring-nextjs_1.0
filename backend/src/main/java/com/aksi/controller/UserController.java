package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.user.UsersApi;
import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.GetUserBranches200Response;
import com.aksi.api.user.dto.ListUsers200Response;
import com.aksi.api.user.dto.UpdateBranchesRequest;
import com.aksi.api.user.dto.UpdateRolesRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserRole;
import com.aksi.service.user.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for user management operations. Thin layer between OpenAPI and service with
 * logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController implements UsersApi {

  private final UserService userService;

  @Override
  public ResponseEntity<UserDetail> activateUser(UUID userId) {
    log.info("Activating user with ID: {}", userId);
    UserDetail userDetail = userService.activateUserAndReturnDetail(userId);
    log.info("User activated successfully: {}", userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<Void> changePassword(
      UUID userId, ChangePasswordRequest changePasswordRequest) {
    log.info("Changing password for user ID: {}", userId);
    userService.changePassword(userId, changePasswordRequest);
    log.info("Password changed successfully for user ID: {}", userId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<UserDetail> createUser(CreateUserRequest createUserRequest) {
    log.info("Creating new user with username: {}", createUserRequest.getUsername());
    UserDetail userDetail = userService.createUserAndReturnDetail(createUserRequest);
    log.info("User created successfully with username: {}", createUserRequest.getUsername());
    return ResponseEntity.status(201).body(userDetail);
  }

  @Override
  public ResponseEntity<UserDetail> deactivateUser(UUID userId) {
    log.info("Deactivating user with ID: {}", userId);
    UserDetail userDetail = userService.deactivateUserAndReturnDetail(userId);
    log.info("User deactivated successfully: {}", userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<GetUserBranches200Response> getUserBranches(UUID userId) {
    log.info("Getting branches for user ID: {}", userId);
    GetUserBranches200Response response = userService.getUserBranches(userId);
    log.info("Retrieved branches for user ID: {}", userId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<UserDetail> getUserById(UUID userId) {
    log.info("Getting user details for ID: {}", userId);
    UserDetail userDetail = userService.getUserDetailById(userId);
    log.info("Retrieved user details for ID: {}", userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<ListUsers200Response> listUsers(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      String search,
      UserRole role,
      UUID branchId,
      Boolean active) {

    log.info(
        "Listing users with filters - page: {}, size: {}, search: {}, role: {}, active: {}",
        page,
        size,
        search,
        role,
        active);

    ListUsers200Response response =
        userService.listUsers(page, size, sortBy, sortOrder, search, role, branchId, active);

    log.info("Listed users successfully");
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<GetUserBranches200Response> updateUserBranches(
      UUID userId, UpdateBranchesRequest updateBranchesRequest) {

    log.info("Updating branches for user ID: {}", userId);
    GetUserBranches200Response response =
        userService.updateUserBranches(userId, updateBranchesRequest);
    log.info("Updated branches for user ID: {}", userId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<UserDetail> updateUser(UUID userId, UpdateUserRequest updateUserRequest) {
    log.info("Updating user with ID: {}", userId);
    UserDetail userDetail = userService.updateUserAndReturnDetail(userId, updateUserRequest);
    log.info("User updated successfully: {}", userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<UserDetail> updateUserRoles(
      UUID userId, UpdateRolesRequest updateRolesRequest) {
    log.info("Updating roles for user ID: {}", userId);
    UserDetail userDetail = userService.updateUserRolesAndReturnDetail(userId, updateRolesRequest);
    log.info("Roles updated successfully for user ID: {}", userId);
    return ResponseEntity.ok(userDetail);
  }
}
