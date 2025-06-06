package com.aksi.domain.order.statemachine.stage4.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;
import com.aksi.domain.order.statemachine.stage4.service.OrderSummaryStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для підетапу 4.1 "Перегляд замовлення з детальним розрахунком".
 *
 * Відокремлює логіку State Machine від бізнес-логіки підетапу,
 * дотримуючись принципу Single Responsibility.
 *
 * Підетап: 4.1 (Перегляд замовлення з детальним розрахунком)
 * Функціональність:
 * - Повний підсумок замовлення
 * - Інформація про клієнта
 * - Список предметів з детальною інформацією
 * - Повний розрахунок вартості з деталізацією
 * - Загальний розрахунок з урахуванням глобальних знижок та терміновості
 * - Дата виконання
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderSummaryStateMachineAdapter {

    private final OrderSummaryStepService orderSummaryStepService;

    /**
     * Завантажує дані підсумку замовлення.
     */
    public OrderSummaryDTO loadOrderSummary(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження підсумку замовлення");

        String wizardId = extractWizardId(context);
        return orderSummaryStepService.loadOrderSummary(wizardId);
    }

    /**
     * Зберігає підсумок замовлення з позначкою про перегляд.
     */
    public OrderSummaryDTO saveOrderSummary(String wizardId, OrderSummaryDTO orderSummary) {
        log.debug("State Machine: Збереження підсумку замовлення");

        return orderSummaryStepService.saveOrderSummary(wizardId, orderSummary);
    }

    /**
     * Перерахунок підсумку замовлення з актуальних даних.
     */
    public OrderSummaryDTO recalculateOrderSummary(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перерахунок підсумку замовлення");

        String wizardId = extractWizardId(context);
        return orderSummaryStepService.recalculateOrderSummary(wizardId);
    }

    /**
     * Позначає перегляд замовлення як завершений.
     */
    public void markOrderSummaryAsReviewed(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Позначення перегляду замовлення як завершений");

        String wizardId = extractWizardId(context);
        OrderSummaryDTO orderSummary = orderSummaryStepService.loadOrderSummary(wizardId);

        if (orderSummary != null && !orderSummary.getIsReviewed()) {
            orderSummary.setIsReviewed(true);
            orderSummaryStepService.saveOrderSummary(wizardId, orderSummary);
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного підетапу.
     */
    public boolean canProceedToLegalAspects(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перевірка готовності до переходу до юридичних аспектів");

        String wizardId = extractWizardId(context);
        return orderSummaryStepService.canProceedToNextStep(wizardId);
    }

    /**
     * Валідує готовність підетапу.
     */
    public boolean validateOrderSummaryCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація завершення підсумку замовлення");

        return canProceedToLegalAspects(context);
    }

    /**
     * Перевіряє чи переглянуто замовлення.
     */
    public boolean isOrderSummaryReviewed(StateContext<OrderState, OrderEvent> context) {
        String wizardId = extractWizardId(context);
        OrderSummaryDTO orderSummary = orderSummaryStepService.loadOrderSummary(wizardId);

        return orderSummary != null && orderSummary.getIsReviewed();
    }

    /**
     * Оновлює розрахунки в підсумку замовлення.
     */
    public void updateCalculations(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Оновлення розрахунків в підсумку замовлення");

        String wizardId = extractWizardId(context);
        orderSummaryStepService.recalculateOrderSummary(wizardId);
    }

    /**
     * Отримує wizardId з контексту State Machine.
     */
    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardIdObj = context.getExtendedState().getVariables().get("wizardId");
        if (wizardIdObj instanceof String) {
            return (String) wizardIdObj;
        }
        throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
    }
}
