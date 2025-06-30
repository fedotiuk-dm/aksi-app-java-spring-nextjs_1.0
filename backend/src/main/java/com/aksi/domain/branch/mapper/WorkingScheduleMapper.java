package com.aksi.domain.branch.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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
 * Mapper для WorkingScheduleEntity з правильними маппінгами Відповідальність: тільки
 * WorkingSchedule entity.
 */
@Mapper(componentModel = "spring")
public interface WorkingScheduleMapper {

  // DTO → Entity mappings

  /** WorkingScheduleRequest → WorkingScheduleEntity. */
  @Mapping(target = "uuid", ignore = true) // автоматично генерується
  @Mapping(target = "branch", ignore = true) // встановлюється в Service
  @Mapping(target = "workingDays", ignore = true) // окремий mapper
  @Mapping(target = "holidays", ignore = true) // окремий mapper
  WorkingScheduleEntity toEntity(WorkingScheduleRequest request);

  /** UpdateWorkingScheduleRequest → WorkingScheduleEntity (для оновлення). */
  @Mapping(target = "uuid", ignore = true) // зберігається з існуючого entity
  @Mapping(target = "branch", ignore = true)
  @Mapping(target = "workingDays", ignore = true)
  @Mapping(target = "holidays", ignore = true)
  WorkingScheduleEntity toEntityForUpdate(UpdateWorkingScheduleRequest request);

  // Entity → DTO mappings

  /** WorkingScheduleEntity → WorkingScheduleResponse. */
  @Mapping(target = "workingDays", ignore = true) // окремий mapper
  @Mapping(target = "holidays", ignore = true) // окремий mapper
  @Mapping(target = "branchId", source = "branch.uuid")
  WorkingScheduleResponse toResponse(WorkingScheduleEntity entity);

  /** List<WorkingScheduleEntity> → List<WorkingScheduleResponse>. */
  List<WorkingScheduleResponse> toResponseList(List<WorkingScheduleEntity> entities);

  // Utility mappings

  /** Long (Entity) → UUID (DTO) - auto mapping. */
  default java.util.UUID map(Long id) {
    return id != null ? java.util.UUID.nameUUIDFromBytes(id.toString().getBytes()) : null;
  }

  /** UUID (DTO) → Long (Entity) - auto mapping. */
  default Long map(java.util.UUID uuid) {
    return uuid != null ? (long) Math.abs(uuid.hashCode()) : null;
  }

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) - auto mapping. */
  default OffsetDateTime map(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity) - auto mapping. */
  default LocalDateTime map(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }

  /** Створити BranchOpenStatusResponse на основі статусу. */
  default BranchOpenStatusResponse toBranchOpenStatusResponse(
      UUID branchId, boolean isOpen, LocalDateTime checkDateTime) {
    BranchOpenStatusResponse response = new BranchOpenStatusResponse();
    response.setBranchId(branchId);
    response.setIsOpen(isOpen);
    response.setCurrentStatus(isOpen ? BranchOpenStatus.OPEN : BranchOpenStatus.CLOSED);
    response.setCheckDateTime(checkDateTime.atOffset(ZoneOffset.UTC));

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
