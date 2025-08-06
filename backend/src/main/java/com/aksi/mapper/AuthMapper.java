package com.aksi.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.api.user.dto.UserRole;
import com.aksi.domain.user.UserEntity;

/** MapStruct mapper for Auth DTOs. */
@Mapper(componentModel = "spring")
public interface AuthMapper {

  @Mapping(target = "userId", source = "id")
  @Mapping(target = "username", source = "username")
  @Mapping(target = "firstName", source = "firstName")
  @Mapping(target = "lastName", source = "lastName")
  @Mapping(target = "roles", expression = "java(mapRoles(userEntityEntity.getRoles()))")
  @Mapping(target = "permissions", ignore = true)
  @Mapping(target = "branchId", ignore = true)
  @Mapping(target = "branchName", ignore = true)
  @Mapping(target = "requiresBranchSelection", constant = "false")
  LoginResponse toLoginResponse(UserEntity userEntityEntity);

  @Mapping(target = "userId", source = "userEntityEntity.id")
  @Mapping(target = "username", source = "userEntityEntity.username")
  @Mapping(target = "roles", expression = "java(mapRoles(userEntityEntity.getRoles()))")
  @Mapping(target = "sessionId", source = "sessionId")
  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "lastAccessedAt", source = "lastAccessedAt")
  @Mapping(target = "expiresAt", source = "expiresAt")
  @Mapping(target = "branchId", ignore = true)
  @Mapping(target = "branchName", ignore = true)
  @Mapping(target = "ipAddress", ignore = true)
  @Mapping(target = "userAgent", ignore = true)
  SessionInfo toSessionInfo(
      UserEntity userEntityEntity,
      String sessionId,
      java.time.Instant createdAt,
      java.time.Instant lastAccessedAt,
      java.time.Instant expiresAt);

  default List<String> mapRoles(Set<UserRole> roles) {
    return roles.stream().map(this::mapRole).collect(Collectors.toList());
  }

  default String mapRole(UserRole role) {
    return role.name();
  }
}
