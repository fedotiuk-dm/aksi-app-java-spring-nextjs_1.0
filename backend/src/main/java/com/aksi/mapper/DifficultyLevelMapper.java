package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.game.dto.CreateDifficultyLevelRequest;
import com.aksi.api.game.dto.DifficultyLevel;
import com.aksi.api.game.dto.UpdateDifficultyLevelRequest;
import com.aksi.domain.game.DifficultyLevelEntity;

/** MapStruct mapper for DifficultyLevel domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface DifficultyLevelMapper {

  // Entity to DTO mappings

  @Mapping(target = "gameId", source = "game.id")
  DifficultyLevel toDifficultyLevelDto(DifficultyLevelEntity entity);

  @Mapping(target = "gameId", source = "game.id")
  List<DifficultyLevel> toDifficultyLevelDtoList(List<DifficultyLevelEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "game", ignore = true)
  @Mapping(target = "priceConfigurations", ignore = true)
  @Mapping(target = "active", ignore = true)
  DifficultyLevelEntity toDifficultyLevelEntity(CreateDifficultyLevelRequest dto);

  @Mapping(target = "game", ignore = true)
  @Mapping(target = "priceConfigurations", ignore = true)
  void updateDifficultyLevelFromDto(
      UpdateDifficultyLevelRequest dto, @MappingTarget DifficultyLevelEntity entity);
}
