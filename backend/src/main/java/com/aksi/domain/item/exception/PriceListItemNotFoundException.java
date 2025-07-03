package com.aksi.domain.item.exception;

import java.util.UUID;

/**
 * Виняток коли предмет прайс-листа не знайдений Domain-specific RuntimeException для Item domain.
 */
public class PriceListItemNotFoundException extends RuntimeException {

  public PriceListItemNotFoundException(String message) {
    super(message);
  }

  public PriceListItemNotFoundException(UUID id) {
    super("Предмет прайс-листа не знайдений з ID: " + id);
  }

  public PriceListItemNotFoundException(String field, String value) {
    super("Предмет прайс-листа не знайдений з " + field + ": " + value);
  }

  public PriceListItemNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods для різних сценаріїв

  public static PriceListItemNotFoundException byCode(String code) {
    return new PriceListItemNotFoundException("code", code);
  }

  public static PriceListItemNotFoundException byCategoryAndName(UUID categoryId, String name) {
    return new PriceListItemNotFoundException(
        "Предмет з назвою '" + name + "' не знайдений в категорії: " + categoryId);
  }
}
