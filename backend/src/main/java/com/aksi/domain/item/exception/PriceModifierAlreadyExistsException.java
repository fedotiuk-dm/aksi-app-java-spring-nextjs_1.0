package com.aksi.domain.item.exception;

/** Exception що викидається коли модифікатор ціни вже існує. */
public class PriceModifierAlreadyExistsException extends RuntimeException {

  public PriceModifierAlreadyExistsException(String message) {
    super(message);
  }

  public static PriceModifierAlreadyExistsException byCode(String code) {
    return new PriceModifierAlreadyExistsException(
        "Модифікатор ціни з кодом '" + code + "' вже існує");
  }

  public PriceModifierAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }
}
