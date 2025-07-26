package com.aksi.domain.client.mapper;

import java.util.List;
import java.util.UUID;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientSearchResult;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;

/** MapStruct mapper for converting between Client entities and DTOs */
@Mapper(
    componentModel = "spring",
    imports = {UUID.class},
    unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ClientMapper {

  @Mapping(target = "isVip", expression = "java(entity.isVip())")
  ClientResponse toResponse(ClientEntity entity);

  @Mapping(target = "orderCount", constant = "0")
  @Mapping(target = "totalSpent", constant = "0")
  @Mapping(target = "lastOrderDate", ignore = true)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  ClientEntity toEntity(CreateClientRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "orderCount", ignore = true)
  @Mapping(target = "totalSpent", ignore = true)
  @Mapping(target = "lastOrderDate", ignore = true)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  void updateEntityFromRequest(@MappingTarget ClientEntity entity, UpdateClientRequest request);

  List<ClientResponse> toResponseList(List<ClientEntity> entities);

  @Mapping(target = "highlightedText", ignore = true)
  ClientSearchResult toSearchResult(ClientEntity entity);

  List<ClientSearchResult> toSearchResultList(List<ClientEntity> entities);
}
