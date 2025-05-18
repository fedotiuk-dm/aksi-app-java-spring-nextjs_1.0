package com.aksi.domain.pricing.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity;

/**
 * Mapper для перетворення між Entity та DTO для модифікаторів цін.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PriceModifierMapper {
    
    /**
     * Перетворює Entity на DTO.
     * 
     * @param entity Entity модифікатора
     * @return DTO модифікатора
     */
    PriceModifierDTO toDto(PriceModifierEntity entity);
    
    /**
     * Перетворює DTO на Entity.
     * 
     * @param dto DTO модифікатора
     * @return Entity модифікатора
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PriceModifierEntity toEntity(PriceModifierDTO dto);
} 