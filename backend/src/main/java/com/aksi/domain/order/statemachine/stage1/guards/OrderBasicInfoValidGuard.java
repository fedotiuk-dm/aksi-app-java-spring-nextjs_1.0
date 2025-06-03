package com.aksi.domain.order.statemachine.stage1.guards;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.validator.OrderBasicInfoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guard для валідації базової інформації замовлення
 * Використовує окремий валідатор для спрощення коду
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderBasicInfoValidGuard implements Guard<OrderState, OrderEvent> {

    private final OrderBasicInfoValidator orderValidator;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.debug("Валідація базової інформації замовлення для wizard: {}", wizardId);

        try {
            // Отримуємо дані з headers повідомлення
            Object orderBasicInfoObj = context.getMessageHeaders().get("orderBasicInfo");

            if (!(orderBasicInfoObj instanceof Map<?, ?>)) {
                log.warn("Базову інформацію замовлення не знайдено для wizard: {}", wizardId);
                setValidationError(context, "Базову інформацію замовлення не передано");
                return false;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> orderData = (Map<String, Object>) orderBasicInfoObj;

            // Використовуємо валідатор
            OrderBasicInfoValidator.ValidationResult result = orderValidator.validate(orderData);

            if (!result.isValid()) {
                log.warn("Валідація базової інформації замовлення не пройшла для wizard: {} - {}",
                    wizardId, result.getFirstError());
                setValidationError(context, result.getFirstError());
                return false;
            }

            log.debug("Валідація базової інформації замовлення пройшла успішно для wizard: {}", wizardId);
            clearValidationError(context);
            return true;

        } catch (Exception e) {
            log.error("Помилка валідації базової інформації замовлення для wizard {}: {}",
                wizardId, e.getMessage(), e);
            setValidationError(context, "Помилка валідації: " + e.getMessage());
            return false;
        }
    }



    /**
     * Встановлює помилку валідації в контексті
     */
    private void setValidationError(StateContext<OrderState, OrderEvent> context, String error) {
        context.getExtendedState().getVariables().put("orderBasicInfoValidationError", error);
        context.getExtendedState().getVariables().put("lastError", error);
    }

    /**
     * Очищує помилки валідації
     */
    private void clearValidationError(StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().remove("orderBasicInfoValidationError");
    }
}
