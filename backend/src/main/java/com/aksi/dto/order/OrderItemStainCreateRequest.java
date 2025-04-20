package com.aksi.dto.order;

import com.aksi.domain.order.entity.StainType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new order item stain.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemStainCreateRequest {
    /**
     * Type of the stain.
     */
    @NotNull(message = "Stain type is required")
    private StainType type;
    
    /**
     * Description of the stain (for OTHER type or additional information).
     */
    private String description;
}
