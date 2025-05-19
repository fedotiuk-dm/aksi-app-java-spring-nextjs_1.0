package com.aksi.domain.order.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на збереження підпису клієнта.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSignatureRequest {

    /**
     * ID замовлення.
     */
    @NotNull(message = "ID замовлення обов'язковий")
    private UUID orderId;

    /**
     * Дані підпису у форматі base64.
     */
    @NotBlank(message = "Дані підпису обов'язкові")
    private String signatureData;

    /**
     * Прапорець прийняття умов надання послуг.
     */
    @NotNull(message = "Прийняття умов обов'язкове")
    @Builder.Default
    private Boolean termsAccepted = false;

    /**
     * Тип підпису (CUSTOMER_ACCEPTANCE - підпис при прийнятті, CUSTOMER_RECEIPT - підпис при отриманні).
     */
    @Builder.Default
    private String signatureType = "CUSTOMER_ACCEPTANCE";
}
