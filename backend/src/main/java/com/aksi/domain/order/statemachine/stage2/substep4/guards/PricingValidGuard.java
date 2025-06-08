package com.aksi.domain.order.statemachine.stage2.substep4.guards;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PricingStateMachineAdapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Guard для валідації завершення підетапу 2.4: Розрахунок ціни.
 *
 * ПРИНЦИП: Тонка інтеграція з State Machine - делегує валідацію до адаптера.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PricingValidGuard implements Guard<OrderState, OrderEvent> {

    private final PricingStateMachineAdapter pricingAdapter;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Evaluating pricing step completion guard");

        try {
            // Отримуємо wizard ID та дані з контексту
            String wizardId = extractWizardId(context);
            Map<String, Object> wizardData = extractWizardData(context);

            // Перевіряємо чи можна завершити підетап
            boolean canComplete = pricingAdapter.canCompletePricingStep(wizardId, wizardData);

            log.debug("Pricing step can be completed: {} for wizard: {}", canComplete, wizardId);
            return canComplete;

        } catch (Exception e) {
            log.error("Error evaluating pricing completion guard: {}", e.getMessage(), e);
            return false;
        }
    }

    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardId = context.getExtendedState().getVariables().get("wizardId");
        return wizardId != null ? wizardId.toString() : "unknown";
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractWizardData(StateContext<OrderState, OrderEvent> context) {
        Object wizardData = context.getExtendedState().getVariables().get("wizardData");
        return wizardData instanceof Map ? (Map<String, Object>) wizardData : Map.of();
    }
}
