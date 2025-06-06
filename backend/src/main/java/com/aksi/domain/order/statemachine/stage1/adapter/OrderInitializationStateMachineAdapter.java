package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для підетапу 1.2 - Базова інформація замовлення.
 *
 * Інтегрує операції ініціалізації замовлення з State Machine через координаційний сервіс,
 * дотримуючись принципу Single Responsibility.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderInitializationStateMachineAdapter {

    private final Stage1CoordinationService coordinationService;

    /**
     * Ініціалізує підетап базової інформації замовлення.
     */
    public void initializeOrderInfo(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Ініціалізація підетапу 1.2 - Базова інформація замовлення");

        String wizardId = extractWizardId(context);
        coordinationService.getStateService().initializeOrderBasicInfo(wizardId, context);
    }

    /**
     * Завершує підетап базової інформації замовлення.
     */
    public void finalizeOrderInfo(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завершення підетапу 1.2 - Базова інформація замовлення");

        coordinationService.getOperationsService().finalizeOrderInitialization(context);
    }

    /**
     * Вибирає філію для замовлення.
     */
    public void selectBranch(UUID branchId, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Вибір філії: {}", branchId);

        coordinationService.getOperationsService().selectBranch(branchId, context);
    }

    /**
     * Встановлює унікальну мітку замовлення.
     */
    public void setUniqueTag(String uniqueTag, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Встановлення унікальної мітки: {}", uniqueTag);

        coordinationService.getOperationsService().setUniqueTag(uniqueTag, context);
    }

    /**
     * Перегенеровує номер квитанції.
     */
    public String regenerateReceiptNumber(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перегенерація номера квитанції");

        return coordinationService.getOperationsService().regenerateReceiptNumber(context);
    }

    /**
     * Перевіряє готовність підетапу до завершення.
     */
    public boolean validateOrderInfoCompletion(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getValidationService().validateOrderInitializationCompletion(context);
    }

    /**
     * Перевіряє чи може користувач перейти до наступного кроку.
     */
    public boolean canProceedToNext(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getValidationService().canProceedToNextInOrderInitialization(context);
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
