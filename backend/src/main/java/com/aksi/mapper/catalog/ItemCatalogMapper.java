package com.aksi.mapper.catalog;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.aksi.api.service.dto.CreateItemInfoRequest;
import com.aksi.api.service.dto.ItemInfo;
import com.aksi.api.service.dto.ListItemsResponse;
import com.aksi.api.service.dto.UpdateItemInfoRequest;
import com.aksi.domain.catalog.ItemCatalog;

/** MapStruct mapper for Item Catalog DTOs. */
@Mapper(componentModel = "spring")
public interface ItemCatalogMapper {

  @Mapping(target = "serviceCategoryCode", expression = "java(item.getCategory().name())")
  @Mapping(target = "icon", ignore = true)
  @Mapping(target = "nameUa", ignore = true)
  @Mapping(target = "pluralName", ignore = true)
  @Mapping(target = "pluralNameUa", ignore = true)
  @Mapping(target = "basePrice", ignore = true)
  @Mapping(target = "priceBlack", ignore = true)
  @Mapping(target = "priceColor", ignore = true)
  @Mapping(target = "attributes", ignore = true)
  @Mapping(target = "tags", ignore = true)
  ItemInfo toItemResponse(ItemCatalog item);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "material", ignore = true)
  @Mapping(target = "careInstructions", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  @Mapping(target = "serviceItems", ignore = true)
  ItemCatalog toEntity(CreateItemInfoRequest request);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "code", ignore = true) // Code cannot be changed
  @Mapping(target = "material", ignore = true)
  @Mapping(target = "careInstructions", ignore = true)
  @Mapping(target = "sortOrder", ignore = true)
  @Mapping(target = "serviceItems", ignore = true)
  void updateEntityFromDto(UpdateItemInfoRequest request, @MappingTarget ItemCatalog item);

  List<ItemInfo> toItemList(List<ItemCatalog> items);

  default ListItemsResponse toListItemsResponse(List<ItemCatalog> items) {
    ListItemsResponse response = new ListItemsResponse();
    response.setItems(toItemList(items));
    return response;
  }
}
