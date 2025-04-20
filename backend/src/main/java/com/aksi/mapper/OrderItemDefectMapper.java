package com.aksi.mapper;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemDefect;
import com.aksi.dto.order.OrderItemDefectCreateRequest;
import com.aksi.dto.order.OrderItemDefectDto;
import org.mapstruct.*;

import java.util.List;
import java.util.ArrayList;


/**
 * Mapper for converting between OrderItemDefect entity and DTOs.
 */
@Mapper(componentModel = "spring", 
        uses = {UuidMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface OrderItemDefectMapper extends BaseMapper {
    

    
    /**
     * Convert OrderItemDefect entity to OrderItemDefectDto.
     * 
     * @param defect The OrderItemDefect entity
     * @return OrderItemDefectDto
     */
    @Mapping(target = "id", ignore = true) // UUID will be set automatically by JPA/Hibernate
    @Mapping(target = "orderItemId", source = "orderItem.id")
    OrderItemDefectDto toDto(OrderItemDefect defect);
    
    /**
     * Convert a list of OrderItemDefect entities to a list of OrderItemDefectDto objects.
     * 
     * @param defects The list of OrderItemDefect entities
     * @return List of OrderItemDefectDto objects
     */
    List<OrderItemDefectDto> toDtoList(List<OrderItemDefect> defects);
    
    /**
     * Convert OrderItemDefectCreateRequest to OrderItemDefect entity.
     * 
     * @param request The OrderItemDefectCreateRequest
     * @param orderItem The OrderItem entity that this defect belongs to
     * @return OrderItemDefect entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", source = "orderItem")
    OrderItemDefect toEntity(OrderItemDefectCreateRequest request, OrderItem orderItem);
    
    /**
     * Convert a list of OrderItemDefectCreateRequest objects to a list of OrderItemDefect entities.
     * 
     * @param requests The list of OrderItemDefectCreateRequest objects
     * @param orderItem The OrderItem entity that these defects belong to
     * @return List of OrderItemDefect entities
     */
    default List<OrderItemDefect> toEntityList(List<OrderItemDefectCreateRequest> requests, OrderItem orderItem) {
        if (requests == null) {
            return new ArrayList<>();
        }
        
        List<OrderItemDefect> defects = new ArrayList<>(requests.size());
        for (OrderItemDefectCreateRequest request : requests) {
            defects.add(toEntity(request, orderItem));
        }
        return defects;
    }
    
    /**
     * Update an existing OrderItemDefect entity from OrderItemDefectCreateRequest.
     * 
     * @param request The OrderItemDefectCreateRequest
     * @param defect The existing OrderItemDefect entity to update
     * @return The updated OrderItemDefect entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", ignore = true)
    OrderItemDefect updateDefectFromRequest(OrderItemDefectCreateRequest request, @MappingTarget OrderItemDefect defect);
}
