package com.aksi.domain.order.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.order.dto.PriceModifierDTO;
import com.aksi.domain.order.entity.PriceModifierEntity;

/**
 * Маппер для перетворення між PriceModifierEntity і PriceModifierDTO.
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PriceModifierMapper {
    
    /**
     * Перетворити PriceModifierEntity у PriceModifierDTO.
     * @param entity сутність модифікатора ціни
     * @return DTO модифікатора ціни
     */
    @Mapping(target = "type", source = "modifierType")
    PriceModifierDTO toDto(PriceModifierEntity entity);
    
    /**
     * Перетворити PriceModifierDTO у PriceModifierEntity.
     * @param dto DTO модифікатора ціни
     * @return сутність модифікатора ціни
     */
    @Mapping(target = "modifierType", source = "type")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    PriceModifierEntity toEntity(PriceModifierDTO dto);
    
    /**
     * Перетворити список PriceModifierEntity у список PriceModifierDTO.
     * @param entities список сутностей модифікаторів ціни
     * @return список DTO модифікаторів ціни
     */
    List<PriceModifierDTO> toDtoList(List<PriceModifierEntity> entities);
    
    /**
     * Перетворити список PriceModifierDTO у список PriceModifierEntity.
     * @param dtos список DTO модифікаторів ціни
     * @return список сутностей модифікаторів ціни
     */
    List<PriceModifierEntity> toEntityList(List<PriceModifierDTO> dtos);
} 