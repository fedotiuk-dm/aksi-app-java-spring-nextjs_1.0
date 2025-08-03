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
  ServiceItemInfo toServiceItemResponse(ServiceItem serviceItem);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "serviceCatalog", ignore = true)
  @Mapping(target = "itemCatalog", ignore = true)
  @Mapping(target = "priceListItem", ignore = true)
  ServiceItem toEntity(CreateServiceItemInfoRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "serviceId", ignore = true)
  @Mapping(target = "itemId", ignore = true)
  @Mapping(target = "serviceCatalog", ignore = true)
  @Mapping(target = "itemCatalog", ignore = true)
  @Mapping(target = "priceListItem", ignore = true)
  void updateEntityFromDto(
      UpdateServiceItemInfoRequest request, @MappingTarget ServiceItem serviceItem);

  List<ServiceItemInfo> toServiceItemList(List<ServiceItem> serviceItems);

  default ListServiceItemsResponse toListServiceItemsResponse(List<ServiceItem> serviceItems) {
    ListServiceItemsResponse response = new ListServiceItemsResponse();
    response.setServiceItems(toServiceItemList(serviceItems));
    return response;
  }
}
