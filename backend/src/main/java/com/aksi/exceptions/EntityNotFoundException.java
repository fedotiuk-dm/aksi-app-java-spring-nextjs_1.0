package com.aksi.exceptions;

import java.util.UUID;

import lombok.Getter;

/**
 * Виключення для випадку, коли сутність не знайдена.
 */
@Getter
public class EntityNotFoundException extends RuntimeException {

    private final Object entityId;
    
    public EntityNotFoundException(String message, Object entityId) {
        super(message);
        this.entityId = entityId;
    }
    
    public EntityNotFoundException(String message) {
        this(message, null);
    }
    
    public EntityNotFoundException(UUID id) {
        this("Entity not found", id);
    }
}
