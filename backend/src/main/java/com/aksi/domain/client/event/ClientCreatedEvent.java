package com.aksi.domain.client.event;

import com.aksi.domain.client.entity.ClientEntity;

import lombok.Getter;

/**
 * Подія, що сигналізує про створення нового клієнта.
 */
@Getter
public class ClientCreatedEvent extends ClientEvent {

    /**
     * Ім'я клієнта.
     */
    private final String firstName;

    /**
     * Прізвище клієнта.
     */
    private final String lastName;

    /**
     * Телефон клієнта.
     */
    private final String phone;

    /**
     * Створює нову подію створення клієнта.
     *
     * @param client новостворений клієнт
     */
    public ClientCreatedEvent(ClientEntity client) {
        super(client);
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.phone = client.getPhone();
    }
}
