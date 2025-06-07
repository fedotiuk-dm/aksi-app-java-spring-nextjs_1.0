package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.ModifierSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.mapper.PricingMapper;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координаційний сервіс для підетапу 2.4: Розрахунок ціни.
 *
 * ПРИНЦИП: НЕ дублює бізнес-логіку - тільки координує виклики до існуючих Pricing Domain сервісів.
 * Надає тонкий адаптаційний шар для інтеграції з Order Wizard State Machine.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PricingStepService {

    // ===== ДЕЛЕГУВАННЯ ДО PRICING DOMAIN =====

    private final PriceCalculationService priceCalculationService; // ВИКОРИСТОВУЄМО ГОТОВЕ!
    private final CatalogPriceModifierService catalogModifierService; // ВИКОРИСТОВУЄМО ГОТОВЕ!
    private final PricingMapper pricingMapper; // Тільки для трансформації DTO

    // ===== ОСНОВНІ МЕТОДИ (ТОНКІ КООРДИНАТОРИ) =====

    /**
     * Отримати базову ціну - ДЕЛЕГУВАННЯ до готового сервісу
     */
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Getting base price for category: {}, item: {}, color: {}", categoryCode, itemName, color);
        return priceCalculationService.getBasePrice(categoryCode, itemName, color);
    }

    /**
     * Отримати доступні модифікатори для категорії - ДЕЛЕГУВАННЯ до готового сервісу
     */
    public List<ModifierSelectionDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Getting available modifiers for category: {}", categoryCode);

        List<PriceModifierDTO> modifiers = catalogModifierService.getModifiersForServiceCategory(categoryCode);
        return modifiers.stream()
                .map(pricingMapper::toModifierSelectionDTO)
                .collect(Collectors.toList());
    }

    /**
     * Повний розрахунок ціни - ДЕЛЕГУВАННЯ до готового сервісу
     */
    public PriceCalculationResponseDTO calculateFullPrice(
            String categoryCode, String itemName, int quantity, String color,
            List<String> modifierCodes, boolean isExpedited,
            BigDecimal expediteFactor, BigDecimal discountPercent) {

        log.debug("Calculating full price for category: {}, item: {}", categoryCode, itemName);

        return priceCalculationService.calculatePrice(
                categoryCode, itemName, quantity, color,
                modifierCodes,
                new ArrayList<>(), // range modifiers
                new ArrayList<>(), // fixed modifiers
                isExpedited,
                expediteFactor != null ? expediteFactor : BigDecimal.ZERO,
                discountPercent != null ? discountPercent : BigDecimal.ZERO
        );
    }

    /**
     * Створити початковий розрахунок для UI
     */
    public PricingCalculationDTO createInitialCalculation(
            String categoryCode, String itemName, int quantity, String color) {

        log.debug("Creating initial calculation for UI");

        try {
            // Отримуємо базову ціну
            BigDecimal basePrice = getBasePrice(categoryCode, itemName, color);

            // Отримуємо доступні модифікатори
            List<ModifierSelectionDTO> availableModifiers = getAvailableModifiers(categoryCode);

            return PricingCalculationDTO.builder()
                    .baseUnitPrice(basePrice)
                    .quantity(quantity)
                    .unitOfMeasure("шт") // TODO: отримувати з сервісу
                    .baseTotal(basePrice.multiply(BigDecimal.valueOf(quantity)))
                    .availableModifiers(availableModifiers)
                    .finalUnitPrice(basePrice)
                    .finalTotalPrice(basePrice.multiply(BigDecimal.valueOf(quantity)))
                    .isValid(true)
                    .build();

        } catch (Exception e) {
            log.error("Error creating initial calculation: {}", e.getMessage(), e);
            return createErrorCalculation("Помилка створення початкового розрахунку: " + e.getMessage());
        }
    }

    /**
     * Перерахунок з модифікаторами
     */
    public PricingCalculationDTO recalculateWithModifiers(
            String categoryCode, String itemName, int quantity, String color,
            List<ModifierSelectionDTO> selectedModifiers,
            boolean isExpedited, BigDecimal expediteFactor, BigDecimal discountPercent) {

        log.debug("Recalculating with {} modifiers", selectedModifiers != null ? selectedModifiers.size() : 0);

        try {
            // Витягуємо коди вибраних модифікаторів
            List<String> modifierCodes = selectedModifiers != null ?
                    selectedModifiers.stream()
                            .filter(ModifierSelectionDTO::getIsSelected)
                            .map(ModifierSelectionDTO::getCode)
                            .collect(Collectors.toList()) :
                    new ArrayList<>();

            // ДЕЛЕГУЄМО до готового сервісу
            PriceCalculationResponseDTO response = calculateFullPrice(
                    categoryCode, itemName, quantity, color,
                    modifierCodes, isExpedited, expediteFactor, discountPercent);

            // Створюємо результат для UI
            return PricingCalculationDTO.builder()
                    .baseUnitPrice(response.getBaseUnitPrice())
                    .quantity(response.getQuantity())
                    .unitOfMeasure(response.getUnitOfMeasure())
                    .baseTotal(response.getBaseTotalPrice())
                    .selectedModifiers(selectedModifiers)
                    .finalUnitPrice(response.getFinalUnitPrice())
                    .finalTotalPrice(response.getFinalTotalPrice())
                    .isExpedited(isExpedited)
                    .expediteFactor(expediteFactor)
                    .discountPercent(discountPercent)
                    .isValid(true)
                    .build();

        } catch (Exception e) {
            log.error("Error recalculating with modifiers: {}", e.getMessage(), e);
            return createErrorCalculation("Помилка перерахунку з модифікаторами: " + e.getMessage());
        }
    }

    /**
     * Збереження розрахунку в контексті візарда (заглушка)
     */
    public PricingCalculationDTO savePricingCalculation(String wizardId, PricingCalculationDTO calculation) {
        log.debug("Saving pricing calculation for wizard: {}", wizardId);

        // TODO: зберегти в БД або кеш
        // Поки що просто повертаємо як є
        return calculation;
    }

    /**
     * Завантаження збереженого розрахунку (заглушка)
     */
    public PricingCalculationDTO loadPricingCalculation(String wizardId) {
        log.debug("Loading pricing calculation for wizard: {}", wizardId);

        // TODO: завантажити з БД або кеш
        // Поки що повертаємо null - означає треба ініціалізувати заново
        return null;
    }

    // ===== ДОПОМІЖНІ МЕТОДИ =====

    private PricingCalculationDTO createErrorCalculation(String errorMessage) {
        return PricingCalculationDTO.builder()
                .isValid(false)
                .validationErrors(List.of(errorMessage))
                .build();
    }
}


