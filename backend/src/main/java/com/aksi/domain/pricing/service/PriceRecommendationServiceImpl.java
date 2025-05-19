package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.service.ModifierRecommendationService;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи з рекомендаціями модифікаторів.
 * Відповідає за:
 * - Отримання рекомендованих модифікаторів на основі плям та дефектів
 * - Формування списку модифікаторів з врахуванням категорії та матеріалу
 * - Встановлення рекомендованих значень для діапазонних модифікаторів
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceRecommendationServiceImpl implements PriceRecommendationService {

    private final ModifierRecommendationService recommendationService;
    private final CatalogPriceModifierService modifierService;
    
    /**
     * Повертає рекомендовані модифікатори на основі забруднень та дефектів.
     * Враховує категорію послуг та тип матеріалу для більш точних рекомендацій.
     * 
     * @param stains список плям для аналізу
     * @param defects список дефектів для аналізу
     * @param categoryCode код категорії послуг
     * @param materialType тип матеріалу виробу
     * @return список рекомендованих модифікаторів з встановленими значеннями
     */
    @Override
    public List<PriceModifierDTO> getRecommendedModifiersForItem(
            Set<String> stains, 
            Set<String> defects, 
            String categoryCode, 
            String materialType) {
        
        List<PriceModifierDTO> recommendedModifiers = new ArrayList<>();
        
        // Отримуємо рекомендації на основі плям
        if (stains != null && !stains.isEmpty()) {
            List<ModifierRecommendationDTO> stainRecommendations = 
                    recommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType);
            processModifierRecommendations(stainRecommendations, recommendedModifiers, false);
        }
        
        // Отримуємо рекомендації на основі дефектів
        if (defects != null && !defects.isEmpty()) {
            List<ModifierRecommendationDTO> defectRecommendations = 
                    recommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType);
            processModifierRecommendations(defectRecommendations, recommendedModifiers, true);
        }
        
        return recommendedModifiers;
    }
    
    /**
     * Обробляє список рекомендацій та перетворює їх у модифікатори цін
     * 
     * @param recommendations список рекомендацій для обробки
     * @param recommendedModifiers існуючий список рекомендованих модифікаторів
     * @param checkForDuplicates чи перевіряти наявність дублікатів
     */
    private void processModifierRecommendations(
            List<ModifierRecommendationDTO> recommendations,
            List<PriceModifierDTO> recommendedModifiers,
            boolean checkForDuplicates) {
        
        recommendations.forEach(rec -> {
            // Перевіряємо, чи вже додано цей модифікатор, якщо потрібно
            boolean shouldAdd = !checkForDuplicates || 
                    recommendedModifiers.stream()
                        .noneMatch(m -> m.getCode().equals(rec.getCode()));
            
            if (shouldAdd) {
                PriceModifierDTO modifier = modifierService.getModifierByCode(rec.getCode());
                if (modifier != null) {
                    // Якщо є рекомендоване значення, встановлюємо його
                    if (rec.getRecommendedValue() != null) {
                        modifier.setValue(BigDecimal.valueOf(rec.getRecommendedValue()));
                    }
                    recommendedModifiers.add(modifier);
                }
            }
        });
    }
} 