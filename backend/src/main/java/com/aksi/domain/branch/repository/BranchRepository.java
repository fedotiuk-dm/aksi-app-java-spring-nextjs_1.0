package com.aksi.domain.branch.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.BranchEntity;

/**
 * Repository interface for Branch entities. Provides methods for branch management and querying.
 */
@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, UUID> {

  /** Check if a receipt prefix already exists. Used for validation during branch creation. */
  boolean existsByReceiptPrefix(String receiptPrefix);

  /**
   * Find branches with search filters. Supports searching by name and filtering by active status.
   */
  @Query(
      "SELECT b FROM BranchEntity b WHERE "
          + "(:includeInactive = true OR b.active = true) AND "
          + "(:searchTerm IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
  Page<BranchEntity> findWithFilters(
      @Param("searchTerm") String searchTerm,
      @Param("includeInactive") boolean includeInactive,
      Pageable pageable);
}
