package com.aksi.shared.service;

import com.aksi.shared.BaseEntity;

/**
 * Helper для усунення дублювання create логіки між domain сервісами. Працює з BaseEntity UUID
 * архітектурою - UUID генерується автоматично.
 */
public final class EntityCreationHelper {

  private EntityCreationHelper() {
    // Утилітарний клас
  }

  /**
   * Підготовляє BaseEntity для створення - встановлює необхідні поля. UUID генерується автоматично
   * через @UuidGenerator.
   *
   * @param entity BaseEntity для підготовки
   * @param <T> тип entity
   * @return підготовлена entity
   */
  public static <T extends BaseEntity> T prepareForCreation(T entity) {
    if (entity == null) {
      throw new IllegalArgumentException("Entity не може бути null");
    }

    // ID генерується автоматично через @UuidGenerator
    // createdAt/updatedAt встановлюються через @CreatedDate/@LastModifiedDate
    // version встановлюється через @Version

    // Повертаємо entity без змін - все налаштовано автоматично
    return entity;
  }

  /**
   * Валідує що entity готова для створення.
   *
   * @param entity BaseEntity для валідації
   * @param <T> тип entity
   * @throws IllegalStateException якщо entity не готова
   */
  public static <T extends BaseEntity> void validateForCreation(T entity) {
    if (entity == null) {
      throw new IllegalArgumentException("Entity не може бути null");
    }

    // ID має бути null для нових entities (буде згенерований)
    if (entity.getId() != null) {
      throw new IllegalStateException("ID має бути null для нових entities");
    }
  }

  /**
   * Клонує базові поля з існуючої entity (крім ID, timestamps, version).
   *
   * @param source джерело
   * @param target ціль
   * @param <T> тип entity
   * @return оновлена target entity
   */
  public static <T extends BaseEntity> T copyBaseFields(T source, T target) {
    if (source == null || target == null) {
      throw new IllegalArgumentException("Source та target не можуть бути null");
    }

    // Базові поля копіювати не потрібно:
    // - ID буде згенерований автоматично
    // - timestamps встановляться автоматично
    // - version встановиться автоматично

    return target;
  }
}
