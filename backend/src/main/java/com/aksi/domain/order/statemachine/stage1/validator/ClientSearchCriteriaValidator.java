package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;

/**
 * Валідатор для критеріїв пошуку клієнта в етапі 1.1.
 * Відповідає тільки за валідацію DTO критеріїв пошуку.
 */
@Component
public class ClientSearchCriteriaValidator {

    /**
     * Мінімальна довжина пошукового терміну.
     */
    private static final int MIN_SEARCH_TERM_LENGTH = 2;

    /**
     * Максимальна довжина пошукового терміну.
     */
    private static final int MAX_SEARCH_TERM_LENGTH = 100;

    /**
     * Валідує критерії пошуку клієнта.
     */
    public ValidationResult validate(ClientSearchCriteriaDTO criteria) {
        if (criteria == null) {
            return ValidationResult.failure("Критерії пошуку не можуть бути null");
        }

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // Перевірка наявності критеріїв пошуку
        if (!criteria.hasSearchCriteria()) {
            errors.add("Потрібно вказати хоча б один критерій пошуку");
            return ValidationResult.failure(errors);
        }

        // Валідація загального терміну пошуку
        if (hasText(criteria.getGeneralSearchTerm())) {
            validateSearchTerm(criteria.getGeneralSearchTerm(), "Загальний термін пошуку", errors);
        }

        // Валідація прізвища
        if (hasText(criteria.getLastName())) {
            validateName(criteria.getLastName(), "Прізвище", errors);
        }

        // Валідація імені
        if (hasText(criteria.getFirstName())) {
            validateName(criteria.getFirstName(), "Ім'я", errors);
        }

        // Валідація телефону
        if (hasText(criteria.getPhone())) {
            validatePhone(criteria.getPhone(), errors);
        }

        // Валідація email
        if (hasText(criteria.getEmail())) {
            validateEmail(criteria.getEmail(), errors);
        }

        // Валідація адреси
        if (hasText(criteria.getAddress())) {
            validateAddress(criteria.getAddress(), errors);
        }

        // Перевірка комбінації критеріїв
        validateCriteriaCombination(criteria, warnings);

        return errors.isEmpty() ?
            (warnings.isEmpty() ? ValidationResult.success() : ValidationResult.successWithWarnings(warnings)) :
            ValidationResult.failure(errors);
    }

    /**
     * Валідує пошуковий термін.
     */
    private void validateSearchTerm(String term, String fieldName, List<String> errors) {
        if (term.length() < MIN_SEARCH_TERM_LENGTH) {
            errors.add(fieldName + " повинен містити мінімум " + MIN_SEARCH_TERM_LENGTH + " символи");
        }
        if (term.length() > MAX_SEARCH_TERM_LENGTH) {
            errors.add(fieldName + " не може містити більше " + MAX_SEARCH_TERM_LENGTH + " символів");
        }
    }

    /**
     * Валідує ім'я або прізвище.
     */
    private void validateName(String name, String fieldName, List<String> errors) {
        validateSearchTerm(name, fieldName, errors);

        if (!name.matches("^[а-яА-ЯёЁa-zA-Z\\s'-]+$")) {
            errors.add(fieldName + " може містити тільки літери, пробіли, дефіс та апостроф");
        }
    }

    /**
     * Валідує телефон.
     */
    private void validatePhone(String phone, List<String> errors) {
        String cleanPhone = phone.replaceAll("[\\s\\-\\(\\)\\+]", "");

        if (cleanPhone.length() < 10) {
            errors.add("Телефон повинен містити мінімум 10 цифр");
        }

        if (!cleanPhone.matches("^\\d+$")) {
            errors.add("Телефон може містити тільки цифри та символи форматування");
        }
    }

    /**
     * Валідує email.
     */
    private void validateEmail(String email, List<String> errors) {
        if (!email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$")) {
            errors.add("Email має неправильний формат");
        }
    }

    /**
     * Валідує адресу.
     */
    private void validateAddress(String address, List<String> errors) {
        validateSearchTerm(address, "Адреса", errors);
    }

    /**
     * Валідує комбінацію критеріїв та додає попередження.
     */
    private void validateCriteriaCombination(ClientSearchCriteriaDTO criteria, List<String> warnings) {
        // Якщо вказано і загальний термін, і специфічні критерії
        if (hasText(criteria.getGeneralSearchTerm()) && criteria.hasSpecificCriteria()) {
            warnings.add("Загальний пошук буде ігнорований, оскільки вказані специфічні критерії");
        }

        // Якщо вказано тільки email без інших критеріїв
        if (hasText(criteria.getEmail()) &&
            !hasText(criteria.getLastName()) &&
            !hasText(criteria.getFirstName()) &&
            !hasText(criteria.getPhone())) {
            warnings.add("Пошук тільки за email може дати неточні результати");
        }
    }

    /**
     * Перевіряє чи рядок не порожній.
     */
    private boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }
}
