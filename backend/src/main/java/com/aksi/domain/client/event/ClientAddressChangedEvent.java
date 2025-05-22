package com.aksi.domain.client.event;

import com.aksi.domain.client.entity.AddressEntity;
import com.aksi.domain.client.entity.ClientEntity;

import lombok.Getter;

/**
 * Подія, що сигналізує про зміну адреси клієнта.
 */
@Getter
public class ClientAddressChangedEvent extends ClientEvent {

    /**
     * Стара адреса (може бути null).
     */
    private final AddressEntity oldAddress;

    /**
     * Нова адреса.
     */
    private final AddressEntity newAddress;

    /**
     * Створює нову подію зміни адреси клієнта.
     *
     * @param client клієнт, для якого змінюється адреса
     * @param oldAddress стара адреса
     * @param newAddress нова адреса
     */
    public ClientAddressChangedEvent(ClientEntity client, AddressEntity oldAddress, AddressEntity newAddress) {
        super(client);
        this.oldAddress = oldAddress;
        this.newAddress = newAddress;
    }

    /**
     * Отримати стару адресу як рядок.
     *
     * @return рядок з адресою або null
     */
    public String getOldAddressString() {
        return oldAddress != null ? oldAddress.formatFullAddress() : null;
    }

    /**
     * Отримати нову адресу як рядок.
     *
     * @return рядок з адресою або null
     */
    public String getNewAddressString() {
        return newAddress != null ? newAddress.formatFullAddress() : null;
    }
}
