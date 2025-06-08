package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.model.PriceCalculationParams;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceModifierCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс застосування модифікаторів до розрахунку ціни.
 *
 * Відповідальність: перерахунок ціни з урахуванням обраних модифікаторів.
 * Принцип: один файл = одна відповідальність модифікації ціни.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceModificationService {

    private final PriceModifierCalculationService priceModifierCalculationService;
    private final CatalogPriceModifierService catalogPriceModifierService;

    /**
     * Застосовує модифікатори до розрахунку.
     */
    public PricingCalculationDTO applyModifiers(
            PricingCalculationDTO currentCalculation,
            List<ModifierSelectionDTO> selectedModifiers) {

        log.debug("Applying {} modifiers to calculation",
                selectedModifiers != null ? selectedModifiers.size() : 0);

        if (selectedModifiers == null || selectedModifiers.isEmpty()) {
            return currentCalculation;
        }

        try {
            // Отримуємо повні дані модифікаторів
            List<String> modifierCodes = selectedModifiers.stream()
                    .filter(ModifierSelectionDTO::getIsSelected)
                    .map(ModifierSelectionDTO::getCode)
                    .collect(Collectors.toList());

            List<PriceModifierDTO> fullModifiers = catalogPriceModifierService
                    .getModifiersByCodes(modifierCodes);

            // Підготовуємо мапи для діапазонних і фіксованих модифікаторів
            Map<String, BigDecimal> rangeValues = new HashMap<>();
            Map<String, Integer> fixedQuantities = new HashMap<>();

            for (ModifierSelectionDTO selection : selectedModifiers) {
                if (selection.getIsSelected()) {
                    if (selection.getSelectedValue() != null) {
                        rangeValues.put(selection.getCode(), selection.getSelectedValue());
                    }
                    if (selection.getQuantity() != null) {
                        fixedQuantities.put(selection.getCode(), selection.getQuantity());
                    }
                }
            }

                        // Застосовуємо модифікатори через новий API
            List<CalculationDetailsDTO> calculationDetails = new ArrayList<>();

            PriceCalculationParams params = PriceCalculationParams.builder()
                    .basePrice(currentCalculation.getBaseUnitPrice())
                    .modifiers(fullModifiers)
                    .color(currentCalculation.getColor())
                    .rangeModifierValues(rangeValues)
                    .fixedModifierQuantities(fixedQuantities)
                    .expedited(Boolean.TRUE.equals(currentCalculation.getIsExpedited()))
                    .expediteFactor(currentCalculation.getExpediteFactor())
                    .categoryCode(currentCalculation.getCategoryCode())
                    .calculationDetails(calculationDetails)
                    .build();

            BigDecimal newPrice = priceModifierCalculationService.calculatePrice(params);

            // Розраховуємо нову загальну суму
            BigDecimal newTotal = newPrice.multiply(BigDecimal.valueOf(currentCalculation.getQuantity()));

            // Створюємо список кроків розрахунку
            List<String> calculationSteps = calculationDetails.stream()
                    .map(detail -> String.format("%s: %s", detail.getDescription(),
                            detail.getPriceDifference() != null ? detail.getPriceDifference().toString() : "0"))
                    .collect(Collectors.toList());

            log.debug("Applied modifiers, new unit price: {}, new total: {}", newPrice, newTotal);

            return currentCalculation.toBuilder()
                    .selectedModifiers(selectedModifiers)
                    .finalUnitPrice(newPrice)
                    .finalTotalPrice(newTotal)
                    .calculationSteps(calculationSteps)
                    .build();

        } catch (Exception e) {
            log.error("Error applying modifiers: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося застосувати модифікатори", e);
        }
    }

    /**
     * Отримує доступні модифікатори для категорії.
     */
    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Getting available modifiers for category: {}", categoryCode);

        try {
            return catalogPriceModifierService.getModifiersForServiceCategory(categoryCode);
        } catch (Exception e) {
            log.error("Error getting modifiers for category {}: {}", categoryCode, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати модифікатори", e);
        }
    }

    /**
     * Перевіряє чи доступний модифікатор для категорії.
     */
    public boolean isModifierAvailable(String categoryCode, String modifierCode) {
        try {
            List<PriceModifierDTO> available = getAvailableModifiers(categoryCode);
            return available.stream()
                    .anyMatch(modifier -> modifier.getCode().equals(modifierCode));
        } catch (Exception e) {
            log.error("Error checking modifier availability: {}", e.getMessage(), e);
            return false;
        }
    }
}
