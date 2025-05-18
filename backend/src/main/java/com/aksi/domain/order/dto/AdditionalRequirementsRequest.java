package com.aksi.domain.order.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на оновлення додаткових вимог замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalRequirementsRequest {
    
    /**
     * ID замовлення
     */
    @NotNull(message = "ID замовлення обов'язковий")
    private UUID orderId;
    
    /**
     * Додаткові вимоги клієнта
     */
    @Size(max = 1000, message = "Довжина додаткових вимог не повинна перевищувати 1000 символів")
    private String additionalRequirements;
    
    /**
     * Загальні примітки до замовлення
     */
    @Size(max = 1000, message = "Довжина приміток не повинна перевищувати 1000 символів")
    private String customerNotes;
} 