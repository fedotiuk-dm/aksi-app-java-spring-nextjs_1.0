package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;

/**
 * Репозиторій для роботи з модифікаторами цін каталогу.
 */
@Repository
public interface CatalogPriceModifierRepository extends JpaRepository<PriceModifierDefinitionEntity, UUID> {

    /**
     * Знайти модифікатор за кодом.
     *
     * @param code Код модифікатора
     * @return Опціональний модифікатор
     */
    Optional<PriceModifierDefinitionEntity> findByCode(String code);

    /**
     * Отримати всі активні модифікатори.
     *
     * @return Список активних модифікаторів
     */
    List<PriceModifierDefinitionEntity> findByActiveTrue();

    /**
     * Отримати всі активні модифікатори певної категорії.
     *
     * @param category Категорія модифікатора (GENERAL, TEXTILE, LEATHER)
     * @return Список активних модифікаторів категорії
     */
    List<PriceModifierDefinitionEntity> findByActiveTrueAndCategory(ModifierCategory category);

    /**
     * Отримати модифікатори для категорії послуг.
     * Повертає загальні модифікатори та модифікатори, які належать до категорій послуг,
     * переданих у applicableCategories.
     *
     * @param serviceCategory Код категорії послуг
     * @return Список модифікаторів для категорії послуг
     */
    @Query("SELECT m FROM PriceModifierDefinitionEntity m " +
           "WHERE m.active = true AND " +
           "(m.category = com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory.GENERAL " +
           "OR (m.category = :category)) " +
           "ORDER BY m.sortOrder ASC, m.name ASC")
    List<PriceModifierDefinitionEntity> findModifiersForServiceCategory(@Param("category") ModifierCategory category);

    /**
     * Знайти модифікатори за списком кодів.
     *
     * @param codes Список кодів модифікаторів
     * @return Список модифікаторів
     */
    List<PriceModifierDefinitionEntity> findByCodeInAndActiveTrue(List<String> codes);
}
