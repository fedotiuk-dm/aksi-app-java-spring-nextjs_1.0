package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.ServiceCategory;
import com.aksi.api.item.dto.UnitType;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.enums.UnitOfMeasure;

/** Mapper for PriceListItem entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PriceListItemMapper {

  @Mapping(
      target = "categoryCode",
      source = "category.code",
      qualifiedByName = "mapEntityCategoryToApiCategory")
  @Mapping(target = "basePrice", source = "priceDetails.basePrice")
  @Mapping(target = "priceBlack", source = "priceDetails.priceBlack")
  @Mapping(target = "priceColor", source = "priceDetails.priceColor")
  @Mapping(target = "isActive", source = "active")
  @Mapping(
      target = "unitOfMeasure",
      source = "unitOfMeasure",
      qualifiedByName = "mapEntityUnitToApiUnit")
  PriceListItemResponse toResponse(PriceListItemEntity entity);

  List<PriceListItemResponse> toResponseList(List<PriceListItemEntity> entities);

  /** Map from String category code to API enum */
  @Named("mapEntityCategoryToApiCategory")
  default ServiceCategory mapEntityCategoryToApiCategory(String code) {
    if (code == null) {
      return null;
    }
    try {
      return ServiceCategory.valueOf(code);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  /** Map from domain unit enum to API enum */
  @Named("mapEntityUnitToApiUnit")
  default UnitType mapEntityUnitToApiUnit(UnitOfMeasure entityEnum) {
    if (entityEnum == null) {
      return null;
    }
    return UnitType.valueOf(entityEnum.name());
  }
}
