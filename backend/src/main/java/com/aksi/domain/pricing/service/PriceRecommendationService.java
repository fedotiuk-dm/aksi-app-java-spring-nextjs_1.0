package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.Set;

import com.aksi.domain.pricing.dto.PriceModifierDTO;

/**
 * Інтерфейс сервісу для роботи з рекомендаціями модифікаторів.
 */
public interface PriceRecommendationService {

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
}
