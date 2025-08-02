package com.aksi.repository.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aksi.domain.service.PriceListItem;
import com.aksi.domain.service.ServiceCategoryType;

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
}
