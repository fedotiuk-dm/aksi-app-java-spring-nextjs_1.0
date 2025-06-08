package com.aksi.domain.order.statemachine.stage2.integration;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс інтеграції з Client Domain для етапу 2 Order Wizard
 *
 * Інкапсулює взаємодію з доменом клієнтів для:
 * - Отримання поточного клієнта
 * - Валідація прав клієнта
 * - Перевірка активності клієнта
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClientIntegrationService {

    private final ClientService clientService;

    /**
     * Отримує поточного клієнта за ID
     */
        public ClientResponse getCurrentClient(UUID clientId) {
        log.debug("Отримання клієнта з ID: {}", clientId);

        try {
            ClientResponse client = clientService.getClientById(clientId);
            log.debug("✅ Отримано клієнта: {} {}", client.getFirstName(), client.getLastName());
            return client;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні клієнта з ID {}: {}", clientId, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати клієнта", e);
        }
    }

    /**
     * Перевіряє чи клієнт активний
     */
    public boolean isClientActive(UUID clientId) {
        log.debug("Перевірка активності клієнта: {}", clientId);

        try {
            ClientResponse client = getCurrentClient(clientId);
            return client != null;

        } catch (Exception e) {
            log.debug("Клієнт {} не активний: {}", clientId, e.getMessage());
            return false;
        }
    }

    /**
     * Перевіряє права клієнта на створення замовлень
     */
    public boolean canClientMakeOrders(UUID clientId) {
        log.debug("Перевірка прав клієнта на створення замовлень: {}", clientId);

        try {
            ClientResponse client = getCurrentClient(clientId);
            // Поки що всі клієнти можуть створювати замовлення
            // В майбутньому можна додати додаткові бізнес-правила
            return client != null;

        } catch (Exception e) {
            log.debug("Клієнт {} не може створювати замовлення: {}", clientId, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує контактну інформацію клієнта
     */
    public String getClientContactInfo(UUID clientId) {
        log.debug("Отримання контактної інформації клієнта: {}", clientId);

        try {
            ClientResponse client = getCurrentClient(clientId);
            String contactInfo = String.format("%s %s - %s",
                client.getFirstName(), client.getLastName(), client.getPhone());

            log.debug("✅ Контактна інформація: {}", contactInfo);
            return contactInfo;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні контактної інформації: {}", e.getMessage(), e);
            return "Невідомий клієнт";
        }
    }
}
