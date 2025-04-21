package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.CategoryMaterialMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи зі зв'язками категорій та матеріалів.
 */
@Repository
public interface CategoryMaterialMappingRepository extends JpaRepository<CategoryMaterialMapping, UUID> {
    
    /**
     * Знаходить усі матеріали, доступні для вказаної категорії, відсортовані за порядком.
     *
     * @param categoryId ID категорії
     * @return Список матеріалів
     */
    @Query("SELECT cm.material FROM CategoryMaterialMapping cm WHERE cm.category.id = :categoryId ORDER BY cm.sortOrder ASC")
    List<String> findMaterialsByCategoryId(@Param("categoryId") UUID categoryId);
    
    /**
     * Знаходить усі матеріали, доступні для вказаної категорії за кодом, відсортовані за порядком.
     *
     * @param categoryCode Код категорії
     * @return Список матеріалів
     */
    @Query("SELECT cm.material FROM CategoryMaterialMapping cm WHERE cm.category.code = :categoryCode ORDER BY cm.sortOrder ASC")
    List<String> findMaterialsByCategoryCode(@Param("categoryCode") String categoryCode);
    
    /**
     * Знаходить усі зв'язки для вказаної категорії.
     *
     * @param categoryId ID категорії
     * @return Список зв'язків CategoryMaterialMapping
     */
    List<CategoryMaterialMapping> findByCategoryIdOrderBySortOrderAsc(UUID categoryId);
}
