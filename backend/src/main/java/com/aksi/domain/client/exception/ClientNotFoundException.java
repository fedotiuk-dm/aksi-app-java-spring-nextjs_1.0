package com.aksi.domain.client.exception;

/**
 * Виняток для випадків коли клієнт не знайдений.
 */
public class ClientNotFoundException extends ClientBusinessException {

    public ClientNotFoundException(Long clientId) {
        super("Клієнт з ID " + clientId + " не знайдений", "CLIENT_NOT_FOUND");
    }

    public ClientNotFoundException(String phone) {
        super("Клієнт з номером телефону " + phone + " не знайдений", "CLIENT_NOT_FOUND_BY_PHONE");
    }

    public ClientNotFoundException(String message, String errorCode) {
        super(message, errorCode);
    }
}
