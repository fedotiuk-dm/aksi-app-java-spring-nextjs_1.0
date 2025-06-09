package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс операцій для підетапу 2.4: Знижки та надбавки.
 * Тонка обгортка над доменними сервісами pricing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceDiscountOperationsService {

    private final PriceCalculationService priceCalculationService;
    private final CatalogPriceModifierService catalogPriceModifierService;

        /**
     * Розрахунок ціни з модифікаторами.
     */
    public PriceCalculationResponseDTO calculatePrice(PriceCalculationRequestDTO request) {
        log.debug("Розрахунок ціни для категорії: {}, предмет: {}",
                  request.getCategoryCode(), request.getItemName());

        try {
            // Конвертуємо DTO в параметри для сервісу
            return priceCalculationService.calculatePrice(
                    request.getCategoryCode(),
                    request.getItemName(),
                    request.getQuantity(),
                    request.getColor(),
                    request.getModifierCodes(),
                    convertRangeModifierValues(request.getRangeModifierValues()),
                    convertFixedModifierQuantities(request.getFixedModifierQuantities()),
                    request.isExpedited(),
                    request.getExpeditePercent(),
                    request.getDiscountPercent()
            );
        } catch (Exception e) {
            log.error("Помилка при розрахунку ціни: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося розрахувати ціну: " + e.getMessage(), e);
        }
    }

    /**
     * Конвертує RangeModifierValueDTO в RangeModifierValue.
     */
    private List<PriceCalculationService.RangeModifierValue> convertRangeModifierValues(
            List<PriceCalculationRequestDTO.RangeModifierValueDTO> dtoList) {
        if (dtoList == null) {
            return List.of();
        }
        return dtoList.stream()
                .map(dto -> new PriceCalculationService.RangeModifierValue(dto.getModifierId(), dto.getPercentage()))
                .toList();
    }

    /**
     * Конвертує FixedModifierQuantityDTO в FixedModifierQuantity.
     */
    private List<PriceCalculationService.FixedModifierQuantity> convertFixedModifierQuantities(
            List<PriceCalculationRequestDTO.FixedModifierQuantityDTO> dtoList) {
        if (dtoList == null) {
            return List.of();
        }
        return dtoList.stream()
                .map(dto -> new PriceCalculationService.FixedModifierQuantity(dto.getModifierId(), dto.getQuantity()))
                .toList();
    }

    /**
     * Отримання доступних модифікаторів для категорії.
     */
    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        log.debug("Отримання модифікаторів для категорії: {}", categoryCode);

        try {
            return catalogPriceModifierService.getModifiersForServiceCategory(categoryCode);
        } catch (Exception e) {
            log.error("Помилка при отриманні модифікаторів для категорії {}: {}", categoryCode, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати модифікатори: " + e.getMessage(), e);
        }
    }

    /**
     * Отримання всіх активних модифікаторів.
     */
    public List<PriceModifierDTO> getAllActiveModifiers() {
        log.debug("Отримання всіх активних модифікаторів");

        try {
            return catalogPriceModifierService.getAllActiveModifiers();
        } catch (Exception e) {
            log.error("Помилка при отриманні всіх модифікаторів: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати модифікатори: " + e.getMessage(), e);
        }
    }

    /**
     * Отримання модифікатора за кодом.
     */
    public PriceModifierDTO getModifierByCode(String modifierCode) {
        log.debug("Отримання модифікатора за кодом: {}", modifierCode);

        try {
            return catalogPriceModifierService.getModifierByCode(modifierCode);
        } catch (Exception e) {
            log.error("Помилка при отриманні модифікатора {}: {}", modifierCode, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати модифікатор: " + e.getMessage(), e);
        }
    }

    /**
     * Перевірка існування модифікатора.
     */
    public boolean modifierExists(String modifierCode) {
        try {
            PriceModifierDTO modifier = catalogPriceModifierService.getModifierByCode(modifierCode);
            return modifier != null && modifier.isActive();
        } catch (Exception e) {
            log.debug("Модифікатор {} не існує або неактивний", modifierCode);
            return false;
        }
    }

    /**
     * Валідація модифікаторів.
     */
    public boolean validateModifiers(List<String> modifierIds) {
        if (modifierIds == null || modifierIds.isEmpty()) {
            return true; // Модифікатори не обов'язкові
        }

        for (String modifierId : modifierIds) {
            if (!modifierExists(modifierId)) {
                log.warn("Неіснуючий або неактивний модифікатор: {}", modifierId);
                return false;
            }
        }

        return true;
    }

    /**
     * Отримання рекомендованих модифікаторів для категорії та предмета.
     */
    public List<PriceModifierDTO> getRecommendedModifiers(String categoryCode, String itemName) {
        log.debug("Отримання рекомендованих модифікаторів для категорії: {}, предмет: {}", categoryCode, itemName);

        try {
            // Поки що повертаємо модифікатори за категорією
            // В майбутньому можна додати логіку рекомендацій на основі предмета
            return getAvailableModifiers(categoryCode);
        } catch (Exception e) {
            log.error("Помилка при отриманні рекомендованих модифікаторів: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати рекомендовані модифікатори: " + e.getMessage(), e);
        }
    }
}
