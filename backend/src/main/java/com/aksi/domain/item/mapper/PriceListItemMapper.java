package com.aksi.domain.item.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.item.dto.PriceListItem;
import com.aksi.api.item.dto.PriceListItemListResponse;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.domain.item.entity.PriceListItemEntity;

/** Mapper for PriceListItem entities and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PriceListItemMapper {

  // Map entity to DTO for list responses
  @Mapping(target = "categoryCode", source = "category.code")
  @Mapping(target = "basePrice", source = "priceDetails.basePrice")
  @Mapping(target = "blackPrice", source = "priceDetails.priceBlack")
  @Mapping(target = "colorPrice", source = "priceDetails.priceColor")
  @Mapping(target = "active", source = "active")
  @Mapping(target = "unitOfMeasure", source = "unitOfMeasure")
  @Mapping(target = "description", ignore = true)
  @Mapping(target = "displayOrder", ignore = true)
  PriceListItem toDto(PriceListItemEntity entity);

  List<PriceListItem> toDtoList(List<PriceListItemEntity> entities);

  // Create list response from entities with pagination support
  default PriceListItemListResponse toListResponse(List<PriceListItemEntity> entities, long total) {
    List<PriceListItem> items = toDtoList(entities);
    PriceListItemListResponse response = new PriceListItemListResponse();
    response.setItems(items);
    response.setTotal((int) total);
    return response;
  }

  // Create single item response
  default PriceListItemResponse toItemResponse(PriceListItemEntity entity) {
    PriceListItemResponse response = new PriceListItemResponse();
    response.setItem(toDto(entity));
    return response;
  }
}
