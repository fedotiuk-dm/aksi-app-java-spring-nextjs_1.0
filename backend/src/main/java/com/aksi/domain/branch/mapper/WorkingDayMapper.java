package com.aksi.domain.branch.mapper;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.ZoneOffset;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.branch.dto.WorkingDayRequest;
import com.aksi.api.branch.dto.WorkingDayResponse;
import com.aksi.domain.branch.entity.WorkingDayEntity;

/**
 * Mapper для WorkingDayEntity з правильними UUID конвертаціями Відповідальність: тільки WorkingDay
 * entity.
 */
@Mapper(componentModel = "spring")
public interface WorkingDayMapper {

  // DTO → Entity mappings

  /** WorkingDayRequest → WorkingDayEntity. */
  @Mapping(target = "workingSchedule", ignore = true) // встановлюється в Service
  WorkingDayEntity toEntity(WorkingDayRequest request);

  // Entity → DTO mappings

  /** WorkingDayEntity → WorkingDayResponse. */
  WorkingDayResponse toResponse(WorkingDayEntity entity);

  /** List<WorkingDayEntity> → List<WorkingDayResponse>. */
  List<WorkingDayResponse> toResponseList(List<WorkingDayEntity> entities);

  // Utility mappings

  /** LocalTime (Entity) → OffsetTime (DTO) - auto mapping. */
  default OffsetTime map(LocalTime localTime) {
    return localTime != null ? localTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetTime (DTO) → LocalTime (Entity) - auto mapping. */
  default LocalTime map(OffsetTime offsetTime) {
    return offsetTime != null ? offsetTime.toLocalTime() : null;
  }

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) - auto mapping. */
  default OffsetDateTime map(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity) - auto mapping. */
  default LocalDateTime map(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }

  /** API DayOfWeek → java.time.DayOfWeek - auto mapping. */
  default java.time.DayOfWeek map(com.aksi.api.branch.dto.DayOfWeek apiDayOfWeek) {
    return apiDayOfWeek != null ? java.time.DayOfWeek.valueOf(apiDayOfWeek.getValue()) : null;
  }

  /** java.time.DayOfWeek → API DayOfWeek - auto mapping. */
  default com.aksi.api.branch.dto.DayOfWeek map(java.time.DayOfWeek javaDayOfWeek) {
    return javaDayOfWeek != null
        ? com.aksi.api.branch.dto.DayOfWeek.fromValue(javaDayOfWeek.name())
        : null;
  }
}
