package com.aksi.mapper.catalog;

import java.util.List;

import org.mapstruct.Mapper;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.domain.catalog.PriceListItem;

/** MapStruct mapper for Price List Item DTOs. */
@Mapper(componentModel = "spring")
public interface PriceListItemMapper {

  // MapStruct handles enum and simple type mapping automatically
  PriceListItemInfo toPriceListItemInfo(PriceListItem priceListItem);

  List<PriceListItemInfo> toPriceListItemInfoList(List<PriceListItem> priceListItems);

  default PriceListItemsResponse toPriceListItemsResponse(List<PriceListItem> priceListItems) {
    PriceListItemsResponse response = new PriceListItemsResponse();
    response.setPriceListItems(toPriceListItemInfoList(priceListItems));
    return response;
  }
}
