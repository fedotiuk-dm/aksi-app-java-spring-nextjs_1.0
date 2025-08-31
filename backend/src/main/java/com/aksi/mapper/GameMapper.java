package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.UpdateGameRequest;
import com.aksi.domain.game.GameEntity;

/** MapStruct mapper for Game domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface GameMapper {

  // Entity to DTO mappings

  Game toGameDto(GameEntity entity);

  List<Game> toGameDtoList(List<GameEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "difficultyLevels", ignore = true)
  @Mapping(target = "priceConfigurations", ignore = true)
  @Mapping(target = "boosterSpecializations", ignore = true)
  @Mapping(target = "active", ignore = true)
  GameEntity toGameEntity(CreateGameRequest dto);

  @Mapping(target = "difficultyLevels", ignore = true)
  @Mapping(target = "priceConfigurations", ignore = true)
  @Mapping(target = "boosterSpecializations", ignore = true)
  void updateGameFromDto(UpdateGameRequest dto, @MappingTarget GameEntity entity);

  List<GameEntity> toGameEntityList(List<CreateGameRequest> dtos);
}
