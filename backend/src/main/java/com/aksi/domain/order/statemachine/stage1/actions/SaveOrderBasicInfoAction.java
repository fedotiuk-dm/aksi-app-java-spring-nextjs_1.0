package com.aksi.domain.order.statemachine.stage1.actions;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1WizardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для збереження базової інформації замовлення.
 * Використовує Stage1WizardService для обробки даних.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveOrderBasicInfoAction implements Action<OrderState, OrderEvent> {

    private final Stage1WizardService stage1WizardService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Збереження базової інформації замовлення для wizard: {}", wizardId);

        try {
            // Отримуємо дані з headers повідомлення
            Object orderBasicInfoObj = context.getMessageHeaders().get("orderBasicInfo");

            @SuppressWarnings("unchecked")
            Map<String, Object> orderData = switch (orderBasicInfoObj) {
                case Map<?, ?> orderBasicInfo -> (Map<String, Object>) orderBasicInfo;
                case null -> throw new IllegalArgumentException("Відсутні дані базової інформації замовлення");
                default -> {
                    log.error("Некоректний тип базової інформації замовлення: {}", orderBasicInfoObj.getClass());
                    throw new IllegalArgumentException("Некоректні дані базової інформації замовлення");
                }
            };

            // Використовуємо Stage1WizardService для обробки даних замовлення
            stage1WizardService.processOrderBasicInfo(wizardId, orderData, context);

            log.info("Базова інформація замовлення збережена для wizard: {}", wizardId);

        } catch (IllegalArgumentException e) {
            log.error("Некоректні дані для wizard {}: {}", wizardId, e.getMessage());
            context.getExtendedState().getVariables().put("lastError",
                "Некоректні дані: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            log.error("Помилка збереження базової інформації замовлення для wizard {}: {}",
                wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка збереження базової інформації: " + e.getMessage());
            throw e;
        }
    }
}
