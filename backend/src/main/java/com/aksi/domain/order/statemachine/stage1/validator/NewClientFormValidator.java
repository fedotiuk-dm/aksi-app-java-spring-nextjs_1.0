package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;

/**
 * Валідатор для форми створення нового клієнта.
 * Перевіряє всі поля форми на відповідність бізнес-правилам.
 */
@Component
public class NewClientFormValidator {

    // Регулярні вирази для валідації
    private static final Pattern NAME_PATTERN = Pattern.compile("^[\\p{L}\\s\\-']{2,50}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9]{10,15}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");

    /**
     * Валідує форму нового клієнта.
     */
    public ValidationResult validate(NewClientFormDTO formDTO) {
        List<String> errors = new ArrayList<>();

        if (formDTO == null) {
            errors.add("Дані форми не можуть бути пустими");
            return ValidationResult.failure(errors);
        }

        // Валідація обов'язкових полів
        validateRequiredFields(formDTO, errors);

        // Валідація форматів полів (тільки якщо поля заповнені)
        validateFieldFormats(formDTO, errors);

        // Валідація бізнес-правил
        validateBusinessRules(formDTO, errors);

        if (errors.isEmpty()) {
            return ValidationResult.success();
        } else {
            return ValidationResult.failure(errors);
        }
    }

    /**
     * Валідує тільки обов'язкові поля.
     */
    public ValidationResult validateRequiredFields(NewClientFormDTO formDTO) {
        List<String> errors = new ArrayList<>();

        if (formDTO != null) {
            validateRequiredFields(formDTO, errors);
        } else {
            errors.add("Дані форми не можуть бути пустими");
        }

        if (errors.isEmpty()) {
            return ValidationResult.success();
        } else {
            return ValidationResult.failure(errors);
        }
    }

    /**
     * Валідує обов'язкові поля.
     */
    private void validateRequiredFields(NewClientFormDTO formDTO, List<String> errors) {
        // Прізвище
        if (formDTO.getLastName() == null || formDTO.getLastName().trim().isEmpty()) {
            errors.add("Прізвище є обов'язковим полем");
        }

        // Ім'я
        if (formDTO.getFirstName() == null || formDTO.getFirstName().trim().isEmpty()) {
            errors.add("Ім'я є обов'язковим полем");
        }

        // Телефон
        if (formDTO.getPhone() == null || formDTO.getPhone().trim().isEmpty()) {
            errors.add("Телефон є обов'язковим полем");
        }
    }

    /**
     * Валідує формати полів.
     */
    private void validateFieldFormats(NewClientFormDTO formDTO, List<String> errors) {
        // Валідація прізвища
        if (formDTO.getLastName() != null && !formDTO.getLastName().trim().isEmpty()) {
            if (!NAME_PATTERN.matcher(formDTO.getLastName().trim()).matches()) {
                errors.add("Прізвище може містити лише літери, пробіли, дефіси та апострофи (від 2 до 50 символів)");
            }
        }

        // Валідація імені
        if (formDTO.getFirstName() != null && !formDTO.getFirstName().trim().isEmpty()) {
            if (!NAME_PATTERN.matcher(formDTO.getFirstName().trim()).matches()) {
                errors.add("Ім'я може містити лише літери, пробіли, дефіси та апострофи (від 2 до 50 символів)");
            }
        }

        // Валідація телефону
        if (formDTO.getPhone() != null && !formDTO.getPhone().trim().isEmpty()) {
            if (!PHONE_PATTERN.matcher(formDTO.getPhone().trim()).matches()) {
                errors.add("Некоректний формат телефону (від 10 до 15 цифр, може починатися з +)");
            }
        }

        // Валідація email (якщо заповнений)
        if (formDTO.hasEmail()) {
            if (!EMAIL_PATTERN.matcher(formDTO.getEmail().trim()).matches()) {
                errors.add("Некоректний формат email");
            }
        }
    }

    /**
     * Валідує бізнес-правила.
     */
    private void validateBusinessRules(NewClientFormDTO formDTO, List<String> errors) {
        // Якщо вказано "Інше" як джерело, має бути вказано опис
        if (formDTO.isOtherInformationSource() && formDTO.needsSourceDetails()) {
            errors.add("При виборі 'Інше' джерело інформації необхідно вказати деталі");
        }

        // Перевірка довжини опису джерела
        if (formDTO.getSourceDetails() != null && formDTO.getSourceDetails().length() > 255) {
            errors.add("Опис джерела інформації не може перевищувати 255 символів");
        }

        // Перевірка довжини адреси
        if (formDTO.hasAddress() && formDTO.getAddress().length() > 500) {
            errors.add("Адреса не може перевищувати 500 символів");
        }
    }

    /**
     * Перевіряє, чи форма готова для відправки.
     */
    public boolean isReadyForSubmission(NewClientFormDTO formDTO) {
        ValidationResult result = validate(formDTO);
        return result.isValid();
    }

    /**
     * Перевіряє базову валідність форми (тільки обов'язкові поля).
     */
    public boolean hasBasicValidation(NewClientFormDTO formDTO) {
        ValidationResult result = validateRequiredFields(formDTO);
        return result.isValid();
    }
}
