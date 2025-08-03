package com.aksi.repository.catalog;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.catalog.ItemCatalog;
import com.aksi.domain.catalog.ServiceCategoryType;

/** Repository interface for Item entity. */
@Repository
public interface ItemRepository extends JpaRepository<ItemCatalog, UUID> {

  Optional<ItemCatalog> findByCode(String code);

  boolean existsByCode(String code);

  Page<ItemCatalog> findByActiveTrue(Pageable pageable);

  Page<ItemCatalog> findByCategoryAndActiveTrue(ServiceCategoryType category, Pageable pageable);

  Optional<ItemCatalog> findByCatalogNumber(Integer catalogNumber);

  Page<ItemCatalog> findByNameContainingIgnoreCaseAndActiveTrue(String name, Pageable pageable);
}
