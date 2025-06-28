package com.aksi.domain.client.exception;

import java.util.List;
import java.util.Map;

/**
 * Виняток для помилок валідації клієнта.
 */
public class ClientValidationException extends ClientBusinessException {

    private final Map<String, List<String>> validationErrors;

    public ClientValidationException(String message, Map<String, List<String>> validationErrors) {
        super(message, "CLIENT_VALIDATION_ERROR");
        this.validationErrors = validationErrors;
    }

    public ClientValidationException(String field, String error) {
        super("Помилка валідації поля " + field + ": " + error, "CLIENT_FIELD_VALIDATION_ERROR");
        this.validationErrors = Map.of(field, List.of(error));
    }

    public Map<String, List<String>> getValidationErrors() {
        return validationErrors;
    }
}
