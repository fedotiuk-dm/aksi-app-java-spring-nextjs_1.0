package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.usecase.CalculatePriceUseCase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для інтерактивних операцій з розрахунком ціни.
 * Відповідальність: робота з модифікаторами, перерахунки, застосування знижок та терміновості.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InteractivePriceCalculationService {

    private final PriceCalculationService priceCalculationService;
    private final CatalogPriceModifierService catalogPriceModifierService;
    private final CalculatePriceUseCase calculatePriceUseCase;

    /**
     * Перерахунок ціни з вибраними модифікаторами.
     */
    public PricingCalculationDTO recalculateWithModifiers(PricingCalculationDTO currentCalculation,
                                                         List<ModifierSelectionDTO> selectedModifiers) {
        log.debug("Перерахунок з модифікаторами для категорії: {}", currentCalculation.getCategoryCode());

        try {
            // Підготовуємо дані для use case
            List<String> modifierCodes = selectedModifiers.stream()
                    .filter(ModifierSelectionDTO::getIsSelected)
                    .map(ModifierSelectionDTO::getCode)
                    .collect(Collectors.toList());

            // Викликаємо готовий use case
            CalculatePriceUseCase.PriceCalculationRequest request =
                    new CalculatePriceUseCase.PriceCalculationRequest(
                            currentCalculation.getCategoryCode(),
                            currentCalculation.getItemName(),
                            currentCalculation.getColor(),
                            currentCalculation.getQuantity(),
                            modifierCodes,
                            extractRangeModifierValues(selectedModifiers),
                            extractFixedModifierQuantities(selectedModifiers),
                            Boolean.TRUE.equals(currentCalculation.getIsExpedited()),
                            currentCalculation.getExpediteFactor(),
                            currentCalculation.getDiscountPercent()
                    );

            var response = calculatePriceUseCase.execute(request);

            // Оновлюємо розрахунок
            return currentCalculation.toBuilder()
                    .selectedModifiers(selectedModifiers)
                    .baseUnitPrice(response.getBaseUnitPrice())
                    .baseTotal(response.getBaseTotalPrice())
                    .finalUnitPrice(response.getFinalUnitPrice())
                    .finalTotalPrice(response.getFinalTotalPrice())
                    .unitOfMeasure(response.getUnitOfMeasure())
                    .isValid(true)
                    .validationErrors(new ArrayList<>())
                    .build();

        } catch (Exception e) {
            log.error("Помилка перерахунку з модифікаторами: {}", e.getMessage());
            return currentCalculation.toBuilder()
                    .isValid(false)
                    .validationErrors(List.of("Помилка перерахунку: " + e.getMessage()))
                    .build();
        }
    }

    /**
     * Отримує рекомендовані модифікатори на основі дефектів та плям.
     */
    public List<ModifierSelectionDTO> getRecommendedModifiers(DefectsStainsDTO defectsStains,
                                                             String categoryCode,
                                                             String material) {
        log.debug("Отримання рекомендованих модифікаторів для категорії: {}", categoryCode);

        try {
            // Отримуємо всі доступні модифікатори
            List<PriceModifierDTO> allModifiers = catalogPriceModifierService
                    .getModifiersForServiceCategory(categoryCode);

            // Конвертуємо та маркуємо рекомендовані
            return allModifiers.stream()
                    .map(this::convertToModifierSelectionDTO)
                    .map(modifier -> markAsRecommendedIfNeeded(modifier, defectsStains, material))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Помилка отримання рекомендованих модифікаторів: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Застосовує терміновість та знижку до розрахунку.
     */
    public PricingCalculationDTO applyExpediteAndDiscount(PricingCalculationDTO calculation,
                                                         boolean isExpedited,
                                                         BigDecimal expediteFactor,
                                                         BigDecimal discountPercent) {
        log.debug("Застосування терміновості {} та знижки {}%", isExpedited, discountPercent);

        try {
            BigDecimal finalPrice = calculation.getFinalTotalPrice();
            if (finalPrice == null) {
                finalPrice = calculation.getBaseTotal();
            }

            // Застосовуємо терміновість
            BigDecimal expediteAmount = BigDecimal.ZERO;
            if (isExpedited && expediteFactor != null && expediteFactor.compareTo(BigDecimal.ZERO) > 0) {
                expediteAmount = finalPrice.multiply(expediteFactor.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
                finalPrice = finalPrice.add(expediteAmount);
            }

            // Застосовуємо знижку
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
                discountAmount = finalPrice.multiply(discountPercent.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
                finalPrice = finalPrice.subtract(discountAmount);
            }

            return calculation.toBuilder()
                    .isExpedited(isExpedited)
                    .expediteFactor(expediteFactor)
                    .expediteAmount(expediteAmount)
                    .discountPercent(discountPercent)
                    .discountAmount(discountAmount)
                    .finalTotalPrice(finalPrice)
                    .finalUnitPrice(finalPrice.divide(BigDecimal.valueOf(calculation.getQuantity()), 2, RoundingMode.HALF_UP))
                    .isValid(true)
                    .build();

        } catch (Exception e) {
            log.error("Помилка застосування терміновості та знижки: {}", e.getMessage());
            return calculation.toBuilder()
                    .isValid(false)
                    .validationErrors(List.of("Помилка застосування: " + e.getMessage()))
                    .build();
        }
    }

    /**
     * Очищає всі вибрані модифікатори.
     */
    public PricingCalculationDTO clearModifiers(PricingCalculationDTO calculation) {
        log.debug("Очищення модифікаторів");

        List<ModifierSelectionDTO> clearedModifiers = calculation.getSelectedModifiers().stream()
                .map(modifier -> modifier.toBuilder().isSelected(false).build())
                .collect(Collectors.toList());

        return calculation.toBuilder()
                .selectedModifiers(clearedModifiers)
                .finalTotalPrice(calculation.getBaseTotal())
                .finalUnitPrice(calculation.getBaseUnitPrice())
                .build();
    }

    /**
     * Застосовує один конкретний модифікатор.
     */
    public PricingCalculationDTO applyModifier(PricingCalculationDTO calculation, ModifierSelectionDTO modifier) {
        log.debug("Застосування модифікатора: {}", modifier.getCode());

        List<ModifierSelectionDTO> updatedModifiers = new ArrayList<>(calculation.getSelectedModifiers());

        // Знаходимо та оновлюємо модифікатор
        for (int i = 0; i < updatedModifiers.size(); i++) {
            if (updatedModifiers.get(i).getCode().equals(modifier.getCode())) {
                updatedModifiers.set(i, modifier.toBuilder().isSelected(true).build());
                break;
            }
        }

        // Перерахунок з оновленими модифікаторами
        return recalculateWithModifiers(calculation, updatedModifiers);
    }

    /**
     * Видаляє конкретний модифікатор.
     */
    public PricingCalculationDTO removeModifier(PricingCalculationDTO calculation, String modifierCode) {
        log.debug("Видалення модифікатора: {}", modifierCode);

        List<ModifierSelectionDTO> updatedModifiers = calculation.getSelectedModifiers().stream()
                .map(modifier -> modifier.getCode().equals(modifierCode) ?
                     modifier.toBuilder().isSelected(false).build() : modifier)
                .collect(Collectors.toList());

        // Перерахунок без видаленого модифікатора
        return recalculateWithModifiers(calculation, updatedModifiers);
    }

    // ========== ПРИВАТНІ МЕТОДИ ==========

    /**
     * Конвертує PriceModifierDTO в ModifierSelectionDTO.
     */
    private ModifierSelectionDTO convertToModifierSelectionDTO(PriceModifierDTO priceModifier) {
        return ModifierSelectionDTO.builder()
                .id(priceModifier.getId())
                .code(priceModifier.getCode())
                .name(priceModifier.getName())
                .description(priceModifier.getDescription())
                .modifierType(priceModifier.getModifierType())
                .category(priceModifier.getCategory())
                .value(priceModifier.getValue())
                .minValue(priceModifier.getMinValue())
                .maxValue(priceModifier.getMaxValue())
                .isSelected(false)
                .isRecommended(false)
                .isRequired(false)
                .isAvailable(true)
                .sortOrder(priceModifier.getSortOrder())
                .build();
    }

    /**
     * Маркує модифікатор як рекомендований на основі дефектів.
     */
    private ModifierSelectionDTO markAsRecommendedIfNeeded(ModifierSelectionDTO modifier,
                                                          DefectsStainsDTO defectsStains,
                                                          String material) {
        boolean isRecommended = determineIfRecommended(modifier.getCode(), defectsStains, material);

        return modifier.toBuilder()
                .isRecommended(isRecommended)
                .build();
    }

    /**
     * Визначає чи потрібно рекомендувати модифікатор.
     */
    private boolean determineIfRecommended(String modifierCode, DefectsStainsDTO defectsStains, String material) {
        if (defectsStains == null) return false;

        // Рекомендації на основі плям
        if (defectsStains.getSelectedStains() != null && !defectsStains.getSelectedStains().isEmpty()) {
            if (modifierCode.contains("HEAVILY_SOILED")) {
                return defectsStains.getSelectedStains().size() > 2;
            }
        }

        // Рекомендації на основі ризиків
        if (defectsStains.getSelectedRisks() != null && !defectsStains.getSelectedRisks().isEmpty()) {
            if (modifierCode.contains("NO_GUARANTEE")) {
                return defectsStains.getSelectedRisks().contains("COLOR_CHANGE_RISK") ||
                       defectsStains.getSelectedRisks().contains("DEFORMATION_RISK");
            }
        }

        return false;
    }

    /**
     * Витягає значення діапазонних модифікаторів.
     */
    private List<PriceCalculationService.RangeModifierValue> extractRangeModifierValues(List<ModifierSelectionDTO> modifiers) {
        return modifiers.stream()
                .filter(ModifierSelectionDTO::getIsSelected)
                .filter(ModifierSelectionDTO::isRangeType)
                .filter(m -> m.getSelectedValue() != null)
                .map(m -> new PriceCalculationService.RangeModifierValue(m.getCode(), m.getSelectedValue()))
                .collect(Collectors.toList());
    }

    /**
     * Витягає кількості фіксованих модифікаторів.
     */
    private List<PriceCalculationService.FixedModifierQuantity> extractFixedModifierQuantities(List<ModifierSelectionDTO> modifiers) {
        return modifiers.stream()
                .filter(ModifierSelectionDTO::getIsSelected)
                .filter(ModifierSelectionDTO::isFixedType)
                .filter(m -> m.getQuantity() != null)
                .map(m -> new PriceCalculationService.FixedModifierQuantity(m.getCode(), m.getQuantity()))
                .collect(Collectors.toList());
    }
}
