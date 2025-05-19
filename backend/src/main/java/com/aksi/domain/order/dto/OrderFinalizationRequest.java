package com.aksi.domain.order.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на завершення замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderFinalizationRequest {

    /**
     * ID замовлення для завершення
     */
    @NotNull(message = "ID замовлення обов'язкове")
    private UUID orderId;

    /**
     * Дані підпису клієнта у форматі base64
     */
    private String signatureData;

    /**
     * Прапорець прийняття умов надання послуг
     */
    @Builder.Default
    private Boolean termsAccepted = false;

    /**
     * Відправити чек на email клієнта
     */
    @Builder.Default
    private Boolean sendReceiptByEmail = false;

    /**
     * Створити друковану версію чеку
     */
    @Builder.Default
    private Boolean generatePrintableReceipt = true;

    /**
     * Додаткові коментарі до замовлення
     */
    private String comments;
}
