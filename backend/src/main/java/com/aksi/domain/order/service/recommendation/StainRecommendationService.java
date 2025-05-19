package com.aksi.domain.order.service.recommendation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.service.StainTypeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для генерації рекомендацій модифікаторів на основі плям.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StainRecommendationService {

    private final StainTypeService stainTypeService;
    private final RecommendationBaseService baseService;

    /**
     * Отримати рекомендовані модифікатори на основі плям на предметі.
     * 
     * @param stains список типів плям на предметі
     * @param categoryCode код категорії предмета
     * @param materialType тип матеріалу
     * @return список рекомендованих модифікаторів
     */
    public List<ModifierRecommendationDTO> getRecommendedModifiersForStains(
            final Set<String> stains, 
            final String categoryCode, 
            final String materialType) {
            
        if (stains == null || stains.isEmpty()) {
            log.debug("Порожній список плям, рекомендації не потрібні");
            return List.of();
        }
        
        // Отримуємо всі активні типи плям
        final List<StainTypeDTO> stainTypes = stainTypeService.getActiveStainTypes();
        
        if (stainTypes == null || stainTypes.isEmpty()) {
            log.warn("Не знайдено активні типи плям у базі даних");
            return List.of();
        }
        
        final Map<String, StainTypeDTO> stainTypeByName = new HashMap<>();
        
        // Створюємо мапу для пошуку типу плями за назвою
        for (final StainTypeDTO stainType : stainTypes) {
            stainTypeByName.put(stainType.getName(), stainType);
        }
        
        log.debug("Отримання рекомендацій для {} типів плям", stains.size());
        return baseService.processModifierRecommendations(
            stains,
            stainTypeByName,
            StainTypeDTO::getCode,
            categoryCode,
            (itemName, entity, info) -> String.format("Рекомендовано через пляму: %s", itemName)
        );
    }
    
    /**
     * Отримати попередження про ризики на основі плям.
     * 
     * @param stains список типів плям
     * @param materialType тип матеріалу
     * @param categoryCode код категорії предмета
     * @return список попереджень про ризики
     */
    public List<String> getRiskWarnings(
            final Set<String> stains, 
            final String materialType, 
            final String categoryCode) {
            
        if (stains == null || stains.isEmpty()) {
            return List.of();
        }
        
        final List<StainTypeDTO> stainTypes = stainTypeService.getActiveStainTypes();
        
        if (stainTypes == null || stainTypes.isEmpty()) {
            log.warn("Не знайдено активні типи плям у базі даних");
            return List.of();
        }
        
        final Map<String, StainTypeDTO> stainTypeByName = new HashMap<>();
        
        for (final StainTypeDTO stainType : stainTypes) {
            stainTypeByName.put(stainType.getName(), stainType);
        }
        
        log.debug("Отримання попереджень про ризики для {} типів плям", stains.size());
        return baseService.processRiskWarnings(
            stains,
            stainTypeByName,
            (item, name) -> String.format("Ризик для плями '%s': %s", 
                name, item.getDescription())
        );
    }
} 
