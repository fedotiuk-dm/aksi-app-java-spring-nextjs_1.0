package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItemEntity;

/** Specifications for PriceListItem queries */
public class PriceListItemSpecification {

  private PriceListItemSpecification() {
    // Utility class
  }

  public static Specification<PriceListItemEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<PriceListItemEntity> hasCategory(ServiceCategoryType categoryCode) {
    return SpecificationUtils.hasType(categoryCode);
  }

  /**
   * Creates a specification for finding active price list items ordered by category and catalog
   * number.
   */
  public static Specification<PriceListItemEntity> findAllActiveOrderedByCategoryAndNumber() {
    return Specification.allOf(
        hasActive(true), SpecificationUtils.orderByCategoryAndCatalogNumber());
  }

  /** Creates a specification for finding price list items by category. */
  public static Specification<PriceListItemEntity> findByCategory(
      ServiceCategoryType categoryCode) {
    return hasCategory(categoryCode);
  }

  // Legacy method for backward compatibility
  @Deprecated
  public static Specification<PriceListItemEntity> isActive(Boolean active) {
    return hasActive(active);
  }
}
