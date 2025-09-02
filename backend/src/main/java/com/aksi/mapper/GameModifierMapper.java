package com.aksi.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.GameModifier;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.domain.game.GameModifierEntity;

/** MapStruct mapper for GameModifier domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface GameModifierMapper {

  // Entity to DTO mappings

  GameModifier toGameModifierDto(GameModifierEntity entity);

  GameModifierInfo toGameModifierInfoDto(GameModifierEntity entity);

  List<GameModifier> toGameModifierDtoList(List<GameModifierEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "sortOrder", constant = "0")
  @Mapping(target = "active", constant = "true")
  @Mapping(target = "priority", constant = "0")
  @Mapping(target = "maxUses", ignore = true)
  @Mapping(target = "effectiveDate", ignore = true)
  @Mapping(target = "expirationDate", ignore = true)
  @Mapping(target = "conditions", ignore = true)
  GameModifierEntity toGameModifierEntity(CreateGameModifierRequest dto);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "code", ignore = true)
  @Mapping(target = "gameCode", ignore = true)
  @Mapping(target = "priority", ignore = true)
  @Mapping(target = "maxUses", ignore = true)
  @Mapping(target = "effectiveDate", ignore = true)
  @Mapping(target = "expirationDate", ignore = true)
  @Mapping(target = "conditions", ignore = true)
  void updateGameModifierFromDto(UpdateGameModifierRequest dto, @MappingTarget GameModifierEntity entity);
}
