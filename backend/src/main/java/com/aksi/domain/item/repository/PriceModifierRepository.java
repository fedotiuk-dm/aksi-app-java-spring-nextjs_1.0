package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.entity.ServiceCategoryEntity;

/** Repository for PriceModifierEntity */
@Repository
public interface PriceModifierRepository extends JpaRepository<PriceModifierEntity, UUID> {

  /**
   * Find modifier by code
   *
   * @param code the modifier code
   * @return optional modifier entity
   */
  Optional<PriceModifierEntity> findByCode(String code);

  /**
   * Find all active modifiers
   *
   * @param sort the sort criteria
   * @return list of active modifiers
   */
  List<PriceModifierEntity> findByActiveTrue(Sort sort);

  /**
   * Find active modifiers applicable to a specific category
   *
   * @param category the service category
   * @return list of applicable modifiers
   */
  @Query(
      "SELECT m FROM PriceModifierEntity m WHERE m.active = true AND "
          + "(m.applicableCategories IS EMPTY OR :category MEMBER OF m.applicableCategories) "
          + "ORDER BY m.priority")
  List<PriceModifierEntity> findByCategoryAndActiveTrue(@Param("category") String category);

  /**
   * Check if modifier with code exists
   *
   * @param code the modifier code
   * @return true if exists
   */
  boolean existsByCode(String code);

  /**
   * Find modifiers that contain a specific category
   *
   * @param category the service category entity
   * @param sort the sort criteria
   * @return list of modifiers
   */
  List<PriceModifierEntity> findByApplicableCategoriesContaining(
      ServiceCategoryEntity category, Sort sort);

  /**
   * Find active modifiers that contain a specific category
   *
   * @param category the service category entity
   * @param sort the sort criteria
   * @return list of active modifiers
   */
  List<PriceModifierEntity> findByApplicableCategoriesContainingAndActiveTrue(
      ServiceCategoryEntity category, Sort sort);
}
