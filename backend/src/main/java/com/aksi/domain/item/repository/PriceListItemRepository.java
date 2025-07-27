package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.PriceListItemEntity;

/** Repository for PriceListItemEntity */
@Repository
public interface PriceListItemRepository extends JpaRepository<PriceListItemEntity, UUID> {

  /**
   * Find active items by category code
   *
   * @param categoryCode the category code
   * @return list of active price list items
   */
  @Query(
      "SELECT p FROM PriceListItemEntity p WHERE p.category.code = :categoryCode AND p.active = true")
  List<PriceListItemEntity> findByCategoryCodeAndActiveTrue(
      @Param("categoryCode") String categoryCode);

  /**
   * Find item by category code and catalog number
   *
   * @param categoryCode the category code
   * @param catalogNumber the catalog number
   * @return optional price list item
   */
  @Query(
      "SELECT p FROM PriceListItemEntity p WHERE p.category.code = :categoryCode AND p.catalogNumber = :catalogNumber")
  Optional<PriceListItemEntity> findByCategoryCodeAndCatalogNumber(
      @Param("categoryCode") String categoryCode, @Param("catalogNumber") Integer catalogNumber);

  /**
   * Search items by name
   *
   * @param searchTerm the search term
   * @return list of matching items
   */
  @Query(
      "SELECT p FROM PriceListItemEntity p WHERE p.active = true AND "
          + "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
  List<PriceListItemEntity> searchByName(@Param("searchTerm") String searchTerm);

  /**
   * Find all active items
   *
   * @return list of active items
   */
  List<PriceListItemEntity> findByActiveTrue();
}
