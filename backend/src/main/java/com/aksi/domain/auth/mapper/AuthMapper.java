package com.aksi.domain.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.api.auth.dto.AuthResponse;
import com.aksi.api.auth.dto.LoginRequest;
import com.aksi.api.auth.dto.UserResponse;
import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;

/**
 * Mapper для Entity ↔ DTO конвертації в Auth домені Використовує MapStruct для автоматичної
 * генерації.
 */
@Mapper(componentModel = "spring")
public interface AuthMapper {

  // Entity → DTO mappings

  /**
   * {@code UserEntity} → {@code UserResponse} Головний маппінг для публічної інформації
   * користувача.
   */
  @Mapping(target = "id", source = "id")
  @Mapping(target = "roles", source = "roles", qualifiedByName = "domainRolesToApiRoles")
  // createdAt: Instant → Instant (автоматичний маппінг)
  UserResponse toUserResponse(UserEntity user);

  /** {@code List<UserEntity>} → {@code List<UserResponse>}. */
  List<UserResponse> toUserResponseList(List<UserEntity> users);

  // DTO → Entity mappings (простіші, без складних ignore)

  /**
   * Створення нового UserEntity тільки з username з LoginRequest Інші поля встановлюються в
   * Service.
   */
  default UserEntity createUserFromLoginRequest(LoginRequest request) {
    if (request == null) return null;

    return UserEntity.builder().username(request.getUsername()).build();
  }

  // AuthResponse builders (для композиції відповіді після аутентифікації)

  /** Створення AuthResponse з токенами та інформацією користувача. */
  @Mapping(
      target = "tokenType",
      expression = "java(com.aksi.api.auth.dto.AuthResponse.TokenTypeEnum.BEARER)")
  @Mapping(target = "user", source = "userEntity")
  AuthResponse toAuthResponse(
      String accessToken, String refreshToken, Long expiresIn, UserEntity userEntity);

  // З Instant типами datetime utility методи не потрібні

  // UserRole mappings (Domain ↔ API)

  /** Domain {@code UserRole} → API {@code UserRole}. */
  default com.aksi.api.auth.dto.UserRole toApiUserRole(UserRole domainRole) {
    return domainRole != null
        ? com.aksi.api.auth.dto.UserRole.fromValue(domainRole.toApiValue())
        : null;
  }

  /** API {@code UserRole} → Domain {@code UserRole}. */
  default UserRole fromApiUserRole(com.aksi.api.auth.dto.UserRole apiRole) {
    return apiRole != null ? UserRole.fromApiValue(apiRole.getValue()) : null;
  }

  /** {@code List<Domain UserRole>} → {@code List<API UserRole>}. */
  @Named("domainRolesToApiRoles")
  default List<com.aksi.api.auth.dto.UserRole> domainRolesToApiRoles(List<UserRole> domainRoles) {
    return domainRoles != null ? domainRoles.stream().map(this::toApiUserRole).toList() : null;
  }

  /** {@code List<API UserRole>} → {@code List<Domain UserRole>}. */
  @Named("apiRolesToDomainRoles")
  default List<UserRole> apiRolesToDomainRoles(List<com.aksi.api.auth.dto.UserRole> apiRoles) {
    return apiRoles != null ? apiRoles.stream().map(this::fromApiUserRole).toList() : null;
  }
}
