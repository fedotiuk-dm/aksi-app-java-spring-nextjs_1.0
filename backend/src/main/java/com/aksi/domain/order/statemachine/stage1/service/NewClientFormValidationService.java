package com.aksi.domain.order.statemachine.stage1.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.validator.NewClientFormValidationResult;
import com.aksi.domain.order.statemachine.stage1.validator.NewClientFormValidator;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Консолідований сервіс валідації для форми нового клієнта.
 * Делегує валідацію відповідним валідаторам.
 */
@Service
public class NewClientFormValidationService {

    private final NewClientFormValidator newClientFormValidator;

    public NewClientFormValidationService(NewClientFormValidator newClientFormValidator) {
        this.newClientFormValidator = newClientFormValidator;
    }

    /**
     * Повна валідація форми нового клієнта.
     */
    public ValidationResult validateNewClientForm(NewClientFormDTO formData) {
        return newClientFormValidator.validate(formData);
    }

    /**
     * Валідація обов'язкових полів.
     */
    public ValidationResult validateRequiredFields(NewClientFormDTO formData) {
        return newClientFormValidator.validateRequiredFields(formData);
    }

    /**
     * Перевірка готовності форми до створення клієнта.
     */
    public boolean isFormReadyForSubmission(NewClientFormDTO formData) {
        return newClientFormValidator.isReadyForSubmission(formData);
    }

    /**
     * Перевірка чи можна зберегти як чернетку.
     */
    public boolean canSaveAsDraft(NewClientFormDTO formData) {
        // Для чернетки достатньо хоча б одного заповненого поля
        return formData != null && (
            (formData.getFirstName() != null && !formData.getFirstName().trim().isEmpty()) ||
            (formData.getLastName() != null && !formData.getLastName().trim().isEmpty()) ||
            (formData.getPhone() != null && !formData.getPhone().trim().isEmpty())
        );
    }

    /**
     * Перевірка мінімальних даних для створення клієнта.
     */
    public boolean hasMinimumRequiredData(NewClientFormDTO formData) {
        return validateRequiredFields(formData).isValid();
    }

    // ========== Методи для Guards ==========

    /**
     * Перевіряє чи форма валідна для Guards
     */
    public boolean isFormValid(NewClientFormDTO formData) {
        if (formData == null) {
            return false;
        }
        ValidationResult result = validateNewClientForm(formData);
        return result.isValid();
    }

    /**
     * Перевіряє чи форма готова до завершення для Guards
     */
    public boolean isFormComplete(NewClientFormDTO formData) {
        return isFormReadyForSubmission(formData);
    }

    // ========== Методи для адаптера з NewClientFormValidationResult ==========

    /**
     * Повна валідація форми з поверненням структурованого результату.
     */
    public NewClientFormValidationResult validateCompleteStructured(NewClientFormDTO formData) {
        ValidationResult result = validateNewClientForm(formData);
        return convertToStructuredResult(result);
    }

    /**
     * Валідація критичних полів з поверненням структурованого результату.
     */
    public NewClientFormValidationResult validateCriticalStructured(NewClientFormDTO formData) {
        ValidationResult result = validateRequiredFields(formData);
        return convertToStructuredResult(result);
    }

    /**
     * Перетворює ValidationResult в NewClientFormValidationResult.
     */
    private NewClientFormValidationResult convertToStructuredResult(ValidationResult result) {
        NewClientFormValidationResult structuredResult = new NewClientFormValidationResult();

        if (!result.isValid()) {
            structuredResult.setValid(false);
            structuredResult.setErrorMessages(result.getErrorMessages());
            structuredResult.setDetailedReport(String.join("; ", result.getErrorMessages()));
        }

        return structuredResult;
    }
}
