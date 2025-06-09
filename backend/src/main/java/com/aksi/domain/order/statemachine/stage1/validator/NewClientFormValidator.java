package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormValidationError;

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

    // Мапа стратегій валідації для кожного поля
    private final Map<String, Function<NewClientFormDTO, List<NewClientFormValidationError>>> validationStrategies = Map.of(
        "firstName", this::validateFirstName,
        "lastName", this::validateLastName,
        "phone", this::validatePhone,
        "email", this::validateEmail,
        "address", this::validateAddress,
        "sourceDetails", this::validateSourceDetails
    );

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

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
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

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідує обов'язкові поля.
     */
    private void validateRequiredFields(NewClientFormDTO formDTO, List<String> errors) {
        validateRequiredField(formDTO.getLastName(), "Прізвище є обов'язковим полем", errors);
        validateRequiredField(formDTO.getFirstName(), "Ім'я є обов'язковим полем", errors);
        validateRequiredField(formDTO.getPhone(), "Телефон є обов'язковим полем", errors);
    }

    /**
     * Утилітарний метод для валідації обов'язкових полів.
     */
    private void validateRequiredField(String value, String errorMessage, List<String> errors) {
        if (isNullOrEmpty(value)) {
            errors.add(errorMessage);
        }
    }

    /**
     * Валідує формати полів.
     */
    private void validateFieldFormats(NewClientFormDTO formDTO, List<String> errors) {
        validateNameField(formDTO.getLastName(), "Прізвище може містити лише літери, пробіли, дефіси та апострофи (від 2 до 50 символів)", errors);
        validateNameField(formDTO.getFirstName(), "Ім'я може містити лише літери, пробіли, дефіси та апострофи (від 2 до 50 символів)", errors);
        validatePatternField(formDTO.getPhone(), PHONE_PATTERN, "Некоректний формат телефону (від 10 до 15 цифр, може починатися з +)", errors);

        if (formDTO.hasEmail()) {
            validatePatternField(formDTO.getEmail(), EMAIL_PATTERN, "Некоректний формат email", errors);
        }
    }

    /**
     * Утилітарний метод для валідації ім'я/прізвище.
     */
    private void validateNameField(String value, String errorMessage, List<String> errors) {
        if (!isNullOrEmpty(value)) {
            validatePatternField(value, NAME_PATTERN, errorMessage, errors);
        }
    }

    /**
     * Утилітарний метод для валідації полів з регулярними виразами.
     */
    private void validatePatternField(String value, Pattern pattern, String errorMessage, List<String> errors) {
        if (!isNullOrEmpty(value) && !pattern.matcher(value.trim()).matches()) {
            errors.add(errorMessage);
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

    /**
     * Валідує конкретне поле та повертає відповідну помилку з енуму.
     * Оптимізована версія з використанням стратегій.
     */
    public List<NewClientFormValidationError> validateFieldWithEnums(NewClientFormDTO formDTO, String fieldName) {
        if (formDTO == null) {
            return new ArrayList<>();
        }

        Function<NewClientFormDTO, List<NewClientFormValidationError>> strategy = validationStrategies.get(fieldName);
        return strategy != null ? strategy.apply(formDTO) : new ArrayList<>();
    }

    // === СТРАТЕГІЇ ВАЛІДАЦІЇ ===

    private List<NewClientFormValidationError> validateFirstName(NewClientFormDTO formDTO) {
        return validateNameFieldWithEnum(
            formDTO.getFirstName(),
            NewClientFormValidationError.FIRST_NAME_EMPTY,
            NewClientFormValidationError.FIRST_NAME_TOO_SHORT,
            NewClientFormValidationError.FIRST_NAME_INVALID_FORMAT
        );
    }

    private List<NewClientFormValidationError> validateLastName(NewClientFormDTO formDTO) {
        return validateNameFieldWithEnum(
            formDTO.getLastName(),
            NewClientFormValidationError.LAST_NAME_EMPTY,
            NewClientFormValidationError.LAST_NAME_TOO_SHORT,
            NewClientFormValidationError.LAST_NAME_INVALID_FORMAT
        );
    }

    private List<NewClientFormValidationError> validatePhone(NewClientFormDTO formDTO) {
        List<NewClientFormValidationError> errors = new ArrayList<>();
        String phone = formDTO.getPhone();

        if (isNullOrEmpty(phone)) {
            errors.add(NewClientFormValidationError.PHONE_EMPTY);
        } else {
            String trimmedPhone = phone.trim();
            if (trimmedPhone.length() < 10) {
                errors.add(NewClientFormValidationError.PHONE_TOO_SHORT);
            } else if (!PHONE_PATTERN.matcher(trimmedPhone).matches()) {
                errors.add(NewClientFormValidationError.PHONE_INVALID_FORMAT);
            }
        }
        return errors;
    }

    private List<NewClientFormValidationError> validateEmail(NewClientFormDTO formDTO) {
        List<NewClientFormValidationError> errors = new ArrayList<>();

        if (formDTO.hasEmail() && !EMAIL_PATTERN.matcher(formDTO.getEmail().trim()).matches()) {
            errors.add(NewClientFormValidationError.EMAIL_INVALID_FORMAT);
        }
        return errors;
    }

    private List<NewClientFormValidationError> validateAddress(NewClientFormDTO formDTO) {
        List<NewClientFormValidationError> errors = new ArrayList<>();

        if (formDTO.hasAddress() && formDTO.getAddress().length() > 500) {
            errors.add(NewClientFormValidationError.ADDRESS_TOO_LONG);
        }
        return errors;
    }

    private List<NewClientFormValidationError> validateSourceDetails(NewClientFormDTO formDTO) {
        List<NewClientFormValidationError> errors = new ArrayList<>();

        if (formDTO.isOtherInformationSource() && formDTO.needsSourceDetails()) {
            errors.add(NewClientFormValidationError.SOURCE_DETAILS_MISSING);
        } else if (formDTO.getSourceDetails() != null && formDTO.getSourceDetails().length() > 255) {
            errors.add(NewClientFormValidationError.SOURCE_DETAILS_TOO_LONG);
        }
        return errors;
    }

    // === УТИЛІТАРНІ МЕТОДИ ===

    /**
     * Універсальний метод для валідації ім'я/прізвище з енумами.
     */
    private List<NewClientFormValidationError> validateNameFieldWithEnum(
            String value,
            NewClientFormValidationError emptyError,
            NewClientFormValidationError tooShortError,
            NewClientFormValidationError invalidFormatError) {

        List<NewClientFormValidationError> errors = new ArrayList<>();

        if (isNullOrEmpty(value)) {
            errors.add(emptyError);
        } else {
            String trimmedValue = value.trim();
            if (trimmedValue.length() < 2) {
                errors.add(tooShortError);
            } else if (!NAME_PATTERN.matcher(trimmedValue).matches()) {
                errors.add(invalidFormatError);
            }
        }
        return errors;
    }

    /**
     * Утилітарний метод для перевірки null або пустого рядка.
     */
    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}
