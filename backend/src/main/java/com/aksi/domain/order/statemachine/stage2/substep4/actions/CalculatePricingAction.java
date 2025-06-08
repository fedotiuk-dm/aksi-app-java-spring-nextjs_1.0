package com.aksi.domain.order.statemachine.stage2.substep4.actions;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PricingStateMachineAdapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Action для розрахунку ціни в підетапі 2.4.
 *
 * ПРИНЦИП: Тонка інтеграція з State Machine - делегує всю логіку до адаптера.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CalculatePricingAction implements Action<OrderState, OrderEvent> {

    private final PricingStateMachineAdapter pricingAdapter;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Executing pricing calculation action");

        try {
            // Отримуємо wizard ID та дані з контексту
            String wizardId = extractWizardId(context);
            Map<String, Object> wizardData = extractWizardData(context);

            // Ініціалізуємо або оновлюємо розрахунок ціни
            Map<String, Object> pricingData = pricingAdapter.initializePricingStep(wizardId, wizardData);

            // Зберігаємо результат в контексті State Machine
            context.getExtendedState().getVariables().put("pricingData", pricingData);
            context.getExtendedState().getVariables().put("pricingInitialized", true);

            log.debug("Pricing calculation completed successfully for wizard: {}", wizardId);

        } catch (Exception e) {
            log.error("Error executing pricing calculation action: {}", e.getMessage(), e);

            // Зберігаємо помилку в контексті
            context.getExtendedState().getVariables().put("pricingError", e.getMessage());
            context.getExtendedState().getVariables().put("pricingInitialized", false);
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
