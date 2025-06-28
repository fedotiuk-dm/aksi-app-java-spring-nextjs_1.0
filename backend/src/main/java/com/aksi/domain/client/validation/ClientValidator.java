package com.aksi.domain.client.validation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.exception.ClientValidationException;

/**
 * Валідатор для бізнес-правил клієнтів.
 * Містить додаткову валідацію поверх JPA аннотацій.
 */
@Component
public class ClientValidator {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+380\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    /**
     * Валідація клієнта перед створенням
     */
    public void validateForCreation(ClientEntity client) {
        Map<String, List<String>> errors = new HashMap<>();

        validateBasicFields(client, errors);
        validatePhoneFormat(client.getPhone(), errors);
        validateEmailFormat(client.getEmail(), errors);
        validateCommunicationMethods(client, errors);

        if (!errors.isEmpty()) {
            throw new ClientValidationException("Помилки валідації при створенні клієнта", errors);
        }
    }

    /**
     * Валідація клієнта перед оновленням
     */
    public void validateForUpdate(ClientEntity client) {
        Map<String, List<String>> errors = new HashMap<>();

        validateBasicFields(client, errors);
        validatePhoneFormat(client.getPhone(), errors);
        validateEmailFormat(client.getEmail(), errors);
        validateCommunicationMethods(client, errors);

        if (!errors.isEmpty()) {
            throw new ClientValidationException("Помилки валідації при оновленні клієнта", errors);
        }
    }

    /**
     * Валідація номера телефону
     */
    public void validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new ClientValidationException("phone", "Номер телефону обов'язковий");
        }

        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw new ClientValidationException("phone",
                "Номер телефону повинен бути у форматі +380XXXXXXXXX");
        }
    }

    /**
     * Валідація email (якщо вказаний)
     */
    public void validateEmail(String email) {
        if (email != null && !email.trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new ClientValidationException("email", "Некоректний формат email");
            }
        }
    }

    private void validateBasicFields(ClientEntity client, Map<String, List<String>> errors) {
        // Ім'я
        if (client.getFirstName() == null || client.getFirstName().trim().isEmpty()) {
            addError(errors, "firstName", "Ім'я клієнта обов'язкове");
        } else if (client.getFirstName().trim().length() < 2) {
            addError(errors, "firstName", "Ім'я повинно містити мінімум 2 символи");
        } else if (client.getFirstName().trim().length() > 50) {
            addError(errors, "firstName", "Ім'я не може перевищувати 50 символів");
        }

        // Прізвище
        if (client.getLastName() == null || client.getLastName().trim().isEmpty()) {
            addError(errors, "lastName", "Прізвище клієнта обов'язкове");
        } else if (client.getLastName().trim().length() < 2) {
            addError(errors, "lastName", "Прізвище повинно містити мінімум 2 символи");
        } else if (client.getLastName().trim().length() > 50) {
            addError(errors, "lastName", "Прізвище не може перевищувати 50 символів");
        }

        // Примітки
        if (client.getNotes() != null && client.getNotes().length() > 500) {
            addError(errors, "notes", "Примітки не можуть перевищувати 500 символів");
        }
    }

    private void validatePhoneFormat(String phone, Map<String, List<String>> errors) {
        if (phone == null || phone.trim().isEmpty()) {
            addError(errors, "phone", "Номер телефону обов'язковий");
            return;
        }

        if (!PHONE_PATTERN.matcher(phone).matches()) {
            addError(errors, "phone", "Номер телефону повинен бути у форматі +380XXXXXXXXX");
        }
    }

    private void validateEmailFormat(String email, Map<String, List<String>> errors) {
        if (email != null && !email.trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                addError(errors, "email", "Некоректний формат email");
            }
        }
    }

    private void validateCommunicationMethods(ClientEntity client, Map<String, List<String>> errors) {
        List<CommunicationMethodType> methods = client.getCommunicationMethods();

        if (methods != null && !methods.isEmpty()) {
            // Якщо обрано EMAIL, то email повинен бути вказаний
            if (methods.contains(CommunicationMethodType.EMAIL)) {
                if (client.getEmail() == null || client.getEmail().trim().isEmpty()) {
                    addError(errors, "communicationMethods",
                        "При виборі EMAIL як способу зв'язку, email адреса обов'язкова");
                }
            }

            // Перевірка на дублікати
            if (methods.size() != methods.stream().distinct().count()) {
                addError(errors, "communicationMethods",
                    "Способи зв'язку не повинні дублюватися");
            }
        }
    }

    private void addError(Map<String, List<String>> errors, String field, String error) {
        errors.computeIfAbsent(field, k -> new ArrayList<>()).add(error);
    }

    /**
     * Перевірка чи рядок є валідним українським іменем/прізвищем
     */
    public boolean isValidUkrainianName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }

        // Українські літери, апостроф, дефіс та пробіл
        Pattern ukrainianNamePattern = Pattern.compile("^[А-ЯІЇЄҐа-яіїєґ\\s'-]+$");
        return ukrainianNamePattern.matcher(name.trim()).matches() &&
               name.trim().length() >= 2 &&
               name.trim().length() <= 50;
    }

    /**
     * Нормалізація імені (перша літера велика, решта малі)
     */
    public String normalizeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return name;
        }

        String trimmed = name.trim();
        return trimmed.substring(0, 1).toUpperCase() +
               (trimmed.length() > 1 ? trimmed.substring(1).toLowerCase() : "");
    }

    /**
     * Нормалізація номера телефону
     */
    public String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }

        // Видаляємо всі не-цифри
        String digits = phone.replaceAll("\\D", "");

        // Якщо починається з 380, додаємо +
        if (digits.startsWith("380") && digits.length() == 12) {
            return "+" + digits;
        }

        // Якщо починається з 0, замінюємо на +380
        if (digits.startsWith("0") && digits.length() == 10) {
            return "+380" + digits.substring(1);
        }

        return phone; // Повертаємо оригінал якщо не можемо нормалізувати
    }
}
