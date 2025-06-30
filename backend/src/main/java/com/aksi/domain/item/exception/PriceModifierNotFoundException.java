package com.aksi.domain.item.exception;

import java.util.UUID;

/** Exception що викидається коли модифікатор ціни не знайдений. */
public class PriceModifierNotFoundException extends RuntimeException {

  public PriceModifierNotFoundException(String message) {
    super(message);
  }

  public PriceModifierNotFoundException(UUID uuid) {
    super("Модифікатор ціни з UUID " + uuid + " не знайдений");
  }

  public static PriceModifierNotFoundException byCode(String code) {
    return new PriceModifierNotFoundException(
        "Модифікатор ціни з кодом '" + code + "' не знайдений");
  }

  public PriceModifierNotFoundException(Long id) {
    super("Модифікатор ціни з ID " + id + " не знайдений");
  }

  public PriceModifierNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
