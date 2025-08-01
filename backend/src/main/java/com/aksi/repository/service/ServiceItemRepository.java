package com.aksi.repository.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.service.ServiceItem;

/** Repository interface for ServiceItem entity. */
@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, UUID> {

  @Query(
      "SELECT si FROM ServiceItem si "
          + "JOIN FETCH si.service s "
          + "JOIN FETCH si.item i "
          + "WHERE s.id = :serviceId AND i.id = :itemId")
  Optional<ServiceItem> findByServiceIdAndItemId(
      @Param("serviceId") UUID serviceId, @Param("itemId") UUID itemId);

  @Query(
      "SELECT si FROM ServiceItem si "
          + "JOIN FETCH si.service "
          + "JOIN FETCH si.item "
          + "WHERE si.active = true AND si.availableForOrder = true")
  Page<ServiceItem> findActiveAndAvailable(Pageable pageable);

  Page<ServiceItem> findByServiceId(UUID serviceId, Pageable pageable);

  Page<ServiceItem> findByItemId(UUID itemId, Pageable pageable);
}
