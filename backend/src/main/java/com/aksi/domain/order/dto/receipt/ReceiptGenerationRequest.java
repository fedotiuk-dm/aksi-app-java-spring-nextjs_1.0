package com.aksi.domain.order.dto.receipt;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту генерації квитанції
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptGenerationRequest {
    /**
     * ID замовлення, для якого потрібно згенерувати квитанцію
     */
    @NotNull(message = "ID замовлення обов'язкове")
    private UUID orderId;
    
    /**
     * Формат квитанції (PDF, HTML)
     */
    @Builder.Default
    private String format = "PDF";
    
    /**
     * Чи потрібно включати цифровий підпис
     */
    @Builder.Default
    private boolean includeSignature = true;
} 