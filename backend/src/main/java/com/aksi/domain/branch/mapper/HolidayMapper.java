package com.aksi.domain.branch.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.api.branch.dto.HolidayRequest;
import com.aksi.api.branch.dto.HolidayResponse;
import com.aksi.domain.branch.entity.HolidayEntity;

/**
 * Mapper для HolidayEntity з правильними UUID конвертаціями Відповідальність: тільки Holiday
 * entity.
 */
@Mapper(componentModel = "spring")
public interface HolidayMapper {

  // DTO → Entity mappings

  /** HolidayRequest → HolidayEntity. */
  /**
   * {@link HolidayRequest} → {@link HolidayEntity} annotation is used to specify the mapping
   * target.
   *
   * @param request
   * @return
   */
  @Mapping(target = "workingSchedule", ignore = true) // встановлюється в Service
  HolidayEntity toEntity(HolidayRequest request);

  // Entity → DTO mappings

  /** HolidayEntity → HolidayResponse. */
  HolidayResponse toResponse(HolidayEntity entity);

  /** List<HolidayEntity> → List<HolidayResponse>. */
  List<HolidayResponse> toResponseList(List<HolidayEntity> entities);

  // Utility mappings

  /** LocalDate (Entity) → LocalDate (DTO) - auto mapping (без конвертації). */
  default LocalDate map(LocalDate localDate) {
    return localDate;
  }

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) - auto mapping. */
  default OffsetDateTime map(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity) - auto mapping. */
  default LocalDateTime map(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }
}
