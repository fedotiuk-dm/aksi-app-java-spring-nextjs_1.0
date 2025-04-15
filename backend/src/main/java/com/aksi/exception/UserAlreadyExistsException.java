package com.aksi.exception;

/**
 * Виняток, що виникає при спробі створити користувача з існуючим логіном або email
 */
public class UserAlreadyExistsException extends RuntimeException {
    
    public UserAlreadyExistsException(String message) {
        super(message);
    }
    
    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
} 