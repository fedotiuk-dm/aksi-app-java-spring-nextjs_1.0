package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.DiscountEntity;

/** Repository for Discount entity */
@Repository
public interface DiscountRepository
    extends JpaRepository<DiscountEntity, UUID>, JpaSpecificationExecutor<DiscountEntity> {

  /** Find discount by code */
  Optional<DiscountEntity> findByCode(String code);

  /** Find all active discounts ordered by sort order and name using specifications. */
  default List<DiscountEntity> findAllActiveOrderedBySortOrder() {
    return findAll(DiscountSpecification.findAllActiveOrderedBySortOrder());
  }

  /** Check if discount code exists */
  boolean existsByCode(String code);
}
