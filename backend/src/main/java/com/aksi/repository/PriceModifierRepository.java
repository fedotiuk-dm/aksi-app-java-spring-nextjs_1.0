package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.PriceModifierEntity;

@Repository
public interface PriceModifierRepository
    extends JpaRepository<PriceModifierEntity, UUID>,
        JpaSpecificationExecutor<PriceModifierEntity> {

  Optional<PriceModifierEntity> findByCode(String code);

  boolean existsByCode(String code);

  /** Find active price modifiers ordered by sort order using specifications. */
  default List<PriceModifierEntity> findByActiveTrueOrderBySortOrderAsc() {
    return findAll(PriceModifierSpecification.findActiveOrderedBySortOrder());
  }

  /** Find all active price modifiers ordered by sort order using specifications. */
  default List<PriceModifierEntity> findAllActiveOrderBySortOrder() {
    return findAll(PriceModifierSpecification.findActiveOrderedBySortOrder());
  }

  // Alias method for backward compatibility
  default List<PriceModifierEntity> findAllActiveOrderedBySortOrder() {
    return findAllActiveOrderBySortOrder();
  }

  /** Find active price modifiers by category code using specifications. */
  default List<PriceModifierEntity> findActiveByCategoryCode(String categoryCode) {
    return findAll(PriceModifierSpecification.findActiveByCategoryCode(categoryCode));
  }
}
