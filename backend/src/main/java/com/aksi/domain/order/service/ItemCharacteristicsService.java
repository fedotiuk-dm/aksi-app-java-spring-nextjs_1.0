package com.aksi.domain.order.service;

import java.util.List;

/**
 * Сервіс для роботи з характеристиками предметів замовлення.
 */
public interface ItemCharacteristicsService {
    
    // ---------- Характеристики предмета ----------
    
    /**
     * Отримати доступні матеріали для категорії.
     * 
     * @param category Категорія предмета (опціонально)
     * @return Список доступних матеріалів
     */
    List<String> getMaterialsByCategory(String category);
    
    /**
     * Отримати доступні базові кольори.
     * 
     * @return Список базових кольорів
     */
    List<String> getAllColors();
    
    /**
     * Отримати типи наповнювачів.
     * 
     * @return Список типів наповнювачів
     */
    List<String> getAllFillerTypes();
    
    /**
     * Отримати ступені зносу.
     * 
     * @return Список ступенів зносу
     */
    List<String> getAllWearDegrees();
    
    // ---------- Забруднення та дефекти ----------
    
    /**
     * Отримати всі типи плям.
     * 
     * @return Список доступних типів плям
     */
    List<String> getAllStainTypes();
    
    /**
     * Отримати всі типи дефектів та ризиків.
     * 
     * @return Список доступних типів дефектів та ризиків
     */
    List<String> getAllDefectsAndRisks();
    
    /**
     * Отримати тільки типи дефектів.
     * 
     * @return Список типів дефектів
     */
    List<String> getDefects();
    
    /**
     * Отримати тільки типи ризиків.
     * 
     * @return Список типів ризиків
     */
    List<String> getRisks();
}
