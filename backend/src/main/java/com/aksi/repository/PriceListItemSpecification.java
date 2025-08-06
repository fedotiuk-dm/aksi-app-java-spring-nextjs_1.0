package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItemEntity;

/** Specifications for PriceListItem queries */
public class PriceListItemSpecification {

  private PriceListItemSpecification() {
    // Utility class
  }

  public static Specification<PriceListItemEntity> hasCategory(ServiceCategoryType categoryCode) {
    return (root, query, criteriaBuilder) ->
        categoryCode == null ? null : criteriaBuilder.equal(root.get("categoryCode"), categoryCode);
  }

  public static Specification<PriceListItemEntity> isActive(Boolean active) {
    return (root, query, criteriaBuilder) ->
        active == null ? null : criteriaBuilder.equal(root.get("active"), active);
  }
}
