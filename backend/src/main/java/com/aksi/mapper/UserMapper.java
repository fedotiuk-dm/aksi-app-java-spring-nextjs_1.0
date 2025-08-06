package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.user.dto.BranchAssignment;
import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserDetail;
import com.aksi.api.user.dto.UserSummary;
import com.aksi.domain.user.UserBranchAssignmentEntity;
import com.aksi.domain.user.UserEntity;

/** MapStruct mapper for User DTOs. */
@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "lastLoginAt", ignore = true)
  UserSummary toUserSummary(UserEntity userEntityEntity);

  @Mapping(target = "branches", source = "branchAssignments")
  @Mapping(target = "lastLoginAt", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  @Mapping(target = "updatedBy", ignore = true)
  UserDetail toUserDetail(UserEntity userEntityEntity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "passwordHash", ignore = true)
  @Mapping(target = "active", constant = "true")
  @Mapping(target = "emailVerified", constant = "false")
  @Mapping(target = "failedLoginAttempts", constant = "0")
  @Mapping(target = "branchAssignments", ignore = true)
  @Mapping(target = "version", ignore = true)
  UserEntity toUser(CreateUserRequest request);

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
  void updateUserFromDto(UpdateUserRequest request, @MappingTarget UserEntity userEntityEntity);

  List<UserSummary> toUserSummaryList(List<UserEntity> userEntities);

  @Mapping(target = "branchName", ignore = true) // Frontend will resolve by ID
  @Mapping(target = "isPrimary", source = "primary")
  BranchAssignment toBranchAssignment(UserBranchAssignmentEntity assignment);
}
