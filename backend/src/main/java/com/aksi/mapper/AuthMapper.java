package com.aksi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.auth.dto.LoginResponse;
import com.aksi.api.auth.dto.SessionInfo;
import com.aksi.domain.user.UserEntity;

/** MapStruct mapper for Auth DTOs. */
@Mapper(componentModel = "spring")
public interface AuthMapper {

  @Mapping(target = "userId", source = "id")
  @Mapping(target = "permissions", ignore = true)
  @Mapping(target = "branchId", ignore = true)
  @Mapping(target = "branchName", ignore = true)
  @Mapping(target = "requiresBranchSelection", constant = "false")
  @Mapping(target = "isBlocked", constant = "false")
  @Mapping(target = "attemptsRemaining", ignore = true)
  @Mapping(target = "lockoutExpiresAt", ignore = true)
  LoginResponse toLoginResponse(UserEntity userEntity);

  @Mapping(target = "userId", source = "userEntity.id")
  @Mapping(target = "username", source = "userEntity.username")
  @Mapping(target = "branchId", ignore = true)
  @Mapping(target = "branchName", ignore = true)
  @Mapping(target = "ipAddress", ignore = true)
  @Mapping(target = "userAgent", ignore = true)
  SessionInfo toSessionInfo(
      UserEntity userEntity,
      String sessionId,
      java.time.Instant createdAt,
      java.time.Instant lastAccessedAt,
      java.time.Instant expiresAt);
}
