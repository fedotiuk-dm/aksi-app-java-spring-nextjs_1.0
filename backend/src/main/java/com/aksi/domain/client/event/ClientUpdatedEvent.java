package com.aksi.domain.client.event;

import com.aksi.domain.client.entity.ClientEntity;

import lombok.Getter;

/**
 * Подія, що сигналізує про оновлення даних клієнта.
 */
@Getter
public class ClientUpdatedEvent extends ClientEvent {

    /**
     * Поле, яке було змінено.
     */
    private final String updatedField;

    /**
     * Старе значення поля.
     */
    private final String oldValue;

    /**
     * Нове значення поля.
     */
    private final String newValue;

    /**
     * Створює нову подію оновлення клієнта.
     *
     * @param client оновлений клієнт
     * @param updatedField поле, яке було змінено
     * @param oldValue старе значення поля
     * @param newValue нове значення поля
     */
    public ClientUpdatedEvent(ClientEntity client, String updatedField, String oldValue, String newValue) {
        super(client);
        this.updatedField = updatedField;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
