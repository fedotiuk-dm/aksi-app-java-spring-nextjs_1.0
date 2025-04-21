package com.aksi.service.catalog;

import com.aksi.domain.order.entity.StainType;
import com.aksi.dto.catalog.MaterialWarningDto;
import com.aksi.dto.catalog.ModifierRecommendationDto;

import java.util.List;
import java.util.UUID;

/**
 * Сервіс для роботи з каталогами та допоміжними даними
 * для реалізації інтелектуальних залежностей в системі.
 */
public interface CatalogService {

    /**
     * Отримати список доступних матеріалів для вказаної категорії.
     *
     * @param categoryId ID категорії
     * @return Список матеріалів
     */
    List<String> getMaterialsForCategory(UUID categoryId);

    /**
     * Отримати список доступних матеріалів для категорії за її кодом.
     *
     * @param categoryCode Код категорії
     * @return Список матеріалів
     */
    List<String> getMaterialsForCategoryByCode(String categoryCode);

    /**
     * Отримати рекомендовані модифікатори на основі типів забруднень.
     *
     * @param stainTypes Список типів забруднень
     * @return Список рекомендованих модифікаторів
     */
    List<ModifierRecommendationDto> getRecommendedModifiersForStains(List<StainType> stainTypes);

    /**
     * Отримати попередження для вказаної комбінації матеріалу та типів забруднень.
     *
     * @param material Матеріал предмета
     * @param stainTypes Список типів забруднень
     * @return Список попереджень
     */
    List<MaterialWarningDto> getWarningsForMaterialAndStains(String material, List<StainType> stainTypes);
    
    /**
     * Додати зв'язок між категорією та матеріалом.
     *
     * @param categoryId ID категорії
     * @param material Назва матеріалу
     * @param sortOrder Порядок сортування
     * @return true, якщо зв'язок успішно додано
     */
    boolean addMaterialToCategory(UUID categoryId, String material, Integer sortOrder);
    
    /**
     * Додати рекомендацію модифікатора для типу забруднення.
     *
     * @param stainType Тип забруднення
     * @param modifierName Назва модифікатора
     * @param modifierType Тип модифікатора (PERCENTAGE або FIXED)
     * @param modifierValue Значення модифікатора
     * @param description Опис рекомендації
     * @param priority Пріоритет
     * @return true, якщо рекомендацію успішно додано
     */
    boolean addStainModifierRecommendation(StainType stainType, String modifierName, 
                                         String modifierType, double modifierValue, 
                                         String description, int priority);
    
    /**
     * Додати попередження для комбінації матеріалу та типу забруднення.
     *
     * @param material Назва матеріалу
     * @param stainType Тип забруднення (може бути null для загальних попереджень)
     * @param warningType Тип попередження
     * @param warningMessage Текст попередження
     * @param severity Серйозність попередження
     * @return true, якщо попередження успішно додано
     */
    boolean addMaterialStainWarning(String material, StainType stainType,
                                  String warningType, String warningMessage,
                                  String severity);
}
