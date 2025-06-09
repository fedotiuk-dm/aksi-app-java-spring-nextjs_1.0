package com.aksi.domain.order.statemachine.stage1.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.validator.ClientSelectionValidator;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Консолідований сервіс валідації для Stage1.
 * Делегує валідацію відповідним валідаторам.
 */
@Service
public class Stage1ValidationService {

    private final ClientSelectionValidator clientSelectionValidator;

    public Stage1ValidationService(ClientSelectionValidator clientSelectionValidator) {
        this.clientSelectionValidator = clientSelectionValidator;
    }

    /**
     * Валідація вибору клієнта.
     */
    public ValidationResult validateClientSelection(ClientSelectionDTO clientSelection) {
        return clientSelectionValidator.validate(clientSelection);
    }

    /**
     * Перевірка готовності до завершення вибору клієнта.
     */
    public boolean isClientSelectionReady(ClientSelectionDTO clientSelection) {
        return validateClientSelection(clientSelection).isValid();
    }

    /**
     * Перевірка готовності до завершення Stage1.
     */
    public boolean isStage1Ready(ClientSelectionDTO clientSelection) {
        // Для Stage1 достатньо тільки валідного вибору клієнта
        return isClientSelectionReady(clientSelection);
    }

    /**
     * Валідація всього контексту Stage1.
     */
    public ValidationResult validateStage1Context(ClientSelectionDTO clientSelection) {
        // Поки що тільки валідація клієнта, але можна розширити
        return validateClientSelection(clientSelection);
    }
}
