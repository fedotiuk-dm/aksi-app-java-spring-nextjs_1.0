package com.aksi.shared.mapper;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Утилітарний клас для загальних методів маппінгу. Використовується в MapStruct мапперах для
 * уникнення дублювання коду.
 */
public final class BaseEntityMapper {

  private BaseEntityMapper() {
    // Утилітарний клас
  }

  /**
   * Конвертує UUID в Long.
   *
   * @param uuid UUID для конвертації
   * @return Long значення або null
   */
  public static Long uuidToLong(UUID uuid) {
    return Optional.ofNullable(uuid).map(UUID::getMostSignificantBits).orElse(null);
  }

  /**
   * Конвертує Long в UUID.
   *
   * @param longValue Long значення для конвертації
   * @return UUID або null
   */
  public static UUID longToUuid(Long longValue) {
    return Optional.ofNullable(longValue).map(value -> new UUID(value, 0L)).orElse(null);
  }

  /**
   * Конвертує LocalDateTime в OffsetDateTime.
   *
   * @param localDateTime LocalDateTime для конвертації
   * @return OffsetDateTime або null
   */
  public static OffsetDateTime localToOffset(LocalDateTime localDateTime) {
    return Optional.ofNullable(localDateTime).map(dt -> dt.atOffset(ZoneOffset.UTC)).orElse(null);
  }

  /**
   * Конвертує OffsetDateTime в LocalDateTime.
   *
   * @param offsetDateTime OffsetDateTime для конвертації
   * @return LocalDateTime або null
   */
  public static LocalDateTime offsetToLocal(OffsetDateTime offsetDateTime) {
    return Optional.ofNullable(offsetDateTime).map(OffsetDateTime::toLocalDateTime).orElse(null);
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
