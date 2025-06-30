package com.aksi.domain.branch.exception;

/** Exception для валідаційних помилок філії. */
public class BranchValidationException extends RuntimeException {

  public BranchValidationException(String message) {
    super(message);
  }

  public BranchValidationException(String message, Throwable cause) {
    super(message, cause);
  }

  public static BranchValidationException invalidCode(String code) {
    return new BranchValidationException(String.format("Невалідний код філії: '%s'", code));
  }

  public static BranchValidationException invalidCoordinates(Double latitude, Double longitude) {
    return new BranchValidationException(
        String.format("Невалідні координати: широта=%s, довгота=%s", latitude, longitude));
  }

  public static BranchValidationException missingRequiredField(String fieldName) {
    return new BranchValidationException(
        String.format("Обов'язкове поле '%s' не заповнено", fieldName));
  }

  public static BranchValidationException invalidStatus(String currentStatus, String action) {
    return new BranchValidationException(
        String.format("Неможливо виконати '%s' для філії зі статусом '%s'", action, currentStatus));
  }
}
