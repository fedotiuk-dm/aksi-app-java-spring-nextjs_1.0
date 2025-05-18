package com.aksi.exception;

import lombok.Getter;

/**
 * Виняток, який виникає, коли сутність не знайдена за ідентифікатором
 */
@Getter
public class EntityNotFoundException extends RuntimeException {
    
    private final String entityId;
    
    /**
     * Конструктор з повідомленням про помилку та ідентифікатором сутності
     * 
     * @param message повідомлення
     * @param entityId ідентифікатор сутності
     */
    public EntityNotFoundException(String message, String entityId) {
        super(message);
        this.entityId = entityId;
    }
} 