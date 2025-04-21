package com.aksi.domain.catalog.repository;

import com.aksi.domain.catalog.entity.MaterialStainWarning;
import com.aksi.domain.order.entity.StainType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи з попередженнями для комбінацій матеріал-забруднення.
 */
@Repository
public interface MaterialStainWarningRepository extends JpaRepository<MaterialStainWarning, UUID> {
    
    /**
     * Знаходить усі попередження для вказаного матеріалу.
     *
     * @param material Назва матеріалу
     * @return Список попереджень
     */
    List<MaterialStainWarning> findByMaterial(String material);
    
    /**
     * Знаходить усі попередження для вказаного матеріалу та типу забруднення.
     *
     * @param material Назва матеріалу
     * @param stainType Тип забруднення
     * @return Список попереджень
     */
    @Query("SELECT w FROM MaterialStainWarning w WHERE w.material = :material AND (w.stainType = :stainType OR w.stainType IS NULL)")
    List<MaterialStainWarning> findByMaterialAndStainType(
            @Param("material") String material, 
            @Param("stainType") StainType stainType);
    
    /**
     * Знаходить усі попередження для вказаного матеріалу та кількох типів забруднень.
     *
     * @param material Назва матеріалу
     * @param stainTypes Список типів забруднень
     * @return Список попереджень
     */
    @Query("SELECT w FROM MaterialStainWarning w WHERE w.material = :material AND (w.stainType IN :stainTypes OR w.stainType IS NULL)")
    List<MaterialStainWarning> findByMaterialAndStainTypeIn(
            @Param("material") String material, 
            @Param("stainTypes") List<StainType> stainTypes);
}
