package com.aksi.api.branch;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.branch.dto.BranchOpenStatusResponse;
import com.aksi.api.branch.dto.NextWorkingDayResponse;
import com.aksi.api.branch.dto.UpdateWorkingScheduleRequest;
import com.aksi.api.branch.dto.WorkingScheduleResponse;
import com.aksi.domain.branch.service.WorkingScheduleService;

import lombok.RequiredArgsConstructor;

/** HTTP контролер для управління графіком роботи Відповідальність: тільки HTTP логіка */
@RestController
@RequiredArgsConstructor
public class WorkingScheduleApiController implements WorkingScheduleApi {

  private final WorkingScheduleService workingScheduleService;

  @Override
  public ResponseEntity<WorkingScheduleResponse> getBranchSchedule(UUID branchId) {
    WorkingScheduleResponse response = workingScheduleService.getBranchSchedule(branchId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<WorkingScheduleResponse> updateBranchSchedule(
      UUID branchId, UpdateWorkingScheduleRequest updateWorkingScheduleRequest) {
    WorkingScheduleResponse response =
        workingScheduleService.updateBranchSchedule(branchId, updateWorkingScheduleRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<BranchOpenStatusResponse> getBranchOpenStatus(
      UUID branchId, OffsetDateTime dateTime) {
    BranchOpenStatusResponse response =
        workingScheduleService.getBranchOpenStatus(branchId, dateTime);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<NextWorkingDayResponse> getBranchNextWorkingDay(
      UUID branchId, LocalDate fromDate) {
    NextWorkingDayResponse response =
        workingScheduleService.getBranchNextWorkingDay(branchId, fromDate);
    return ResponseEntity.ok(response);
  }
}
