package com.aksi.domain.order.statemachine.stage2.integration.domain.pricing;

import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceListDomainService;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * Фасад для інтеграції Stage 2 з Pricing Domain.
 * Інкапсулює всі операції з розрахунку цін, категорій та модифікаторів.
 *
 * @author Stage2 Integration Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PricingDomainFacade {

    private final PriceCalculationService priceCalculationService;
    private final PriceListDomainService priceListDomainService;
    private final CatalogPriceModifierService catalogPriceModifierService;

    /**
     * Отримує всі доступні категорії послуг
     */
    public List<ServiceCategoryDTO> getAllServiceCategories() {
        log.debug("Fetching all service categories for Stage 2");
        return priceListDomainService.getAllCategories();
    }

        /**
     * Отримує прайс-лист для конкретної категорії
     */
    public List<PriceListItemDTO> getPriceListByCategory(String categoryCode) {
        log.debug("Fetching price list for category: {}", categoryCode);
        return priceListDomainService.getItemsByCategoryCode(categoryCode);
    }

    /**
     * Отримує конкретний елемент прайс-листа за назвою
     */
    public PriceListItemDTO getPriceListItem(String categoryCode, String itemName) {
        log.debug("Fetching price list item: category={}, item={}", categoryCode, itemName);
        List<PriceListItemDTO> items = priceListDomainService.getItemsByCategoryCode(categoryCode);
        return items.stream()
                .filter(item -> itemName.equals(item.getName()))
                .findFirst()
                .orElse(null);
    }

        /**
     * Розраховує базову ціну для предмета
     */
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Calculating base price: category={}, item={}, color={}", categoryCode, itemName, color);
        return priceCalculationService.getBasePrice(categoryCode, itemName, color);
    }

    /**
     * Розраховує повну ціну з усіма модифікаторами
     */
    public PriceCalculationResponseDTO calculateFullPrice(
            String categoryCode,
            String itemName,
            int quantity,
            String color,
            List<String> modifierCodes,
            List<PriceCalculationService.RangeModifierValue> rangeModifierValues,
            List<PriceCalculationService.FixedModifierQuantity> fixedModifierQuantities,
            boolean isExpedited,
            BigDecimal expediteFactor,
            BigDecimal discountPercent) {

        log.debug("Calculating full price with modifiers for item: {}", itemName);
        return priceCalculationService.calculatePrice(
                categoryCode, itemName, quantity, color, modifierCodes,
                rangeModifierValues, fixedModifierQuantities,
                isExpedited, expediteFactor, discountPercent);
    }

        /**
     * Отримує доступні модифікатори для категорії
     */
    public List<String> getAvailableModifiersForCategory(String categoryCode) {
        log.debug("Fetching available modifiers for category: {}", categoryCode);
        return priceCalculationService.getAvailableModifiersForCategory(categoryCode);
    }

        /**
     * Розраховує повну ціну з PriceCalculationRequestDTO (рекомендований спосіб)
     */
    public PriceCalculationResponseDTO calculatePriceWithRequest(PriceCalculationRequestDTO request) {
        log.debug("Calculating price with request for item: {}", request.getItemName());

        // Конвертуємо DTO в records для сервісу
        List<PriceCalculationService.RangeModifierValue> rangeValues = null;
        if (request.getRangeModifierValues() != null) {
            rangeValues = request.getRangeModifierValues().stream()
                    .map(dto -> new PriceCalculationService.RangeModifierValue(
                            dto.getModifierId(), dto.getPercentage()))
                    .toList();
        }

        List<PriceCalculationService.FixedModifierQuantity> fixedQuantities = null;
        if (request.getFixedModifierQuantities() != null) {
            fixedQuantities = request.getFixedModifierQuantities().stream()
                    .map(dto -> new PriceCalculationService.FixedModifierQuantity(
                            dto.getModifierId(), dto.getQuantity()))
                    .toList();
        }

        return priceCalculationService.calculatePrice(
                request.getCategoryCode(),
                request.getItemName(),
                request.getQuantity(),
                request.getColor(),
                request.getModifierCodes(),
                rangeValues,
                fixedQuantities,
                request.isExpedited(),
                request.getExpeditePercent(),
                request.getDiscountPercent()
        );
    }

    /**
     * Отримує модифікатори за кодами
     */
    public List<PriceModifierDTO> getModifiersByCodes(List<String> modifierCodes) {
        log.debug("Fetching modifiers by codes: {}", modifierCodes);
        return catalogPriceModifierService.getModifiersByCodes(modifierCodes);
    }

    /**
     * Отримує всі модифікатори для категорії послуг
     */
    public List<PriceModifierDTO> getModifiersForServiceCategory(String categoryCode) {
        log.debug("Fetching modifiers for service category: {}", categoryCode);
        return catalogPriceModifierService.getModifiersForServiceCategory(categoryCode);
    }

    /**
     * Перевіряє чи існує комбінація категорія + предмет
     */
    public boolean validateCategoryItemCombination(String categoryCode, String itemName) {
        log.debug("Validating category-item combination: category={}, item={}", categoryCode, itemName);
        return getPriceListItem(categoryCode, itemName) != null;
    }

        /**
     * Отримує одиницю виміру для конкретного предмета
     */
    public String getUnitOfMeasure(String categoryCode, String itemName) {
        log.debug("Getting unit of measure: category={}, item={}", categoryCode, itemName);
        PriceListItemDTO priceItem = getPriceListItem(categoryCode, itemName);
        return priceItem != null ? priceItem.getUnitOfMeasure() : "шт";
    }

    /**
     * Додає рекомендовані модифікатори на основі забруднень та дефектів
     */
    public List<PriceModifierDTO> getRecommendedModifiers(String categoryCode, String materialType,
                                                         List<String> stains, List<String> defects) {
        log.debug("Getting recommended modifiers: category={}, material={}, stains={}, defects={}",
                categoryCode, materialType, stains, defects);

        return priceCalculationService.getRecommendedModifiersForItem(
                stains != null ? Set.copyOf(stains) : Set.of(),
                defects != null ? Set.copyOf(defects) : Set.of(),
                categoryCode,
                materialType
        );
    }

    /**
     * Отримує попередження про ризики для предмета
     */
    public List<String> getRiskWarnings(String categoryCode, String materialType,
                                       List<String> stains, List<String> defects) {
        log.debug("Getting risk warnings: category={}, material={}, stains={}, defects={}",
                categoryCode, materialType, stains, defects);

        return priceCalculationService.getRiskWarningsForItem(
                stains != null ? Set.copyOf(stains) : Set.of(),
                defects != null ? Set.copyOf(defects) : Set.of(),
                categoryCode,
                materialType
        );
    }

    /**
     * Отримує рекомендовану одиницю виміру для товару
     */
    public String getRecommendedUnitOfMeasure(String categoryCode, String itemName) {
        log.debug("Getting recommended unit of measure: category={}, item={}", categoryCode, itemName);
        return priceCalculationService.getRecommendedUnitOfMeasure(categoryCode, itemName);
    }
}
