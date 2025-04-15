package com.aksi.exception;

/**
 * Виключення, яке виникає при спробі доступу до неіснуючої сутності
 */
public class EntityNotFoundException extends RuntimeException {
    
    /**
     * Створює виключення з повідомленням про помилку
     * @param message повідомлення про помилку
     */
    public EntityNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Створює виключення з повідомленням про помилку та причиною
     * @param message повідомлення про помилку
     * @param cause причина виключення
     */
    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 