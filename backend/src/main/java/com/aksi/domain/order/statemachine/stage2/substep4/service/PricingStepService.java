package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для загальних операцій підетапу ціноутворення.
 * Відповідальність: збереження/завантаження розрахунків та доступ до модифікаторів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PricingStepService {

    private final CatalogPriceModifierService catalogPriceModifierService;
    private final PriceCalculationCoordinatorService coordinatorService;
    private final OrderWizardPersistenceService persistenceService;

        /**
     * Зберігає розрахунок ціни в контексті візарда.
     */
    public PricingCalculationDTO savePricingCalculation(String wizardId, PricingCalculationDTO calculation) {
        log.debug("Збереження розрахунку для wizardId: {}", wizardId);

        try {
            // Зберігаємо розрахунок в persistence через wizard context
            persistenceService.saveWizardData(wizardId, "pricingCalculation", calculation, 2, 4);
            log.debug("Розрахунок успішно збережено для wizardId: {}", wizardId);
            return calculation;
        } catch (Exception e) {
            log.error("Помилка збереження розрахунку для wizardId {}: {}", wizardId, e.getMessage());
            // Повертаємо calculation навіть при помилці збереження
            return calculation;
        }
    }

        /**
     * Завантажує збережений розрахунок з контексту візарда.
     */
    public PricingCalculationDTO loadPricingCalculation(String wizardId) {
        log.debug("Завантаження розрахунку для wizardId: {}", wizardId);

        try {
            // Завантажуємо всі дані wizardId
            var wizardData = persistenceService.loadWizardData(wizardId);

            // Шукаємо розрахунок у збережених даних
            Object calculationObj = wizardData.get("pricingCalculation");

            if (calculationObj instanceof PricingCalculationDTO) {
                log.debug("Розрахунок успішно завантажено для wizardId: {}", wizardId);
                return (PricingCalculationDTO) calculationObj;
            } else if (calculationObj != null) {
                log.warn("Знайдено об'єкт для pricingCalculation, але він має неочікуваний тип: {}",
                         calculationObj.getClass().getName());
            } else {
                log.debug("Розрахунок не знайдено для wizardId: {}", wizardId);
            }

            return null;
        } catch (Exception e) {
            log.error("Помилка завантаження розрахунку для wizardId {}: {}", wizardId, e.getMessage());
            return null;
        }
    }

    /**
     * Отримує доступні модифікатори для категорії.
     */
    public List<ModifierSelectionDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Отримання модифікаторів для категорії: {}", categoryCode);

        try {
            // Використовуємо готовий сервіс каталогу з pricing domain
            List<PriceModifierDTO> priceModifiers = catalogPriceModifierService
                    .getModifiersForServiceCategory(categoryCode);

            // Конвертуємо в DTO підетапу
            return priceModifiers.stream()
                    .map(this::convertToModifierSelectionDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Помилка отримання модифікаторів для категорії {}: {}", categoryCode, e.getMessage());
            return List.of();
        }
    }

    /**
     * Конвертує PriceModifierDTO з pricing domain в ModifierSelectionDTO підетапу.
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
}
