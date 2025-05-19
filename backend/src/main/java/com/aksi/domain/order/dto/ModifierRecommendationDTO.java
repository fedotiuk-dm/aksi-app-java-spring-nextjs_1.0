package com.aksi.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для рекомендацій модифікаторів ціни на основі плям та дефектів.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifierRecommendationDTO {

    /**
     * Ідентифікатор модифікатора
     */
    private String modifierId;

    /**
     * Код модифікатора
     */
    private String code;

    /**
     * Назва модифікатора
     */
    private String name;

    /**
     * Опис причини рекомендації
     */
    private String reason;

    /**
     * Рекомендоване значення модифікатора (якщо застосовується)
     */
    private Double recommendedValue;

    /**
     * Рівень важливості рекомендації
     * HIGH - критично важливо застосувати
     * MEDIUM - рекомендовано застосувати
     * LOW - можливо застосувати
     */
    private RecommendationPriority priority;

    /**
     * Сповіщення про ризик
     */
    private String riskWarning;

    /**
     * Перелік пріоритетів рекомендацій
     */
    public enum RecommendationPriority {
        HIGH, MEDIUM, LOW
    }
}
