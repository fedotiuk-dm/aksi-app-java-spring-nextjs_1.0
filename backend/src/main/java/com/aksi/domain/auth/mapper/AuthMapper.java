package com.aksi.domain.auth.mapper;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

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

  /** UserEntity → UserResponse Головний маппінг для публічної інформації користувача. */
  @Mapping(target = "id", source = "id", qualifiedByName = "longToUuid")
  @Mapping(
      target = "createdAt",
      source = "createdAt",
      qualifiedByName = "localDateTimeToOffsetDateTime")
  @Mapping(target = "roles", source = "roles", qualifiedByName = "domainRolesToApiRoles")
  UserResponse toUserResponse(UserEntity user);

  /** List<UserEntity> → List<UserResponse>. */
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

  // Utility mappings

  /** Long (Entity) → UUID (DTO) Аналог з ClientMapper. */
  @Named("longToUuid")
  default UUID longToUuid(Long id) {
    return id != null ? UUID.nameUUIDFromBytes(id.toString().getBytes()) : null;
  }

  /** UUID (DTO) → Long (Entity) Зворотна конвертація. */
  @Named("uuidToLong")
  default Long uuidToLong(UUID uuid) {
    return uuid != null ? (long) Math.abs(uuid.hashCode()) : null;
  }

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) Аналог з ClientMapper. */
  @Named("localDateTimeToOffsetDateTime")
  default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity). */
  @Named("offsetDateTimeToLocalDateTime")
  default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }

  // UserRole mappings (Domain ↔ API)

  /** Domain UserRole → API UserRole. */
  default com.aksi.api.auth.dto.UserRole toApiUserRole(UserRole domainRole) {
    return domainRole != null
        ? com.aksi.api.auth.dto.UserRole.fromValue(domainRole.toApiValue())
        : null;
  }

  /** API UserRole → Domain UserRole. */
  default UserRole fromApiUserRole(com.aksi.api.auth.dto.UserRole apiRole) {
    return apiRole != null ? UserRole.fromApiValue(apiRole.getValue()) : null;
  }

  /** List<Domain UserRole> → List<API UserRole>. */
  @Named("domainRolesToApiRoles")
  default List<com.aksi.api.auth.dto.UserRole> domainRolesToApiRoles(List<UserRole> domainRoles) {
    return domainRoles != null ? domainRoles.stream().map(this::toApiUserRole).toList() : null;
  }

  /** List<API UserRole> → List<Domain UserRole>. */
  @Named("apiRolesToDomainRoles")
  default List<UserRole> apiRolesToDomainRoles(List<com.aksi.api.auth.dto.UserRole> apiRoles) {
    return apiRoles != null ? apiRoles.stream().map(this::fromApiUserRole).toList() : null;
  }
}
