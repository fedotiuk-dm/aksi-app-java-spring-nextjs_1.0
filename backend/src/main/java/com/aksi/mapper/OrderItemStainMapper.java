package com.aksi.mapper;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemStain;
import com.aksi.dto.order.OrderItemStainCreateRequest;
import com.aksi.dto.order.OrderItemStainDto;
import org.mapstruct.*;

import java.util.List;
import java.util.ArrayList;


/**
 * Mapper for converting between OrderItemStain entity and DTOs.
 */
@Mapper(componentModel = "spring", uses = {UuidMapper.class}, injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface OrderItemStainMapper extends BaseMapper {
    

    
    /**
     * Convert OrderItemStain entity to OrderItemStainDto.
     * 
     * @param stain The OrderItemStain entity
     * @return OrderItemStainDto
     */
    @Mapping(target = "orderItemId", source = "orderItem.id")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "stainDescription")
    OrderItemStainDto toDto(OrderItemStain stain);
    
    /**
     * Convert a list of OrderItemStain entities to a list of OrderItemStainDto objects.
     * 
     * @param stains The list of OrderItemStain entities
     * @return List of OrderItemStainDto objects
     */
    List<OrderItemStainDto> toDtoList(List<OrderItemStain> stains);
    
    /**
     * Convert OrderItemStainCreateRequest to OrderItemStain entity.
     * 
     * @param request The OrderItemStainCreateRequest
     * @param orderItem The OrderItem entity that this stain belongs to
     * @return OrderItemStain entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", source = "orderItem")
    @Mapping(target = "stainDescription", source = "request.description")
    OrderItemStain toEntity(OrderItemStainCreateRequest request, OrderItem orderItem);
    
    /**
     * Convert a list of OrderItemStainCreateRequest objects to a list of OrderItemStain entities.
     * 
     * @param requests The list of OrderItemStainCreateRequest objects
     * @param orderItem The OrderItem entity that these stains belong to
     * @return List of OrderItemStain entities
     */
    default List<OrderItemStain> toEntityList(List<OrderItemStainCreateRequest> requests, OrderItem orderItem) {
        if (requests == null) {
            return new ArrayList<>();
        }
        
        List<OrderItemStain> stains = new ArrayList<>(requests.size());
        for (OrderItemStainCreateRequest request : requests) {
            stains.add(toEntity(request, orderItem));
        }
        return stains;
    }
    
    /**
     * Update an existing OrderItemStain entity from OrderItemStainCreateRequest.
     * 
     * @param request The OrderItemStainCreateRequest
     * @param stain The existing OrderItemStain entity to update
     * @return The updated OrderItemStain entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", ignore = true)
    @Mapping(target = "stainDescription", source = "request.description")
    OrderItemStain updateStainFromRequest(OrderItemStainCreateRequest request, @MappingTarget OrderItemStain stain);
}
