package com.aksi.domain.order.statemachine.stage2.substep1.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.PriceListItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.ServiceCategoryDTO;

/**
 * MapStruct маппер для підетапу 2.1: Основна інформація
 *
 * Перетворює доменні DTO в DTO підетапу та навпаки
 */
@Mapper(componentModel = "spring")
public interface BasicInfoMapper {

    /**
     * Перетворює Pricing ServiceCategoryDTO в Substep1 ServiceCategoryDTO
     */
    @Mapping(target = "id", expression = "java(source.getId().toString())")
    @Mapping(target = "code", source = "code")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "recommendedUnitOfMeasure", constant = "шт")
    @Mapping(target = "minQuantity", constant = "1")
    @Mapping(target = "maxQuantity", ignore = true)
    @Mapping(target = "expectedDeliveryDays", source = "standardProcessingDays")
    ServiceCategoryDTO mapCategoryToDTO(com.aksi.domain.pricing.dto.ServiceCategoryDTO source);

    /**
     * Перетворює список Pricing ServiceCategoryDTO в список Substep1 ServiceCategoryDTO
     */
    List<ServiceCategoryDTO> mapCategoriesToDTO(List<com.aksi.domain.pricing.dto.ServiceCategoryDTO> sources);

    /**
     * Перетворює Pricing PriceListItemDTO в Substep1 PriceListItemDTO
     */
    @Mapping(target = "id", expression = "java(source.getId().toString())")
    @Mapping(target = "code", expression = "java(source.getCatalogNumber() != null ? source.getCatalogNumber().toString() : null)")
    @Mapping(target = "number", expression = "java(source.getCatalogNumber() != null ? source.getCatalogNumber().toString() : null)")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "categoryCode", expression = "java(source.getCategoryId() != null ? source.getCategoryId().toString() : null)")
    @Mapping(target = "basePrice", source = "basePrice")
    @Mapping(target = "unitOfMeasure", source = "unitOfMeasure")
    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "notes", ignore = true)
    @Mapping(target = "hasColorVariants", expression = "java(source.getPriceBlack() != null || source.getPriceColor() != null)")
    @Mapping(target = "blackColorPrice", source = "priceBlack")
    @Mapping(target = "minQuantity", constant = "1")
    @Mapping(target = "maxQuantity", ignore = true)
    @Mapping(target = "recommendedMaterials", ignore = true)
    @Mapping(target = "deliveryDays", constant = "2")
    PriceListItemDTO mapItemToDTO(com.aksi.domain.pricing.dto.PriceListItemDTO source);

    /**
     * Перетворює список Pricing PriceListItemDTO в список Substep1 PriceListItemDTO
     */
    List<PriceListItemDTO> mapItemsToDTO(List<com.aksi.domain.pricing.dto.PriceListItemDTO> sources);
}
