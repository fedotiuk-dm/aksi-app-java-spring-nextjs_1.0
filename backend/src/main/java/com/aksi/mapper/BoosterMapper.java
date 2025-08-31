package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.domain.game.BoosterEntity;

/** MapStruct mapper for Booster domain */
@Mapper(componentModel = "spring", config = BaseMapperConfig.class)
public interface BoosterMapper {

  // Entity to DTO mappings

  Booster toBoosterDto(BoosterEntity entity);

  List<Booster> toBoosterDtoList(List<BoosterEntity> entities);

  // DTO to Entity mappings

  @Mapping(target = "gameSpecializations", ignore = true)
  @Mapping(target = "rating", ignore = true)
  @Mapping(target = "completedOrders", ignore = true)
  @Mapping(target = "active", ignore = true)
  BoosterEntity toBoosterEntity(CreateBoosterRequest dto);

  @Mapping(target = "gameSpecializations", ignore = true)
  BoosterEntity toBoosterEntity(UpdateBoosterRequest dto);

  @Mapping(target = "gameSpecializations", ignore = true)
  BoosterEntity toBoosterEntity(Booster dto);

  @Mapping(target = "gameSpecializations", ignore = true)
  void updateBoosterFromDto(UpdateBoosterRequest dto, @MappingTarget BoosterEntity entity);

  @Mapping(target = "gameSpecializations", ignore = true)
  void updateBoosterFromDto(Booster dto, @MappingTarget BoosterEntity entity);

  List<BoosterEntity> toBoosterEntityList(List<CreateBoosterRequest> dtos);
}
