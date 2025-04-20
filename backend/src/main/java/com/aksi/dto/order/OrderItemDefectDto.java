package com.aksi.dto.order;

import com.aksi.domain.order.entity.DefectType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Data Transfer Object for OrderItemDefect entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDefectDto {
    private UUID id;
    private UUID orderItemId;
    private DefectType type;
    private String description;
}
