package com.aksi.domain.client.exception;

/**
 * Виняток для випадків коли клієнт з такими даними вже існує.
 */
public class ClientAlreadyExistsException extends ClientBusinessException {

    public ClientAlreadyExistsException(String phone) {
        super("Клієнт з номером телефону " + phone + " вже існує", "CLIENT_PHONE_ALREADY_EXISTS");
    }

    public static ClientAlreadyExistsException byEmail(String email) {
        return new ClientAlreadyExistsException("Клієнт з email " + email + " вже існує", "CLIENT_EMAIL_ALREADY_EXISTS");
    }

    private ClientAlreadyExistsException(String message, String errorCode) {
        super(message, errorCode);
    }
}
