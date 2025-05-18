package com.aksi.exception;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;

/**
 * Виключення для випадку, коли сутність не знайдена.
 * Надає детальну інформацію про тип сутності та її ідентифікатор.
 */
@Getter
public class EntityNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final Object entityId;
    private final String entityType;
    private final Map<String, Object> metadata;
    
    /**
     * Базовий конструктор з усіма параметрами (приватний, щоб заохочувати використання статичних фабричних методів)
     */
    private EntityNotFoundException(String message, String entityType, Object entityId, Map<String, Object> metadata) {
        super(message);
        this.entityType = entityType;
        this.entityId = entityId;
        this.metadata = metadata != null ? new HashMap<>(metadata) : new HashMap<>();
    }
    
    /**
     * Публічний конструктор для зворотної сумісності
     */
    public EntityNotFoundException(String message) {
        this(message, null, null, null);
    }
    
    /**
     * Публічний конструктор для зворотної сумісності
     */
    public EntityNotFoundException(String message, String entityType, Object entityId) {
        this(message, entityType, entityId, null);
    }

    /**
     * Створює виключення з повідомленням та ідентифікатором сутності
     */
    public static EntityNotFoundException withId(Object id) {
        String message = String.format("Сутність з ідентифікатором %s не знайдена", id);
        return new EntityNotFoundException(message, null, id, null);
    }

    /**
     * Створює виключення з вказаним повідомленням
     */
    public static EntityNotFoundException withMessage(String message) {
        return new EntityNotFoundException(message, null, null, null);
    }

    /**
     * Створює виключення з типом сутності та ідентифікатором
     */
    public static EntityNotFoundException withTypeAndId(String entityType, Object id) {
        String message = String.format("Сутність типу %s з ідентифікатором %s не знайдена", entityType, id);
        return new EntityNotFoundException(message, entityType, id, null);
    }
    
    /**
     * Додає метадані до виключення
     */
    public EntityNotFoundException withMetadata(String key, Object value) {
        metadata.put(key, value);
        return this;
    }
}
