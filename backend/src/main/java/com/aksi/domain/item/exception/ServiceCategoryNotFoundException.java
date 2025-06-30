package com.aksi.domain.item.exception;

import java.util.UUID;

/**
 * Exception що викидається коли категорія послуг не знайдена.
 */
public class ServiceCategoryNotFoundException extends RuntimeException {

    public ServiceCategoryNotFoundException(String message) {
        super(message);
    }

    public ServiceCategoryNotFoundException(UUID uuid) {
        super("Категорія послуг з UUID " + uuid + " не знайдена");
    }

    public ServiceCategoryNotFoundException(String code, boolean byCode) {
        super("Категорія послуг з кодом '" + code + "' не знайдена");
    }

    public ServiceCategoryNotFoundException(Long id) {
        super("Категорія послуг з ID " + id + " не знайдена");
    }

    public ServiceCategoryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
