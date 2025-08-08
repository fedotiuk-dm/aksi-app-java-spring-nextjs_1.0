package com.aksi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.branch.BranchesApi;
import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.BranchesResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.SortOrder;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.service.branch.BranchService;

import lombok.RequiredArgsConstructor;

/** REST controller for branch operations */
@RestController
@RequiredArgsConstructor
public class BranchController implements BranchesApi {

  private final BranchService branchService;

  @Override
  public ResponseEntity<BranchInfo> getBranchById(UUID branchId) {
    return ResponseEntity.ok(branchService.getBranchById(branchId));
  }

  @Override
  public ResponseEntity<BranchesResponse> listBranches(
      Integer page,
      Integer size,
      String sortBy,
      SortOrder sortOrder,
      Boolean active,
      @Nullable String search) {
    return ResponseEntity.ok(
        branchService.listBranches(page, size, sortBy, sortOrder.getValue(), active, search));
  }

  @Override
  public ResponseEntity<List<BranchInfo>> getAllActiveBranches() {
    return ResponseEntity.ok(branchService.getAllActiveBranches());
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<BranchInfo> createBranch(CreateBranchRequest createBranchRequest) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(branchService.createBranch(createBranchRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<BranchInfo> updateBranch(
      UUID branchId, UpdateBranchRequest updateBranchRequest) {
    return ResponseEntity.ok(branchService.updateBranch(branchId, updateBranchRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteBranch(UUID branchId) {
    branchService.deleteBranch(branchId);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<BranchInfo> activateBranch(UUID branchId) {
    return ResponseEntity.ok(branchService.activateBranch(branchId));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<BranchInfo> deactivateBranch(UUID branchId) {
    return ResponseEntity.ok(branchService.deactivateBranch(branchId));
  }
}
