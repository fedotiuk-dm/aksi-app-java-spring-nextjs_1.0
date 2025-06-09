package com.aksi.domain.order.statemachine.stage2.substep4.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;

/**
 * Validator для підетапу 2.4: Знижки та надбавки.
 */
@Component
public class PriceDiscountValidator {

    /**
     * Валідація базових даних для розрахунку ціни.
     */
    public ValidationResult validateBasicCalculationData(PriceDiscountDTO priceDiscountDTO) {
        List<String> errors = new ArrayList<>();

        if (priceDiscountDTO == null) {
            errors.add("Дані для розрахунку ціни не можуть бути null");
            return ValidationResult.failure(errors);
        }

        PriceCalculationRequestDTO request = priceDiscountDTO.getCalculationRequest();
        if (request == null) {
            errors.add("Запит на розрахунок ціни не може бути null");
            return ValidationResult.failure(errors);
        }

        // Валідація категорії
        if (request.getCategoryCode() == null || request.getCategoryCode().trim().isEmpty()) {
            errors.add("Код категорії послуги обов'язковий");
        }

        // Валідація найменування предмета
        if (request.getItemName() == null || request.getItemName().trim().isEmpty()) {
            errors.add("Найменування предмета обов'язкове");
        }

        // Валідація кількості
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            errors.add("Кількість повинна бути більше 0");
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація модифікаторів.
     */
    public ValidationResult validateModifiers(PriceDiscountDTO priceDiscountDTO) {
        List<String> errors = new ArrayList<>();

        if (priceDiscountDTO == null) {
            return ValidationResult.success(); // Модифікатори не обов'язкові
        }

        // Валідація range модифікаторів
        if (priceDiscountDTO.getRangeModifierValues() != null) {
            for (PriceCalculationRequestDTO.RangeModifierValueDTO rangeValue : priceDiscountDTO.getRangeModifierValues()) {
                if (rangeValue.getModifierId() == null || rangeValue.getModifierId().trim().isEmpty()) {
                    errors.add("ID модифікатора діапазону не може бути порожнім");
                }
                if (rangeValue.getPercentage() == null || rangeValue.getPercentage().compareTo(BigDecimal.ZERO) < 0) {
                    errors.add("Значення модифікатора діапазону повинно бути не менше 0");
                }
            }
        }

        // Валідація fixed модифікаторів
        if (priceDiscountDTO.getFixedModifierQuantities() != null) {
            for (PriceCalculationRequestDTO.FixedModifierQuantityDTO fixedQuantity : priceDiscountDTO.getFixedModifierQuantities()) {
                if (fixedQuantity.getModifierId() == null || fixedQuantity.getModifierId().trim().isEmpty()) {
                    errors.add("ID фіксованого модифікатора не може бути порожнім");
                }
                if (fixedQuantity.getQuantity() == null || fixedQuantity.getQuantity() <= 0) {
                    errors.add("Кількість фіксованого модифікатора повинна бути більше 0");
                }
            }
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідація результату розрахунку.
     */
    public ValidationResult validateCalculationResult(PriceDiscountDTO priceDiscountDTO) {
        List<String> errors = new ArrayList<>();

        if (priceDiscountDTO == null) {
            errors.add("Дані розрахунку не можуть бути null");
            return ValidationResult.failure(errors);
        }

        if (priceDiscountDTO.isCalculationCompleted()) {
            if (priceDiscountDTO.getCalculationResponse() == null) {
                errors.add("Результат розрахунку відсутній при завершеному розрахунку");
            } else {
                // Валідація базової ціни
                if (priceDiscountDTO.getBasePrice() == null || priceDiscountDTO.getBasePrice().compareTo(BigDecimal.ZERO) < 0) {
                    errors.add("Базова ціна повинна бути не менше 0");
                }

                // Валідація фінальної ціни
                if (priceDiscountDTO.getFinalPrice() == null || priceDiscountDTO.getFinalPrice().compareTo(BigDecimal.ZERO) < 0) {
                    errors.add("Фінальна ціна повинна бути не менше 0");
                }
            }
        }

        return errors.isEmpty() ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Повна валідація всіх даних підетапу.
     */
    public ValidationResult validateAll(PriceDiscountDTO priceDiscountDTO) {
        ValidationResult basicValidation = validateBasicCalculationData(priceDiscountDTO);
        ValidationResult modifiersValidation = validateModifiers(priceDiscountDTO);
        ValidationResult resultValidation = validateCalculationResult(priceDiscountDTO);

        return basicValidation
                .combine(modifiersValidation)
                .combine(resultValidation);
    }

    /**
     * Перевірка готовності до розрахунку базової ціни.
     */
    public boolean isReadyForBaseCalculation(PriceDiscountDTO priceDiscountDTO) {
        return validateBasicCalculationData(priceDiscountDTO).isValid();
    }

    /**
     * Перевірка готовності до розрахунку фінальної ціни.
     */
    public boolean isReadyForFinalCalculation(PriceDiscountDTO priceDiscountDTO) {
        ValidationResult basicValidation = validateBasicCalculationData(priceDiscountDTO);
        ValidationResult modifiersValidation = validateModifiers(priceDiscountDTO);

        return basicValidation.isValid() && modifiersValidation.isValid();
    }

    /**
     * Перевірка завершеності підетапу.
     */
    public boolean isSubstepCompleted(PriceDiscountDTO priceDiscountDTO) {
        return validateAll(priceDiscountDTO).isValid() &&
               priceDiscountDTO.isCalculationCompleted() &&
               !priceDiscountDTO.isHasCalculationErrors();
    }
}
