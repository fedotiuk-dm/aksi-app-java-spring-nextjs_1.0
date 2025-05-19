package com.aksi.domain.pricing.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.aksi.domain.pricing.dto.PriceModifierDefinitionDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity;

/**
 * Mapper для перетворення між Entity та DTO для модифікаторів цін з каталогу.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PriceModifierDefinitionMapper {
    
    /**
     * Перетворює Entity на DTO.
     * 
     * @param entity Entity модифікатора
     * @return DTO модифікатора
     */
    PriceModifierDefinitionDTO toDto(PriceModifierDefinitionEntity entity);
    
    /**
     * Перетворює DTO на Entity.
     * 
     * @param dto DTO модифікатора
     * @return Entity модифікатора
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PriceModifierDefinitionEntity toEntity(PriceModifierDefinitionDTO dto);
} 
