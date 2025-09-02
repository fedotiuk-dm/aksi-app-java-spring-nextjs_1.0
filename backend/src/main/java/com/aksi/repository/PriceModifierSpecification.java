package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.pricing.PriceModifierEntity;

public class PriceModifierSpecification {

  public static Specification<PriceModifierEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<PriceModifierEntity> hasCategoryRestriction(String categoryCode) {
    return SpecificationUtils.hasCategoryRestriction(categoryCode);
  }

  public static Specification<PriceModifierEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  /** Creates a specification for finding active price modifiers ordered by sort order. */
  public static Specification<PriceModifierEntity> findActiveOrderedBySortOrder() {
    return Specification.allOf(hasActive(true), orderBySortOrder());
  }

  /** Creates a specification for finding active price modifiers by category code. */
  public static Specification<PriceModifierEntity> findActiveByCategoryCode(String categoryCode) {
    return Specification.allOf(
        hasActive(true), hasCategoryRestriction(categoryCode), orderBySortOrder());
  }
}
