package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.domain.game.ServiceTypeEntity;

/** MapStruct mapper for ServiceType domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface ServiceTypeMapper {

  // Entity to DTO mappings

  @Mapping(target = "gameId", source = "game.id")
  ServiceType toServiceTypeDto(ServiceTypeEntity entity);

  @Mapping(target = "gameId", source = "game.id")
  List<ServiceType> toServiceTypeDtoList(List<ServiceTypeEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "game", ignore = true)
  @Mapping(target = "priceConfigurations", ignore = true)
  @Mapping(target = "active", ignore = true)
  ServiceTypeEntity toServiceTypeEntity(CreateServiceTypeRequest dto);

  // Update entity from DTO (only non-null fields)
  @Mapping(target = "game", ignore = true)
  @Mapping(target = "priceConfigurations", ignore = true)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  void updateServiceTypeFromDto(
      UpdateServiceTypeRequest dto, @MappingTarget ServiceTypeEntity entity);
}
