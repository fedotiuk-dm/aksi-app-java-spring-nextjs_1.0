package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.DiscountEntity;

/** Repository for Discount entity */
@Repository
public interface DiscountRepository extends JpaRepository<DiscountEntity, UUID> {

  /** Find discount by code */
  Optional<DiscountEntity> findByCode(String code);

  /** Find all active discounts ordered by sort order */
  @Query("SELECT d FROM DiscountEntity d WHERE d.active = true ORDER BY d.sortOrder, d.name")
  List<DiscountEntity> findAllActiveOrderedBySortOrder();

  /** Find discounts applicable to category */
  @Query(
      "SELECT d FROM DiscountEntity d WHERE d.active = true AND "
          + "(d.excludedCategories IS EMPTY OR :categoryCode NOT IN (SELECT ec FROM d.excludedCategories ec)) "
          + "ORDER BY d.sortOrder, d.name")
  List<DiscountEntity> findApplicableToCategoryCode(@Param("categoryCode") String categoryCode);

  /** Check if discount code exists */
  boolean existsByCode(String code);

  /** Check if discount code exists excluding current discount */
  @Query("SELECT COUNT(d) > 0 FROM DiscountEntity d WHERE d.code = :code AND d.id != :excludeId")
  boolean existsByCodeAndIdNot(@Param("code") String code, @Param("excludeId") UUID excludeId);
}
