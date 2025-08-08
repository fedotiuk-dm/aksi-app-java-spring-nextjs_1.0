package com.aksi.service.branch;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.BranchListResponse;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.BranchMapper;
import com.aksi.repository.BranchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for branch-related read operations. All methods are read-only and optimized for
 * queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BranchQueryService {

  private final BranchRepository branchRepository;
  private final BranchMapper branchMapper;

  /**
   * Get branch by ID.
   *
   * @param branchId Branch ID
   * @return Branch information
   * @throws NotFoundException if branch not found
   */
  public BranchInfo getBranchById(UUID branchId) {
    log.debug("Getting branch by id: {}", branchId);

    BranchEntity branchEntity = findByIdOrThrow(branchId);
    return branchMapper.toBranchInfo(branchEntity);
  }

  /**
   * List branches with pagination and filtering.
   *
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param sortBy Sort field
   * @param sortOrder Sort direction
   * @param active Filter by active status
   * @param search Search by name or address
   * @return Branches response with pagination
   */
  public BranchListResponse listBranches(
      Integer page, Integer size, String sortBy, String sortOrder, Boolean active, String search) {
    log.debug(
        "Listing branches - page: {}, size: {}, sortBy: {}, sortOrder: {}, active: {}, search: '{}'",
        page,
        size,
        sortBy,
        sortOrder,
        active,
        search);

    // Create pagination - OpenAPI defines defaults and validation
    Pageable pageable = createPagination(page, size, sortBy, sortOrder);
    Page<BranchEntity> branchPage =
        branchRepository.findBranchesWithSearch(active, search, pageable);

    return buildBranchesResponse(branchPage);
  }

  /**
   * Get all active branches for dropdowns.
   *
   * @return List of active branches ordered by sort order
   */
  public List<BranchInfo> getAllActiveBranches() {
    log.debug("Getting all active branches");

    List<BranchEntity> branchEntities = branchRepository.findAllActiveOrderedBySortOrder();
    return branchEntities.stream().map(branchMapper::toBranchInfo).toList();
  }

  /**
   * Check if branch exists by ID.
   *
   * @param branchId Branch ID
   * @return true if branch exists
   */
  public boolean existsById(UUID branchId) {
    return branchRepository.existsById(branchId);
  }

  /**
   * Find branch by ID.
   *
   * @param branchId Branch ID
   * @return Branch entity if found
   */
  public Optional<BranchEntity> findById(UUID branchId) {
    return branchRepository.findById(branchId);
  }

  /**
   * Helper method to find branch by ID or throw exception.
   *
   * @param branchId Branch ID
   * @return Branch entity
   * @throws NotFoundException if branch not found
   */
  private BranchEntity findByIdOrThrow(UUID branchId) {
    return branchRepository
        .findById(branchId)
        .orElseThrow(() -> new NotFoundException("Branch not found with id: " + branchId));
  }

  /**
   * Create pagination from page/size/sort parameters (as defined in OpenAPI schema). OpenAPI
   * validation ensures defaults: page=0, size=20, sortBy=name, sortOrder=asc
   *
   * @param page Page number (validated by OpenAPI)
   * @param size Page size (validated by OpenAPI)
   * @param sortBy Sort field (validated by OpenAPI)
   * @param sortOrder Sort direction (validated by OpenAPI)
   * @return Pageable object
   */
  private Pageable createPagination(Integer page, Integer size, String sortBy, String sortOrder) {
    int safePage = page != null ? page : 0;
    int safeSize = size != null ? size : 20;
    String property = (sortBy == null || sortBy.isBlank()) ? "name" : sortBy;
    Sort.Direction direction =
        ("desc".equalsIgnoreCase(sortOrder))
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
    return PageRequest.of(safePage, safeSize, Sort.by(direction, property));
  }

  /**
   * Build branches response from page.
   *
   * @param page page of branch entities
   * @return branches response
   */
  private BranchListResponse buildBranchesResponse(Page<BranchEntity> page) {
    List<BranchInfo> data = page.getContent().stream().map(branchMapper::toBranchInfo).toList();

    BranchListResponse response = new BranchListResponse();
    response.setData(data);
    response.setTotalElements(page.getTotalElements());
    response.setTotalPages(page.getTotalPages());
    response.setSize(page.getSize());
    response.setNumber(page.getNumber());
    response.setNumberOfElements(page.getNumberOfElements());
    response.setFirst(page.isFirst());
    response.setLast(page.isLast());
    response.setEmpty(page.isEmpty());

    return response;
  }
}
