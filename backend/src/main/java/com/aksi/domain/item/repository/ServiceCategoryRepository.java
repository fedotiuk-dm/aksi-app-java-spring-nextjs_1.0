package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.ServiceCategoryEntity;

/** Repository for ServiceCategoryEntity */
@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategoryEntity, UUID> {

  /**
   * Find service category by code
   *
   * @param code the category code
   * @return optional category entity
   */
  Optional<ServiceCategoryEntity> findByCode(String code);

  /**
   * Find all active service categories
   *
   * @param sort the sort criteria
   * @return list of active categories
   */
  List<ServiceCategoryEntity> findByActiveTrue(Sort sort);

  /**
   * Check if category with code exists
   *
   * @param code the category code
   * @return true if exists
   */
  boolean existsByCode(String code);
}
