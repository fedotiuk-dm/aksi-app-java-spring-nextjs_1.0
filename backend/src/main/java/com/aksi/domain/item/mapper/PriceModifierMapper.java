package com.aksi.domain.item.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.ModifierType;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.domain.item.entity.PriceModifierEntity;

/** Mapper for PriceModifier entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PriceModifierMapper {

  @Mapping(target = "type", source = "type", qualifiedByName = "mapEntityModifierTypeToApiType")
  @Mapping(target = "isActive", source = "active")
  @Mapping(
      target = "applicableTo",
      source = "applicableCategories",
      qualifiedByName = "mapCategorySetToUuidList")
  PriceModifierResponse toResponse(PriceModifierEntity entity);

  List<PriceModifierResponse> toResponseList(List<PriceModifierEntity> entities);

  /** Map from domain modifier type enum to API enum */
  @Named("mapEntityModifierTypeToApiType")
  default ModifierType mapEntityModifierTypeToApiType(String type) {
    if (type == null) {
      return null;
    }
    try {
      return ModifierType.valueOf(type);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  /**
   * Map category set to UUID list (placeholder - in real implementation would map to category IDs)
   * For now, returns the category codes as strings
   */
  @Named("mapCategorySetToUuidList")
  default List<String> mapCategorySetToUuidList(Set<String> categories) {
    if (categories == null || categories.isEmpty()) {
      return List.of();
    }
    // In a real implementation, this would map to actual category entity IDs
    // For now, returning the category codes as strings
    return categories.stream().collect(Collectors.toList());
  }
}
