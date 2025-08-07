package com.aksi.service.branch;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.BranchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for branch operations. Centralizes all validation logic to avoid duplication
 * and improve maintainability.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BranchValidationService {

  private final BranchRepository branchRepository;

  /**
   * Validate branch creation request.
   *
   * @param request create branch request
   * @throws ConflictException if branch name already exists
   */
  public void validateCreateBranch(CreateBranchRequest request) {
    log.debug("Validating create branch request for name: {}", request.getName());

    validateUniqueNameForCreation(request.getName());
  }

  /**
   * Validate branch update request.
   *
   * @param branchId ID of branch being updated
   * @param request update branch request
   * @param existingBranch existing branch entity
   * @throws ConflictException if branch name already exists for another branch
   */
  public void validateUpdateBranch(
      UUID branchId, UpdateBranchRequest request, BranchEntity existingBranch) {
    log.debug("Validating update branch request for id: {}", branchId);

    if (request.getName() != null) {
      validateUniqueNameForUpdate(request.getName(), branchId, existingBranch.getName());
    }
  }

  /**
   * Validate that branch exists before deletion.
   *
   * @param branchId branch ID
   * @throws NotFoundException if branch doesn't exist
   */
  public void validateBranchExistsForDeletion(UUID branchId) {
    log.debug("Validating branch exists for deletion: {}", branchId);

    if (!branchRepository.existsById(branchId)) {
      throw new NotFoundException("Branch not found: " + branchId);
    }
  }

  /**
   * Validate that branch name is unique for creation.
   *
   * @param name branch name
   * @throws ConflictException if name already exists
   */
  private void validateUniqueNameForCreation(String name) {
    if (branchRepository.existsByNameIgnoreCase(name)) {
      log.warn("Attempt to create branch with existing name: {}", name);
      throw new ConflictException("Branch with name '" + name + "' already exists");
    }
  }

  /**
   * Validate that branch name is unique for update.
   *
   * @param newName new branch name
   * @param branchId branch ID being updated
   * @param currentName current branch name
   * @throws ConflictException if name already exists for another branch
   */
  private void validateUniqueNameForUpdate(String newName, UUID branchId, String currentName) {
    if (!newName.equalsIgnoreCase(currentName)
        && branchRepository.existsByNameIgnoreCaseAndIdNot(newName, branchId)) {
      log.warn("Attempt to update branch {} with existing name: {}", branchId, newName);
      throw new ConflictException("Branch with name '" + newName + "' already exists");
    }
  }
}
