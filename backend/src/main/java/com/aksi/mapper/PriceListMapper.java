package com.aksi.mapper;

import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.dto.pricing.PriceListItemDto;
import com.aksi.dto.pricing.ServiceCategoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PriceListMapper {

    @Mapping(target = "items", source = "services")
    ServiceCategoryDto toDto(ServiceCategory category);

    List<ServiceCategoryDto> toCategoryDtoList(List<ServiceCategory> categories);

    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "categoryId", source = "category.id")
    PriceListItemDto toDto(PriceListItem priceListItem);

    List<PriceListItemDto> toItemDtoList(List<PriceListItem> items);

    @Mapping(target = "services", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ServiceCategory toEntity(ServiceCategoryDto dto);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "active", source = "isActive")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PriceListItem toEntity(PriceListItemDto dto);
}
