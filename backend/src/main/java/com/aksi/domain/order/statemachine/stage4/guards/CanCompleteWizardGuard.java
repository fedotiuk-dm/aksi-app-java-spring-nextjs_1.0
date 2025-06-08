package com.aksi.domain.order.statemachine.stage4.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guard для перевірки можливості завершення Order Wizard
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CanCompleteWizardGuard implements Guard<OrderState, OrderEvent> {

    private final WizardCompletionGuards wizardCompletionGuards;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

        if (wizardId == null) {
            log.warn("WizardId не знайдено в контексті State Machine");
            return false;
        }

        boolean canComplete = wizardCompletionGuards.canCompleteWizard(wizardId);
        log.debug("Перевірка можливості завершення wizard {}: {}", wizardId, canComplete);

        return canComplete;
    }
}
