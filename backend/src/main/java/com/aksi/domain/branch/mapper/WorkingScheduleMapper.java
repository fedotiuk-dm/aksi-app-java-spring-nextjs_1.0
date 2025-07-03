package com.aksi.domain.branch.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.branch.dto.BranchOpenStatus;
import com.aksi.api.branch.dto.BranchOpenStatusResponse;
import com.aksi.api.branch.dto.NextWorkingDayResponse;
import com.aksi.api.branch.dto.UpdateWorkingScheduleRequest;
import com.aksi.api.branch.dto.WorkingHoursInfo;
import com.aksi.api.branch.dto.WorkingScheduleRequest;
import com.aksi.api.branch.dto.WorkingScheduleResponse;
import com.aksi.domain.branch.entity.WorkingScheduleEntity;

/**
 * Mapper для WorkingScheduleEntity з Instant типами (OpenAPI-first) Відповідальність: тільки
 * WorkingSchedule entity.
 */
@Mapper(componentModel = "spring")
public interface WorkingScheduleMapper {

  // DTO → Entity mappings

  /** WorkingScheduleRequest → WorkingScheduleEntity. */
  @Mapping(target = "branch", ignore = true) // встановлюється в Service
  @Mapping(target = "workingDays", ignore = true) // окремий mapper
  @Mapping(target = "holidays", ignore = true) // окремий mapper
  WorkingScheduleEntity toEntity(WorkingScheduleRequest request);

  /** UpdateWorkingScheduleRequest → WorkingScheduleEntity (для оновлення). */
  @Mapping(target = "branch", ignore = true)
  @Mapping(target = "workingDays", ignore = true)
  @Mapping(target = "holidays", ignore = true)
  WorkingScheduleEntity toEntityForUpdate(UpdateWorkingScheduleRequest request);

  // Entity → DTO mappings

  /** WorkingScheduleEntity → WorkingScheduleResponse. */
  @Mapping(target = "workingDays", ignore = true) // окремий mapper
  @Mapping(target = "holidays", ignore = true) // окремий mapper
  @Mapping(target = "branchId", source = "branch.id")
  WorkingScheduleResponse toResponse(WorkingScheduleEntity entity);

  /** List<WorkingScheduleEntity> → List<WorkingScheduleResponse>. */
  List<WorkingScheduleResponse> toResponseList(List<WorkingScheduleEntity> entities);

  /** Створити BranchOpenStatusResponse на основі статусу. */
  default BranchOpenStatusResponse toBranchOpenStatusResponse(
      UUID branchId, boolean isOpen, Instant checkDateTime) {
    BranchOpenStatusResponse response = new BranchOpenStatusResponse();
    response.setBranchId(branchId);
    response.setIsOpen(isOpen);
    response.setCurrentStatus(isOpen ? BranchOpenStatus.OPEN : BranchOpenStatus.CLOSED);
    response.setCheckDateTime(checkDateTime); // Прямий маппінг Instant

    // TODO: Додати більше деталей з розкладу (todaySchedule, nextOpenTime)

    return response;
  }

  /** Створити NextWorkingDayResponse на основі дати. */
  default NextWorkingDayResponse toNextWorkingDayResponse(
      UUID branchId, LocalDate nextWorkingDate) {
    NextWorkingDayResponse response = new NextWorkingDayResponse();
    response.setBranchId(branchId);
    response.setNextWorkingDate(nextWorkingDate);
    response.setDaysUntilNextWorking(0); // TODO: Розрахувати правильно

    // TODO: Додати workingHours з реального розкладу
    WorkingHoursInfo workingHours = new WorkingHoursInfo();
    workingHours.setOpenTime("09:00");
    workingHours.setCloseTime("18:00");
    response.setWorkingHours(workingHours);

    return response;
  }
}
