package com.aksi.domain.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.UserResponse;
import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;

/**
 * Mapper для Entity ↔ DTO конвертації в Auth домені. Використовує MapStruct для автоматичної
 * генерації. Містить тільки використовувані методи.
 */
@Mapper(componentModel = "spring")
public interface AuthMapper {

  /** UserEntity → UserResponse. Головний маппінг для публічної інформації користувача. */
  @Mapping(target = "id", source = "id")
  @Mapping(target = "roles", source = "roles", qualifiedByName = "domainRolesToApiRoles")
  UserResponse toUserResponse(UserEntity user);

  /** Створення AuthResponse з токенами та інформацією користувача. */
  @Mapping(
      target = "tokenType",
      expression = "java(com.aksi.api.auth.dto.AuthResponse.TokenTypeEnum.BEARER)")
  @Mapping(target = "user", source = "userEntity")
  AuthResponse toAuthResponse(
      String accessToken, String refreshToken, Long expiresIn, UserEntity userEntity);

  // UserRole mappings (Domain ↔ API)

  /** Domain UserRole → API UserRole. */
  default com.aksi.api.auth.dto.UserRole toApiUserRole(UserRole domainRole) {
    return domainRole != null
        ? com.aksi.api.auth.dto.UserRole.fromValue(domainRole.toApiValue())
        : null;
  }

  /** List<Domain UserRole> → List<API UserRole>. */
  @Named("domainRolesToApiRoles")
  default List<com.aksi.api.auth.dto.UserRole> domainRolesToApiRoles(List<UserRole> domainRoles) {
    return domainRoles != null ? domainRoles.stream().map(this::toApiUserRole).toList() : null;
  }
}
