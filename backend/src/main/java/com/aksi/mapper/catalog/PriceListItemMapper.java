package com.aksi.mapper.catalog;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UnitOfMeasure;
import com.aksi.domain.catalog.PriceListItem;

/** MapStruct mapper for Price List Item DTOs. */
@Mapper(componentModel = "spring")
public interface PriceListItemMapper {

  @Mapping(
      target = "categoryCode",
      expression = "java(mapCategoryCode(priceListItem.getCategoryCode()))")
  @Mapping(
      target = "unitOfMeasure",
      expression = "java(mapUnitOfMeasure(priceListItem.getUnitOfMeasure()))")
  PriceListItemInfo toPriceListItemInfo(PriceListItem priceListItem);

  default PriceListItemInfo.CategoryCodeEnum mapCategoryCode(ServiceCategoryType categoryType) {
    if (categoryType == null) return null;
    return PriceListItemInfo.CategoryCodeEnum.fromValue(categoryType.name());
  }

  default PriceListItemInfo.UnitOfMeasureEnum mapUnitOfMeasure(UnitOfMeasure unitOfMeasure) {
    if (unitOfMeasure == null) return null;
    return PriceListItemInfo.UnitOfMeasureEnum.fromValue(unitOfMeasure.name());
  }

  List<PriceListItemInfo> toPriceListItemInfoList(List<PriceListItem> priceListItems);

  default PriceListItemsResponse toPriceListItemsResponse(List<PriceListItem> priceListItems) {
    PriceListItemsResponse response = new PriceListItemsResponse();
    response.setPriceListItems(toPriceListItemInfoList(priceListItems));
    return response;
  }
}
