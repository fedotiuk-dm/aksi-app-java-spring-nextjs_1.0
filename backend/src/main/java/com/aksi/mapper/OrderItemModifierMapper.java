package com.aksi.mapper;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemModifier;
import com.aksi.dto.order.OrderItemModifierCreateRequest;
import com.aksi.dto.order.OrderItemModifierDto;
import org.mapstruct.*;

import java.util.List;
import java.util.ArrayList;


/**
 * Mapper for converting between OrderItemModifier entity and DTOs.
 */
@Mapper(componentModel = "spring", 
        uses = {UuidMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface OrderItemModifierMapper extends BaseMapper {
    

    
    /**
     * Convert OrderItemModifier entity to OrderItemModifierDto.
     * 
     * @param modifier The OrderItemModifier entity
     * @return OrderItemModifierDto
     */
    @Mapping(target = "id", ignore = true) // UUID will be set automatically by JPA/Hibernate
    @Mapping(target = "orderItemId", source = "orderItem.id")
    OrderItemModifierDto toDto(OrderItemModifier modifier);
    
    /**
     * Convert a list of OrderItemModifier entities to a list of OrderItemModifierDto objects.
     * 
     * @param modifiers The list of OrderItemModifier entities
     * @return List of OrderItemModifierDto objects
     */
    List<OrderItemModifierDto> toDtoList(List<OrderItemModifier> modifiers);
    
    /**
     * Convert OrderItemModifierCreateRequest to OrderItemModifier entity.
     * 
     * @param request The OrderItemModifierCreateRequest
     * @param orderItem The OrderItem entity that this modifier belongs to
     * @return OrderItemModifier entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", source = "orderItem")
    @Mapping(target = "priceImpact", expression = "java(calculatePriceImpact(request, orderItem))")
    @Mapping(target = "name", source = "request.name")
    OrderItemModifier toEntity(OrderItemModifierCreateRequest request, OrderItem orderItem);
    
    /**
     * Convert a list of OrderItemModifierCreateRequest objects to a list of OrderItemModifier entities.
     * 
     * @param requests The list of OrderItemModifierCreateRequest objects
     * @param orderItem The OrderItem entity that these modifiers belong to
     * @return List of OrderItemModifier entities
     */
    default List<OrderItemModifier> toEntityList(List<OrderItemModifierCreateRequest> requests, OrderItem orderItem) {
        if (requests == null) {
            return new ArrayList<>();
        }
        
        List<OrderItemModifier> modifiers = new ArrayList<>(requests.size());
        for (OrderItemModifierCreateRequest request : requests) {
            modifiers.add(toEntity(request, orderItem));
        }
        return modifiers;
    }
    
    /**
     * Update an existing OrderItemModifier entity from OrderItemModifierCreateRequest.
     * 
     * @param request The OrderItemModifierCreateRequest
     * @param modifier The existing OrderItemModifier entity to update
     * @return The updated OrderItemModifier entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", ignore = true)
    @Mapping(target = "priceImpact", expression = "java(calculatePriceImpact(request, modifier.getOrderItem()))")
    OrderItemModifier updateModifierFromRequest(OrderItemModifierCreateRequest request, @MappingTarget OrderItemModifier modifier);
    
    /**
     * Calculate the price impact of a modifier.
     * 
     * @param request The OrderItemModifierCreateRequest
     * @param orderItem The OrderItem entity
     * @return The price impact
     */
    default java.math.BigDecimal calculatePriceImpact(OrderItemModifierCreateRequest request, OrderItem orderItem) {
        if (orderItem == null || orderItem.getBasePrice() == null) {
            return java.math.BigDecimal.ZERO;
        }
        
        if ("PERCENTAGE".equals(request.getType())) {
            return orderItem.getBasePrice().multiply(request.getValue()).divide(java.math.BigDecimal.valueOf(100));
        } else if ("FIXED".equals(request.getType())) {
            return request.getValue();
        }
        
        return java.math.BigDecimal.ZERO;
    }
}
