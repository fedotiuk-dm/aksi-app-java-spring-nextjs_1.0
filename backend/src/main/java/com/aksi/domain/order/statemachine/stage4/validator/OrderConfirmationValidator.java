package com.aksi.domain.order.statemachine.stage4.validator;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;

/**
 * Валідатор для підтвердження замовлення Stage4.
 * Перевіряє готовність замовлення до підтвердження та повноту даних.
 */
@Component
public class OrderConfirmationValidator {

    /**
     * Валідує дані підтвердження замовлення.
     *
     * @param confirmationDTO DTO підтвердження замовлення
     * @return результат валідації
     */
    public ValidationResult validate(OrderConfirmationDTO confirmationDTO) {
        if (confirmationDTO == null) {
            return ValidationResult.withError("Дані підтвердження замовлення відсутні");
        }

        ValidationResult result = new ValidationResult();

        // Перевірка базових полів
        validateBasicFields(confirmationDTO, result);

        // Перевірка підсумку замовлення
        validateOrderSummary(confirmationDTO, result);

        // Перевірка готовності до підтвердження
        validateConfirmationReadiness(confirmationDTO, result);

        return result;
    }

    /**
     * Валідує базові поля DTO.
     *
     * @param confirmationDTO DTO підтвердження замовлення
     * @param result результат валідації
     */
    private void validateBasicFields(OrderConfirmationDTO confirmationDTO, ValidationResult result) {
        if (confirmationDTO.getSessionId() == null) {
            result.addError("ID сесії обов'язковий");
        }

        if (confirmationDTO.getCurrentState() == null) {
            result.addError("Поточний стан обов'язковий");
        }
    }

    /**
     * Валідує підсумок замовлення.
     *
     * @param confirmationDTO DTO підтвердження замовлення
     * @param result результат валідації
     */
    private void validateOrderSummary(OrderConfirmationDTO confirmationDTO, ValidationResult result) {
        if (confirmationDTO.getOrderSummary() == null) {
            result.addError("Підсумок замовлення відсутній");
            return;
        }

        var orderSummary = confirmationDTO.getOrderSummary();

        if (orderSummary.getId() == null) {
            result.addError("ID замовлення відсутній");
        }

        if (orderSummary.getClient() == null) {
            result.addError("Інформація про клієнта відсутня");
        }

        if (orderSummary.getItems() == null || orderSummary.getItems().isEmpty()) {
            result.addError("Список предметів замовлення порожній");
        }

        if (orderSummary.getFinalAmount() == null) {
            result.addError("Фінальна сума замовлення відсутня");
        } else if (orderSummary.getFinalAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            result.addError("Фінальна сума замовлення повинна бути більше нуля");
        }

        if (orderSummary.getExpectedCompletionDate() == null) {
            result.addWarning("Дата виконання замовлення не вказана");
        }
    }

    /**
     * Валідує готовність до підтвердження.
     *
     * @param confirmationDTO DTO підтвердження замовлення
     * @param result результат валідації
     */
    private void validateConfirmationReadiness(OrderConfirmationDTO confirmationDTO, ValidationResult result) {
        if (!confirmationDTO.getReadyForConfirmation()) {
            result.addWarning("Замовлення ще не готове до підтвердження");
        }

        if (confirmationDTO.getHasValidationErrors()) {
            result.addError("Є невирішені помилки валідації: " +
                confirmationDTO.getValidationMessage());
        }
    }
}
