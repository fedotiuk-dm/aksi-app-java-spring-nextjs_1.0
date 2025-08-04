package com.aksi.controller;

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
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.service.branch.BranchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for branch operations */
@Slf4j
@RestController
@RequiredArgsConstructor
public class BranchController implements BranchesApi {

  private final BranchService branchService;

  @Override
  public ResponseEntity<BranchInfo> getBranchById(UUID branchId) {
    log.debug("Getting branch by id: {}", branchId);
    return ResponseEntity.ok(branchService.getBranchById(branchId));
  }

  @Override
  public ResponseEntity<BranchesResponse> listBranches(
      @Nullable Boolean active, @Nullable String search, Integer offset, Integer limit) {
    log.debug(
        "Listing branches with active: {}, search: '{}', offset: {}, limit: {}",
        active,
        search,
        offset,
        limit);
    return ResponseEntity.ok(branchService.listBranches(active, search, offset, limit));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<BranchInfo> createBranch(CreateBranchRequest createBranchRequest) {
    log.debug("Creating new branch: {}", createBranchRequest.getName());
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(branchService.createBranch(createBranchRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<BranchInfo> updateBranch(
      UUID branchId, UpdateBranchRequest updateBranchRequest) {
    log.debug("Updating branch: {}", branchId);
    return ResponseEntity.ok(branchService.updateBranch(branchId, updateBranchRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteBranch(UUID branchId) {
    log.debug("Deleting branch: {}", branchId);
    branchService.deleteBranch(branchId);
    return ResponseEntity.noContent().build();
  }
}
