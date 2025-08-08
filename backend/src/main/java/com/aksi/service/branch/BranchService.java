package com.aksi.service.branch;

import java.util.List;
import java.util.UUID;

import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.BranchListResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;

/** Service for managing branches */
public interface BranchService {

  /**
   * Get branch by ID
   *
   * @param branchId Branch ID
   * @return Branch information
   */
  BranchInfo getBranchById(UUID branchId);

  /**
   * Create new branch
   *
   * @param request Create branch request
   * @return Created branch information
   */
  BranchInfo createBranch(CreateBranchRequest request);

  /**
   * Update existing branch
   *
   * @param branchId Branch ID
   * @param request Update branch request
   * @return Updated branch information
   */
  BranchInfo updateBranch(UUID branchId, UpdateBranchRequest request);

  /**
   * Delete branch
   *
   * @param branchId Branch ID
   */
  void deleteBranch(UUID branchId);

  /**
   * List branches with pagination and filtering
   *
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param sortBy Sort field
   * @param sortOrder Sort direction
   * @param active Filter by active status
   * @param search Search by name or address
   * @return Branches response with pagination
   */
  BranchListResponse listBranches(
      Integer page, Integer size, String sortBy, String sortOrder, Boolean active, String search);

  /**
   * Get all active branches for dropdowns
   *
   * @return List of active branches
   */
  List<BranchInfo> getAllActiveBranches();

  /**
   * Check if branch exists by ID
   *
   * @param branchId Branch ID
   * @return true if branch exists
   */
  boolean existsById(UUID branchId);

  /**
   * Activate a branch
   *
   * @param branchId Branch ID
   * @return Updated branch information
   */
  BranchInfo activateBranch(UUID branchId);

  /**
   * Deactivate a branch
   *
   * @param branchId Branch ID
   * @return Updated branch information
   */
  BranchInfo deactivateBranch(UUID branchId);
}
