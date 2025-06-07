package com.aksi.domain.order.statemachine.stage2.integration;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceListDomainService;
import com.aksi.domain.pricing.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс інтеграції з Pricing Domain для етапу 2 Order Wizard
 *
 * Інкапсулює взаємодію з доменом ціноутворення для:
 * - Отримання категорій послуг
 * - Отримання прайс-листів
 * - Розрахунку цін на предмети
 * - Роботи з модифікаторами цін
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PricingIntegrationService {

    private final PriceListDomainService priceListDomainService;
    private final PriceCalculationService priceCalculationService;
    private final ServiceCategoryService serviceCategoryService;

    /**
     * Отримує всі доступні категорії послуг
     */
    public List<ServiceCategoryDTO> getServiceCategories() {
        log.debug("Отримання категорій послуг з Pricing Domain");

        try {
            List<ServiceCategoryDTO> categories = serviceCategoryService.getAllActiveCategories();
            log.debug("✅ Отримано {} активних категорій послуг", categories.size());
            return categories;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні категорій послуг: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати категорії послуг", e);
        }
    }

    /**
     * Отримує категорію за кодом
     */
    public ServiceCategoryDTO getCategoryByCode(String categoryCode) {
        log.debug("Отримання категорії за кодом: {}", categoryCode);

        try {
            ServiceCategoryDTO category = serviceCategoryService.getCategoryByCode(categoryCode);
            log.debug("✅ Отримано категорію: {}", category.getName());
            return category;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні категорії з кодом {}: {}", categoryCode, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати категорію з кодом " + categoryCode, e);
        }
    }

    /**
     * Отримує прайс-лист для конкретної категорії за кодом
     */
    public List<PriceListItemDTO> getPriceListItemsByCode(String categoryCode) {
        log.debug("Отримання прайс-листу для категорії: {}", categoryCode);

        try {
            List<PriceListItemDTO> items = priceListDomainService.getItemsByCategoryCode(categoryCode);
            log.debug("✅ Отримано {} позицій прайс-листу для категорії {}", items.size(), categoryCode);
            return items;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні прайс-листу для категорії {}: {}", categoryCode, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати прайс-лист для категорії " + categoryCode, e);
        }
    }

    /**
     * Отримує прайс-лист для конкретної категорії за UUID
     */
    public List<PriceListItemDTO> getPriceListItemsById(UUID categoryId) {
        log.debug("Отримання прайс-листу для категорії: {}", categoryId);

        try {
            List<PriceListItemDTO> items = priceListDomainService.getItemsByCategory(categoryId);
            log.debug("✅ Отримано {} позицій прайс-листу для категорії {}", items.size(), categoryId);
            return items;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні прайс-листу для категорії {}: {}", categoryId, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати прайс-лист для категорії " + categoryId, e);
        }
    }

    /**
     * Розраховує базову ціну для предмета
     */
    public BigDecimal calculateBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Розрахунок базової ціни: категорія={}, предмет={}, колір={}",
                  categoryCode, itemName, color);

        try {
            BigDecimal basePrice = priceCalculationService.getBasePrice(categoryCode, itemName, color);
            log.debug("✅ Базова ціна розрахована: {}", basePrice);
            return basePrice;

        } catch (Exception e) {
            log.error("❌ Помилка при розрахунку базової ціни: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося розрахувати базову ціну", e);
        }
    }

    /**
     * Розраховує повну ціну з модифікаторами
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

        log.debug("Розрахунок повної ціни з модифікаторами для предмета: {}", itemName);

        try {
            PriceCalculationResponseDTO result = priceCalculationService.calculatePrice(
                categoryCode, itemName, quantity, color, modifierCodes,
                rangeModifierValues, fixedModifierQuantities, isExpedited, expediteFactor, discountPercent
            );

            log.debug("✅ Повна ціна розрахована: базова={}, остаточна={}",
                      result.getBaseTotalPrice(), result.getFinalTotalPrice());
            return result;

        } catch (Exception e) {
            log.error("❌ Помилка при розрахунку повної ціни: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося розрахувати повну ціну", e);
        }
    }

    /**
     * Отримує доступні модифікатори для категорії
     */
    public List<String> getAvailableModifiersForCategory(String categoryCode) {
        log.debug("Отримання доступних модифікаторів для категорії: {}", categoryCode);

        try {
            List<String> modifiers = priceCalculationService.getAvailableModifiersForCategory(categoryCode);
            log.debug("✅ Отримано {} модифікаторів для категорії {}", modifiers.size(), categoryCode);
            return modifiers;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні модифікаторів для категорії {}: {}", categoryCode, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Отримує рекомендовані модифікатори на основі плям та дефектів
     */
    public List<PriceModifierDTO> getRecommendedModifiers(
            Set<String> stains,
            Set<String> defects,
            String categoryCode,
            String materialType) {

        log.debug("Отримання рекомендованих модифікаторів: категорія={}, матеріал={}", categoryCode, materialType);

        try {
            List<PriceModifierDTO> recommendations = priceCalculationService.getRecommendedModifiersForItem(
                stains, defects, categoryCode, materialType
            );

            log.debug("✅ Отримано {} рекомендованих модифікаторів", recommendations.size());
            return recommendations;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні рекомендованих модифікаторів: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Отримує попередження про ризики
     */
    public List<String> getRiskWarnings(
            Set<String> stains,
            Set<String> defects,
            String categoryCode,
            String materialType) {

        log.debug("Отримання попереджень про ризики: категорія={}, матеріал={}", categoryCode, materialType);

        try {
            List<String> warnings = priceCalculationService.getRiskWarningsForItem(
                stains, defects, categoryCode, materialType
            );

            log.debug("✅ Отримано {} попереджень про ризики", warnings.size());
            return warnings;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні попереджень про ризики: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Отримує рекомендовану одиницю виміру
     */
    public String getRecommendedUnitOfMeasure(String categoryCode, String itemName) {
        log.debug("Отримання рекомендованої одиниці виміру: категорія={}, предмет={}", categoryCode, itemName);

        try {
            String unit = priceCalculationService.getRecommendedUnitOfMeasure(categoryCode, itemName);
            log.debug("✅ Рекомендована одиниця виміру: {}", unit);
            return unit;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні рекомендованої одиниці виміру: {}", e.getMessage(), e);
            return "шт"; // За замовчуванням
        }
    }

    /**
     * Перевіряє чи категорія доступна
     */
    public boolean isCategoryAvailable(String categoryCode) {
        log.debug("Перевірка доступності категорії: {}", categoryCode);

        try {
            ServiceCategoryDTO category = serviceCategoryService.getCategoryByCode(categoryCode);
            return category != null;

        } catch (Exception e) {
            log.debug("Категорія {} не доступна: {}", categoryCode, e.getMessage());
            return false;
        }
    }

    /**
     * Перевіряє чи предмет доступний в категорії
     */
    public boolean isItemAvailable(String categoryCode, String itemName) {
        log.debug("Перевірка доступності предмета: категорія={}, предмет={}", categoryCode, itemName);

        try {
            List<PriceListItemDTO> items = getPriceListItemsByCode(categoryCode);
            return items.stream()
                .anyMatch(item -> item.getName().equalsIgnoreCase(itemName) && item.isActive());

        } catch (Exception e) {
            log.debug("Предмет {}/{} не доступний: {}", categoryCode, itemName, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує назви предметів за категорією для автокомпліту
     */
    public List<String> getItemNamesByCategory(UUID categoryId) {
        log.debug("Отримання назв предметів за категорією: {}", categoryId);

        try {
            List<String> itemNames = priceListDomainService.getItemNamesByCategory(categoryId);
            log.debug("✅ Отримано {} назв предметів", itemNames.size());
            return itemNames;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні назв предметів: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
