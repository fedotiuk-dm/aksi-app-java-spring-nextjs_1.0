package com.aksi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.api.pricing.dto.ModifierType;
import com.aksi.domain.pricing.PriceModifierEntity;

@Repository
public interface PriceModifierRepository
    extends JpaRepository<PriceModifierEntity, java.util.UUID> {

  Optional<PriceModifierEntity> findByCode(String code);

  boolean existsByCode(String code);

  List<PriceModifierEntity> findByActiveTrue();

  List<PriceModifierEntity> findByType(ModifierType type);

  List<PriceModifierEntity> findByActiveTrueOrderBySortOrderAsc();

  @Query(
      "SELECT pm FROM PriceModifierEntity pm WHERE pm.active = true AND pm.type = :modifierType ORDER BY pm.sortOrder ASC")
  List<PriceModifierEntity> findActiveByTypeOrderBySortOrder(
      @Param("modifierType") ModifierType modifierType);

  @Query("SELECT pm FROM PriceModifierEntity pm WHERE pm.active = true ORDER BY pm.sortOrder ASC")
  List<PriceModifierEntity> findAllActiveOrderBySortOrder();

  // Alias method for backward compatibility
  default List<PriceModifierEntity> findAllActiveOrderedBySortOrder() {
    return findAllActiveOrderBySortOrder();
  }

  @Query(
      "SELECT pm FROM PriceModifierEntity pm WHERE pm.active = true AND :categoryCode MEMBER OF pm.categoryRestrictions ORDER BY pm.sortOrder ASC")
  List<PriceModifierEntity> findActiveByCategoryCode(@Param("categoryCode") String categoryCode);

  @Query(
      "SELECT DISTINCT pm.type FROM PriceModifierEntity pm WHERE pm.active = true ORDER BY pm.type")
  List<ModifierType> findDistinctTypes();
}
