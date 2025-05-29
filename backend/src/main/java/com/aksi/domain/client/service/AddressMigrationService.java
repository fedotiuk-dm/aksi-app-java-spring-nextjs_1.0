package com.aksi.domain.client.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для міграції адрес клієнтів з рядкового формату в структурований
 * після оновлення бази даних. Виконується автоматично при старті програми.
 */
@Service
@Slf4j
public class AddressMigrationService {

    /**
     * Виконується після запуску контексту Spring і мігрує дані адрес.
     * Тимчасово відключено для усунення проблем з autoCommit.
     */
    // @EventListener(ContextRefreshedEvent.class)
    @Transactional
    public void migrateAddresses() {
        log.info("Міграція адрес тимчасово відключена");

        /*
        log.info("Початок міграції адрес клієнтів...");

        // Отримуємо всіх клієнтів з непустою адресою і без address_id
        List<ClientEntity> clients = clientRepository.findAll();
        List<ClientEntity> clientsWithOldAddresses = clients.stream()
            .filter(client ->
                client.getAddress() == null &&
                hasFieldWithValue(client, "address") // Перевіряємо поле 'address' через рефлексію
            )
            .toList();

        if (clientsWithOldAddresses.isEmpty()) {
            log.info("Немає клієнтів з адресами для міграції або міграція вже виконана");
            return;
        }

        log.info("Знайдено {} клієнтів для міграції адрес", clientsWithOldAddresses.size());

        // Мігруємо адреси для кожного клієнта
        for (ClientEntity client : clientsWithOldAddresses) {
            try {
                // Отримуємо стару адресу через рефлексію
                String oldAddress = getFieldValue(client, "address");
                if (oldAddress != null && !oldAddress.isEmpty()) {
                    AddressEntity addressEntity = addressMapper.stringToAddressEntity(oldAddress);
                    client.setAddress(addressEntity);
                    log.debug("Мігровано адресу для клієнта {}: {}", client.getId(), oldAddress);
                }
            } catch (RuntimeException e) {
                log.error("Помилка при міграції адреси для клієнта {}: {}", client.getId(), e.getMessage());
            }
        }

        // Зберігаємо зміни
        clientRepository.saveAll(clientsWithOldAddresses);
        log.info("Міграцію адрес клієнтів завершено успішно");
        */
    }
}
