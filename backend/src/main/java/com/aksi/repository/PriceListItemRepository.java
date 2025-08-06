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

  @Query("SELECT DISTINCT p.categoryCode FROM PriceListItemEntity p WHERE p.active = true")
  List<ServiceCategoryType> findDistinctActiveCategories();

  @Query(
      "SELECT p FROM PriceListItemEntity p WHERE p.active = true ORDER BY p.categoryCode, p.catalogNumber")
  List<PriceListItemEntity> findAllActiveOrderedByCategoryAndNumber();

  Optional<PriceListItemEntity> findByCatalogNumber(Integer catalogNumber);

  // Category management methods
  List<PriceListItemEntity> findByCategoryCode(ServiceCategoryType categoryCode);

  @Query("SELECT COUNT(p) FROM PriceListItemEntity p WHERE p.categoryCode = :categoryCode")
  long countByCategoryCode(ServiceCategoryType categoryCode);

  @Query(
      "SELECT COUNT(p) FROM PriceListItemEntity p WHERE p.categoryCode = :categoryCode AND p.active = true")
  long countByCategoryCodeAndActiveTrue(ServiceCategoryType categoryCode);

  @Query("SELECT DISTINCT p.categoryCode FROM PriceListItemEntity p")
  List<ServiceCategoryType> findAllDistinctCategories();
}
