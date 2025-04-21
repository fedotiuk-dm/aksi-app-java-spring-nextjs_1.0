package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.StainModifierRecommendation;
import com.aksi.domain.order.entity.StainType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи з рекомендаціями модифікаторів на основі типів забруднень.
 */
@Repository
public interface StainModifierRecommendationRepository extends JpaRepository<StainModifierRecommendation, UUID> {
    
    /**
     * Знаходить всі рекомендації для вказаного типу забруднення,
     * відсортовані за пріоритетом (вищий пріоритет спочатку).
     *
     * @param stainType Тип забруднення
     * @return Список рекомендацій
     */
    List<StainModifierRecommendation> findByStainTypeOrderByPriorityDesc(StainType stainType);
    
    /**
     * Знаходить всі рекомендації для кількох типів забруднень,
     * відсортовані за пріоритетом (вищий пріоритет спочатку).
     *
     * @param stainTypes Список типів забруднень
     * @return Список рекомендацій
     */
    List<StainModifierRecommendation> findByStainTypeInOrderByPriorityDesc(List<StainType> stainTypes);
}
