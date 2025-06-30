package com.aksi.domain.item.exception;

/** Exception що викидається коли категорія послуг вже існує. */
public class ServiceCategoryAlreadyExistsException extends RuntimeException {

  public ServiceCategoryAlreadyExistsException(String message) {
    super(message);
  }

  public static ServiceCategoryAlreadyExistsException byCode(String code) {
    return new ServiceCategoryAlreadyExistsException(
        "Категорія послуг з кодом '" + code + "' вже існує");
  }

  public ServiceCategoryAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }
}
