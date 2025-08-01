package com.aksi.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.api.auth.dto.UserRole;
import com.aksi.domain.user.Role;
import com.aksi.domain.user.User;

/** MapStruct mapper for Auth DTOs. */
@Mapper(componentModel = "spring")
public interface AuthMapper {

  @Mapping(target = "userId", source = "id")
  @Mapping(target = "username", source = "username")
  @Mapping(target = "firstName", source = "firstName")
  @Mapping(target = "lastName", source = "lastName")
  @Mapping(target = "roles", expression = "java(mapRoles(user.getRoles()))")
  @Mapping(target = "permissions", ignore = true)
  @Mapping(target = "branchId", ignore = true)
  @Mapping(target = "branchName", ignore = true)
  @Mapping(target = "requiresBranchSelection", constant = "false")
  LoginResponse toLoginResponse(User user);

  @Mapping(target = "userId", source = "user.id")
  @Mapping(target = "username", source = "user.username")
  @Mapping(target = "roles", expression = "java(mapRoles(user.getRoles()))")
  @Mapping(target = "sessionId", source = "sessionId")
  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "lastAccessedAt", source = "lastAccessedAt")
  @Mapping(target = "expiresAt", source = "expiresAt")
  @Mapping(target = "branchId", ignore = true)
  @Mapping(target = "branchName", ignore = true)
  @Mapping(target = "ipAddress", ignore = true)
  @Mapping(target = "userAgent", ignore = true)
  SessionInfo toSessionInfo(
      User user,
      String sessionId,
      java.time.Instant createdAt,
      java.time.Instant lastAccessedAt,
      java.time.Instant expiresAt);

  default List<UserRole> mapRoles(Set<Role> roles) {
    return roles.stream().map(this::mapRole).collect(Collectors.toList());
  }

  default UserRole mapRole(Role role) {
    return UserRole.valueOf(role.name());
  }
}
