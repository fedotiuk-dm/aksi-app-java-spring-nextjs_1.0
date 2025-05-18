package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;

/**
 * Сервіс для роботи з модифікаторами цін.
 */
public interface PriceModifierService {
    
    /**
     * Отримати всі активні модифікатори цін.
     * 
     * @return Список всіх активних модифікаторів
     */
    List<PriceModifierDTO> getAllActiveModifiers();
    
    /**
     * Отримати модифікатор за ID.
     * 
     * @param id ID модифікатора
     * @return Модифікатор або null, якщо не знайдено
     */
    PriceModifierDTO getModifierById(UUID id);
    
    /**
     * Отримати модифікатор за кодом.
     * 
     * @param code Код модифікатора
     * @return Модифікатор або null, якщо не знайдено
     */
    PriceModifierDTO getModifierByCode(String code);
    
    /**
     * Отримати модифікатори для категорії послуг.
     * 
     * @param categoryCode Код категорії (CLOTHING, LEATHER, etc.)
     * @return Список модифікаторів, доступних для цієї категорії
     */
    List<PriceModifierDTO> getModifiersForServiceCategory(String categoryCode);
    
    /**
     * Створити новий модифікатор.
     * 
     * @param modifierDTO Дані модифікатора
     * @return Створений модифікатор
     */
    PriceModifierDTO createModifier(PriceModifierDTO modifierDTO);
    
    /**
     * Оновити існуючий модифікатор.
     * 
     * @param id ID модифікатора
     * @param modifierDTO Нові дані модифікатора
     * @return Оновлений модифікатор
     */
    PriceModifierDTO updateModifier(UUID id, PriceModifierDTO modifierDTO);
    
    /**
     * Деактивувати модифікатор (soft delete).
     * 
     * @param id ID модифікатора
     */
    void deactivateModifier(UUID id);
    
    /**
     * Отримати модифікатори за категорією (GENERAL, TEXTILE, LEATHER).
     * 
     * @param category Категорія модифікатора
     * @return Список модифікаторів у категорії
     */
    List<PriceModifierDTO> getModifiersByCategory(ModifierCategory category);
    
    /**
     * Отримати модифікатори за списком кодів.
     * 
     * @param codes Список кодів модифікаторів
     * @return Список модифікаторів
     */
    List<PriceModifierDTO> getModifiersByCodes(List<String> codes);
} 