package com.aksi.shared.mapper;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

/**
 * Базова MapStruct конфігурація з загальними маппінгами
 * Використовується всіма доменними мапперами для уникнення дублювання
 * Автоматично ігнорує BaseEntity поля (id, createdAt, updatedAt, version)
 */
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BaseMapperConfig {

    /**
     * Конвертація LocalDateTime → OffsetDateTime (UTC)
     */
    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    /**
     * Конвертація OffsetDateTime → LocalDateTime
     */
    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }

    /**
     * Конвертація LocalDateTime → LocalDate для registrationDate полів
     */
    @Named("localDateTimeToLocalDate")
    default java.time.LocalDate localDateTimeToLocalDate(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.toLocalDate() : null;
    }

    /**
     * Конвертація OffsetDateTime → LocalDate
     */
    @Named("offsetDateTimeToLocalDate")
    default java.time.LocalDate offsetDateTimeToLocalDate(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDate() : null;
    }
}
