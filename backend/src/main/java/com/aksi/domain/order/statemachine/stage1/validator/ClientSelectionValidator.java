package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSelectionMode;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

/**
 * Сучасний валідатор для вибору клієнта використовуючи Jakarta Bean Validation.
 */
@Component
public class ClientSelectionValidator {

    private final Validator validator;

    public ClientSelectionValidator(Validator validator) {
        this.validator = validator;
    }

    /**
     * Валідація ClientSelectionDTO використовуючи Jakarta Bean Validation.
     */
    public ValidationResult validate(ClientSelectionDTO clientSelection) {
        if (clientSelection == null) {
            return ValidationResult.failure(java.util.List.of("Дані вибору клієнта відсутні"));
        }

        // Jakarta Bean Validation
        Set<ConstraintViolation<ClientSelectionDTO>> violations = validator.validate(clientSelection);

        if (!violations.isEmpty()) {
            var errors = violations.stream()
                .map(ConstraintViolation::getMessage)
                .toList();
            return ValidationResult.failure(errors);
        }

        // Додаткові бізнес-правила
        return validateBusinessRules(clientSelection);
    }

    /**
     * Валідація специфічних бізнес-правил після стандартної валідації.
     * Використовує enum стратегії замість if/switch.
     */
    private ValidationResult validateBusinessRules(ClientSelectionDTO clientSelection) {
        try {
            ClientSelectionMode mode = ClientSelectionMode.fromCode(clientSelection.getMode());
            return mode.validate(clientSelection);
        } catch (IllegalArgumentException e) {
            return ValidationResult.failure(java.util.List.of(e.getMessage()));
        }
    }
}
