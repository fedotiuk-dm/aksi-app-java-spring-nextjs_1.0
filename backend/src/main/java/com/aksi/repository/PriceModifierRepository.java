package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.PriceModifierEntity;

/** Repository for PriceModifier entity */
@Repository
public interface PriceModifierRepository extends JpaRepository<PriceModifierEntity, UUID> {

  /** Find modifier by code */
  Optional<PriceModifierEntity> findByCode(String code);

  /** Find all active modifiers ordered by sort order */
  @Query(
      "SELECT pm FROM PriceModifierEntity pm WHERE pm.active = true ORDER BY pm.sortOrder, pm.name")
  List<PriceModifierEntity> findAllActiveOrderedBySortOrder();

  /** Find active modifiers by category code */
  @Query(
      "SELECT pm FROM PriceModifierEntity pm WHERE pm.active = true AND "
          + "(pm.categoryRestrictions IS EMPTY OR :categoryCode MEMBER OF pm.categoryRestrictions) "
          + "ORDER BY pm.sortOrder, pm.name")
  List<PriceModifierEntity> findActiveByCategoryCode(@Param("categoryCode") String categoryCode);

  /** Find general modifiers (no category restrictions) */
  @Query(
      "SELECT pm FROM PriceModifierEntity pm WHERE pm.active = true AND "
          + "pm.categoryRestrictions IS EMPTY ORDER BY pm.sortOrder, pm.name")
  List<PriceModifierEntity> findGeneralModifiers();

  /** Check if modifier code exists */
  boolean existsByCode(String code);

  /** Check if modifier code exists excluding current modifier */
  @Query(
      "SELECT COUNT(pm) > 0 FROM PriceModifierEntity pm WHERE pm.code = :code AND pm.id != :excludeId")
  boolean existsByCodeAndIdNot(@Param("code") String code, @Param("excludeId") UUID excludeId);
}
