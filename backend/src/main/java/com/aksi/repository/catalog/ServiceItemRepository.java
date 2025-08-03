package com.aksi.repository.catalog;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.catalog.ServiceItem;

/** Repository interface for ServiceItem entity. */
@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, UUID> {

  @Query(
      "SELECT si FROM ServiceItem si "
          + "JOIN FETCH si.serviceCatalog s "
          + "JOIN FETCH si.itemCatalog i "
          + "WHERE s.id = :serviceId AND i.id = :itemId")
  Optional<ServiceItem> findByServiceIdAndItemId(
      @Param("serviceId") UUID serviceId, @Param("itemId") UUID itemId);

  @Query(
      "SELECT si FROM ServiceItem si "
          + "JOIN FETCH si.serviceCatalog "
          + "JOIN FETCH si.itemCatalog "
          + "WHERE si.active = true AND si.availableForOrder = true")
  Page<ServiceItem> findActiveAndAvailable(Pageable pageable);

  Page<ServiceItem> findByServiceCatalogId(UUID serviceId, Pageable pageable);

  Page<ServiceItem> findByItemCatalogId(UUID itemId, Pageable pageable);

  boolean existsByServiceCatalogIdAndItemCatalogId(UUID serviceId, UUID itemId);

  Page<ServiceItem> findByActiveTrue(Pageable pageable);

  Page<ServiceItem> findByServiceCatalogIdAndActiveTrue(UUID serviceId, Pageable pageable);

  Page<ServiceItem> findByItemCatalogIdAndActiveTrue(UUID itemId, Pageable pageable);

  Page<ServiceItem> findByServiceCatalogIdAndActiveTrueAndAvailableForOrderTrue(
      UUID serviceId, Pageable pageable);

  @Query(
      "SELECT si FROM ServiceItem si "
          + "JOIN FETCH si.serviceCatalog s "
          + "JOIN FETCH si.itemCatalog i "
          + "WHERE s.id = :serviceId AND i.id = :itemId")
  Page<ServiceItem> findByServiceIdAndItemId(
      @Param("serviceId") UUID serviceId, @Param("itemId") UUID itemId, Pageable pageable);
}
