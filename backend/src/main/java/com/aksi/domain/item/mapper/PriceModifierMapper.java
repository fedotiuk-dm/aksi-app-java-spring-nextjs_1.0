package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.ModifierType;
import com.aksi.api.item.dto.PriceModifier;
import com.aksi.api.item.dto.PriceModifierListResponse;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.domain.item.entity.PriceModifierEntity;

/** Mapper for PriceModifier entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PriceModifierMapper {

  @Mapping(target = "type", source = "type", qualifiedByName = "mapModifierTypeToApiType")
  @Mapping(target = "isActive", source = "active")
  @Mapping(target = "applicableTo", source = "applicableCategories")
  PriceModifierResponse toResponse(PriceModifierEntity entity);

  List<PriceModifierResponse> toResponseList(List<PriceModifierEntity> entities);

  @Mapping(target = "type", source = "type", qualifiedByName = "mapModifierTypeToApiType")
  @Mapping(target = "applicableCategories", source = "applicableCategories")
  @Mapping(target = "active", source = "active")
  PriceModifier toDto(PriceModifierEntity entity);

  List<PriceModifier> toDtoList(List<PriceModifierEntity> entities);

  /** Map from domain modifier type enum to API enum */
  @Named("mapModifierTypeToApiType")
  default ModifierType mapModifierTypeToApiType(com.aksi.domain.item.enums.ModifierType type) {
    if (type == null) {
      return null;
    }
    try {
      return ModifierType.valueOf(type.name());
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  // Create list response from entities
  default PriceModifierListResponse toListResponse(List<PriceModifierEntity> entities) {
    List<PriceModifier> modifiers = toDtoList(entities);
    PriceModifierListResponse response = new PriceModifierListResponse();
    response.setModifiers(modifiers);
    response.setTotal(modifiers.size());
    return response;
  }
}
