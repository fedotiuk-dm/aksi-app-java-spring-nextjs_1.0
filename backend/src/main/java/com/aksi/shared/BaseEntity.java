package com.aksi.shared;

import java.time.Instant;
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
  private Instant createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private Instant updatedAt;

  @Version
  @Column(name = "version")
  private Long version;

  // Конструктори
  protected BaseEntity() {
    // Для JPA
  }

  // З Instant більше не потрібні conversion methods - прямий mapping!
}
