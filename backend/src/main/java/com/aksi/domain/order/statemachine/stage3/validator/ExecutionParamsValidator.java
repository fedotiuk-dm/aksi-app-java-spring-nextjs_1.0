package com.aksi.domain.order.statemachine.stage3.validator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;

/**
 * Validator для параметрів виконання Stage3 (підетап 3.1)
 * ЕТАП 2.2: Залежать тільки від DTO + ValidationResult
 */
@Component
public class ExecutionParamsValidator {

    /**
     * Валідує базові параметри виконання
     */
    public ValidationResult validateBasicParams(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Валідація sessionId
        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        // Валідація категорій послуг
        List<UUID> serviceCategoryIds = dto.getServiceCategoryIds();
        if (serviceCategoryIds == null || serviceCategoryIds.isEmpty()) {
            result.addError("Повинна бути вибрана принаймні одна категорія послуг");
        } else {
            for (UUID categoryId : serviceCategoryIds) {
                if (categoryId == null) {
                    result.addError("ID категорії послуг не може бути null");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Валідує тип терміновості
     */
    public ValidationResult validateExpediteType(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.getExpediteType() == null) {
            result.addError("Тип терміновості обов'язковий");
        }

        return result;
    }

    /**
     * Валідує дату виконання
     */
    public ValidationResult validateExecutionDate(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевірка ручної дати
        if (Boolean.TRUE.equals(dto.getUseManualDate())) {
            LocalDate manualDate = dto.getManualExecutionDate();
            if (manualDate == null) {
                result.addError("При використанні ручної дати, дата повинна бути встановлена");
            } else {
                LocalDate today = LocalDate.now();
                if (manualDate.isBefore(today)) {
                    result.addError("Дата виконання не може бути в минулому");
                } else if (manualDate.isEqual(today)) {
                    result.addWarning("Дата виконання встановлена на сьогодні - переконайтеся що це правильно");
                }

                // Перевірка що дата не занадто далеко в майбутньому
                LocalDate maxDate = today.plusMonths(6);
                if (manualDate.isAfter(maxDate)) {
                    result.addWarning("Дата виконання дуже далеко в майбутньому (більше 6 місяців)");
                }
            }
        }

        // Перевірка розрахованої дати
        LocalDateTime effectiveDate = dto.getEffectiveExecutionDate();
        if (effectiveDate != null) {
            LocalDateTime now = LocalDateTime.now();
            if (effectiveDate.isBefore(now)) {
                result.addError("Ефективна дата виконання не може бути в минулому");
            }
        }

        return result;
    }

    /**
     * Валідує готовність до завершення
     */
    public ValidationResult validateReadinessForCompletion(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевіряємо основні параметри
        ValidationResult basicValidation = validateBasicParams(dto);
        result.merge(basicValidation);

        // Перевіряємо тип терміновості
        ValidationResult expediteValidation = validateExpediteType(dto);
        result.merge(expediteValidation);

        // Перевіряємо дату виконання
        ValidationResult dateValidation = validateExecutionDate(dto);
        result.merge(dateValidation);

        // Додаткові перевірки готовності
        if (result.isValid()) {
            if (!dto.hasRequiredParameters()) {
                result.addError("Не всі обов'язкові параметри встановлені");
            }

            // Перевірка що є відповідь від доменного сервісу
            if (dto.getCompletionDateResponse() == null) {
                result.addWarning("Дата виконання не була розрахована доменним сервісом");
            }
        }

        return result;
    }

    /**
     * Валідує цілісність даних
     */
    public ValidationResult validateDataIntegrity(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевірка узгодженості між запитом та відповіддю
        if (dto.getCompletionDateRequest() != null && dto.getCompletionDateResponse() != null) {
            List<UUID> requestCategories = dto.getCompletionDateRequest().getServiceCategoryIds();
            List<UUID> dtoCategories = dto.getServiceCategoryIds();

            if (!equalLists(requestCategories, dtoCategories)) {
                result.addError("Категорії послуг в запиті не відповідають категоріям в DTO");
            }

            if (dto.getCompletionDateRequest().getExpediteType() != dto.getExpediteType()) {
                result.addError("Тип терміновості в запиті не відповідає типу в DTO");
            }
        }

        // Перевірка логічності ручної дати
        if (Boolean.TRUE.equals(dto.getUseManualDate())) {
            LocalDate manualDate = dto.getManualExecutionDate();
            LocalDateTime effectiveDate = dto.getEffectiveExecutionDate();

            if (manualDate != null && effectiveDate != null) {
                LocalDate effectiveLocalDate = effectiveDate.toLocalDate();
                if (!manualDate.equals(effectiveLocalDate)) {
                    result.addWarning("Ручна дата не відповідає ефективній даті виконання");
                }
            }
        }

        return result;
    }

    /**
     * Комплексна валідація всіх аспектів
     */
    public ValidationResult validateAll(ExecutionParamsDTO dto) {
        ValidationResult result = ValidationResult.success();

        // Базова валідація
        result.merge(validateBasicParams(dto));

        // Якщо базова валідація провалилася, не продовжуємо
        if (!result.isValid()) {
            return result;
        }

        // Валідація окремих аспектів
        result.merge(validateExpediteType(dto));
        result.merge(validateExecutionDate(dto));
        result.merge(validateDataIntegrity(dto));

        // Фінальна перевірка готовності
        if (result.isValid()) {
            ValidationResult readinessValidation = validateReadinessForCompletion(dto);
            result.merge(readinessValidation);
        }

        return result;
    }

    /**
     * Швидка валідація для мінімальних вимог
     */
    public ValidationResult validateMinimal(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        if (dto.getServiceCategoryIds() == null || dto.getServiceCategoryIds().isEmpty()) {
            result.addError("Повинна бути вибрана принаймні одна категорія послуг");
        }

        return result;
    }

    /**
     * Валідація для конкретного стану
     */
    public ValidationResult validateForState(ExecutionParamsDTO dto, String stateName) {
        if (dto == null) {
            return ValidationResult.failure("DTO параметрів виконання не може бути null");
        }

        ValidationResult result = switch (stateName) {
            case "PARAMS_INITIALIZED" -> validateMinimal(dto);
            case "DATE_CALCULATION_REQUESTED" -> {
                ValidationResult combined = validateBasicParams(dto);
                combined.merge(validateExpediteType(dto));
                yield combined;
            }
            case "DATE_CALCULATED" -> validateAll(dto);
            default -> {
                ValidationResult defaultResult = validateAll(dto);
                defaultResult.addWarning("Невідомий стан: " + stateName + ", виконана повна валідація");
                yield defaultResult;
            }
        };

        return result;
    }

    /**
     * Утилітний метод для порівняння списків UUID
     */
    private boolean equalLists(List<UUID> list1, List<UUID> list2) {
        if (list1 == null && list2 == null) {
            return true;
        }
        if (list1 == null || list2 == null) {
            return false;
        }
        if (list1.size() != list2.size()) {
            return false;
        }
        return list1.containsAll(list2) && list2.containsAll(list1);
    }
}
