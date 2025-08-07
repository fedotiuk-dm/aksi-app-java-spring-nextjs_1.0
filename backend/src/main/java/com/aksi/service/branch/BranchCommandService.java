package com.aksi.service.branch;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.BranchMapper;
import com.aksi.repository.BranchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for branch-related write operations. Handles all branch modifications and state
 * changes.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BranchCommandService {

  private final BranchRepository branchRepository;
  private final BranchMapper branchMapper;
  private final BranchValidationService validationService;
  private final BranchQueryService queryService;

  /**
   * Create new branch.
   *
   * @param request Create branch request
   * @return Created branch information
   */
  public BranchInfo createBranch(CreateBranchRequest request) {
    log.info("Creating new branch: {}", request.getName());

    // Validate request
    validationService.validateCreateBranch(request);

    // Create and save entity
    BranchEntity branchEntity = createBranchEntity(request);
    BranchEntity saved = branchRepository.save(branchEntity);

    log.info("Created branch with ID: {}", saved.getId());
    return branchMapper.toBranchInfo(saved);
  }

  /**
   * Update existing branch.
   *
   * @param branchId Branch ID
   * @param request Update branch request
   * @return Updated branch information
   * @throws NotFoundException if branch not found
   */
  public BranchInfo updateBranch(UUID branchId, UpdateBranchRequest request) {
    log.info("Updating branch: {}", branchId);

    // Find existing branch
    BranchEntity branchEntity = getBranchEntityOrThrow(branchId);

    // Validate update request
    validationService.validateUpdateBranch(branchId, request, branchEntity);

    // Update entity using MapStruct
    updateBranchEntity(request, branchEntity);

    BranchEntity updated = branchRepository.save(branchEntity);
    log.info("Updated branch: {}", branchId);

    return branchMapper.toBranchInfo(updated);
  }

  /**
   * Delete branch.
   *
   * @param branchId Branch ID
   * @throws NotFoundException if branch not found
   */
  public void deleteBranch(UUID branchId) {
    log.info("Deleting branch: {}", branchId);

    // Validate branch exists
    validationService.validateBranchExistsForDeletion(branchId);

    branchRepository.deleteById(branchId);
    log.info("Deleted branch: {}", branchId);
  }

  /**
   * Create branch entity from request.
   *
   * @param request create branch request
   * @return new branch entity
   */
  private BranchEntity createBranchEntity(CreateBranchRequest request) {
    // MapStruct handles all the mapping including defaults from OpenAPI
    return branchMapper.toEntity(request);
  }

  /**
   * Update branch entity from request.
   *
   * @param request update branch request
   * @param branchEntity existing branch entity
   */
  private void updateBranchEntity(UpdateBranchRequest request, BranchEntity branchEntity) {
    // MapStruct handles partial updates with null checks
    branchMapper.updateEntityFromRequest(request, branchEntity);
  }

  /**
   * Activate a branch.
   *
   * @param branchId Branch ID
   * @return Updated branch information
   * @throws NotFoundException if branch not found
   * @throws ConflictException if branch is already active
   */
  public BranchInfo activateBranch(UUID branchId) {
    log.info("Activating branch: {}", branchId);

    BranchEntity branchEntity = getBranchEntityOrThrow(branchId);

    if (branchEntity.isActive()) {
      throw new ConflictException("Branch is already active");
    }

    branchEntity.setActive(true);
    BranchEntity updated = branchRepository.save(branchEntity);

    log.info("Activated branch: {}", branchId);
    return branchMapper.toBranchInfo(updated);
  }

  /**
   * Deactivate a branch.
   *
   * @param branchId Branch ID
   * @return Updated branch information
   * @throws NotFoundException if branch not found
   * @throws ConflictException if branch is already inactive
   */
  public BranchInfo deactivateBranch(UUID branchId) {
    log.info("Deactivating branch: {}", branchId);

    BranchEntity branchEntity = getBranchEntityOrThrow(branchId);

    if (!branchEntity.isActive()) {
      throw new ConflictException("Branch is already inactive");
    }

    branchEntity.setActive(false);
    BranchEntity updated = branchRepository.save(branchEntity);

    log.info("Deactivated branch: {}", branchId);
    return branchMapper.toBranchInfo(updated);
  }

  /**
   * Helper method to get branch entity or throw exception.
   *
   * @param branchId branch ID
   * @return branch entity
   * @throws NotFoundException if branch not found
   */
  private BranchEntity getBranchEntityOrThrow(UUID branchId) {
    return queryService
        .findById(branchId)
        .orElseThrow(() -> new NotFoundException("Branch not found: " + branchId));
  }
}
