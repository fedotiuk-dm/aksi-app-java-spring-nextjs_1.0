package com.aksi.repository.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.service.Item;
import com.aksi.domain.service.ServiceCategoryType;

/** Repository interface for Item entity. */
@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {

  Optional<Item> findByCode(String code);

  boolean existsByCode(String code);

  Page<Item> findByActiveTrue(Pageable pageable);

  Page<Item> findByCategoryAndActiveTrue(ServiceCategoryType category, Pageable pageable);

  Optional<Item> findByCatalogNumber(Integer catalogNumber);
}
