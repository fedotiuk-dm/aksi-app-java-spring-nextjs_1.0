package com.aksi.service.game.util;

import java.time.Instant;

import com.aksi.domain.common.BaseEntity;

/**
 * Common entity factory utilities for setting default values and timestamps. Provides reusable
 * patterns for entity creation across all game services.
 */
public final class EntityFactory {

  private EntityFactory() {
    // Utility class
  }

  /**
   * Set creation timestamps for new entity.
   *
   * @param entity Entity to update
   * @return Updated entity
   */
  public static <T extends BaseEntity> T setCreationTimestamps(T entity) {
    Instant now = Instant.now();
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);
    return entity;
  }

  /**
   * Set update timestamps for existing entity.
   *
   * @param entity Entity to update
   * @return Updated entity
   */
  public static <T extends BaseEntity> T setUpdateTimestamps(T entity) {
    entity.setUpdatedAt(Instant.now());
    return entity;
  }

  /**
   * Apply creation defaults for new entity.
   *
   * @param entity Entity to update
   * @return Updated entity
   */
  public static <T extends BaseEntity> T applyCreationDefaults(T entity) {
    return setCreationTimestamps(entity);
  }

  /**
   * Prepare entity for update (only update timestamp).
   *
   * @param entity Entity to update
   * @return Updated entity
   */
  public static <T extends BaseEntity> T prepareForUpdate(T entity) {
    return setUpdateTimestamps(entity);
  }
}
