package com.aksi.domain.order.statemachine.stage1.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.validator.ClientSearchCriteriaValidator;
import com.aksi.domain.order.statemachine.stage1.validator.ClientSearchValidationResult;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Консолідований сервіс валідації для пошуку клієнта в етапі 1.1.
 * Делегує валідацію відповідним валідаторам.
 */
@Service
public class ClientSearchValidationService {

    private final ClientSearchCriteriaValidator criteriaValidator;

    public ClientSearchValidationService(ClientSearchCriteriaValidator criteriaValidator) {
        this.criteriaValidator = criteriaValidator;
    }

    /**
     * Повна валідація критеріїв пошуку клієнта.
     */
    public ValidationResult validateSearchCriteria(ClientSearchCriteriaDTO criteria) {
        return criteriaValidator.validate(criteria);
    }

    /**
     * Перевірка готовності критеріїв до виконання пошуку.
     */
    public boolean isReadyForSearch(ClientSearchCriteriaDTO criteria) {
        ValidationResult validation = validateSearchCriteria(criteria);
        return validation.isValid();
    }

    /**
     * Перевірка чи можна зберегти критерії як чернетку.
     */
    public boolean canSaveAsDraft(ClientSearchCriteriaDTO criteria) {
        // Для чернетки достатньо хоча б одного заповненого поля
        return criteria != null && (
            hasText(criteria.getLastName()) ||
            hasText(criteria.getFirstName()) ||
            hasText(criteria.getPhone()) ||
            hasText(criteria.getEmail()) ||
            hasText(criteria.getAddress()) ||
            hasText(criteria.getGeneralSearchTerm())
        );
    }

    /**
     * Перевірка мінімальних даних для пошуку.
     */
    public boolean hasMinimumRequiredData(ClientSearchCriteriaDTO criteria) {
        return validateSearchCriteria(criteria).isValid();
    }

    /**
     * Перевіряє чи рядок не порожній.
     */
    private boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }

    // ========== Методи для Guards ==========

    /**
     * Перевіряє чи критерії пошуку валідні для Guards
     */
    public boolean areSearchCriteriaValid(ClientSearchCriteriaDTO criteria) {
        if (criteria == null) {
            return false;
        }
        return canSaveAsDraft(criteria);
    }

    // ========== Методи для адаптера з ClientSearchValidationResult ==========

    /**
     * Повна валідація критеріїв пошуку з поверненням структурованого результату.
     */
    public ClientSearchValidationResult validateCriteriaStructured(ClientSearchCriteriaDTO criteria) {
        ValidationResult result = validateSearchCriteria(criteria);
        return convertToStructuredResult(result, criteria);
    }

    /**
     * Валідація критичних критеріїв з поверненням структурованого результату.
     */
    public ClientSearchValidationResult validateCriticalStructured(ClientSearchCriteriaDTO criteria) {
        ValidationResult result = validateSearchCriteria(criteria);
        return convertToStructuredResult(result, criteria);
    }

    /**
     * Перетворює ValidationResult в ClientSearchValidationResult.
     */
    private ClientSearchValidationResult convertToStructuredResult(ValidationResult result, ClientSearchCriteriaDTO criteria) {
        ClientSearchValidationResult structuredResult = new ClientSearchValidationResult();

        if (!result.isValid()) {
            structuredResult.setValid(false);
            structuredResult.setErrorMessages(result.getErrorMessages());
            structuredResult.setDetailedReport(String.join("; ", result.getErrorMessages()));
        }

        // Встановлюємо можливості пошуку
        if (criteria != null) {
            structuredResult.setCanSearchByPhone(hasText(criteria.getPhone()));
            structuredResult.setCanSearchByName(hasText(criteria.getFirstName()) || hasText(criteria.getLastName()));
            structuredResult.setCanSearchByEmail(hasText(criteria.getEmail()));
        }

        return structuredResult;
    }
}
