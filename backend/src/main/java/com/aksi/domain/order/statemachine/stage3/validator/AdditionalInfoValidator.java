package com.aksi.domain.order.statemachine.stage3.validator;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;

/**
 * Validator для додаткової інформації Stage3 (підетап 3.4)
 * ЕТАП 2.2: Залежать тільки від DTO + ValidationResult
 */
@Component
public class AdditionalInfoValidator {

    private static final int MAX_TEXT_LENGTH = 1000;
    private static final int WARNING_TEXT_LENGTH = 500;

    /**
     * Валідує базові параметри додаткової інформації
     */
    public ValidationResult validateBasicParams(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Валідація sessionId
        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        // Валідація orderId (може бути null на початкових етапах)
        if (dto.getOrderId() == null) {
            result.addWarning("Order ID не встановлений");
        }

        return result;
    }

    /**
     * Валідує додаткові вимоги
     */
    public ValidationResult validateAdditionalRequirements(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        String additionalRequirements = dto.getAdditionalRequirements();

        if (additionalRequirements != null) {
            // Перевірка довжини
            if (additionalRequirements.length() > MAX_TEXT_LENGTH) {
                result.addError("Додаткові вимоги не можуть перевищувати " + MAX_TEXT_LENGTH + " символів");
            } else if (additionalRequirements.length() > WARNING_TEXT_LENGTH) {
                result.addWarning("Додаткові вимоги досить довгі (" + additionalRequirements.length() + " символів)");
            }

            // Перевірка на порожній текст після trim
            if (additionalRequirements.trim().isEmpty()) {
                result.addWarning("Додаткові вимоги містять тільки пробільні символи");
            }

            // Перевірка на потенційно небезпечний контент
            if (containsSuspiciousContent(additionalRequirements)) {
                result.addWarning("Додаткові вимоги містять потенційно небезпечний контент");
            }
        }

        return result;
    }

    /**
     * Валідує примітки клієнта
     */
    public ValidationResult validateCustomerNotes(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        String customerNotes = dto.getCustomerNotes();

        if (customerNotes != null) {
            // Перевірка довжини
            if (customerNotes.length() > MAX_TEXT_LENGTH) {
                result.addError("Примітки клієнта не можуть перевищувати " + MAX_TEXT_LENGTH + " символів");
            } else if (customerNotes.length() > WARNING_TEXT_LENGTH) {
                result.addWarning("Примітки клієнта досить довгі (" + customerNotes.length() + " символів)");
            }

            // Перевірка на порожній текст після trim
            if (customerNotes.trim().isEmpty()) {
                result.addWarning("Примітки клієнта містять тільки пробільні символи");
            }

            // Перевірка на потенційно небезпечний контент
            if (containsSuspiciousContent(customerNotes)) {
                result.addWarning("Примітки клієнта містять потенційно небезпечний контент");
            }
        }

        return result;
    }

    /**
     * Валідує загальну інформацію
     */
    public ValidationResult validateOverallInfo(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        String additionalRequirements = dto.getAdditionalRequirements();
        String customerNotes = dto.getCustomerNotes();

        // Перевірка що є хоча б щось
        boolean hasRequirements = additionalRequirements != null && !additionalRequirements.trim().isEmpty();
        boolean hasNotes = customerNotes != null && !customerNotes.trim().isEmpty();

        if (!hasRequirements && !hasNotes) {
            result.addWarning("Додаткова інформація не заповнена");
        }

        // Перевірка загальної довжини
        int totalLength = 0;
        if (additionalRequirements != null) {
            totalLength += additionalRequirements.length();
        }
        if (customerNotes != null) {
            totalLength += customerNotes.length();
        }

        if (totalLength > MAX_TEXT_LENGTH * 2) {
            result.addWarning("Загальна довжина додаткової інформації дуже велика (" + totalLength + " символів)");
        }

        // Перевірка на дублювання інформації
        if (hasRequirements && hasNotes && additionalRequirements != null && customerNotes != null) {
            String reqTrimmed = additionalRequirements.trim().toLowerCase();
            String notesTrimmed = customerNotes.trim().toLowerCase();

            if (reqTrimmed.equals(notesTrimmed)) {
                result.addWarning("Додаткові вимоги та примітки клієнта ідентичні");
            } else if (reqTrimmed.contains(notesTrimmed) || notesTrimmed.contains(reqTrimmed)) {
                result.addWarning("Додаткові вимоги та примітки клієнта містять дублюючу інформацію");
            }
        }

        return result;
    }

    /**
     * Валідує готовність до завершення
     */
    public ValidationResult validateReadinessForCompletion(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевіряємо всі аспекти
        result.merge(validateBasicParams(dto));
        result.merge(validateAdditionalRequirements(dto));
        result.merge(validateCustomerNotes(dto));
        result.merge(validateOverallInfo(dto));

        // Додаткові перевірки готовності
        if (result.isValid()) {
            if (!dto.hasRequiredParameters()) {
                result.addError("Не всі обов'язкові параметри встановлені");
            }

            // Для додаткової інформації немає обов'язкових полів, тому завжди готово
            // Але можемо додати логічні перевірки
        }

        return result;
    }

