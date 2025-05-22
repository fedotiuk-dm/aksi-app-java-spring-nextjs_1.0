package com.aksi.domain.client.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для обробки подій, пов'язаних з клієнтами.
 */
@Component
@Slf4j
public class ClientEventListener {

    /**
     * Обробляє подію створення нового клієнта.
     *
     * @param event подія створення клієнта
     */
    @EventListener
    public void handleClientCreated(ClientCreatedEvent event) {
        log.info("Створено нового клієнта: {} {} (ID: {})",
                event.getLastName(),
                event.getFirstName(),
                event.getClientId());
    }

    /**
     * Обробляє подію оновлення даних клієнта.
     *
     * @param event подія оновлення клієнта
     */
    @EventListener
    public void handleClientUpdated(ClientUpdatedEvent event) {
        log.info("Оновлено клієнта (ID: {}): поле '{}' змінено з '{}' на '{}'",
                event.getClientId(),
                event.getUpdatedField(),
                event.getOldValue(),
                event.getNewValue());
    }

    /**
     * Обробляє подію зміни адреси клієнта.
     *
     * @param event подія зміни адреси
     */
    @EventListener
    public void handleClientAddressChanged(ClientAddressChangedEvent event) {
        log.info("Змінено адресу клієнта (ID: {}): з '{}' на '{}'",
                event.getClientId(),
                event.getOldAddressString(),
                event.getNewAddressString());
    }
}
