package com.aksi.domain.order.statemachine.stage4.mapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

/**
 * Mapper для перетворення даних підтвердження замовлення Stage4.
 * Обробляє конверсію між State Machine DTO та domain DTO.
 */
@Component
public class Stage4OrderConfirmationMapper {

    /**
     * Створює OrderConfirmationDTO з domain OrderDetailedSummaryResponse.
     *
     * @param sessionId ID сесії State Machine
     * @param orderSummary детальний підсумок замовлення з domain шару
     * @return OrderConfirmationDTO для State Machine
     */
    public OrderConfirmationDTO createFromOrderSummary(UUID sessionId, OrderDetailedSummaryResponse orderSummary) {
        return fromDomainResponse(sessionId, orderSummary);
    }

    /**
     * Створює OrderConfirmationDTO з domain OrderDetailedSummaryResponse.
     *
     * @param sessionId ID сесії State Machine
     * @param orderSummary детальний підсумок замовлення з domain шару
     * @return OrderConfirmationDTO для State Machine
     */
    public OrderConfirmationDTO fromDomainResponse(UUID sessionId, OrderDetailedSummaryResponse orderSummary) {
        if (orderSummary == null) {
            return OrderConfirmationDTO.builder()
                    .sessionId(sessionId)
                    .currentState(Stage4State.STAGE4_INITIALIZED)
                    .readyForConfirmation(false)
                    .hasValidationErrors(true)
                    .validationMessage("Відсутні дані замовлення для підтвердження")
                    .build();
        }

        return OrderConfirmationDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.ORDER_SUMMARY_REVIEW)
                .orderSummary(orderSummary)
                .readyForConfirmation(isOrderReadyForConfirmation(orderSummary))
                .summaryReviewed(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Оновлює стан перегляду підсумку.
     *
     * @param confirmationDTO поточний DTO підтвердження
     * @return оновлений DTO з позначкою про перегляд
     */
    public OrderConfirmationDTO markSummaryAsReviewed(OrderConfirmationDTO confirmationDTO) {
        if (confirmationDTO == null) {
            return null;
        }

        return confirmationDTO.toBuilder()
                .summaryReviewed(true)
                .currentState(Stage4State.ORDER_SUMMARY_REVIEW)
                .build();
    }

    /**
     * Переводить до стану готовності для юридичного оформлення.
     *
     * @param confirmationDTO поточний DTO підтвердження
     * @return оновлений DTO готовий для переходу до юридичного оформлення
     */
    public OrderConfirmationDTO prepareForLegalAcceptance(OrderConfirmationDTO confirmationDTO) {
        if (confirmationDTO == null || !confirmationDTO.getSummaryReviewed()) {
            return confirmationDTO != null ?
                confirmationDTO.toBuilder()
                    .hasValidationErrors(true)
                    .validationMessage("Спочатку потрібно переглянути підсумок замовлення")
                    .build() : null;
        }

        return confirmationDTO.toBuilder()
                .currentState(Stage4State.LEGAL_ACCEPTANCE)
                .readyForConfirmation(true)
                .build();
    }

    /**
     * Перевіряє чи готове замовлення для підтвердження.
     *
     * @param orderSummary детальний підсумок замовлення
     * @return true якщо замовлення готове для підтвердження
     */
    private boolean isOrderReadyForConfirmation(OrderDetailedSummaryResponse orderSummary) {
        return orderSummary != null
                && orderSummary.getId() != null
                && orderSummary.getClient() != null
                && orderSummary.getItems() != null
                && !orderSummary.getItems().isEmpty()
                && orderSummary.getFinalAmount() != null;
    }
}
