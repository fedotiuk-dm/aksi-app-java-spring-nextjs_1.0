package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

/**
 * Інтерфейс сервісу для розрахунку цін з модифікаторами з бази даних.
 */
public interface PriceCalculationService {
    
    /**
     * Отримати базову ціну товару з прайс-листа.
     * 
     * @param categoryCode Код категорії товару
     * @param itemName Найменування товару
     * @param color Колір товару (може бути null)
     * @return Базова ціна
     */
    BigDecimal getBasePrice(String categoryCode, String itemName, String color);
    
    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів.
     *
     * @param categoryCode Код категорії товару
     * @param itemName Найменування товару
     * @param quantity Кількість
     * @param color Колір (може бути null)
     * @param modifierCodes Список кодів модифікаторів для застосування
     * @param rangeModifierValues Значення для модифікаторів з діапазоном
     * @param fixedModifierQuantities Кількості для фіксованих модифікаторів
     * @param isExpedited Чи замовлення термінове
     * @param expediteFactor Коефіцієнт терміновості (відсоток)
     * @param discountPercent Відсоток знижки
     * @return DTO з результатами розрахунку ціни
     */
    PriceCalculationResponseDTO calculatePrice(
            String categoryCode,
            String itemName,
            int quantity,
            String color,
            List<String> modifierCodes,
            List<RangeModifierValue> rangeModifierValues,
            List<FixedModifierQuantity> fixedModifierQuantities,
            boolean isExpedited,
            BigDecimal expediteFactor,
            BigDecimal discountPercent);
    
    /**
     * Отримати список доступних модифікаторів для категорії.
     * 
     * @param categoryCode Код категорії
     * @return Список кодів доступних модифікаторів
     */
    List<String> getAvailableModifiersForCategory(String categoryCode);
    
    /**
     * Запис для значення діапазонного модифікатора.
     * 
     * @param modifierCode Код модифікатора
     * @param value Значення в діапазоні (відсоток)
     */
    record RangeModifierValue(String modifierCode, BigDecimal value) {}
    
    /**
     * Запис для кількості фіксованого модифікатора.
     * 
     * @param modifierCode Код модифікатора
     * @param quantity Кількість
     */
    record FixedModifierQuantity(String modifierCode, int quantity) {}
    
    /**
     * Повертає рекомендовані модифікатори на основі забруднень та дефектів.
     * 
     * @param stains список плям
     * @param defects список дефектів
     * @param categoryCode код категорії
     * @param materialType тип матеріалу
     * @return список рекомендованих модифікаторів
     */
    List<PriceModifierDTO> getRecommendedModifiersForItem(
            Set<String> stains, 
            Set<String> defects, 
            String categoryCode, 
            String materialType);
    
    /**
     * Отримує попередження про ризики для предмета.
     * 
     * @param stains список плям
     * @param defects список дефектів
     * @param categoryCode код категорії
     * @param materialType тип матеріалу
     * @return список попереджень
     */
    List<String> getRiskWarningsForItem(
            Set<String> stains, 
            Set<String> defects, 
            String categoryCode, 
            String materialType);
    
    /**
     * Отримує рекомендовану одиницю виміру для товару.
     * 
     * @param categoryCode Код категорії послуг
     * @param itemName Назва товару
     * @return Рекомендована одиниця виміру (шт, кг, кв.м, пара)
     */
    String getRecommendedUnitOfMeasure(String categoryCode, String itemName);
} 
