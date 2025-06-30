package com.aksi.domain.client.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.client.dto.ClientContactsResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientSearchResult;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CommunicationMethod;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientContactsRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.shared.mapper.BaseMapperConfig;

/**
 * MapStruct mapper для конвертації між Entity та DTO Базується на реальних згенерованих OpenAPI
 * DTO.
 */
@Mapper(
    componentModel = "spring",
    uses = {BaseMapperConfig.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ClientMapper {

  // DTO → Entity mappings (для create/update)

  /**
   * Конвертація CreateClientRequest → ClientEntity BaseEntity поля автоматично ігноруються через
   * BaseMapperConfig.
   */
  @Mapping(target = "communicationMethods", source = "communicationMethods")
  ClientEntity toEntity(CreateClientRequest request);

  /** Оновлення існуючого ClientEntity з UpdateClientRequest. */
  @Mapping(target = "communicationMethods", source = "communicationMethods")
  void updateEntityFromRequest(UpdateClientRequest request, @MappingTarget ClientEntity entity);

  /** Оновлення контактної інформації ClientEntity з UpdateClientContactsRequest. */
  @Mapping(target = "communicationMethods", source = "communicationMethods")
  void updateContactsFromRequest(
      UpdateClientContactsRequest request, @MappingTarget ClientEntity entity);

  // Entity → DTO mappings (для response)

  /** Конвертація ClientEntity → ClientResponse. */
  @Mapping(target = "id", source = "uuid")
  @Mapping(target = "fullName", expression = "java(entity.getFullName())")
  @Mapping(target = "statistics", source = "entity")
  @Mapping(
      target = "createdAt",
      source = "createdAt",
      qualifiedByName = "localDateTimeToOffsetDateTime")
  @Mapping(
      target = "updatedAt",
      source = "updatedAt",
      qualifiedByName = "localDateTimeToOffsetDateTime")
  @Mapping(target = "communicationMethods", source = "communicationMethods")
  ClientResponse toResponse(ClientEntity entity);

  /** Конвертація ClientEntity → ClientContactsResponse. */
  @Mapping(target = "id", source = "uuid")
  @Mapping(target = "communicationMethods", source = "communicationMethods")
  ClientContactsResponse toContactsResponse(ClientEntity entity);

  /** Конвертація ClientEntity → ClientSearchResult. */
  @Mapping(target = "id", source = "uuid")
  @Mapping(target = "fullName", expression = "java(entity.getFullName())")
  @Mapping(target = "orderCount", source = "totalOrders")
  @Mapping(target = "highlightedFields", ignore = true)
  ClientSearchResult toSearchResult(ClientEntity entity);

  /** Конвертація ClientEntity → ClientStatistics. */
  @Mapping(
      target = "registrationDate",
      source = "createdAt",
      qualifiedByName = "localDateTimeToLocalDate")
  ClientStatistics toStatistics(ClientEntity entity);

  // List mappings

  /** Конвертація списку Entity → список Response. */
  List<ClientResponse> toResponseList(List<ClientEntity> entities);

  /** Конвертація списку Entity → список SearchResult. */
  List<ClientSearchResult> toSearchResultList(List<ClientEntity> entities);

  // Enum mappings між DTO та Domain

  /** CommunicationMethod DTO → CommunicationMethodType Entity. */
  default CommunicationMethodType toCommunicationMethodType(CommunicationMethod dto) {
    if (dto == null) return null;
    return CommunicationMethodType.valueOf(dto.getValue());
  }

  /** CommunicationMethodType Entity → CommunicationMethod DTO. */
  default CommunicationMethod toCommunicationMethod(CommunicationMethodType entity) {
    if (entity == null) return null;
    return CommunicationMethod.fromValue(entity.name());
  }

  /** List`CommunicationMethod` → Set`CommunicationMethodType`. */
  default Set<CommunicationMethodType> toCommunicationMethodTypeSet(
      List<CommunicationMethod> dtoList) {
    if (dtoList == null) return null;
    return dtoList.stream().map(this::toCommunicationMethodType).collect(Collectors.toSet());
  }

  /** Set`CommunicationMethodType` → List`CommunicationMethod`. */
  default List<CommunicationMethod> toCommunicationMethodList(
      Set<CommunicationMethodType> entitySet) {
    if (entitySet == null) return null;
    return entitySet.stream().map(this::toCommunicationMethod).collect(Collectors.toList());
  }
}
