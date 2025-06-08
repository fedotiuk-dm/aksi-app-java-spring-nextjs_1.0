package com.aksi.domain.order.statemachine.stage2.service.coordination;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.service.InitialPriceCalculationService;
import com.aksi.domain.order.statemachine.stage2.substep4.service.InteractivePriceCalculationService;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PricingStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координатор для підетапу 2.4: Розрахунок ціни предмета.
 * Тонка обгортка над сервісами підетапу 2.4.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Step4PricingCoordinator {

    private final PricingStepService pricingStepService;
    private final InteractivePriceCalculationService interactivePriceCalculationService;
    private final InitialPriceCalculationService initialPriceCalculationService;

    // ========== БАЗОВІ ОПЕРАЦІЇ З МОДИФІКАТОРАМИ ==========

    /**
     * Отримує доступні модифікатори для категорії.
     */
    public List<ModifierSelectionDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Координація отримання модифікаторів для категорії: {}", categoryCode);
        return pricingStepService.getAvailableModifiers(categoryCode);
    }

    /**
     * Зберігає розрахунок ціни.
     */
    public PricingCalculationDTO savePricingCalculation(String wizardId, PricingCalculationDTO calculation) {
        log.debug("Координація збереження розрахунку для wizardId: {}", wizardId);
        return pricingStepService.savePricingCalculation(wizardId, calculation);
    }

    /**
     * Завантажує збережений розрахунок.
     */
    public PricingCalculationDTO loadPricingCalculation(String wizardId) {
        log.debug("Координація завантаження розрахунку для wizardId: {}", wizardId);
        return pricingStepService.loadPricingCalculation(wizardId);
    }

    // ========== РОЗРАХУНКИ ЧЕРЕЗ СЕРВІСИ ПІДЕТАПУ ==========

    /**
     * Створює початковий розрахунок ціни.
     */
    public PricingCalculationDTO createInitialCalculation(BasicInfoDTO basicInfo, CharacteristicsDTO characteristics) {
        log.debug("Координація створення початкового розрахунку");
        return initialPriceCalculationService.calculateInitialPrice(basicInfo, characteristics);
    }

    /**
     * Перевіряє чи можна розрахувати ціну.
     */
    public boolean canCalculatePrice(BasicInfoDTO basicInfo, CharacteristicsDTO characteristics) {
        log.debug("Координація перевірки можливості розрахунку ціни");
        return initialPriceCalculationService.canCalculatePrice(basicInfo, characteristics);
    }

    /**
     * Перерахунок з вибраними модифікаторами.
     */
    public PricingCalculationDTO recalculateWithModifiers(PricingCalculationDTO currentCalculation,
                                                         List<ModifierSelectionDTO> selectedModifiers) {
        log.debug("Координація перерахунку з модифікаторами");
        return interactivePriceCalculationService.recalculateWithModifiers(currentCalculation, selectedModifiers);
    }

    /**
     * Отримує рекомендовані модифікатори на основі дефектів та плям.
     */
    public List<ModifierSelectionDTO> getRecommendedModifiers(DefectsStainsDTO defectsStains,
                                                             String categoryCode,
                                                             String material) {
        log.debug("Координація отримання рекомендованих модифікаторів");
        return interactivePriceCalculationService.getRecommendedModifiers(defectsStains, categoryCode, material);
    }

    /**
     * Розрахунок повної ціни з усіма параметрами.
     */
    public PricingCalculationDTO calculateFullPrice(BasicInfoDTO basicInfo,
                                                   CharacteristicsDTO characteristics,
                                                   List<ModifierSelectionDTO> selectedModifiers,
                                                   boolean isExpedited,
                                                   BigDecimal expediteFactor,
                                                   BigDecimal discountPercentage) {
        log.debug("Координація повного розрахунку ціни");

        // Використовуємо комбінацію сервісів підетапу
        PricingCalculationDTO calculation = createInitialCalculation(basicInfo, characteristics);

        if (selectedModifiers != null && !selectedModifiers.isEmpty()) {
            calculation = recalculateWithModifiers(calculation, selectedModifiers);
        }

        // Застосовуємо терміновість та знижки через інтерактивний сервіс
        return interactivePriceCalculationService.applyExpediteAndDiscount(
                calculation, isExpedited, expediteFactor, discountPercentage);
    }

    /**
     * Отримує базову ціну через сервіс ініціалізації.
     */
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Координація отримання базової ціни");
        return initialPriceCalculationService.getBasePrice(categoryCode, itemName, color);
    }

    // ========== ВАЛІДАЦІЯ ТА СТАН ==========

    /**
     * Валідує готовність до завершення підетапу.
     */
    public boolean isReadyForCompletion(String wizardId) {
        log.debug("Координація перевірки готовності до завершення");

        try {
            PricingCalculationDTO calculation = loadPricingCalculation(wizardId);

            if (calculation == null) {
                return false;
            }

            // Перевіряємо валідність розрахунку
            return Boolean.TRUE.equals(calculation.getIsValid()) &&
                   calculation.getFinalTotalPrice() != null &&
                   calculation.getFinalTotalPrice().compareTo(BigDecimal.ZERO) > 0;

        } catch (Exception e) {
            log.error("Помилка перевірки готовності: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Отримує підсумок розрахунку ціни.
     */
    public String getPricingSummary(String wizardId) {
        log.debug("Координація отримання підсумку розрахунку");

        try {
            PricingCalculationDTO calculation = loadPricingCalculation(wizardId);

            if (calculation == null) {
                return "Розрахунок не знайдено";
            }

            if (!Boolean.TRUE.equals(calculation.getIsValid())) {
                return "Розрахунок містить помилки";
            }

            return String.format("Фінальна ціна: %s грн (%s %s × %d)",
                calculation.getFinalTotalPrice(),
                calculation.getFinalUnitPrice(),
                calculation.getUnitOfMeasure() != null ? calculation.getUnitOfMeasure() : "шт",
                calculation.getQuantity() != null ? calculation.getQuantity() : 1);

        } catch (Exception e) {
            log.error("Помилка отримання підсумку: {}", e.getMessage());
            return "Помилка отримання підсумку розрахунку";
        }
    }

    /**
     * Перевіряє чи є активні модифікатори для розрахунку.
     */
    public boolean hasActiveModifiers(String wizardId) {
        log.debug("Перевірка активних модифікаторів для wizardId: {}", wizardId);

        PricingCalculationDTO calculation = loadPricingCalculation(wizardId);
        return calculation != null &&
               calculation.hasSelectedModifiers() != null &&
               calculation.hasSelectedModifiers();
    }

    /**
     * Очищає всі вибрані модифікатори.
     */
    public PricingCalculationDTO clearSelectedModifiers(String wizardId) {
        log.debug("Очищення вибраних модифікаторів для wizardId: {}", wizardId);

        PricingCalculationDTO calculation = loadPricingCalculation(wizardId);
        if (calculation == null) {
            return null;
        }

        return interactivePriceCalculationService.clearModifiers(calculation);
    }

    /**
     * Застосовує один конкретний модифікатор.
     */
    public PricingCalculationDTO applyModifier(String wizardId, ModifierSelectionDTO modifier) {
        log.debug("Застосування модифікатора {} для wizardId: {}", modifier.getCode(), wizardId);

        PricingCalculationDTO calculation = loadPricingCalculation(wizardId);
        if (calculation == null) {
            return null;
        }

        return interactivePriceCalculationService.applyModifier(calculation, modifier);
    }

    /**
     * Видаляє конкретний модифікатор.
     */
    public PricingCalculationDTO removeModifier(String wizardId, String modifierCode) {
        log.debug("Видалення модифікатора {} для wizardId: {}", modifierCode, wizardId);

        PricingCalculationDTO calculation = loadPricingCalculation(wizardId);
        if (calculation == null) {
            return null;
        }

        return interactivePriceCalculationService.removeModifier(calculation, modifierCode);
    }
}
