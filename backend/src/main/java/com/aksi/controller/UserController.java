package com.aksi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.user.UsersApi;
import com.aksi.api.user.dto.ChangePasswordRequest;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.SortOrder;
import com.aksi.api.user.dto.UpdateBranchesRequest;
import com.aksi.api.user.dto.UpdateRolesRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserBranchesResponse;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.service.user.UserService;

import lombok.RequiredArgsConstructor;

/** REST controller for user management operations. Thin layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class UserController implements UsersApi {

  private final UserService userService;

  @Override
  public ResponseEntity<UserDetail> activateUser(UUID userId) {
    UserDetail userDetail = userService.activateUser(userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<Void> changePassword(
      UUID userId, ChangePasswordRequest changePasswordRequest) {
    userService.changePassword(userId, changePasswordRequest);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<UserDetail> createUser(CreateUserRequest createUserRequest) {
    UserDetail userDetail = userService.createUser(createUserRequest);
    return ResponseEntity.status(201).body(userDetail);
  }

  @Override
  public ResponseEntity<UserDetail> deactivateUser(UUID userId) {
    UserDetail userDetail = userService.deactivateUser(userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<UserBranchesResponse> getUserBranches(UUID userId) {
    UserBranchesResponse response = userService.getUserBranches(userId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<UserDetail> getUserById(UUID userId) {
    UserDetail userDetail = userService.getUserById(userId);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<UserListResponse> listUsers(
      Integer page,
      Integer size,
      String sortBy,
      SortOrder sortOrder,
      @Nullable String search,
      @Nullable UserRole role,
      @Nullable UUID branchId,
      @Nullable Boolean active) {

    UserListResponse response =
        userService.listUsers(
            page, size, sortBy, sortOrder.getValue(), search, role, branchId, active);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<UserBranchesResponse> updateUserBranches(
      UUID userId, UpdateBranchesRequest updateBranchesRequest) {
    UserBranchesResponse response = userService.updateUserBranches(userId, updateBranchesRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<UserDetail> updateUser(UUID userId, UpdateUserRequest updateUserRequest) {
    UserDetail userDetail = userService.updateUser(userId, updateUserRequest);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<UserDetail> updateUserRoles(
      UUID userId, UpdateRolesRequest updateRolesRequest) {
    UserDetail userDetail = userService.updateUserRoles(userId, updateRolesRequest);
    return ResponseEntity.ok(userDetail);
  }

  @Override
  public ResponseEntity<List<String>> getUserPermissions(UUID userId) {
    List<String> permissions = userService.getUserPermissions(userId);
    return ResponseEntity.ok(permissions);
  }

  @Override
  public ResponseEntity<List<String>> getRolePermissions(UserRole role) {
    List<String> permissions = userService.getRolePermissions(role);
    return ResponseEntity.ok(permissions);
  }
}
