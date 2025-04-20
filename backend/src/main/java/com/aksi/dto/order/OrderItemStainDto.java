package com.aksi.dto.order;

import com.aksi.domain.order.entity.StainType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Data Transfer Object for OrderItemStain entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemStainDto {
    private UUID id;
    private UUID orderItemId;
    private StainType type;
    private String description;
}
