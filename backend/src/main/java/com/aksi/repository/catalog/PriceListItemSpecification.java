package com.aksi.repository.catalog;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItem;

/** Specifications for PriceListItem queries */
public class PriceListItemSpecification {

  private PriceListItemSpecification() {
    // Utility class
  }

  public static Specification<PriceListItem> hasCategory(ServiceCategoryType categoryCode) {
    return (root, query, criteriaBuilder) ->
        categoryCode == null ? null : criteriaBuilder.equal(root.get("categoryCode"), categoryCode);
  }

  public static Specification<PriceListItem> isActive(Boolean active) {
    return (root, query, criteriaBuilder) ->
        active == null ? null : criteriaBuilder.equal(root.get("active"), active);
  }
}
