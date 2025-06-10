package com.aksi.domain.order.statemachine.stage4.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

/**
 * Mapper для перетворення даних завершення замовлення Stage4.
 * Обробляє конверсію між State Machine DTO та domain DTO для завершення Order Wizard.
 */
@Component
public class Stage4OrderCompletionMapper {

    /**
     * Створює OrderCompletionDTO з domain OrderFinalizationRequest.
     *
     * @param sessionId ID сесії State Machine
     * @param finalizationRequest запит на завершення з domain шару
     * @return OrderCompletionDTO для State Machine
     */
    public OrderCompletionDTO createFromFinalizationRequest(UUID sessionId, OrderFinalizationRequest finalizationRequest) {
        return OrderCompletionDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.ORDER_COMPLETION)
                .finalizationRequest(finalizationRequest)
                .orderProcessed(false)
                .orderSaved(false)
                .wizardCompleted(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Позначає замовлення як завершене.
     *
     * @param completionDTO поточний DTO завершення замовлення
     * @return оновлений DTO з позначкою про завершення
     */
    public OrderCompletionDTO markOrderCompleted(OrderCompletionDTO completionDTO) {
        if (completionDTO == null) {
            return null;
        }

        return completionDTO.toBuilder()
                .currentState(Stage4State.STAGE4_COMPLETED)
                .completionTimestamp(LocalDateTime.now())
                .wizardCompleted(true)
                .build();
    }

    /**
     * Створює OrderCompletionDTO з domain OrderFinalizationRequest.
     *
     * @param sessionId ID сесії State Machine
     * @param orderId ID замовлення
     * @param signatureData дані підпису клієнта
     * @param sendByEmail чи відправляти квитанцію на email
     * @param generatePrintable чи генерувати друковану версію
     * @param comments додаткові коментарі
     * @return OrderCompletionDTO для State Machine
     */
    public OrderCompletionDTO createForOrder(UUID sessionId, UUID orderId, String signatureData,
                                           boolean sendByEmail, boolean generatePrintable, String comments) {
        OrderFinalizationRequest finalizationRequest = OrderFinalizationRequest.builder()
                .orderId(orderId)
                .signatureData(signatureData)
                .termsAccepted(true)
                .sendReceiptByEmail(sendByEmail)
                .generatePrintableReceipt(generatePrintable)
                .comments(comments)
                .build();

        return OrderCompletionDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.ORDER_COMPLETION)
                .finalizationRequest(finalizationRequest)
                .orderProcessed(false)
                .orderSaved(false)
                .wizardCompleted(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Оновлює стан після обробки замовлення.
     *
     * @param completionDTO поточний DTO завершення замовлення
     * @return оновлений DTO з позначкою про обробку
     */
    public OrderCompletionDTO markOrderProcessed(OrderCompletionDTO completionDTO) {
        if (completionDTO == null) {
            return null;
        }

        return completionDTO.toBuilder()
                .orderProcessed(true)
                .build();
    }

    /**
     * Оновлює стан після збереження замовлення.
     *
     * @param completionDTO поточний DTO завершення замовлення
     * @param orderNumber номер створеного замовлення
     * @return оновлений DTO з номером замовлення
     */
    public OrderCompletionDTO markOrderSaved(OrderCompletionDTO completionDTO, String orderNumber) {
        if (completionDTO == null) {
            return null;
        }

        return completionDTO.toBuilder()
                .orderSaved(true)
                .createdOrderNumber(orderNumber)
                .completionTimestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Завершує Order Wizard успішно.
     *
     * @param completionDTO поточний DTO завершення замовлення
     * @param successMessage повідомлення про успішне завершення
     * @return оновлений DTO з завершенням wizard
     */
    public OrderCompletionDTO completeWizard(OrderCompletionDTO completionDTO, String successMessage) {
        if (completionDTO == null || !isOrderCompletionReady(completionDTO)) {
            return completionDTO != null ?
                completionDTO.toBuilder()
                    .hasValidationErrors(true)
                    .build() : null;
        }

        return completionDTO.toBuilder()
                .wizardCompleted(true)
                .currentState(Stage4State.STAGE4_COMPLETED)
                .completionMessage(successMessage != null ? successMessage :
                    "Замовлення успішно створено. Номер: " + completionDTO.getCreatedOrderNumber())
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Перевіряє чи готове завершення замовлення.
     *
     * @param completionDTO DTO завершення замовлення
     * @return true якщо завершення готове
     */
    private boolean isOrderCompletionReady(OrderCompletionDTO completionDTO) {
        return completionDTO != null
                && completionDTO.getOrderProcessed()
                && completionDTO.getOrderSaved()
                && completionDTO.getCreatedOrderNumber() != null
                && !completionDTO.getCreatedOrderNumber().trim().isEmpty();
    }
}
