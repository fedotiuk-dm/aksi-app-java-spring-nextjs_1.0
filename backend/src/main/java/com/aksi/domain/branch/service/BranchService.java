package com.aksi.domain.branch.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchListResponse;
import com.aksi.api.branch.dto.BranchResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.api.branch.dto.WorkingScheduleResponse;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.exception.BranchNotFoundException;
import com.aksi.domain.branch.exception.DuplicateReceiptPrefixException;
import com.aksi.domain.branch.mapper.BranchMapper;
import com.aksi.domain.branch.repository.BranchRepository;
import com.aksi.domain.branch.util.BranchUtils;
import com.aksi.shared.validation.ValidationConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for branch management operations */
@Service
@RequiredArgsConstructor
@Slf4j
public class BranchService {

  private final BranchRepository branchRepository;
  private final BranchMapper branchMapper;
  private final WorkingScheduleService workingScheduleService;

  /** Create a new branch */
  @Transactional
  public BranchResponse createBranch(CreateBranchRequest request) {
    log.info(ValidationConstants.Messages.CREATING_BRANCH, request.getName());

    // Check if receipt prefix already exists
    if (branchRepository.existsByReceiptPrefix(request.getReceiptPrefix())) {
      throw new DuplicateReceiptPrefixException(
          String.format(
              ValidationConstants.Messages.RECEIPT_PREFIX_EXISTS, request.getReceiptPrefix()));
    }

    // Create branch entity
    BranchEntity branch = branchMapper.toEntity(request);
    branch = branchRepository.save(branch);

    // Create working schedule if provided
    WorkingScheduleResponse workingScheduleResponse = null;
    if (request.getWorkingSchedule() != null) {
      workingScheduleResponse =
          workingScheduleService.createWorkingSchedule(branch, request.getWorkingSchedule());
    }

    // Convert to response
    BranchResponse response = branchMapper.toResponse(branch);
    response.setWorkingSchedule(workingScheduleResponse);

    log.debug(
        "Created branch: {} (display: {})", branch.getName(), BranchUtils.getDisplayName(branch));

    return response;
  }

  /** Get branch by ID */
  @Transactional(readOnly = true)
  public BranchResponse getBranchById(UUID id) {
    log.debug(ValidationConstants.Messages.GETTING_BRANCH_BY_ID, id);

    BranchEntity branch =
        branchRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new BranchNotFoundException(
                        String.format(ValidationConstants.Messages.BRANCH_NOT_FOUND, id)));

    // Log branch display name using utility
    log.debug("Found branch: {}", BranchUtils.getDisplayName(branch));

    BranchResponse response = branchMapper.toResponse(branch);

    // Add working schedule
    WorkingScheduleResponse workingSchedule = workingScheduleService.getWorkingSchedule(id);
    response.setWorkingSchedule(workingSchedule);

    return response;
  }

  /** Get branches with filters and pagination */
  @Transactional(readOnly = true)
  public BranchListResponse getBranches(
      String search, Boolean includeInactive, Integer page, Integer size) {

    boolean includeInactiveFlag = includeInactive != null ? includeInactive : false;
    int pageNumber = page != null ? page : ValidationConstants.Controllers.DEFAULT_PAGE;
    int pageSize = size != null ? size : ValidationConstants.Controllers.DEFAULT_PAGE_SIZE;

    log.debug(
        ValidationConstants.Messages.GETTING_BRANCHES_LIST,
        search,
        includeInactiveFlag,
        pageNumber,
        pageSize);

    // Create pageable with sorting by name
    Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("name").ascending());

    // Find branches with filters
    Page<BranchEntity> branchPage =
        branchRepository.findWithFilters(search, includeInactiveFlag, pageable);

    // Convert to response
    BranchListResponse response = new BranchListResponse();
    response.setItems(branchMapper.toResponseList(branchPage.getContent()));

    return response;
  }

  /** Update branch information */
  @Transactional
  public BranchResponse updateBranch(UUID id, UpdateBranchRequest request) {
    log.info(ValidationConstants.Messages.UPDATING_BRANCH, id);

    BranchEntity branch =
        branchRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new BranchNotFoundException(
                        String.format(ValidationConstants.Messages.BRANCH_NOT_FOUND, id)));

    // Update branch fields using mapper
    branchMapper.updateEntityFromRequest(branch, request);
    branch = branchRepository.save(branch);

    // Update working schedule if provided
    WorkingScheduleResponse workingScheduleResponse;
    if (request.getWorkingSchedule() != null) {
      workingScheduleResponse =
          workingScheduleService.updateWorkingSchedule(branch, request.getWorkingSchedule());
    } else {
      // Get existing working schedule
      workingScheduleResponse = workingScheduleService.getWorkingSchedule(id);
    }

    // Convert to response
    BranchResponse response = branchMapper.toResponse(branch);
    response.setWorkingSchedule(workingScheduleResponse);

    log.debug("Updated branch: {}", BranchUtils.getDisplayName(branch));

    return response;
  }
}
