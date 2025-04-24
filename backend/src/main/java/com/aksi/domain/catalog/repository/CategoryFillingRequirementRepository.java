package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.CategoryFillingRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Репозиторій для роботи з вимогами наповнювачів для категорій.
 */
@Repository
public interface CategoryFillingRequirementRepository extends JpaRepository<CategoryFillingRequirement, UUID> {
    
    /**
     * Знаходить інформацію про потребу наповнювача для вказаної категорії.
     *
     * @param categoryId ID категорії
     * @return Optional з інформацією про потребу наповнювача
     */
    Optional<CategoryFillingRequirement> findByCategoryId(UUID categoryId);
    
    /**
     * Знаходить інформацію про потребу наповнювача за кодом категорії.
     *
     * @param categoryCode Код категорії
     * @return Optional з інформацією про потребу наповнювача
     */
    @Query("SELECT cfr FROM CategoryFillingRequirement cfr WHERE cfr.category.code = :categoryCode")
    Optional<CategoryFillingRequirement> findByCategoryCode(@Param("categoryCode") String categoryCode);
}
