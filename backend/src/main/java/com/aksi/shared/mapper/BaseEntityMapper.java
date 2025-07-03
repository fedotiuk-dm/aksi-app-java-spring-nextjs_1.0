package com.aksi.shared.mapper;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Базовий mapper для Entity → DTO конвертацій. З Instant типами - ніяких конверторів дат не
 * потрібно (OpenAPI-first).
 */
public final class BaseEntityMapper {

  private BaseEntityMapper() {
    // Utility клас
  }

  /**
   * Конвертує List в Set.
   *
   * @param list список для конвертації
   * @param <T> тип елементів
   * @return Set або null
   */
  public static <T> Set<T> listToSet(List<T> list) {
    return Optional.ofNullable(list).map(l -> l.stream().collect(Collectors.toSet())).orElse(null);
  }

  /**
   * Конвертує Set в List.
   *
   * @param set Set для конвертації
   * @param <T> тип елементів
   * @return List або null
   */
  public static <T> List<T> setToList(Set<T> set) {
    return Optional.ofNullable(set).map(s -> s.stream().collect(Collectors.toList())).orElse(null);
  }

  /**
   * Безпечний маппінг списку з null перевіркою.
   *
   * @param list список для маппінгу
   * @param <T> тип елементів
   * @return список або пустий список
   */
  public static <T> List<T> safeListMapping(List<T> list) {
    return Optional.ofNullable(list).orElse(List.of());
  }

  /**
   * Перевіряє чи не пустий рядок.
   *
   * @param value рядок для перевірки
   * @return true якщо рядок не пустий
   */
  public static boolean isNotEmpty(String value) {
    return Optional.ofNullable(value).map(String::trim).filter(s -> !s.isEmpty()).isPresent();
  }
}
