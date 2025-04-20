package com.aksi.mapper;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.order.entity.Order;
import com.aksi.dto.client.ClientDTO;
import com.aksi.dto.order.OrderCreateRequest;
import com.aksi.dto.order.OrderDto;
import com.aksi.dto.order.OrderItemDto;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * Mapper for converting between Order entity and DTOs.
 */
@Mapper(componentModel = "spring", 
        uses = {ClientMapper.class, OrderItemMapper.class, UuidMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper extends BaseMapper {
    
    /**
     * Convert Order entity to OrderDto.
     * 
     * @param order The Order entity
     * @return OrderDto
     */
    @Mapping(target = "id", source = "id", qualifiedByName = "uuidToUuid")
    OrderDto toDto(Order order);
    
    /**
     * Convert a list of Order entities to a list of OrderDto objects.
     * 
     * @param orders The list of Order entities
     * @return List of OrderDto objects
     */
    default List<OrderDto> toDtoList(List<Order> orders) {
        if (orders == null) {
            return null;
        }
        
        List<OrderDto> result = new ArrayList<>(orders.size());
        for (Order order : orders) {
            result.add(toDto(order));
        }
        return result;
    }
    
    /**
     * Convert OrderCreateRequest to Order entity.
     * 
     * @param request The OrderCreateRequest
     * @param client The Client entity
     * @return Order entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "receiptNumber", ignore = true)
    @Mapping(target = "createdAt", expression = "java(getCurrentDateTime())")
    @Mapping(target = "client", source = "client")
    @Mapping(target = "status", constant = "CREATED")
    @Mapping(target = "basePrice", constant = "0")
    @Mapping(target = "totalPrice", constant = "0")
    @Mapping(target = "amountDue", expression = "java(request.getAmountPaid().negate())")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "clientSignature", ignore = true)
    @Mapping(target = "notes", source = "request.notes")
    Order toEntity(OrderCreateRequest request, Client client);
    
    /**
     * Update an existing Order entity from OrderCreateRequest.
     * 
     * @param request The OrderCreateRequest
     * @param order The existing Order entity to update
     * @param client The Client entity
     * @return The updated Order entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "receiptNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "client", source = "client")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "basePrice", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "amountDue", expression = "java(calculateAmountDue(order.getTotalPrice(), request.getAmountPaid()))")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "clientSignature", ignore = true)
    @Mapping(target = "notes", source = "request.notes")
    Order updateOrderFromRequest(OrderCreateRequest request, @MappingTarget Order order, Client client);
    
    /**
     * Convert Order entity to OrderDto with client and order items.
     * 
     * @param order The Order entity
     * @param client The ClientDTO representation
     * @param orderItems The list of OrderItemDto objects
     * @return OrderDto
     */
    @Mapping(target = "id", source = "order.id", qualifiedByName = "uuidToUuid")
    @Mapping(target = "items", source = "orderItems")
    @Mapping(target = "status", source = "order.status")
    @Mapping(target = "client", source = "client")
    @Mapping(target = "notes", source = "order.notes")
    @Mapping(target = "createdAt", source = "order.createdAt")
    OrderDto toDto(Order order, ClientDTO client, List<OrderItemDto> orderItems);
    
    /**
     * Helper method to get the current date and time.
     * 
     * @return Current date and time
     */
    default LocalDateTime getCurrentDateTime() {
        return LocalDateTime.now();
    }
    

    
    /**
     * Calculate the amount due based on total price and amount paid.
     * 
     * @param totalPrice The total price
     * @param amountPaid The amount paid
     * @return The amount due
     */
    default java.math.BigDecimal calculateAmountDue(java.math.BigDecimal totalPrice, java.math.BigDecimal amountPaid) {
        return totalPrice.subtract(amountPaid);
    }
}
