package com.aksi.domain.order.statemachine.stage1.actions;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1WizardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для ініціалізації нового Order Wizard.
 *
 * Виконується при події START_ORDER_CREATION.
 * Використовує Stage1WizardService для ініціалізації Stage 1.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InitializeOrderAction implements Action<OrderState, OrderEvent> {

    private final Stage1WizardService stage1WizardService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = UUID.randomUUID().toString();

        log.info("Ініціалізація нового Order Wizard з ID: {}", wizardId);

        // Встановлюємо базові змінні wizard
        context.getExtendedState().getVariables().put("wizardId", wizardId);
        context.getExtendedState().getVariables().put("createdAt", LocalDateTime.now());
        context.getExtendedState().getVariables().put("currentStage", 1);
        context.getExtendedState().getVariables().put("currentStep", 1);

        // Ініціалізуємо Stage 1 через сервіс
        try {
            stage1WizardService.initializeStage1(wizardId, context);
            log.info("Order Wizard {} успішно ініціалізовано через Stage1WizardService", wizardId);
        } catch (Exception e) {
            log.error("Помилка ініціалізації Order Wizard {}: {}", wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка ініціалізації: " + e.getMessage());
            throw e;
        }
    }
}
