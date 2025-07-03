package com.aksi.shared.repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Інтерфейс для repository з можливістю пошуку за UUID ID. Використовується в BaseService для
 * уникнення дублювання. Працює з BaseEntity.id (UUID) полем.
 *
 * @param <T> тип Entity
 */
public interface UuidFindableRepository<T> {

  /** Знайти entity за UUID ID (BaseEntity.id). */
  Optional<T> findById(UUID id);

  /** Перевірити існування entity за UUID ID (BaseEntity.id). */
  boolean existsById(UUID id);
}