    /**
     * Валідує цілісність даних
     */
    public ValidationResult validateDataIntegrity(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевірка узгодженості між запитом та відповіддю
        if (dto.getAdditionalInfoRequest() != null && dto.getAdditionalInfoResponse() != null) {
            UUID requestOrderId = dto.getAdditionalInfoRequest().getOrderId();
            UUID dtoOrderId = dto.getOrderId();

            if (requestOrderId != null && dtoOrderId != null && !requestOrderId.equals(dtoOrderId)) {
                result.addError("Order ID в запиті не відповідає Order ID в DTO");
            }
        }

        // Перевірка логічності стану
        if (Boolean.TRUE.equals(dto.isAdditionalInfoComplete()) && !dto.isReadyForCompletion()) {
            result.addError("Додаткова інформація помічена як завершена, але не готова до завершення");
        }

        // Перевірка узгодженості булевих індикаторів
        boolean hasRequirements = dto.getAdditionalRequirements() != null &&
                                !dto.getAdditionalRequirements().trim().isEmpty();
        boolean hasNotes = dto.getCustomerNotes() != null &&
                          !dto.getCustomerNotes().trim().isEmpty();

        if (Boolean.TRUE.equals(dto.getHasAdditionalRequirements()) && !hasRequirements) {
            result.addWarning("Індикатор додаткових вимог встановлений, але текст відсутній");
        }

        if (Boolean.TRUE.equals(dto.getHasCustomerNotes()) && !hasNotes) {
            result.addWarning("Індикатор приміток клієнта встановлений, але текст відсутній");
        }

        return result;
    }

    /**
     * Комплексна валідація всіх аспектів
     */
    public ValidationResult validateAll(AdditionalInfoDTO dto) {
        ValidationResult result = ValidationResult.success();

        // Базова валідація
        result.merge(validateBasicParams(dto));

        // Якщо базова валідація провалилася, не продовжуємо
        if (!result.isValid()) {
            return result;
        }

        // Валідація окремих аспектів
        result.merge(validateAdditionalRequirements(dto));
        result.merge(validateCustomerNotes(dto));
        result.merge(validateOverallInfo(dto));
        result.merge(validateDataIntegrity(dto));

        // Фінальна перевірка готовності (для додаткової інформації завжди успішна)
        ValidationResult readinessValidation = validateReadinessForCompletion(dto);
        result.merge(readinessValidation);

        return result;
    }

    /**
     * Швидка валідація для мінімальних вимог
     */
    public ValidationResult validateMinimal(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        // Для додаткової інформації мінімальні вимоги дуже прості
        return result;
    }

    /**
     * Валідація для конкретного стану
     */
    public ValidationResult validateForState(AdditionalInfoDTO dto, String stateName) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = switch (stateName) {
            case "INFO_INITIALIZED" -> validateMinimal(dto);
            case "INFO_ENTERED" -> validateAll(dto);
            case "INFO_COMPLETED" -> validateAll(dto);
            default -> {
                ValidationResult defaultResult = validateAll(dto);
                defaultResult.addWarning("Невідомий стан: " + stateName + ", виконана повна валідація");
                yield defaultResult;
            }
        };

        return result;
    }

    /**
     * Спеціальна валідація для порожньої додаткової інформації
     */
    public ValidationResult validateEmptyInfo(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.hasAnyInformation()) {
            result.addWarning("Цей метод валідації призначений для порожньої додаткової інформації");
            return result;
        }

        // Перевірка що дійсно все порожнє
        if (dto.getAdditionalRequirements() != null && !dto.getAdditionalRequirements().trim().isEmpty()) {
            result.addError("Додаткові вимоги не порожні");
        }

        if (dto.getCustomerNotes() != null && !dto.getCustomerNotes().trim().isEmpty()) {
            result.addError("Примітки клієнта не порожні");
        }

        if (Boolean.TRUE.equals(dto.getHasAdditionalRequirements())) {
            result.addError("Індикатор додаткових вимог встановлений при порожній інформації");
        }

        if (Boolean.TRUE.equals(dto.getHasCustomerNotes())) {
            result.addError("Індикатор приміток клієнта встановлений при порожній інформації");
        }

        return result;
    }

    /**
     * Валідація тільки додаткових вимог
     */
    public ValidationResult validateOnlyRequirements(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = validateAdditionalRequirements(dto);

        // Перевірка що примітки клієнта порожні
        String customerNotes = dto.getCustomerNotes();
        if (customerNotes != null && !customerNotes.trim().isEmpty()) {
            result.addWarning("Цей метод валідації призначений тільки для додаткових вимог, але примітки клієнта також заповнені");
        }

        return result;
    }

    /**
     * Валідація тільки приміток клієнта
     */
    public ValidationResult validateOnlyNotes(AdditionalInfoDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO додаткової інформації не може бути null");
        }

        ValidationResult result = validateCustomerNotes(dto);

        // Перевірка що додаткові вимоги порожні
        String additionalRequirements = dto.getAdditionalRequirements();
        if (additionalRequirements != null && !additionalRequirements.trim().isEmpty()) {
            result.addWarning("Цей метод валідації призначений тільки для приміток клієнта, але додаткові вимоги також заповнені");
        }

        return result;
    }

    /**
     * Утилітний метод для перевірки підозрілого контенту
     */
    private boolean containsSuspiciousContent(String text) {
        if (text == null) {
            return false;
        }

        String lowerText = text.toLowerCase();

        // Прості перевірки на потенційно небезпечний контент
        String[] suspiciousPatterns = {
            "<script", "javascript:", "eval(", "document.", "window.",
            "onclick=", "onerror=", "onload=", "<iframe", "<object"
        };

        for (String pattern : suspiciousPatterns) {
            if (lowerText.contains(pattern)) {
                return true;
            }
        }

        return false;
    }
}
