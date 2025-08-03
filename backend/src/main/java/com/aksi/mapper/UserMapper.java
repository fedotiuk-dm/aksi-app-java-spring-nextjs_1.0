package com.aksi.mapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;

import com.aksi.api.user.dto.BranchAssignment;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserListResponse;
import com.aksi.api.user.dto.UserRole;
import com.aksi.api.user.dto.UserSummary;
import com.aksi.domain.user.User;
import com.aksi.domain.user.UserBranchAssignment;

/** MapStruct mapper for User DTOs. */
@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "roles", expression = "java(mapRoles(user.getRoles()))")
  @Mapping(target = "primaryBranchId", expression = "java(getPrimaryBranchId(user))")
  @Mapping(target = "primaryBranchName", expression = "java(getPrimaryBranchName(user))")
  @Mapping(target = "lastLoginAt", ignore = true)
  UserSummary toUserSummary(User user);

  @Mapping(target = "roles", expression = "java(mapRoles(user.getRoles()))")
  @Mapping(target = "primaryBranchId", expression = "java(getPrimaryBranchId(user))")
  @Mapping(target = "primaryBranchName", expression = "java(getPrimaryBranchName(user))")
  @Mapping(target = "permissions", expression = "java(calculatePermissions(user.getRoles()))")
  @Mapping(
      target = "branches",
      expression = "java(mapBranchAssignments(user.getBranchAssignments()))")
  @Mapping(target = "lastLoginAt", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  @Mapping(target = "updatedBy", ignore = true)
  UserDetail toUserDetail(User user);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "passwordHash", ignore = true)
  @Mapping(target = "active", constant = "true")
  @Mapping(target = "emailVerified", constant = "false")
  @Mapping(target = "failedLoginAttempts", constant = "0")
  @Mapping(target = "roles", expression = "java(mapRolesFromDto(request.getRoles()))")
  @Mapping(target = "branchAssignments", ignore = true)
  @Mapping(target = "version", ignore = true)
  User toUser(CreateUserRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "username", ignore = true)
  @Mapping(target = "passwordHash", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "emailVerified", ignore = true)
  @Mapping(target = "failedLoginAttempts", ignore = true)
  @Mapping(target = "roles", ignore = true)
  @Mapping(target = "branchAssignments", ignore = true)
  @Mapping(target = "version", ignore = true)
  void updateUserFromDto(UpdateUserRequest request, @MappingTarget User user);

  List<UserSummary> toUserSummaryList(List<User> users);

  default UserListResponse toUserListResponse(Page<User> userPage) {
    UserListResponse response = new UserListResponse();
    response.setData(toUserSummaryList(userPage.getContent()));
    response.setNumber(userPage.getNumber());
    response.setSize(userPage.getSize());
    response.setTotalElements(userPage.getTotalElements());
    response.setTotalPages(userPage.getTotalPages());
    response.setNumberOfElements(userPage.getNumberOfElements());
    response.setFirst(userPage.isFirst());
    response.setLast(userPage.isLast());
    response.setEmpty(userPage.isEmpty());
    return response;
  }

  // Branch assignment mapping
  @Mapping(target = "branchId", source = "branchId")
  @Mapping(target = "branchName", expression = "java(getBranchNameById(assignment.getBranchId()))")
  @Mapping(target = "isPrimary", source = "primary")
  BranchAssignment toBranchAssignment(UserBranchAssignment assignment);

  // Helper methods
  default List<UserRole> mapRoles(Set<UserRole> roles) {
    return new ArrayList<>(roles);
  }

  default Set<UserRole> mapRolesFromDto(List<UserRole> roles) {
    return new HashSet<>(roles);
  }

  default List<BranchAssignment> mapBranchAssignments(Set<UserBranchAssignment> assignments) {
    return assignments.stream().map(this::toBranchAssignment).collect(Collectors.toList());
  }

  default UUID getPrimaryBranchId(User user) {
    return user.getBranchAssignments().stream()
        .filter(UserBranchAssignment::isPrimary)
        .findFirst()
        .map(UserBranchAssignment::getBranchId)
        .orElse(null);
  }

  default String getPrimaryBranchName(User user) {
    return user.getBranchAssignments().stream()
        .filter(UserBranchAssignment::isPrimary)
        .findFirst()
        .map(assignment -> getBranchNameById(assignment.getBranchId()))
        .orElse(null);
  }

  default String getBranchNameById(UUID branchId) {
    // TODO: Implement branch name lookup by ID
    // This requires Branch service or repository injection
    return "Branch " + branchId;
  }

  default List<String> calculatePermissions(Set<UserRole> roles) {
    // Simple permission calculation based on roles
    // In real implementation, this would be more sophisticated
    return roles.stream()
        .flatMap(role -> getPermissionsForRole(role).stream())
        .distinct()
        .collect(Collectors.toList());
  }

  default List<String> getPermissionsForRole(UserRole role) {
    return switch (role) {
      case ADMIN ->
          List.of(
              "CREATE_USER",
              "UPDATE_USER",
              "DELETE_USER",
              "VIEW_USERS",
              "CREATE_ORDER",
              "UPDATE_ORDER",
              "DELETE_ORDER",
              "VIEW_ORDERS",
              "CREATE_CUSTOMER",
              "UPDATE_CUSTOMER",
              "DELETE_CUSTOMER",
              "VIEW_CUSTOMERS",
              "MANAGE_BRANCHES",
              "VIEW_REPORTS");
      case MANAGER ->
          List.of(
              "CREATE_ORDER",
              "UPDATE_ORDER",
              "VIEW_ORDERS",
              "CREATE_CUSTOMER",
              "UPDATE_CUSTOMER",
              "VIEW_CUSTOMERS",
              "VIEW_REPORTS");
      case OPERATOR ->
          List.of(
              "CREATE_ORDER",
              "UPDATE_ORDER",
              "VIEW_ORDERS",
              "CREATE_CUSTOMER",
              "UPDATE_CUSTOMER",
              "VIEW_CUSTOMERS");
      case CLEANER -> List.of("VIEW_ORDERS", "UPDATE_ORDER_STATUS");
      case DRIVER -> List.of("VIEW_ORDERS", "UPDATE_DELIVERY_STATUS");
      case ACCOUNTANT -> List.of("VIEW_ORDERS", "VIEW_CUSTOMERS", "VIEW_REPORTS", "MANAGE_BILLING");
    };
  }
}
