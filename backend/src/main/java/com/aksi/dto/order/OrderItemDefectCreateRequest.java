package com.aksi.dto.order;

import com.aksi.domain.order.entity.DefectType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new order item defect.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDefectCreateRequest {
    /**
     * Type of the defect.
     */
    @NotNull(message = "Defect type is required")
    private DefectType type;
    
    /**
     * Description of the defect (for OTHER type or additional information).
     */
    private String description;
}
