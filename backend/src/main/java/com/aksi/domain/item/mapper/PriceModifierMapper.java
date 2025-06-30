package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.item.dto.CreatePriceModifierRequest;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.api.item.dto.UpdatePriceModifierRequest;
import com.aksi.domain.item.entity.PriceModifierEntity;

/** MapStruct mapper для PriceModifier - Entity ↔ DTO конвертація */
@Mapper(componentModel = "spring")
public interface PriceModifierMapper {

  // DTO → Entity (для create)
  @Mapping(target = "uuid", ignore = true)
  @Mapping(target = "jexlFormula", ignore = true)
  @Mapping(target = "jexlCondition", ignore = true)
  @Mapping(source = "type", target = "modifierType")
  PriceModifierEntity toEntity(CreatePriceModifierRequest request);

  // Entity → DTO (для response)
  @Mapping(source = "uuid", target = "id")
  @Mapping(source = "modifierType", target = "type")
  PriceModifierResponse toResponse(PriceModifierEntity entity);

  // List mappings
  List<PriceModifierResponse> toResponseList(List<PriceModifierEntity> entities);

  // Update entity з DTO
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "uuid", ignore = true)
  @Mapping(target = "code", ignore = true) // Код не змінюється при оновленні
  @Mapping(target = "modifierType", ignore = true) // Тип не змінюється при оновленні
  @Mapping(target = "jexlFormula", ignore = true) // JEXL поля керуються окремо
  @Mapping(target = "jexlCondition", ignore = true) // JEXL поля керуються окремо
  void updateEntityFromRequest(
      UpdatePriceModifierRequest request, @org.mapstruct.MappingTarget PriceModifierEntity entity);

  // DateTime конвертація
  default java.time.OffsetDateTime map(java.time.LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(java.time.ZoneOffset.UTC) : null;
  }

  default java.time.LocalDateTime map(java.time.OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }
}
