package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.validator.ClientDataValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guard для валідації даних клієнта
 * Використовує окремий валідатор для спрощення коду
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ClientValidGuard implements Guard<OrderState, OrderEvent> {

    private final ClientDataValidator clientValidator;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.debug("Валідація даних клієнта для wizard: {}", wizardId);

        try {
            // Отримуємо дані клієнта з headers повідомлення
            Object clientDataObj = context.getMessageHeaders().get("clientData");

            if (!(clientDataObj instanceof ClientResponse clientData)) {
                log.warn("Дані клієнта не знайдено або некоректний тип для wizard: {}", wizardId);
                setValidationError(context, "Дані клієнта не передано");
                return false;
            }

            // Використовуємо валідатор
            ClientDataValidator.ValidationResult result = clientValidator.validate(clientData);

            if (!result.isValid()) {
                log.warn("Валідація клієнта не пройшла для wizard: {} - {}", wizardId, result.getFirstError());
                setValidationError(context, result.getFirstError());
                return false;
            }

            log.debug("Валідація клієнта пройшла успішно для wizard: {}", wizardId);
            clearValidationError(context);
            return true;

        } catch (Exception e) {
            log.error("Помилка валідації клієнта для wizard {}: {}", wizardId, e.getMessage(), e);
            setValidationError(context, "Помилка валідації: " + e.getMessage());
            return false;
        }
    }

    /**
     * Встановлює помилку валідації в контексті
     */
    private void setValidationError(StateContext<OrderState, OrderEvent> context, String error) {
        context.getExtendedState().getVariables().put("clientValidationError", error);
        context.getExtendedState().getVariables().put("lastError", error);
    }

    /**
     * Очищує помилки валідації
     */
    private void clearValidationError(StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().remove("clientValidationError");
    }
}
