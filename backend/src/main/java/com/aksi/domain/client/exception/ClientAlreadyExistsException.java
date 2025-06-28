package com.aksi.domain.client.exception;

/**
 * Виняток, що виникає при спробі створити клієнта який вже існує
 */
public class ClientAlreadyExistsException extends RuntimeException {

    public ClientAlreadyExistsException(String message) {
        super(message);
    }

    public ClientAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public static ClientAlreadyExistsException byPhone(String phone) {
        return new ClientAlreadyExistsException("Клієнт з телефоном " + phone + " вже існує");
    }

    public static ClientAlreadyExistsException byEmail(String email) {
        return new ClientAlreadyExistsException("Клієнт з email " + email + " вже існує");
    }
}
