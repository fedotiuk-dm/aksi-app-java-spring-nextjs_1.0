package com.aksi.domain.order.service.recommendation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.service.DefectTypeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для генерації рекомендацій модифікаторів на основі дефектів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DefectRecommendationService {

    private final DefectTypeService defectTypeService;
    private final RecommendationBaseService baseService;

    /**
     * Отримати рекомендовані модифікатори на основі дефектів предмета.
     * 
     * @param defects список типів дефектів предмета
     * @param categoryCode код категорії предмета
     * @param materialType тип матеріалу
     * @return список рекомендованих модифікаторів
     */
    public List<ModifierRecommendationDTO> getRecommendedModifiersForDefects(
            final Set<String> defects, 
            final String categoryCode, 
            final String materialType) {
            
        if (defects == null || defects.isEmpty()) {
            log.debug("Порожній список дефектів, рекомендації не потрібні");
            return List.of();
        }
        
        final Map<String, DefectTypeDTO> defectTypeByName = getDefectTypesByName(defects);
        if (defectTypeByName.isEmpty()) {
            return List.of();
        }
        
        log.debug("Отримання рекомендацій для {} типів дефектів", defects.size());
        return baseService.processModifierRecommendations(
            defects,
            defectTypeByName,
            DefectTypeDTO::getCode,
            categoryCode,
            (itemName, entity, info) -> String.format("Рекомендовано через дефект: %s", itemName)
        );
    }
    
    /**
     * Отримати попередження про ризики на основі дефектів.
     * 
     * @param defects список типів дефектів
     * @param materialType тип матеріалу
     * @param categoryCode код категорії предмета
     * @return список попереджень про ризики
     */
    public List<String> getRiskWarnings(
            final Set<String> defects, 
            final String materialType, 
            final String categoryCode) {
            
        if (defects == null || defects.isEmpty()) {
            return List.of();
        }
        
        final Map<String, DefectTypeDTO> defectTypeByName = getDefectTypesByName(defects);
        if (defectTypeByName.isEmpty()) {
            return List.of();
        }
        
        log.debug("Отримання попереджень про ризики для {} типів дефектів", defects.size());
        return baseService.processRiskWarnings(
            defects,
            defectTypeByName,
            (item, name) -> String.format("Ризик для дефекту '%s': %s", 
                name, item.getDescription())
        );
    }

    /**
     * Отримати мапу активних типів дефектів за їх назвою.
     * 
     * @param defects список дефектів (використовується для логування)
     * @return мапа типів дефектів за назвою
     */
    private Map<String, DefectTypeDTO> getDefectTypesByName(final Set<String> defects) {
        // Отримуємо всі активні типи дефектів
        final List<DefectTypeDTO> defectTypes = defectTypeService.getActiveDefectTypes();
        
        if (defectTypes == null || defectTypes.isEmpty()) {
            log.warn("Не знайдено активні типи дефектів у базі даних");
            return Map.of();
        }
        
        final Map<String, DefectTypeDTO> defectTypeByName = new HashMap<>();
        
        // Створюємо мапу для пошуку типу дефекту за назвою
        for (final DefectTypeDTO defectType : defectTypes) {
            defectTypeByName.put(defectType.getName(), defectType);
        }
        
        // Додаємо можливість використовувати параметр defects для майбутнього розширення
        // Наприклад, тут можна додати додаткову логіку з використанням множини defects
        
        log.debug("Підготовлено мапу з {} типів дефектів для {} дефектів замовлення", 
              defectTypeByName.size(), defects != null ? defects.size() : 0);
        
        return defectTypeByName;
    }
} 
