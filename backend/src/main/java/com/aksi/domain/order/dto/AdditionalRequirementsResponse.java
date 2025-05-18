package com.aksi.domain.order.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з додатковими вимогами замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalRequirementsResponse {
    
    /**
     * ID замовлення
     */
    private UUID orderId;
    
    /**
     * Додаткові вимоги клієнта
     */
    private String additionalRequirements;
    
    /**
     * Загальні примітки до замовлення
     */
    private String customerNotes;
} 