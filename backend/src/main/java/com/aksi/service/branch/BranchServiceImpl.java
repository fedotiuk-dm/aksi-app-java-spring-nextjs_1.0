package com.aksi.service.branch;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchInfo;
import com.aksi.api.branch.dto.BranchesResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.Branch;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.BranchMapper;
import com.aksi.repository.BranchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of BranchService */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BranchServiceImpl implements BranchService {

  private final BranchRepository branchRepository;
  private final BranchMapper branchMapper;

  @Override
  @Transactional(readOnly = true)
  public BranchInfo getBranchById(UUID branchId) {
    log.debug("Getting branch by id: {}", branchId);

    Branch branch =
        branchRepository
            .findById(branchId)
            .orElseThrow(() -> new NotFoundException("Branch not found with id: " + branchId));

    return branchMapper.toBranchInfo(branch);
  }

  @Override
  public BranchInfo createBranch(CreateBranchRequest request) {
    log.info("Creating new branch: {}", request.getName());

    // Validate unique name
    if (branchRepository.existsByNameIgnoreCase(request.getName())) {
      throw new ConflictException("Branch with name '" + request.getName() + "' already exists");
    }

    // Map to entity
    Branch branch = branchMapper.toEntity(request);

    // Save and return
    Branch saved = branchRepository.save(branch);
    log.info("Created branch with ID: {}", saved.getId());

    return branchMapper.toBranchInfo(saved);
  }

  @Override
  public BranchInfo updateBranch(UUID branchId, UpdateBranchRequest request) {
    log.info("Updating branch: {}", branchId);

    Branch branch =
        branchRepository
            .findById(branchId)
            .orElseThrow(() -> new NotFoundException("Branch not found: " + branchId));

    // Validate unique name if changed
    if (request.getName() != null
        && !request.getName().equalsIgnoreCase(branch.getName())
        && branchRepository.existsByNameIgnoreCaseAndIdNot(request.getName(), branchId)) {
      throw new ConflictException("Branch with name '" + request.getName() + "' already exists");
    }

    // Update entity using MapStruct
    branchMapper.updateEntityFromRequest(request, branch);

    Branch updated = branchRepository.save(branch);
    log.info("Updated branch: {}", branchId);

    return branchMapper.toBranchInfo(updated);
  }

  @Override
  public void deleteBranch(UUID branchId) {
    log.info("Deleting branch: {}", branchId);

    if (!branchRepository.existsById(branchId)) {
      throw new NotFoundException("Branch not found: " + branchId);
    }

    branchRepository.deleteById(branchId);
    log.info("Deleted branch: {}", branchId);
  }

  @Override
  @Transactional(readOnly = true)
  public BranchesResponse listBranches(
      Boolean active, String search, Integer offset, Integer limit) {
    log.debug(
        "Listing branches with active: {}, search: '{}', offset: {}, limit: {}",
        active,
        search,
        offset,
        limit);

    // Handle pagination parameters
    int safeOffset = offset != null && offset >= 0 ? offset : 0;
    int safeLimit = limit != null && limit > 0 ? Math.min(limit, 100) : 20;
    int pageNumber = safeOffset / safeLimit;

    Pageable pageable = PageRequest.of(pageNumber, safeLimit);

    Page<Branch> page = branchRepository.findBranchesWithSearch(active, search, pageable);

    // Map to DTOs
    List<BranchInfo> branches = page.getContent().stream().map(branchMapper::toBranchInfo).toList();

    BranchesResponse response = new BranchesResponse();
    response.setBranches(branches);
    response.setTotalItems((int) page.getTotalElements());
    response.setHasMore(page.hasNext());

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public List<BranchInfo> getAllActiveBranches() {
    log.debug("Getting all active branches");

    List<Branch> branches = branchRepository.findAllActiveOrderedBySortOrder();
    return branches.stream().map(branchMapper::toBranchInfo).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean existsById(UUID branchId) {
    return branchRepository.existsById(branchId);
  }
}
