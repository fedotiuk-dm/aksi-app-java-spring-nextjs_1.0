package com.aksi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Виняток, що викидається, коли ресурс з таким самим унікальним ідентифікатором вже існує.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {

    /**
     * Створює новий виняток з вказаним повідомленням.
     *
     * @param message повідомлення про помилку
     */
    public DuplicateResourceException(String message) {
        super(message);
    }

    /**
     * Створює новий виняток з вказаним повідомленням та причиною.
     *
     * @param message повідомлення про помилку
     * @param cause причина помилки
     */
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
