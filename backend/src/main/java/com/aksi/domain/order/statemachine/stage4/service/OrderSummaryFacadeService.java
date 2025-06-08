package com.aksi.domain.order.statemachine.stage4.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryPresentationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade сервіс для роботи з OrderSummary.
 *
 * Об'єднує всю функціональність пов'язану з OrderSummary та приховує складність
 * від клієнтських класів. Реалізує паттерн Facade для спрощення використання.
 *
 * Архітектурні переваги:
 * - Єдина точка доступу до функціональності OrderSummary
 * - Приховує складність взаємодії між сервісами
 * - Спрощує тестування та моки
 * - Дотримання принципу DRY
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderSummaryFacadeService {

    private final OrderSummaryPresentationService presentationService;
    private final OrderSummaryValidationService validationService;

    /**
     * Отримати повне форматування для UI.
     */
    public OrderSummaryPresentationDTO getFormattedSummary(OrderSummaryDTO summary) {
        log.debug("Форматування підсумку замовлення: {}", summary.getReceiptNumber());
        return presentationService.formatFullSummary(summary);
    }

    /**
     * Валідувати замовлення з деталізованими помилками.
     */
    public OrderSummaryValidationService.OrderSummaryValidationResult validateSummary(OrderSummaryDTO summary) {
        log.debug("Валідація замовлення: {}", summary.getReceiptNumber());
        return validationService.validateOrderSummary(summary);
    }

    /**
     * Швидка перевірка чи можна переходити далі.
     */
    public boolean canProceedToNextStep(OrderSummaryDTO summary) {
        return validationService.canProceedToNextStep(summary);
    }

    /**
     * Комплексна обробка замовлення: валідація + форматування.
     *
     * @return CompleteOrderSummaryResult з валідацією та форматованими даними
     */
    public CompleteOrderSummaryResult processOrderSummary(OrderSummaryDTO summary) {
        log.debug("Комплексна обробка замовлення: {}", summary.getReceiptNumber());

        // Валідація
        var validationResult = validationService.validateOrderSummary(summary);

        // Форматування (навіть якщо є помилки, для відображення)
        var presentationData = presentationService.formatFullSummary(summary);

        return new CompleteOrderSummaryResult(
            validationResult.isValid(),
            validationResult.errors(),
            presentationData
        );
    }

    /**
     * Результат комплексної обробки замовлення.
     */
    public record CompleteOrderSummaryResult(
        boolean isValid,
        java.util.List<String> validationErrors,
        OrderSummaryPresentationDTO presentationData
    ) {}

    // === Делегування до презентаційного сервісу ===

    /**
     * Форматувати суму з валютою.
     */
    public String formatAmount(java.math.BigDecimal amount) {
        return presentationService.formatSubtotalAmount(amount);
    }

    /**
     * Отримати опис знижки.
     */
    public String getDiscountDisplayText(OrderSummaryDTO summary) {
        return presentationService.formatDiscountDisplayText(summary);
    }

    /**
     * Отримати опис терміновості.
     */
    public String getExpediteDisplayText(OrderSummaryDTO summary) {
        return presentationService.formatExpediteDisplayText(summary);
    }

    /**
     * Отримати символ валюти.
     */
    public String getCurrencySymbol() {
        return presentationService.getCurrencySymbol();
    }
}
