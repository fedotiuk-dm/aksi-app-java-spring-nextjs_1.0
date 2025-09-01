package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.domain.game.PriceConfigurationEntity;

/** MapStruct mapper for PriceConfiguration domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface PriceConfigurationMapper {

  // Entity to DTO mappings

  @Mapping(target = "gameId", source = "game.id")
  @Mapping(target = "difficultyLevelId", source = "difficultyLevel.id")
  @Mapping(target = "serviceTypeId", source = "serviceType.id")
  PriceConfiguration toPriceConfigurationDto(PriceConfigurationEntity entity);

  @Mapping(target = "gameId", source = "game.id")
  @Mapping(target = "difficultyLevelId", source = "difficultyLevel.id")
  @Mapping(target = "serviceTypeId", source = "serviceType.id")
  List<PriceConfiguration> toPriceConfigurationDtoList(List<PriceConfigurationEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "game", ignore = true)
  @Mapping(target = "difficultyLevel", ignore = true)
  @Mapping(target = "serviceType", ignore = true)
  @Mapping(target = "active", ignore = true)
  PriceConfigurationEntity toPriceConfigurationEntity(CreatePriceConfigurationRequest dto);
}
