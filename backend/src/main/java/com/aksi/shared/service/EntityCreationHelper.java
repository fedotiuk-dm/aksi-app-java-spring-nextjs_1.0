package com.aksi.shared.service;

import java.util.UUID;

/** Helper для усунення дублювання create логіки між domain сервісами. */
public final class EntityCreationHelper {

  private EntityCreationHelper() {
    // Утилітарний клас
  }

  /**
   * Простий helper для встановлення випадкового UUID в entity. Усуває дублювання між
   * PriceModifierService та ServiceCategoryService.
   *
   * @param entity entity для встановлення UUID
   */
  public static void setRandomUuid(Object entity) {
    try {
      var method = entity.getClass().getMethod("setUuid", UUID.class);
      method.invoke(entity, UUID.randomUUID());
    } catch (ReflectiveOperationException e) {
      throw new RuntimeException("Entity не має методу setUuid(UUID): " + entity.getClass(), e);
    }
  }
}
