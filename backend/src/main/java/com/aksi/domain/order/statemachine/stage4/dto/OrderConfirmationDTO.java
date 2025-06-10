package com.aksi.domain.order.statemachine.stage4.dto;

import java.util.UUID;

import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підтвердження замовлення Stage4.
 * Обгортає domain OrderDetailedSummaryResponse з додатковими полями State Machine.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderConfirmationDTO {

    /**
     * ID сесії State Machine.
     */
    private UUID sessionId;

    /**
     * Поточний стан Stage4.
     */
    private Stage4State currentState;

    /**
     * Детальний підсумок замовлення з domain шару.
     */
    private OrderDetailedSummaryResponse orderSummary;

    /**
     * Чи готове замовлення до підтвердження.
     */
    @Builder.Default
    private Boolean readyForConfirmation = false;

    /**
     * Чи перевірено замовлення клієнтом.
     */
    @Builder.Default
    private Boolean summaryReviewed = false;

    /**
     * Повідомлення про валідацію (якщо є).
     */
    private String validationMessage;

    /**
     * Чи є помилки валідації.
     */
    @Builder.Default
    private Boolean hasValidationErrors = false;
}
