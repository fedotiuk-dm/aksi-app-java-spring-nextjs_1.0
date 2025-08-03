package com.aksi.repository.catalog;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.ServiceCatalog;

/** Repository interface for Service entity. */
@Repository
public interface ServiceRepository extends JpaRepository<ServiceCatalog, UUID> {

  boolean existsByCode(String code);

  Page<ServiceCatalog> findByActiveTrue(Pageable pageable);

  Page<ServiceCatalog> findByCategoryAndActiveTrue(ServiceCategoryType category, Pageable pageable);
}
