package com.aksi.api.branch;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.branch.dto.BranchListResponse;
import com.aksi.api.branch.dto.BranchResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.service.BranchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for branch management. Implements OpenAPI generated BranchesApi interface. */
@RestController
@RequiredArgsConstructor
@Slf4j
public class BranchController implements BranchesApi {

  private final BranchService branchService;

  @Override
  public ResponseEntity<BranchResponse> createBranch(CreateBranchRequest createBranchRequest) {
    log.info("Creating new branch: {}", createBranchRequest.getName());
    BranchResponse response = branchService.createBranch(createBranchRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<BranchResponse> getBranchById(UUID id) {
    log.debug("Getting branch by id: {}", id);
    BranchResponse response = branchService.getBranchById(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<BranchListResponse> getBranches(Boolean includeInactive) {
    log.debug("Getting branches list, includeInactive: {}", includeInactive);
    // For now, we'll use simple parameters. Full pagination can be added later
    BranchListResponse response = branchService.getBranches(null, includeInactive, 0, 100);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<BranchResponse> updateBranch(
      UUID id, UpdateBranchRequest updateBranchRequest) {
    log.info("Updating branch: {}", id);
    BranchResponse response = branchService.updateBranch(id, updateBranchRequest);
    return ResponseEntity.ok(response);
  }
}
