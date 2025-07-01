package com.aksi.shared.repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Інтерфейс для repository з можливістю пошуку за UUID. Використовується в BaseEntityService для
 * уникнення дублювання.
 *
 * @param <T> тип Entity
 */
public interface UuidFindableRepository<T> {

  /** Знайти entity за UUID. */
  Optional<T> findByUuid(UUID uuid);
}
