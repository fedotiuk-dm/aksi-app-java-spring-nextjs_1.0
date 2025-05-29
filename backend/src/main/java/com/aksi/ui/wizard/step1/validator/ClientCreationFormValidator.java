package com.aksi.ui.wizard.step1.validator;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для форми створення клієнта.
 * Відповідає за валідацію полів форми згідно з бізнес-правилами.
 */
@Component
@Slf4j
public class ClientCreationFormValidator {

    /**
     * Валідувати обов'язкові поля.
     */
    public boolean validateRequiredFields(String lastName, String firstName, String phone) {
        boolean isValid = isFieldValid(lastName) && isFieldValid(firstName) && isFieldValid(phone);

        if (!isValid) {
            log.warn("Validation failed for required fields: lastName={}, firstName={}, phone={}",
                lastName != null, firstName != null, phone != null);
        }

        return isValid;
    }

    /**
     * Валідувати формат телефону.
     */
    public boolean validatePhoneFormat(String phone) {
        if (!isFieldValid(phone)) {
            return false;
        }

        // Базова валідація формату телефону
        String cleanPhone = phone.replaceAll("[\\s\\-\\(\\)\\+]", "");
        boolean isValid = cleanPhone.matches("\\d{10,15}");

        if (!isValid) {
            log.warn("Invalid phone format: {}", phone);
        }

        return isValid;
    }

    /**
     * Валідувати формат email.
     */
    public boolean validateEmailFormat(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Email не обов'язковий
        }

        boolean isValid = email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");

        if (!isValid) {
            log.warn("Invalid email format: {}", email);
        }

        return isValid;
    }

    /**
     * Валідувати довжину текстових полів.
     */
    public boolean validateFieldLength(String value, int maxLength) {
        if (value == null) {
            return true;
        }

        boolean isValid = value.length() <= maxLength;

        if (!isValid) {
            log.warn("Field length validation failed: length={}, maxAllowed={}", value.length(), maxLength);
        }

        return isValid;
    }

    /**
     * Валідувати що custom source details заповнені, якщо вибрано "Інше".
     */
    public boolean validateCustomSourceDetails(String informationSource, String customDetails) {
        if (!"Інше".equals(informationSource)) {
            return true;
        }

        boolean isValid = isFieldValid(customDetails);

        if (!isValid) {
            log.warn("Custom source details required when 'Other' is selected");
        }

        return isValid;
    }

    /**
     * Комплексна валідація всієї форми.
     */
    public ValidationResult validateCompleteForm(String lastName, String firstName, String phone,
                                                String email, String address, String informationSource,
                                                String customDetails) {
        ValidationResult result = new ValidationResult();

        // Обов'язкові поля
        if (!validateRequiredFields(lastName, firstName, phone)) {
            result.addError("Прізвище, ім'я та телефон є обов'язковими полями");
        }

        // Формат телефону
        if (!validatePhoneFormat(phone)) {
            result.addError("Невірний формат телефону");
        }

        // Формат email
        if (!validateEmailFormat(email)) {
            result.addError("Невірний формат email");
        }

        // Довжина полів
        if (!validateFieldLength(lastName, 50)) {
            result.addError("Прізвище не може бути довше 50 символів");
        }
        if (!validateFieldLength(firstName, 50)) {
            result.addError("Ім'я не може бути довше 50 символів");
        }
        if (!validateFieldLength(address, 200)) {
            result.addError("Адреса не може бути довше 200 символів");
        }

        // Custom source details
        if (!validateCustomSourceDetails(informationSource, customDetails)) {
            result.addError("Потрібно вказати деталі для джерела 'Інше'");
        }

        log.debug("Form validation completed: isValid={}, errorCount={}",
            result.isValid(), result.getErrors().size());

        return result;
    }

    private boolean isFieldValid(String field) {
        return field != null && !field.trim().isEmpty();
    }
}
