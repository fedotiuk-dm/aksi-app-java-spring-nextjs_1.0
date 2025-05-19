package com.aksi.domain.pricing.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity;

/**
 * Mapper для перетворення між Entity та DTO для модифікаторів цін каталогу.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CatalogPriceModifierMapper {

    /**
     * Перетворює Entity на DTO.
     *
     * @param entity Entity модифікатора
     * @return DTO модифікатора
     */
    PriceModifierDTO toDto(PriceModifierDefinitionEntity entity);

    /**
     * Перетворює DTO на Entity.
     *
     * @param dto DTO модифікатора
     * @return Entity модифікатора
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PriceModifierDefinitionEntity toEntity(PriceModifierDTO dto);
}
