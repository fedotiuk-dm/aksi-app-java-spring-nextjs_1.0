package com.aksi.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;

@Mapper(componentModel = "spring")
public interface PriceListMapper {

    @Mapping(target = "items", source = "services")
    ServiceCategoryDTO toDto(ServiceCategoryEntity category);

    List<ServiceCategoryDTO> toCategoryDtoList(List<ServiceCategoryEntity> categories);

    @Mapping(target = "categoryId", source = "category.id")
    PriceListItemDTO toDto(PriceListItemEntity priceListItem);

    List<PriceListItemDTO> toItemDtoList(List<PriceListItemEntity> items);

    @Mapping(target = "services", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ServiceCategoryEntity toEntity(ServiceCategoryDTO dto);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PriceListItemEntity toEntity(PriceListItemDTO dto);
}
