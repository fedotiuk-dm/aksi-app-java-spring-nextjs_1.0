package com.aksi.domain.order.statemachine.stage2.substep4.validator;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 2.4: Розрахунок ціни.
 *
 * ПРИНЦИП: Валідує тільки коректність даних розрахунку,
 * НЕ дублює бізнес-правила з Pricing Domain.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PricingValidator {

    // ===== ГОЛОВНІ МЕТОДИ ВАЛІДАЦІЇ =====

    /**
     * Валідація повноти розрахунку ціни
     */
    public ValidationResult validatePricingCalculation(PricingCalculationDTO calculation) {
        log.debug("Validating pricing calculation completeness");

        ValidationResult result = ValidationResult.valid();

        if (calculation == null) {
            return ValidationResult.invalid("Розрахунок ціни відсутній");
        }

        // Валідація базових даних
        validateBasicData(calculation, result);

        // Валідація модифікаторів
        validateModifiers(calculation, result);

        // Валідація терміновості
        validateExpedite(calculation, result);

        // Валідація знижки
        validateDiscount(calculation, result);

        // Валідація кінцевих результатів
        validateFinalResults(calculation, result);

        return result;
    }

    /**
     * Валідація можливості завершення підетапу
     */
    public ValidationResult validateCanCompleteStep(PricingCalculationDTO calculation) {
        log.debug("Validating can complete pricing step");

        ValidationResult result = validatePricingCalculation(calculation);

        if (!result.isValid()) {
            return result;
        }

        // Додаткові перевірки для завершення
        if (calculation.getFinalTotalPrice() == null ||
            calculation.getFinalTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            result.addError("Кінцева ціна повинна бути більше нуля");
        }

        if (!calculation.isCalculationComplete()) {
            result.addError("Розрахунок не завершений");
        }

        return result;
    }

    /**
     * Валідація вибору модифікаторів
     */
    public ValidationResult validateModifierSelection(List<ModifierSelectionDTO> modifiers) {
        log.debug("Validating modifier selection");

        ValidationResult result = ValidationResult.valid();

        if (modifiers == null) {
            return result; // Модифікатори не обов'язкові
        }

        for (ModifierSelectionDTO modifier : modifiers) {
            if (modifier.getIsSelected() && (modifier.getCode() == null || modifier.getCode().trim().isEmpty())) {
                result.addError("Вибраний модифікатор має некоректний код");
            }

            if (modifier.getIsSelected() && modifier.getImpactAmount() != null &&
                modifier.getImpactAmount().compareTo(BigDecimal.ZERO) < 0) {
                result.addWarning("Модифікатор '" + modifier.getName() + "' зменшує ціну");
            }
        }

        return result;
    }

    /**
     * Валідація розумності кінцевої ціни
     */
    public ValidationResult validatePriceReasonableness(PricingCalculationDTO calculation) {
        log.debug("Validating price reasonableness");

        ValidationResult result = ValidationResult.valid();

        if (calculation == null || calculation.getBaseTotal() == null || calculation.getFinalTotalPrice() == null) {
            return result;
        }

        BigDecimal basePrice = calculation.getBaseTotal();
        BigDecimal finalPrice = calculation.getFinalTotalPrice();

        // Перевірка на занадто велику зміну ціни
        BigDecimal priceChange = finalPrice.subtract(basePrice);
        BigDecimal percentageChange = priceChange.divide(basePrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        if (percentageChange.abs().compareTo(BigDecimal.valueOf(300)) > 0) {
            result.addWarning("Кінцева ціна відрізняється від базової більш ніж на 300%");
        }

        if (percentageChange.compareTo(BigDecimal.valueOf(-80)) < 0) {
            result.addWarning("Кінцева ціна на 80%+ менше базової - перевірте знижки та модифікатори");
        }

        return result;
    }

    // ===== ПРИВАТНІ МЕТОДИ ВАЛІДАЦІЇ =====

    private void validateBasicData(PricingCalculationDTO calculation, ValidationResult result) {
        if (calculation.getBaseUnitPrice() == null || calculation.getBaseUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
            result.addError("Базова ціна за одиницю повинна бути більше нуля");
        }

        if (calculation.getQuantity() == null || calculation.getQuantity() <= 0) {
            result.addError("Кількість повинна бути більше нуля");
        }

        if (calculation.getUnitOfMeasure() == null || calculation.getUnitOfMeasure().trim().isEmpty()) {
            result.addError("Одиниця виміру обов'язкова");
        }

        if (calculation.getBaseTotal() == null || calculation.getBaseTotal().compareTo(BigDecimal.ZERO) <= 0) {
            result.addError("Базова загальна ціна повинна бути більше нуля");
        }
    }

    private void validateModifiers(PricingCalculationDTO calculation, ValidationResult result) {
        if (calculation.getSelectedModifiers() != null) {
            ValidationResult modifierResult = validateModifierSelection(calculation.getSelectedModifiers());
            result.merge(modifierResult);
        }
    }

    private void validateExpedite(PricingCalculationDTO calculation, ValidationResult result) {
        if (calculation.getIsExpedited() != null && calculation.getIsExpedited()) {
            if (calculation.getExpediteFactor() == null || calculation.getExpediteFactor().compareTo(BigDecimal.ZERO) <= 0) {
                result.addError("Коефіцієнт терміновості повинен бути більше нуля");
            }

            if (calculation.getExpediteFactor() != null && calculation.getExpediteFactor().compareTo(BigDecimal.valueOf(200)) > 0) {
                result.addWarning("Коефіцієнт терміновості більше 200% - перевірте правильність");
            }
        }
    }

    private void validateDiscount(PricingCalculationDTO calculation, ValidationResult result) {
        if (calculation.getDiscountPercent() != null && calculation.getDiscountPercent().compareTo(BigDecimal.ZERO) > 0) {
            if (!calculation.getDiscountApplicable()) {
                result.addError("Знижка не може бути застосована до цієї категорії");
            }

            if (calculation.getDiscountPercent().compareTo(BigDecimal.valueOf(100)) >= 0) {
                result.addError("Знижка не може бути 100% або більше");
            }

            if (calculation.getDiscountPercent().compareTo(BigDecimal.valueOf(50)) > 0) {
                result.addWarning("Знижка більше 50% - перевірте правильність");
            }
        }
    }

    private void validateFinalResults(PricingCalculationDTO calculation, ValidationResult result) {
        if (calculation.getFinalUnitPrice() == null || calculation.getFinalUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
            result.addError("Кінцева ціна за одиницю повинна бути більше нуля");
        }

        if (calculation.getFinalTotalPrice() == null || calculation.getFinalTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            result.addError("Кінцева загальна ціна повинна бути більше нуля");
        }

        // Перевірка консистентності unit price * quantity = total price
        if (calculation.getFinalUnitPrice() != null && calculation.getFinalTotalPrice() != null && calculation.getQuantity() != null) {
            BigDecimal expectedTotal = calculation.getFinalUnitPrice().multiply(BigDecimal.valueOf(calculation.getQuantity()));
            BigDecimal tolerance = BigDecimal.valueOf(0.01); // 1 копійка толерантності

            if (calculation.getFinalTotalPrice().subtract(expectedTotal).abs().compareTo(tolerance) > 0) {
                result.addWarning("Невідповідність між ціною за одиницю та загальною ціною");
            }
        }
    }

    // ===== КЛАС РЕЗУЛЬТАТУ ВАЛІДАЦІЇ =====

    public static class ValidationResult {
        private boolean valid = true;
        private final List<String> errors = new ArrayList<>();
        private final List<String> warnings = new ArrayList<>();

        public static ValidationResult valid() {
            return new ValidationResult();
        }

        public static ValidationResult invalid(String error) {
            ValidationResult result = new ValidationResult();
            result.addError(error);
            return result;
        }

        public boolean isValid() {
            return valid && errors.isEmpty();
        }

        public List<String> getErrors() {
            return new ArrayList<>(errors);
        }

        public List<String> getWarnings() {
            return new ArrayList<>(warnings);
        }

        public void addError(String error) {
            this.valid = false;
            this.errors.add(error);
        }

        public void addWarning(String warning) {
            this.warnings.add(warning);
        }

        public boolean hasErrors() {
            return !errors.isEmpty();
        }

        public boolean hasWarnings() {
            return !warnings.isEmpty();
        }

        public void merge(ValidationResult other) {
            if (other != null) {
                this.errors.addAll(other.errors);
                this.warnings.addAll(other.warnings);
                if (!other.valid) {
                    this.valid = false;
                }
            }
        }

        public String getErrorMessage() {
            if (errors.isEmpty()) return null;
            return String.join("; ", errors);
        }

        public String getWarningMessage() {
            if (warnings.isEmpty()) return null;
            return String.join("; ", warnings);
        }
    }
}
