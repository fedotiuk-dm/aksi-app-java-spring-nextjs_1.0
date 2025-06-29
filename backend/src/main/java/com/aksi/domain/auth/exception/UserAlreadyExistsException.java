package com.aksi.domain.auth.exception;

/**
 * Виняток коли користувач вже існує
 * Domain-specific RuntimeException
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String field, String value) {
        super("Користувач вже існує з " + field + ": " + value);
    }

    public static UserAlreadyExistsException byUsername(String username) {
        return new UserAlreadyExistsException("username", username);
    }

    public static UserAlreadyExistsException byEmail(String email) {
        return new UserAlreadyExistsException("email", email);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
