package com.aksi.domain.order.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.entity.OrderItemPhotoEntity;

/**
 * Маппер для перетворення між OrderItemPhotoEntity і OrderItemPhotoDTO.
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface OrderItemPhotoMapper {
    
    /**
     * Перетворити OrderItemPhotoEntity у OrderItemPhotoDTO.
     * @param entity сутність фото предмета замовлення
     * @return DTO фото предмета замовлення
     */
    @Mapping(target = "itemId", source = "orderItem.id")
    OrderItemPhotoDTO toDto(OrderItemPhotoEntity entity);
    
    /**
     * Перетворити OrderItemPhotoDTO у OrderItemPhotoEntity.
     * @param dto DTO фото предмета замовлення
     * @return сутність фото предмета замовлення
     */
    @Mapping(target = "orderItem", ignore = true)
    OrderItemPhotoEntity toEntity(OrderItemPhotoDTO dto);
    
    /**
     * Перетворити список OrderItemPhotoEntity у список OrderItemPhotoDTO.
     * @param entities список сутностей фото предметів замовлення
     * @return список DTO фото предметів замовлення
     */
    List<OrderItemPhotoDTO> toDtoList(List<OrderItemPhotoEntity> entities);
} 
