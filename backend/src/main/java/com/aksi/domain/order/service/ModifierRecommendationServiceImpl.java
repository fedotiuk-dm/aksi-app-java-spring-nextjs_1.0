package com.aksi.domain.order.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.service.recommendation.DefectRecommendationService;
import com.aksi.domain.order.service.recommendation.StainRecommendationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу рекомендацій модифікаторів.
 * Делегує виконання спеціалізованим сервісам.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ModifierRecommendationServiceImpl implements ModifierRecommendationService {

    private final StainRecommendationService stainRecommendationService;
    private final DefectRecommendationService defectRecommendationService;

    @Override
    public List<ModifierRecommendationDTO> getRecommendedModifiersForStains(final Set<String> stains, final String categoryCode, final String materialType) {
        log.debug("Запит на отримання рекомендованих модифікаторів для плям: {}", stains);
        return stainRecommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType);
    }

    @Override
    public List<ModifierRecommendationDTO> getRecommendedModifiersForDefects(final Set<String> defects, final String categoryCode, final String materialType) {
        log.debug("Запит на отримання рекомендованих модифікаторів для дефектів: {}", defects);
        return defectRecommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType);
    }

    @Override
    public List<String> getRiskWarnings(final Set<String> stains, final Set<String> defects, final String materialType, final String categoryCode) {
        final List<String> warnings = new ArrayList<>();

        // Обробляємо попередження для плям
        if (stains != null && !stains.isEmpty()) {
            warnings.addAll(stainRecommendationService.getRiskWarnings(stains, materialType, categoryCode));
        }

        // Обробляємо попередження для дефектів
        if (defects != null && !defects.isEmpty()) {
            warnings.addAll(defectRecommendationService.getRiskWarnings(defects, materialType, categoryCode));
        }

        return warnings;
    }
}
