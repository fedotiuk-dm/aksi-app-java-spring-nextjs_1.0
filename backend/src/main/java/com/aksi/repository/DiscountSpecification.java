package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.pricing.DiscountEntity;

/** Specifications for Discount entity queries */
public class DiscountSpecification {

  private DiscountSpecification() {
    // Utility class
  }

  public static Specification<DiscountEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<DiscountEntity> orderBySortOrderAndName() {
    return SpecificationUtils.orderBySortOrderAndName();
  }

  /** Creates a specification for finding all active discounts ordered by sort order and name. */
  public static Specification<DiscountEntity> findAllActiveOrderedBySortOrder() {
    return Specification.allOf(hasActive(true), orderBySortOrderAndName());
  }
}
