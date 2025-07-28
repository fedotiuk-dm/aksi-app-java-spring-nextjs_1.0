package com.aksi.domain.item.exception;

/** Exception thrown when JEXL formula calculation fails */
public class FormulaCalculationException extends RuntimeException {

  public FormulaCalculationException(String message) {
    super(message);
  }

  public FormulaCalculationException(String message, Throwable cause) {
    super(message, cause);
  }
}
