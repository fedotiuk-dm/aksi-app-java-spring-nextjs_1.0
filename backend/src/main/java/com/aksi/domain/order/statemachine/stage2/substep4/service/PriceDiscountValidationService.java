package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.validator.PriceDiscountValidator;
import com.aksi.domain.order.statemachine.stage2.substep4.validator.ValidationResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Спрощений сервіс для валідації підетапу 2.4.
 * Фокусується на валідації даних та інтеграції з Guards через єдині методи.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceDiscountValidationService {

    private final PriceDiscountValidator priceDiscountValidator;
    private final PriceDiscountStateService stateService;
    private final PriceDiscountResultFactory resultFactory;

    // === ОСНОВНІ МЕТОДИ ВАЛІДАЦІЇ ===

    /**
     * Валідація базових даних для розрахунку ціни.
     */
    public ValidationResult validateBasicCalculationData(PriceDiscountDTO data) {
        log.debug("Валідація базових даних для розрахунку ціни");
        if (data == null) {
            return ValidationResult.invalid("Дані відсутні");
        }
        return priceDiscountValidator.validateBasicCalculationData(data);
    }

    /**
     * Валідація модифікаторів.
     */
    public ValidationResult validateModifiers(PriceDiscountDTO data) {
        log.debug("Валідація модифікаторів");
        if (data == null) {
            return ValidationResult.invalid("Дані відсутні");
        }
        return priceDiscountValidator.validateModifiers(data);
    }

    /**
     * Валідація результату розрахунку.
     */
    public ValidationResult validateCalculationResult(PriceDiscountDTO data) {
        log.debug("Валідація результату розрахунку");
        if (data == null) {
            return ValidationResult.invalid("Дані відсутні");
        }
        return priceDiscountValidator.validateCalculationResult(data);
    }

    /**
     * Повна валідація всіх даних підетапу.
     */
    public ValidationResult validateAll(PriceDiscountDTO data) {
        log.debug("Повна валідація всіх даних підетапу");
        if (data == null) {
            return ValidationResult.invalid("Дані відсутні");
        }
        return priceDiscountValidator.validateAll(data);
    }

    // === МЕТОДИ З RESULT DTO ===

    /**
     * Валідація з створенням результату для UI.
     */
    public SubstepResultDTO validateWithResult(UUID sessionId, ValidationOperation operation) {
        try {
            PriceDiscountDTO data = stateService.getData(sessionId);
            PriceDiscountState currentState = stateService.getCurrentState(sessionId);

            ValidationResult result = operation.validate(data);

            return resultFactory.createValidationResult(sessionId, currentState, data,
                result.isValid(), result.isValid() ? "Валідація пройшла успішно" : result.getFirstError());

        } catch (Exception e) {
            log.error("Помилка при валідації для сесії {}: {}", sessionId, e.getMessage(), e);
            return resultFactory.createCriticalErrorResult(sessionId, e.getMessage());
        }
    }

    /**
     * Валідація базових даних з результатом.
     */
    public SubstepResultDTO validateBasicDataWithResult(UUID sessionId) {
        return validateWithResult(sessionId, this::validateBasicCalculationData);
    }

    /**
     * Валідація модифікаторів з результатом.
     */
    public SubstepResultDTO validateModifiersWithResult(UUID sessionId) {
        return validateWithResult(sessionId, this::validateModifiers);
    }

    /**
     * Повна валідація з результатом.
     */
    public SubstepResultDTO validateAllWithResult(UUID sessionId) {
        return validateWithResult(sessionId, this::validateAll);
    }

    // === СПРОЩЕНІ МЕТОДИ ДЛЯ GUARDS ===

    /**
     * Універсальний метод валідації для Guards.
     * Замінює всі окремі методи isReadyFor*.
     */
    public boolean isValidForGuard(UUID sessionId, GuardValidationType validationType) {
        try {
            PriceDiscountDTO data = stateService.getData(sessionId);
            if (data == null) {
                log.debug("Валідація {} не пройшла: дані відсутні", validationType);
                return false;
            }

            boolean isValid = switch (validationType) {
                case BASIC_CALCULATION -> priceDiscountValidator.isReadyForBaseCalculation(data);
                case MODIFIERS_SELECTION -> isReadyForModifiersSelection(data);
                case FINAL_CALCULATION -> priceDiscountValidator.isReadyForFinalCalculation(data);
                case SUBSTEP_COMPLETION -> priceDiscountValidator.isSubstepCompleted(data);
                case DATA_VALIDITY -> validateAll(data).isValid();
                case NO_CALCULATION_ERRORS -> !data.isHasCalculationErrors();
            };

            log.debug("Валідація {} для сесії {}: {}", validationType, sessionId, isValid);
            return isValid;

        } catch (Exception e) {
            log.error("Помилка при валідації {} для сесії {}: {}", validationType, sessionId, e.getMessage());
            return false;
        }
    }

    /**
     * Отримання повідомлення про помилку для Guards.
     */
    public String getValidationErrorMessage(UUID sessionId) {
        try {
            PriceDiscountDTO data = stateService.getData(sessionId);
            if (data == null) {
                return "Дані відсутні";
            }

            // Перевіряємо помилки розрахунку
            if (data.isHasCalculationErrors() && data.getErrorMessage() != null) {
                return data.getErrorMessage();
            }

            // Перевіряємо загальну валідність
            ValidationResult result = validateAll(data);
            if (!result.isValid()) {
                return result.getFirstError();
            }

            return null;

        } catch (Exception e) {
            log.error("Помилка при отриманні повідомлення для сесії {}: {}", sessionId, e.getMessage());
            return "Помилка валідації: " + e.getMessage();
        }
    }

    // === PRIVATE МЕТОДИ ===

    /**
     * Перевірка готовності до вибору модифікаторів.
     */
    private boolean isReadyForModifiersSelection(PriceDiscountDTO data) {
        return priceDiscountValidator.isReadyForBaseCalculation(data) &&
               data.getCalculationResponse() != null &&
               data.getBasePrice() != null;
    }

    // === ЕНУМИ ТА ІНТЕРФЕЙСИ ===

    /**
     * Типи валідації для Guards.
     */
    public enum GuardValidationType {
        BASIC_CALCULATION("Готовність до базового розрахунку"),
        MODIFIERS_SELECTION("Готовність до вибору модифікаторів"),
        FINAL_CALCULATION("Готовність до фінального розрахунку"),
        SUBSTEP_COMPLETION("Завершеність підетапу"),
        DATA_VALIDITY("Валідність даних"),
        NO_CALCULATION_ERRORS("Відсутність помилок розрахунку");

        private final String description;

        GuardValidationType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return description;
        }
    }

    /**
     * Функціональний інтерфейс для операцій валідації.
     */
    @FunctionalInterface
    public interface ValidationOperation {
        ValidationResult validate(PriceDiscountDTO data);
    }
}
