package com.aksi.domain.order.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;

import lombok.RequiredArgsConstructor;

/**
 * Маппер для перетворення між OrderEntity і OrderDTO.
 */
@Component
@RequiredArgsConstructor
public class OrderMapper {
    
    private final ClientMapper clientMapper;
    
    /**
     * Перетворити OrderEntity у OrderDTO.
     * @param order параметр order
     * @return об'єкт OrderDTO, створений на основі ентіті замовлення
     */
    public OrderDTO toDTO(OrderEntity order) {
        if (order == null) {
            return null;
        }
        
        return OrderDTO.builder()
                .id(order.getId())
                .receiptNumber(order.getReceiptNumber())
                .tagNumber(order.getTagNumber())
                .client(clientMapper.toClientResponse(order.getClient()))
                .items(mapItemsToDTO(order.getItems()))
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .prepaymentAmount(order.getPrepaymentAmount())
                .balanceAmount(order.getBalanceAmount())
                .branchLocation(order.getBranchLocation())
                .status(order.getStatus())
                .createdDate(order.getCreatedDate())
                .updatedDate(order.getUpdatedDate())
                .expectedCompletionDate(order.getExpectedCompletionDate())
                .completedDate(order.getCompletedDate())
                .customerNotes(order.getCustomerNotes())
                .internalNotes(order.getInternalNotes())
                .express(order.isExpress())
                .draft(order.isDraft())
                .build();
    }
    
    /**
     * Перетворити OrderItemDTO у OrderItemEntity.
     * @param dto об'єкт передачі даних
     * @return ентіті елементу замовлення, створена на основі DTO
     */
    public OrderItemEntity fromDTO(OrderItemDTO dto) {
        if (dto == null) {
            return null;
        }
        
        return OrderItemEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .quantity(dto.getQuantity())
                .unitPrice(dto.getUnitPrice())
                .totalPrice(dto.getTotalPrice())
                .category(dto.getCategory())
                .color(dto.getColor())
                .material(dto.getMaterial())
                .defects(dto.getDefects())
                .specialInstructions(dto.getSpecialInstructions())
                .build();
    }
    
    /**
     * Перетворити OrderItemEntity у OrderItemDTO.
     * @param item параметр item
     * @return об'єкт передачі даних елементу замовлення
     */
    public OrderItemDTO toDTO(OrderItemEntity item) {
        if (item == null) {
            return null;
        }
        
        return OrderItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .category(item.getCategory())
                .color(item.getColor())
                .material(item.getMaterial())
                .defects(item.getDefects())
                .specialInstructions(item.getSpecialInstructions())
                .build();
    }
    
    /**
     * Перетворити список OrderItemEntity у список OrderItemDTO.
     */
    private List<OrderItemDTO> mapItemsToDTO(List<OrderItemEntity> items) {
        if (items == null) {
            return List.of();
        }
        
        return items.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}