package com.aksi.domain.branch.service;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.WorkingScheduleRequest;
import com.aksi.api.branch.dto.WorkingScheduleResponse;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.entity.WorkingScheduleEntity;
import com.aksi.domain.branch.exception.InvalidWorkingScheduleException;
import com.aksi.domain.branch.mapper.WorkingScheduleMapper;
import com.aksi.domain.branch.repository.WorkingScheduleRepository;
import com.aksi.domain.branch.util.BranchUtils;
import com.aksi.domain.branch.util.WorkingScheduleUtils;
import com.aksi.shared.validation.ValidationConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for working schedule management operations */
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkingScheduleService {

  private final WorkingScheduleRepository workingScheduleRepository;
  private final WorkingScheduleMapper workingScheduleMapper;

  /** Get working schedule for a specific branch */
  @Transactional(readOnly = true)
  public WorkingScheduleResponse getWorkingSchedule(UUID branchId) {
    log.debug("Getting working schedule for branch: {}", branchId);

    List<WorkingScheduleEntity> schedules =
        workingScheduleRepository.findByBranchIdOrderByDayOfWeek(branchId);

    return workingScheduleMapper.toWorkingScheduleResponse(schedules);
  }

  /** Create working schedule for a branch */
  @Transactional
  public WorkingScheduleResponse createWorkingSchedule(
      BranchEntity branch, WorkingScheduleRequest request) {
    log.info("Creating working schedule for branch: {}", branch.getId());
    return processWorkingScheduleUpdate(branch, request, "Created");
  }

  /** Update working schedule for a branch */
  @Transactional
  public WorkingScheduleResponse updateWorkingSchedule(
      BranchEntity branch, WorkingScheduleRequest request) {
    log.info(ValidationConstants.Messages.UPDATING_WORKING_SCHEDULE, branch.getId());
    return processWorkingScheduleUpdate(branch, request, "Updated");
  }

  // Private helper methods

  /** Common logic for creating/updating working schedule */
  private WorkingScheduleResponse processWorkingScheduleUpdate(
      BranchEntity branch, WorkingScheduleRequest request, String operation) {

    validateWorkingScheduleRequest(request);

    // Clear existing schedules using utility method and delete from database
    BranchUtils.clearWorkingSchedules(branch);
    workingScheduleRepository.deleteByBranchId(branch.getId());

    // Create new schedules
    List<WorkingScheduleEntity> schedules = createScheduleEntities(branch, request);
    schedules = workingScheduleRepository.saveAll(schedules);

    log.debug(
        "{} working schedule with {} entries for branch: {}",
        operation,
        schedules.size(),
        branch.getId());

    return workingScheduleMapper.toWorkingScheduleResponse(schedules);
  }

  /** Validate working schedule request */
  private void validateWorkingScheduleRequest(WorkingScheduleRequest request) {
    if (request == null || request.getWorkingDays() == null) {
      throw new InvalidWorkingScheduleException(
          ValidationConstants.Messages.WORKING_SCHEDULE_MUST_HAVE_7_DAYS);
    }

    List<com.aksi.api.branch.dto.WorkingDayRequest> workingDays = request.getWorkingDays();

    // Use utility method for basic validation (7 days, no duplicates)
    if (!WorkingScheduleUtils.validateScheduleRequests(workingDays)) {
      throw new InvalidWorkingScheduleException(
          ValidationConstants.Messages.WORKING_SCHEDULE_MUST_HAVE_7_DAYS);
    }

    // Validate each working day
    workingDays.forEach(this::validateWorkingDay);
  }

  /** Validate individual working day */
  private void validateWorkingDay(com.aksi.api.branch.dto.WorkingDayRequest workingDay) {
    if (workingDay.getIsWorkingDay() == null || !workingDay.getIsWorkingDay()) {
      return; // Non-working days don't need time validation
    }

    if (workingDay.getOpenTime() == null
        || workingDay.getCloseTime() == null
        || workingDay.getOpenTime().trim().isEmpty()
        || workingDay.getCloseTime().trim().isEmpty()) {
      throw new InvalidWorkingScheduleException(ValidationConstants.Messages.WORKING_TIME_INVALID);
    }

    try {
      // Parse times to check validity and compare
      LocalTime openTime = LocalTime.parse(workingDay.getOpenTime());
      LocalTime closeTime = LocalTime.parse(workingDay.getCloseTime());

      if (!openTime.isBefore(closeTime)) {
        throw new InvalidWorkingScheduleException(
            ValidationConstants.Messages.WORKING_TIME_INVALID);
      }
    } catch (DateTimeParseException e) {
      throw new InvalidWorkingScheduleException(ValidationConstants.Messages.WORKING_TIME_INVALID);
    }
  }

  /** Create schedule entities from request */
  private List<WorkingScheduleEntity> createScheduleEntities(
      BranchEntity branch, WorkingScheduleRequest request) {

    return request.getWorkingDays().stream()
        .map(
            workingDayRequest -> {
              WorkingScheduleEntity entity = workingScheduleMapper.toEntity(workingDayRequest);

              // Use utility method to manage bidirectional relationship
              BranchUtils.addWorkingSchedule(branch, entity);

              // Validate the created entity
              if (WorkingScheduleUtils.isInvalidWorkingSchedule(entity)) {
                throw new InvalidWorkingScheduleException(
                    "Invalid working schedule for day: " + entity.getDayOfWeek());
              }

              return entity;
            })
        .toList();
  }
}
