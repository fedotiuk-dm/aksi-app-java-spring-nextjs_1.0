package com.aksi.service.branch;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.BranchesResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of BranchService. Provides a unified API while delegating to specialized
 * Query and Command services for better separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BranchServiceImpl implements BranchService {

  private final BranchQueryService queryService;
  private final BranchCommandService commandService;

  // Query methods - delegate to BranchQueryService
  @Override
  @Transactional(readOnly = true)
  public BranchInfo getBranchById(UUID branchId) {
    return queryService.getBranchById(branchId);
  }

  // Command methods - delegate to BranchCommandService
  @Override
  public BranchInfo createBranch(CreateBranchRequest request) {
    return commandService.createBranch(request);
  }

  @Override
  public BranchInfo updateBranch(UUID branchId, UpdateBranchRequest request) {
    return commandService.updateBranch(branchId, request);
  }

  @Override
  public void deleteBranch(UUID branchId) {
    commandService.deleteBranch(branchId);
  }

  @Override
  @Transactional(readOnly = true)
  public BranchesResponse listBranches(
      Integer page, Integer size, String sortBy, String sortOrder, Boolean active, String search) {
    return queryService.listBranches(page, size, sortBy, sortOrder, active, search);
  }

  @Override
  @Transactional(readOnly = true)
  public List<BranchInfo> getAllActiveBranches() {
    return queryService.getAllActiveBranches();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean existsById(UUID branchId) {
    return queryService.existsById(branchId);
  }

  @Override
  public BranchInfo activateBranch(UUID branchId) {
    return commandService.activateBranch(branchId);
  }

  @Override
  public BranchInfo deactivateBranch(UUID branchId) {
    return commandService.deactivateBranch(branchId);
  }
}
