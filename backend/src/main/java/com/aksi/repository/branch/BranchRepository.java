package com.aksi.repository.branch;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.Branch;

/** Repository for Branch entity */
@Repository
public interface BranchRepository
    extends JpaRepository<Branch, UUID>, JpaSpecificationExecutor<Branch> {

  /** Find all active branches ordered by sort order */
  @Query("SELECT b FROM Branch b WHERE b.active = true ORDER BY b.sortOrder, b.name")
  List<Branch> findAllActiveOrderedBySortOrder();

  /** Find branches by active status with pagination */
  Page<Branch> findByActiveOrderBySortOrderAscNameAsc(boolean active, Pageable pageable);

  /** Search branches by name or address with active status filter */
  @Query(
      "SELECT b FROM Branch b WHERE "
          + "(:active IS NULL OR b.active = :active) AND "
          + "(:search IS NULL OR :search = '' OR "
          + "LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%')) OR "
          + "LOWER(b.address) LIKE LOWER(CONCAT('%', :search, '%'))) "
          + "ORDER BY b.sortOrder, b.name")
  Page<Branch> findBranchesWithSearch(
      @Param("active") Boolean active, @Param("search") String search, Pageable pageable);

  /** Check if branch name already exists (for validation) */
  boolean existsByNameIgnoreCase(String name);

  /** Check if branch name already exists excluding current branch (for updates) */
  @Query(
      "SELECT COUNT(b) > 0 FROM Branch b WHERE LOWER(b.name) = LOWER(:name) AND b.id != :excludeId")
  boolean existsByNameIgnoreCaseAndIdNot(
      @Param("name") String name, @Param("excludeId") UUID excludeId);

  /** Count active branches */
  long countByActiveTrue();
}
