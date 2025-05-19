package com.aksi.domain.order.service;

import java.util.List;
import java.util.Set;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;

/**
 * Сервіс для генерації рекомендацій модифікаторів
 * на основі характеристик предмета (плями, дефекти, матеріал тощо).
 */
public interface ModifierRecommendationService {
    
    /**
     * Отримати рекомендовані модифікатори на основі плям на предметі.
     * 
     * @param stains список типів плям на предметі
     * @param categoryCode код категорії предмета
     * @param materialType тип матеріалу
     * @return список рекомендованих модифікаторів
     */
    List<ModifierRecommendationDTO> getRecommendedModifiersForStains(
            Set<String> stains, 
            String categoryCode, 
            String materialType);
    
    /**
     * Отримати рекомендовані модифікатори на основі дефектів предмета.
     * 
     * @param defects список типів дефектів предмета
     * @param categoryCode код категорії предмета
     * @param materialType тип матеріалу
     * @return список рекомендованих модифікаторів
     */
    List<ModifierRecommendationDTO> getRecommendedModifiersForDefects(
            Set<String> defects, 
            String categoryCode, 
            String materialType);
    
    /**
     * Отримати попередження про ризики на основі характеристик предмета.
     * 
     * @param stains список типів плям на предметі
     * @param defects список типів дефектів предмета
     * @param materialType тип матеріалу
     * @param categoryCode код категорії предмета
     * @return список попереджень про ризики
     */
    List<String> getRiskWarnings(
            Set<String> stains, 
            Set<String> defects, 
            String materialType, 
            String categoryCode);
} 
