package com.aksi.domain.branch.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.branch.dto.WorkingDayRequest;
import com.aksi.api.branch.dto.WorkingDayResponse;
import com.aksi.api.branch.dto.WorkingScheduleResponse;
import com.aksi.domain.branch.entity.WorkingScheduleEntity;

/** MapStruct mapper for converting between WorkingScheduleEntity and DTOs */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface WorkingScheduleMapper {

  /** Convert WorkingScheduleEntity to WorkingDayResponse */
  @Mapping(target = "dayOfWeek", source = "dayOfWeek")
  @Mapping(target = "isWorkingDay", source = "workingDay")
  @Mapping(target = "openTime", source = "openTime")
  @Mapping(target = "closeTime", source = "closeTime")
  WorkingDayResponse toWorkingDayResponse(WorkingScheduleEntity entity);

  /** Convert WorkingDayRequest to WorkingScheduleEntity */
  @Mapping(target = "dayOfWeek", source = "dayOfWeek")
  @Mapping(target = "workingDay", source = "isWorkingDay")
  @Mapping(target = "openTime", source = "openTime")
  @Mapping(target = "closeTime", source = "closeTime")
  @Mapping(target = "branch", ignore = true) // Will be set by service
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  WorkingScheduleEntity toEntity(WorkingDayRequest request);

  /** Convert list of WorkingScheduleEntity to WorkingScheduleResponse */
  default WorkingScheduleResponse toWorkingScheduleResponse(List<WorkingScheduleEntity> entities) {
    if (entities == null) {
      return null;
    }
    WorkingScheduleResponse response = new WorkingScheduleResponse();
    entities.forEach(entity -> response.addWorkingDaysItem(toWorkingDayResponse(entity)));
    return response;
  }
}
