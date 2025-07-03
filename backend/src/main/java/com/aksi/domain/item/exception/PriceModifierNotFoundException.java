package com.aksi.domain.item.exception;

import java.util.UUID;

/** Виняток коли модифікатор ціни не знайдений Domain-specific RuntimeException для Item domain. */
public class PriceModifierNotFoundException extends RuntimeException {

  public PriceModifierNotFoundException(String message) {
    super(message);
  }

  public PriceModifierNotFoundException(UUID id) {
    super("Модифікатор ціни не знайдений з ID: " + id);
  }

  public PriceModifierNotFoundException(String field, String value) {
    super("Модифікатор ціни не знайдений з " + field + ": " + value);
  }

  public PriceModifierNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods для різних сценаріїв

  public static PriceModifierNotFoundException byCode(String code) {
    return new PriceModifierNotFoundException("code", code);
  }

  public static PriceModifierNotFoundException byType(String modifierType) {
    return new PriceModifierNotFoundException("modifierType", modifierType);
  }
}
