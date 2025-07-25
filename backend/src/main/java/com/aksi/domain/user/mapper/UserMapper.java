package com.aksi.domain.user.mapper;

import java.util.List;
import java.util.UUID;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.user.dto.CreateUserRequest;
import com.aksi.api.user.dto.UpdateUserRequest;
import com.aksi.api.user.dto.UserResponse;
import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.entity.UserRole;

/** MapStruct mapper for converting between UserEntity and DTOs */
@Mapper(
    componentModel = "spring",
    imports = {UUID.class},
    unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserMapper {

  /** Convert UserEntity to UserResponse */
  @Mapping(target = "isActive", source = "active")
  @Mapping(target = "role", source = "role")
  UserResponse toResponse(UserEntity entity);

  /** Convert CreateUserRequest to UserEntity */
  @Mapping(target = "passwordHash", ignore = true)
  @Mapping(target = "active", constant = "true")
  @Mapping(target = "failedLoginAttempts", constant = "0")
  @Mapping(target = "lastLoginAt", ignore = true)
  @Mapping(target = "lockedUntil", ignore = true)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(source = "role", target = "role")
  UserEntity toEntity(CreateUserRequest request);

  /** Update UserEntity from UpdateUserRequest */
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "username", ignore = true)
  @Mapping(target = "passwordHash", ignore = true)
  @Mapping(target = "role", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "failedLoginAttempts", ignore = true)
  @Mapping(target = "lastLoginAt", ignore = true)
  @Mapping(target = "lockedUntil", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  void updateEntityFromRequest(@MappingTarget UserEntity entity, UpdateUserRequest request);

  /** Convert list of UserEntity to list of UserResponse */
  List<UserResponse> toResponseList(List<UserEntity> entities);

  /** Map API UserRole to entity UserRole - used in UserService */
  default UserRole mapApiRoleToEntityRole(com.aksi.api.user.dto.UserRole apiRole) {
    if (apiRole == null) {
      return null;
    }
    return UserRole.valueOf(apiRole.name());
  }
}
