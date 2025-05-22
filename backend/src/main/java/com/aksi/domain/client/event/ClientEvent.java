package com.aksi.domain.client.event;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.client.entity.ClientEntity;

import lombok.Getter;

/**
 * Базовий клас для доменних подій клієнта.
 */
@Getter
public abstract class ClientEvent {

    /**
     * Ідентифікатор клієнта.
     */
    private final UUID clientId;

    /**
     * Час створення події.
     */
    private final LocalDateTime timestamp;

    /**
     * Створює нову подію клієнта.
     *
     * @param client клієнт, для якого створюється подія
     */
    protected ClientEvent(ClientEntity client) {
        this.clientId = client.getId();
        this.timestamp = LocalDateTime.now();
    }
}
