package com.aksi.shared;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Data;

/**
 * Базовий клас для всіх доменних сутностей.
 *
 * <p>Забезпечує загальні поля та функціональність: - Унікальний ідентифікатор (UUID) - Аудит дат
 * створення та модифікації - Helper методи для API конвертації - Базові методи
 * equals/hashCode/toString
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class BaseEntity {

  @Id
  @Column(name = "id", updatable = false, nullable = false, unique = true)
  @UuidGenerator
  private UUID id;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Version
  @Column(name = "version")
  private Long version;

  // Конструктори
  protected BaseEntity() {
    // Для JPA
  }

  // API Helper методи для MapStruct сумісності

  /** Конвертація createdAt в OffsetDateTime для API. */
  public OffsetDateTime getCreatedAtAsOffsetDateTime() {
    return createdAt != null ? createdAt.atOffset(ZoneOffset.UTC) : null;
  }

  /** Конвертація updatedAt в OffsetDateTime для API. */
  public OffsetDateTime getUpdatedAtAsOffsetDateTime() {
    return updatedAt != null ? updatedAt.atOffset(ZoneOffset.UTC) : null;
  }

  /** Конвертація createdAt в LocalDate для API. */
  public java.time.LocalDate getCreatedAtAsLocalDate() {
    return createdAt != null ? createdAt.toLocalDate() : null;
  }

  /** Статичний helper для конвертації LocalDateTime → OffsetDateTime. */
  public static OffsetDateTime toOffsetDateTime(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** Статичний helper для конвертації OffsetDateTime → LocalDateTime. */
  public static LocalDateTime toLocalDateTime(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }
}
