package com.aksi.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.aksi.api.service.dto.CreatePriceListItemRequest;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.UpdatePriceListItemRequest;
import com.aksi.domain.catalog.PriceListItemEntity;

/** MapStruct mapper for Price List Item DTOs. */
@Mapper(componentModel = "spring")
public interface PriceListItemMapper {

  // MapStruct handles enum and simple type mapping automatically
  PriceListItemInfo toPriceListItemInfo(PriceListItemEntity priceListItemEntity);

  List<PriceListItemInfo> toPriceListItemInfoList(List<PriceListItemEntity> priceListItemEntities);

  // Create mapping - defaults will come from OpenAPI schema
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  PriceListItemEntity toEntity(CreatePriceListItemRequest request);

  // Update mapping - only non-null values
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "categoryCode", ignore = true) // Cannot change category
  @Mapping(target = "catalogNumber", ignore = true) // Cannot change catalog number
  @Mapping(target = "unitOfMeasure", ignore = true) // Cannot change unit of measure
  void updateEntityFromRequest(
      UpdatePriceListItemRequest request, @MappingTarget PriceListItemEntity entity);
}
