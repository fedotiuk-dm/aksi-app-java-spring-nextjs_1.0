package com.aksi.repository.catalog;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aksi.domain.catalog.PriceListItem;
import com.aksi.domain.catalog.ServiceCategoryType;

/** Repository for PriceListItem entity */
@Repository
public interface PriceListItemRepository extends JpaRepository<PriceListItem, UUID> {

  List<PriceListItem> findByCategoryCodeAndActiveTrue(ServiceCategoryType categoryCode);

  List<PriceListItem> findByActiveTrue();

  Optional<PriceListItem> findByCategoryCodeAndCatalogNumber(
      ServiceCategoryType categoryCode, Integer catalogNumber);

  @Query("SELECT DISTINCT p.categoryCode FROM PriceListItem p WHERE p.active = true")
  List<ServiceCategoryType> findDistinctActiveCategories();

  @Query(
      "SELECT p FROM PriceListItem p WHERE p.active = true ORDER BY p.categoryCode, p.catalogNumber")
  List<PriceListItem> findAllActiveOrderedByCategoryAndNumber();

  Page<PriceListItem> findByCategoryCodeAndActiveTrue(
      ServiceCategoryType categoryCode, Pageable pageable);

  Page<PriceListItem> findByActiveTrue(Pageable pageable);

  Page<PriceListItem> findByCategoryCode(ServiceCategoryType categoryCode, Pageable pageable);

  Optional<PriceListItem> findByCatalogNumber(Integer catalogNumber);
}
