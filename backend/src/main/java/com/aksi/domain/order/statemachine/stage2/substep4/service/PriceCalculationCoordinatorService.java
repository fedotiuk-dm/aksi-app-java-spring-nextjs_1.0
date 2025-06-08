package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.validator.PricingValidator;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координуючий сервіс розрахунків ціни.
 *
 * Відповідальність: координація всіх мікросервісів ціноутворення.
 * Принцип: один файл = координація всіх інших сервісів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationCoordinatorService {

    private final PriceInitializationService initializationService;
    private final PriceModificationService modificationService;
    private final PriceExpediteService expediteService;
    private final PriceDiscountService discountService;
    private final PricingValidator pricingValidator;

    /**
     * Створює початковий розрахунок.
     */
    public PricingCalculationDTO createInitialCalculation(
            BasicInfoDTO basicInfo,
            CharacteristicsDTO characteristics) {

        log.debug("Creating initial calculation for: {}", basicInfo.getItemName());

        PricingCalculationDTO calculation = initializationService
                .createInitialCalculation(basicInfo, characteristics);

        // Валідуємо розрахунок
        PricingValidator.ValidationResult validationResult = pricingValidator
                .validatePricingCalculation(calculation);

        if (!validationResult.isValid()) {
            calculation = calculation.toBuilder()
                    .isValid(false)
                    .validationErrors(validationResult.getErrors())
                    .build();
        }

        return calculation;
    }

    /**
     * Застосовує терміновість до розрахунку.
     */
    public PricingCalculationDTO applyExpedite(
            PricingCalculationDTO calculation,
            boolean isExpedited,
            BigDecimal expediteFactor) {

        log.debug("Applying expedite to calculation");

        PricingCalculationDTO expeditedCalculation = expediteService
                .applyExpedite(calculation, isExpedited, expediteFactor);

        // Валідуємо результат
        PricingValidator.ValidationResult validationResult = pricingValidator
                .validatePricingCalculation(expeditedCalculation);

        if (!validationResult.isValid()) {
            expeditedCalculation = expeditedCalculation.toBuilder()
                    .isValid(false)
                    .validationErrors(validationResult.getErrors())
                    .build();
        }

        return expeditedCalculation;
    }

    /**
     * Застосовує знижку до розрахунку.
     */
    public PricingCalculationDTO applyDiscount(
            PricingCalculationDTO calculation,
            BigDecimal discountPercentage) {

        log.debug("Applying discount to calculation");

        PricingCalculationDTO discountedCalculation = discountService
                .applyDiscount(calculation, discountPercentage);

        // Валідуємо результат
        PricingValidator.ValidationResult validationResult = pricingValidator
                .validatePricingCalculation(discountedCalculation);

        if (!validationResult.isValid()) {
            discountedCalculation = discountedCalculation.toBuilder()
                    .isValid(false)
                    .validationErrors(validationResult.getErrors())
                    .build();
        }

        return discountedCalculation;
    }

        /**
     * Застосовує модифікатори до розрахунку.
     */
    public PricingCalculationDTO applyModifiers(
            PricingCalculationDTO calculation,
            List<ModifierSelectionDTO> selectedModifiers) {

        log.debug("Applying modifiers to calculation");

        if (selectedModifiers == null || selectedModifiers.isEmpty()) {
            return calculation;
        }

        try {
            PricingCalculationDTO modifiedCalculation = modificationService
                    .applyModifiers(calculation, selectedModifiers);

            // Валідуємо результат
            PricingValidator.ValidationResult validationResult = pricingValidator
                    .validatePricingCalculation(modifiedCalculation);

            if (!validationResult.isValid()) {
                modifiedCalculation = modifiedCalculation.toBuilder()
                        .isValid(false)
                        .validationErrors(validationResult.getErrors())
                        .build();
            }

            return modifiedCalculation;

        } catch (Exception e) {
            log.error("Error applying modifiers: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося застосувати модифікатори", e);
        }
    }

    /**
     * Отримує доступні модифікатори.
     */
    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Getting available modifiers for category: {}", categoryCode);

        try {
            return modificationService.getAvailableModifiers(categoryCode);
        } catch (Exception e) {
            log.error("Error getting available modifiers for category {}: {}", categoryCode, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати доступні модифікатори", e);
        }
    }

    /**
     * Повний розрахунок з усіма параметрами.
     */
    public PricingCalculationDTO calculateFullPrice(
            BasicInfoDTO basicInfo,
            CharacteristicsDTO characteristics,
            boolean isExpedited,
            BigDecimal expediteFactor,
            BigDecimal discountPercentage) {

        log.debug("Calculating full price for: {}", basicInfo.getItemName());

        // 1. Створюємо початковий розрахунок
        PricingCalculationDTO calculation = createInitialCalculation(basicInfo, characteristics);

        // 2. Застосовуємо терміновість
        if (isExpedited && expediteFactor != null) {
            calculation = applyExpedite(calculation, true, expediteFactor);
        }

        // 3. Застосовуємо знижки
        if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            calculation = applyDiscount(calculation, discountPercentage);
        }

        return calculation;
    }
}
