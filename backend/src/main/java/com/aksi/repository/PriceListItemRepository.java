package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItemEntity;

/** Repository for PriceListItem entity */
@Repository
public interface PriceListItemRepository
    extends JpaRepository<PriceListItemEntity, UUID>,
        JpaSpecificationExecutor<PriceListItemEntity> {

  Optional<PriceListItemEntity> findByCategoryCodeAndCatalogNumber(
      ServiceCategoryType categoryCode, Integer catalogNumber);

  /** Find distinct active categories using specifications. */
  default List<ServiceCategoryType> findDistinctActiveCategories() {
    return findAll(PriceListItemSpecification.hasActive(true)).stream()
        .map(PriceListItemEntity::getCategoryCode)
        .distinct()
        .toList();
  }

  /**
   * Find all active price list items ordered by category and catalog number using specifications.
   */
  default List<PriceListItemEntity> findAllActiveOrderedByCategoryAndNumber() {
    return findAll(PriceListItemSpecification.findAllActiveOrderedByCategoryAndNumber());
  }

  /** Find price list items by category code using specifications. */
  default List<PriceListItemEntity> findByCategoryCode(ServiceCategoryType categoryCode) {
    return findAll(PriceListItemSpecification.findByCategory(categoryCode));
  }

  @Query("SELECT COUNT(p) FROM PriceListItemEntity p WHERE p.categoryCode = :categoryCode")
  long countByCategoryCode(ServiceCategoryType categoryCode);

  @Query(
      "SELECT COUNT(p) FROM PriceListItemEntity p WHERE p.categoryCode = :categoryCode AND p.active = true")
  long countByCategoryCodeAndActiveTrue(ServiceCategoryType categoryCode);
}
