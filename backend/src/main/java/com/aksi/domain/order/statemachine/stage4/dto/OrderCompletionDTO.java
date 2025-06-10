package com.aksi.domain.order.statemachine.stage4.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для завершення замовлення Stage4.
 * Обгортає domain OrderFinalizationRequest з додатковими полями State Machine.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderCompletionDTO {

    /**
     * ID сесії State Machine.
     */
    private UUID sessionId;

    /**
     * Поточний стан Stage4.
     */
    private Stage4State currentState;

    /**
     * Запит на завершення замовлення з domain шару.
     */
    private OrderFinalizationRequest finalizationRequest;

    /**
     * Чи замовлення повністю оброблене.
     */
    @Builder.Default
    private Boolean orderProcessed = false;

    /**
     * Чи замовлення збережене у базі даних.
     */
    @Builder.Default
    private Boolean orderSaved = false;

    /**
     * Чи Order Wizard завершено успішно.
     */
    @Builder.Default
    private Boolean wizardCompleted = false;

    /**
     * Час завершення замовлення.
     */
    private LocalDateTime completionTimestamp;

    /**
     * Номер створеного замовлення.
     */
    private String createdOrderNumber;

    /**
     * Повідомлення про успішне завершення.
     */
    private String completionMessage;

    /**
     * Чи є помилки валідації.
     */
    @Builder.Default
    private Boolean hasValidationErrors = false;
}
