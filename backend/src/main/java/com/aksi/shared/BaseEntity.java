package com.aksi.shared;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Objects;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;

/**
 * Базовий клас для всіх доменних сутностей.
 *
 * <p>Забезпечує загальні поля та функціональність: - Унікальний ідентифікатор (Long - внутрішньо) -
 * UUID для API сумісності (зовнішньо) - Аудит дат створення та модифікації - Helper методи для API
 * конвертації - Базові методи equals/hashCode/toString
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

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

  // Геттери та сеттери
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
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

  // Перевизначення базових методів
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    BaseEntity that = (BaseEntity) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }

  @Override
  public String toString() {
    return getClass().getSimpleName()
        + "{"
        + "id="
        + id
        + ", createdAt="
        + createdAt
        + ", updatedAt="
        + updatedAt
        + ", version="
        + version
        + '}';
  }
}
