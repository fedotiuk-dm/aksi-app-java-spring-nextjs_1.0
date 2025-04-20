package com.aksi.mapper;

import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.dto.order.*;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

/**
 * Mapper for converting between OrderItem entity and DTOs.
 */
@Mapper(componentModel = "spring", 
        uses = {PriceListMapper.class, OrderItemModifierMapper.class, OrderItemStainMapper.class, 
                OrderItemDefectMapper.class, OrderItemPhotoMapper.class, UuidMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface OrderItemMapper extends BaseMapper {
    
    /**
     * Convert OrderItem entity to OrderItemDto.
     * 
     * @param orderItem The OrderItem entity
     * @return OrderItemDto
     */
    @Mapping(target = "orderId", source = "order.id", qualifiedByName = "uuidToUuid")
    @Mapping(target = "id", source = "id", qualifiedByName = "uuidToUuid")
    OrderItemDto toDto(OrderItem orderItem);
    

    
    /**
     * Convert a list of OrderItem entities to a list of OrderItemDto objects.
     * 
     * @param orderItems The list of OrderItem entities
     * @return List of OrderItemDto objects
     */
    default List<OrderItemDto> toDtoList(List<OrderItem> orderItems) {
        if (orderItems == null) {
            return null;
        }
        
        List<OrderItemDto> result = new ArrayList<>(orderItems.size());
        for (OrderItem orderItem : orderItems) {
            result.add(toDto(orderItem));
        }
        return result;
    }
    
    /**
     * Convert OrderItemCreateRequest to OrderItem entity.
     * 
     * @param request The OrderItemCreateRequest
     * @param order The Order entity that this item belongs to
     * @param serviceCategory The ServiceCategory entity
     * @param priceListItem The PriceListItem entity
     * @return OrderItem entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", source = "order")
    @Mapping(target = "serviceCategory", source = "serviceCategory")
    @Mapping(target = "priceListItem", source = "priceListItem")
    @Mapping(target = "basePrice", source = "priceListItem.basePrice")
    @Mapping(target = "finalPrice", source = "priceListItem.basePrice")
    @Mapping(target = "name", source = "request.name")
    @Mapping(target = "modifiers", ignore = true)
    @Mapping(target = "stains", ignore = true)
    @Mapping(target = "defects", ignore = true)
    @Mapping(target = "photos", ignore = true)
    OrderItem toEntity(OrderItemCreateRequest request, Order order, 
                      ServiceCategory serviceCategory, PriceListItem priceListItem);
    
    /**
     * Update an existing OrderItem entity from OrderItemCreateRequest.
     * 
     * @param request The OrderItemCreateRequest
     * @param orderItem The existing OrderItem entity to update
     * @param serviceCategory The ServiceCategory entity
     * @param priceListItem The PriceListItem entity
     * @return The updated OrderItem entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "serviceCategory", source = "serviceCategory")
    @Mapping(target = "priceListItem", source = "priceListItem")
    @Mapping(target = "basePrice", source = "priceListItem.basePrice")
    @Mapping(target = "finalPrice", source = "priceListItem.basePrice")
    @Mapping(target = "name", source = "request.name")
    @Mapping(target = "modifiers", ignore = true)
    @Mapping(target = "stains", ignore = true)
    @Mapping(target = "defects", ignore = true)
    @Mapping(target = "photos", ignore = true)
    OrderItem updateOrderItemFromRequest(OrderItemCreateRequest request, @MappingTarget OrderItem orderItem,
                                        ServiceCategory serviceCategory, PriceListItem priceListItem);
    
    /**
     * Update the final price of an OrderItem.
     * 
     * @param orderItem The OrderItem entity
     * @param finalPrice The new final price
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "serviceCategory", ignore = true)
    @Mapping(target = "priceListItem", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "unitOfMeasurement", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "color", ignore = true)
    @Mapping(target = "filler", ignore = true)
    @Mapping(target = "clumpedFiller", ignore = true)
    @Mapping(target = "wearPercentage", ignore = true)
    @Mapping(target = "defectNotes", ignore = true)
    @Mapping(target = "noWarranty", ignore = true)
    @Mapping(target = "noWarrantyReason", ignore = true)
    @Mapping(target = "manualCleaning", ignore = true)
    @Mapping(target = "heavilySoiled", ignore = true)
    @Mapping(target = "heavilySoiledPercentage", ignore = true)
    @Mapping(target = "childSized", ignore = true)
    @Mapping(target = "basePrice", ignore = true)
    @Mapping(target = "finalPrice", source = "finalPrice")
    @Mapping(target = "modifiers", ignore = true)
    @Mapping(target = "stains", ignore = true)
    @Mapping(target = "defects", ignore = true)
    @Mapping(target = "photos", ignore = true)
    void updateFinalPrice(@MappingTarget OrderItem orderItem, BigDecimal finalPrice);
}
