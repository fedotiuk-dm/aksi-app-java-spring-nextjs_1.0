package com.aksi.domain.order.statemachine.stage1.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції Stage 1 координатора з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки координації,
 * дотримуючись принципу Single Responsibility.
 *
 * Етап: 1 (Клієнт та базова інформація замовлення)
 * Підетапи: 1.1 Вибір або створення клієнта, 1.2 Базова інформація замовлення
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Stage1StateMachineAdapter {

    private final Stage1CoordinationService coordinationService;

    /**
     * Ініціалізує етап 1 з усіма підетапами.
     */
    public void initializeStage1(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Ініціалізація етапу 1 - Клієнт та базова інформація замовлення");

        String wizardId = extractWizardId(context);
        coordinationService.initializeStage1(wizardId, context);
    }

    /**
     * Завершує підетап вибору клієнта та переходить до базової інформації замовлення.
     */
    public void finishClientSelectionAndStartOrderInfo(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від вибору клієнта до базової інформації замовлення");

        String wizardId = extractWizardId(context);
        coordinationService.finishClientSelectionAndStartOrderInfo(wizardId, context);
    }

    /**
     * Фіналізує весь етап 1.
     */
    public void finalizeStage1(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Фіналізація етапу 1");

        String wizardId = extractWizardId(context);
        coordinationService.finalizeStage1(wizardId, context);
    }

    /**
     * Отримує поточний підетап етапу 1.
     */
    public String getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getCurrentStep(context);
    }

    /**
     * Перевіряє чи завершено підетап вибору клієнта.
     */
    public boolean isClientSelectionCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isClientSelectionCompleted(context);
    }

    /**
     * Перевіряє чи ініціалізовано підетап базової інформації замовлення.
     */
    public boolean isOrderInfoInitialized(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isOrderInfoInitialized(context);
    }

    /**
     * Валідує чи етап 1 готовий до завершення.
     */
    public boolean validateStage1Completion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності етапу 1");

        return coordinationService.validateStage1Completion(context);
    }

    /**
     * Очищує дані етапу 1.
     */
    public void clearStage1Data(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних етапу 1");

        // Очищення виконується в координаційному сервісі
        coordinationService.finalizeStage1(extractWizardId(context), context);
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
