package com.aksi.domain.order.statemachine.stage3.validator;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;

/**
 * Validator для конфігурації знижок Stage3 (підетап 3.2)
 * ЕТАП 2.2: Залежать тільки від DTO + ValidationResult
 */
@Component
public class DiscountConfigurationValidator {

    /**
     * Валідує базові параметри знижки
     */
    public ValidationResult validateBasicParams(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
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
     * Валідує тип знижки
     */
    public ValidationResult validateDiscountType(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        DiscountType discountType = dto.getDiscountType();
        if (discountType == null) {
            result.addError("Тип знижки обов'язковий");
            return result;
        }

        // Специфічна валідація для кастомної знижки
        if (discountType == DiscountType.CUSTOM) {
            Integer percentage = dto.getDiscountPercentage();
            if (percentage == null) {
                result.addError("Для кастомної знижки відсоток обов'язковий");
            } else {
                if (percentage < 0) {
                    result.addError("Відсоток знижки не може бути від'ємним");
                } else if (percentage > 100) {
                    result.addError("Відсоток знижки не може перевищувати 100%");
                } else if (percentage == 0) {
                    result.addWarning("Знижка 0% еквівалентна відсутності знижки");
                }
            }

            String description = dto.getDiscountDescription();
            if (description == null || description.trim().isEmpty()) {
                result.addWarning("Рекомендується додати опис для кастомної знижки");
            } else if (description.length() > 500) {
                result.addError("Опис знижки не може перевищувати 500 символів");
            }
        }

        return result;
    }

    /**
     * Валідує суми знижки
     */
    public ValidationResult validateDiscountAmounts(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        BigDecimal originalAmount = dto.getOriginalAmount();
        BigDecimal discountAmount = dto.getDiscountAmount();
        BigDecimal finalAmount = dto.getFinalAmount();

        // Валідація оригінальної суми
        if (originalAmount != null) {
            if (originalAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Оригінальна сума не може бути від'ємною");
            } else if (originalAmount.compareTo(BigDecimal.ZERO) == 0) {
                result.addWarning("Оригінальна сума дорівнює нулю");
            }
        }

        // Валідація суми знижки
        if (discountAmount != null) {
            if (discountAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Сума знижки не може бути від'ємною");
            }

            if (originalAmount != null && discountAmount.compareTo(originalAmount) > 0) {
                result.addError("Сума знижки не може перевищувати оригінальну суму");
            }
        }

        // Валідація фінальної суми
        if (finalAmount != null) {
            if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Фінальна сума не може бути від'ємною");
            }

            // Перевірка математичної коректності
            if (originalAmount != null && discountAmount != null) {
                BigDecimal calculatedFinal = originalAmount.subtract(discountAmount);
                if (finalAmount.compareTo(calculatedFinal) != 0) {
                    result.addError("Фінальна сума не відповідає розрахунку (оригінальна - знижка)");
                }
            }
        }

        return result;
    }

    /**
     * Валідує застосовність знижки до категорій
     */
    public ValidationResult validateDiscountApplicability(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевірка виключених категорій
        if (dto.getExcludedCategoryIds() != null && !dto.getExcludedCategoryIds().isEmpty()) {
            for (UUID excludedId : dto.getExcludedCategoryIds()) {
                if (excludedId == null) {
                    result.addError("ID виключеної категорії не може бути null");
                    break;
                }
            }

            // Якщо є виключені категорії, це може вплинути на знижку
            if (dto.getDiscountType() != null && dto.getDiscountType() != DiscountType.NO_DISCOUNT) {
                result.addWarning("Деякі категорії виключені зі знижки - перевірте фінальні суми");
            }
        }

        return result;
    }

    /**
     * Валідує готовність до завершення
     */
    public ValidationResult validateReadinessForCompletion(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевіряємо всі аспекти
        result.merge(validateBasicParams(dto));
        result.merge(validateDiscountType(dto));
        result.merge(validateDiscountAmounts(dto));
        result.merge(validateDiscountApplicability(dto));

        // Додаткові перевірки готовності
        if (result.isValid()) {
            if (!dto.hasRequiredParameters()) {
                result.addError("Не всі обов'язкові параметри встановлені");
            }

            // Перевірка що розрахунок знижки виконаний
            if (dto.hasDiscount() && dto.getDiscountResponse() == null) {
                result.addWarning("Знижка не була розрахована доменним сервісом");
            }
        }

        return result;
    }

    /**
     * Валідує цілісність даних
     */
    public ValidationResult validateDataIntegrity(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевірка узгодженості між запитом та відповіддю
        if (dto.getDiscountRequest() != null && dto.getDiscountResponse() != null) {
            if (!dto.getDiscountRequest().getOrderId().equals(dto.getOrderId())) {
                result.addError("Order ID в запиті не відповідає Order ID в DTO");
            }

            if (dto.getDiscountRequest().getDiscountType() != dto.getDiscountType()) {
                result.addError("Тип знижки в запиті не відповідає типу в DTO");
            }
        }

        // Перевірка логічності стану
        if (Boolean.TRUE.equals(dto.isDiscountConfigComplete()) && !dto.isReadyForCompletion()) {
            result.addError("Конфігурація помічена як завершена, але не готова до завершення");
        }

        return result;
    }

    /**
     * Комплексна валідація всіх аспектів
     */
    public ValidationResult validateAll(DiscountConfigurationDTO dto) {
        ValidationResult result = ValidationResult.success();

        // Базова валідація
        result.merge(validateBasicParams(dto));

        // Якщо базова валідація провалилася, не продовжуємо
        if (!result.isValid()) {
            return result;
        }

        // Валідація окремих аспектів
        result.merge(validateDiscountType(dto));
        result.merge(validateDiscountAmounts(dto));
        result.merge(validateDiscountApplicability(dto));
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
    public ValidationResult validateMinimal(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        if (dto.getDiscountType() == null) {
            result.addError("Тип знижки обов'язковий");
        }

        return result;
    }

    /**
     * Валідація для конкретного стану
     */
    public ValidationResult validateForState(DiscountConfigurationDTO dto, String stateName) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = switch (stateName) {
            case "DISCOUNT_INITIALIZED" -> validateMinimal(dto);
            case "DISCOUNT_TYPE_SELECTED" -> {
                ValidationResult combined = validateBasicParams(dto);
                combined.merge(validateDiscountType(dto));
                yield combined;
            }
            case "DISCOUNT_CALCULATED" -> validateAll(dto);
            default -> {
                ValidationResult defaultResult = validateAll(dto);
                defaultResult.addWarning("Невідомий стан: " + stateName + ", виконана повна валідація");
                yield defaultResult;
            }
        };

        return result;
    }

    /**
     * Спеціальна валідація для NO_DISCOUNT
     */
    public ValidationResult validateNoDiscount(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації знижки не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.getDiscountType() != DiscountType.NO_DISCOUNT) {
            result.addError("Цей метод валідації призначений тільки для NO_DISCOUNT");
            return result;
        }

        // Для NO_DISCOUNT додаткові параметри не повинні бути встановлені
        if (dto.getDiscountPercentage() != null && dto.getDiscountPercentage() != 0) {
            result.addWarning("Для типу 'без знижки' відсоток повинен бути нулем або null");
        }

        if (dto.getDiscountDescription() != null && !dto.getDiscountDescription().trim().isEmpty()) {
            result.addWarning("Для типу 'без знижки' опис не потрібен");
        }

        return result;
    }
}
