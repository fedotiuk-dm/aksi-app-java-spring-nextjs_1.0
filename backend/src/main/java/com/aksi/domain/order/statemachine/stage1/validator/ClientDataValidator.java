package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для даних клієнта в Order Wizard
 * Винесено з Guards для спрощення коду
 */
@Component
@Slf4j
public class ClientDataValidator {

    // Регекс для українських номерів телефонів
    private static final Pattern UKRAINIAN_PHONE_PATTERN = Pattern.compile(
        "^(\\+38|38|8)?[\\s\\-]?\\(?0?(39|50|63|66|67|68|91|92|93|94|95|96|97|98|99|73|89)\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}$"
    );

    // Регекс для перевірки імен
    private static final Pattern NAME_PATTERN = Pattern.compile("^[\\p{L}\\s\\-']{2,50}$");

    // Регекс для email
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    /**
     * Валідує дані клієнта та повертає список помилок
     *
     * @param client дані клієнта для валідації
     * @return список помилок валідації (порожній якщо все валідно)
     */
    public ValidationResult validate(ClientResponse client) {
        List<String> errors = new ArrayList<>();

        if (client == null) {
            return ValidationResult.invalid("Дані клієнта не передано");
        }

        // Валідація прізвища
        if (!isValidName(client.getLastName())) {
            errors.add("Прізвище обов'язкове і повинно містити від 2 до 50 символів");
        }

        // Валідація імені
        if (!isValidName(client.getFirstName())) {
            errors.add("Ім'я обов'язкове і повинно містити від 2 до 50 символів");
        }

        // Валідація телефону (обов'язкове поле)
        if (!isValidUkrainianPhone(client.getPhone())) {
            errors.add("Номер телефону обов'язковий і повинен відповідати українському формату");
        }

        // Валідація email (необов'язкове, але якщо вказано - повинно бути коректним)
        if (client.getEmail() != null && !client.getEmail().trim().isEmpty()) {
            if (!isValidEmail(client.getEmail())) {
                errors.add("Email має некоректний формат");
            }
        }

        return errors.isEmpty() ? ValidationResult.valid() : ValidationResult.invalid(errors);
    }

    /**
     * Перевіряє чи є клієнт новим (без ID) чи існуючим
     */
    public boolean isNewClient(ClientResponse client) {
        return client != null && client.getId() == null;
    }

    /**
     * Перевіряє коректність імені/прізвища
     */
    private boolean isValidName(String name) {
        return name != null &&
               !name.trim().isEmpty() &&
               NAME_PATTERN.matcher(name.trim()).matches();
    }

    /**
     * Перевіряє коректність українського номеру телефону
     */
    private boolean isValidUkrainianPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }

        String cleanPhone = phone.replaceAll("[\\s\\-\\(\\)]", "");
        return UKRAINIAN_PHONE_PATTERN.matcher(cleanPhone).matches();
    }

    /**
     * Перевіряє коректність email
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Email не обов'язковий
        }

        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Результат валідації
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        private ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors != null ? errors : new ArrayList<>();
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, new ArrayList<>());
        }

        public static ValidationResult invalid(String error) {
            return new ValidationResult(false, List.of(error));
        }

        public static ValidationResult invalid(List<String> errors) {
            return new ValidationResult(false, errors);
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public String getFirstError() {
            return errors.isEmpty() ? null : errors.get(0);
        }
    }
}
