package com.aksi.mapper.catalog;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.service.dto.CreateServiceItemInfoRequest;
import com.aksi.api.service.dto.ListServiceItemsResponse;
import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.api.service.dto.UpdateServiceItemInfoRequest;
import com.aksi.domain.catalog.ServiceItem;

/** MapStruct mapper for Service Item DTOs. */
@Mapper(
    componentModel = "spring",
    uses = {ServiceCatalogMapper.class, ItemCatalogMapper.class})
public interface ServiceItemMapper {

  @Mapping(target = "service", source = "serviceCatalog")
  @Mapping(target = "item", source = "itemCatalog")
  @Mapping(target = "priceBlack", ignore = true) // Will handle in service
  @Mapping(target = "priceColor", ignore = true) // Will handle in service
  @Mapping(target = "serviceId", ignore = true)
  @Mapping(target = "itemId", ignore = true)
  @Mapping(target = "branchPrice", ignore = true)
  @Mapping(target = "processingTime", ignore = true)
  @Mapping(target = "expressAvailable", ignore = true)
  @Mapping(target = "expressMultiplier", ignore = true)
  @Mapping(target = "minQuantity", ignore = true)
  @Mapping(target = "maxQuantity", ignore = true)
  @Mapping(target = "specialInstructions", ignore = true)
  @Mapping(target = "popularityScore", ignore = true)
  ServiceItemInfo toServiceItemResponse(ServiceItem serviceItem);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "serviceCatalog", ignore = true)
  @Mapping(target = "itemCatalog", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "expressPrice", ignore = true)
  @Mapping(target = "priceBlack", ignore = true)
  @Mapping(target = "priceColor", ignore = true)
  @Mapping(target = "processingTimeDays", ignore = true)
  @Mapping(target = "expressTimeHours", ignore = true)
  @Mapping(target = "complexityFactor", ignore = true)
  @Mapping(target = "notes", ignore = true)
  @Mapping(target = "active", ignore = true)
  @Mapping(target = "availableForOrder", ignore = true)
  ServiceItem toEntity(CreateServiceItemInfoRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "serviceCatalog", ignore = true)
  @Mapping(target = "itemCatalog", ignore = true)
  @Mapping(target = "version", ignore = true)
  @Mapping(target = "expressPrice", ignore = true)
  @Mapping(target = "priceBlack", ignore = true)
  @Mapping(target = "priceColor", ignore = true)
  @Mapping(target = "processingTimeDays", ignore = true)
  @Mapping(target = "expressTimeHours", ignore = true)
  @Mapping(target = "complexityFactor", ignore = true)
  @Mapping(target = "notes", ignore = true)
  @Mapping(target = "availableForOrder", ignore = true)
  void updateEntityFromDto(
      UpdateServiceItemInfoRequest request, @MappingTarget ServiceItem serviceItem);

  List<ServiceItemInfo> toServiceItemList(List<ServiceItem> serviceItems);

  default ListServiceItemsResponse toListServiceItemsResponse(List<ServiceItem> serviceItems) {
    ListServiceItemsResponse response = new ListServiceItemsResponse();
    response.setServiceItems(toServiceItemList(serviceItems));
    return response;
  }
}
