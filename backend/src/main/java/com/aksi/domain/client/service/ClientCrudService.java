package com.aksi.domain.client.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.validation.ClientValidator;

/**
 * ============================================================================
 * CLIENT CRUD SERVICE - ОСНОВНІ CRUD ОПЕРАЦІЇ З КЛІЄНТАМИ
 * ============================================================================
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * • Створення нових клієнтів (createClient)
 * • Отримання клієнтів за UUID (findByUuid)
 * • Оновлення існуючих клієнтів (updateClient)
 * • М'яке видалення клієнтів (deleteClient)
 * • Отримання списків клієнтів з пагінацією (getAllClients)
 * • Базові перевірки існування (existsByPhone, countActiveClients)
 *
 * ЩО НЕ ВХОДИТЬ В ВІДПОВІДАЛЬНІСТЬ:
 * ❌ Пошук клієнтів (ClientSearchService)
 * ❌ Управління контактами (ClientContactService)
 * ❌ Статистика/аналітика (ClientAnalyticsService)
 *
 * АРХІТЕКТУРНІ ПРИНЦИПИ:
 * • Functional Programming: Optional + map/filter замість if-statements
 * • Single Responsibility: тільки базові CRUD операції
 * • Validation: використання ClientValidator для всіх перевірок
 * • Transaction Management: @Transactional для консистентності даних
 *
 * ВИКОРИСТАННЯ:
 * • ClientsApiDelegateImpl - основні API endpoints
 * • Order Wizard - створення клієнтів під час оформлення замовлень
 * • Admin Interface - управління клієнтами
 */
@Service
@Transactional
public class ClientCrudService {

    private final ClientRepository clientRepository;
    private final ClientValidator clientValidator;

    public ClientCrudService(ClientRepository clientRepository, ClientValidator clientValidator) {
        this.clientRepository = clientRepository;
        this.clientValidator = clientValidator;
    }

    /**
     * Створення нового клієнта
     *
     * @param client Entity для збереження
     * @return Збережений клієнт з згенерованим UUID та timestamps
     * @throws IllegalArgumentException якщо валідація не пройшла
     */
    public ClientEntity createClient(ClientEntity client) {
        return Optional.ofNullable(client)
            .filter(this::validateNewClient)
            .map(clientRepository::save)
            .orElseThrow(() -> new IllegalArgumentException("Неможливо створити клієнта: помилки валідації"));
    }

    /**
     * Отримання клієнта за UUID
     *
     * @param uuid Унікальний ідентифікатор клієнта
     * @return Optional з клієнтом або Optional.empty() якщо не знайдено
     */
    @Transactional(readOnly = true)
    public Optional<ClientEntity> findByUuid(UUID uuid) {
        return Optional.ofNullable(uuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue);
    }

    /**
     * Оновлення існуючого клієнта
     *
     * @param client Entity з оновленими даними (UUID має бути заповнений)
     * @return Оновлений клієнт
     * @throws IllegalArgumentException якщо клієнт не знайдено або валідація не пройшла
     */
    public ClientEntity updateClient(ClientEntity client) {
        return Optional.ofNullable(client)
            .filter(this::validateExistingClient)
            .filter(c -> clientRepository.findByUuidAndIsActiveTrue(c.getUuid()).isPresent())
            .map(clientRepository::save)
            .orElseThrow(() -> new IllegalArgumentException("Неможливо оновити клієнта: не знайдено або помилки валідації"));
    }

    /**
     * М'яке видалення клієнта за UUID
     * Клієнт не видаляється фізично, а помічається як неактивний (isActive = false)
     *
     * @param uuid Унікальний ідентифікатор клієнта
     * @return true якщо клієнт був деактивований, false якщо не знайдено
     */
    public boolean deleteClient(UUID uuid) {
        return Optional.ofNullable(uuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .map(client -> {
                client.deactivate();
                clientRepository.save(client);
                return true;
            })
            .orElse(false);
    }

    /**
     * Отримання всіх активних клієнтів з пагінацією
     * Клієнти сортуються за прізвищем, потім за ім'ям
     *
     * @param pageable Параметри пагінації (page, size, sort)
     * @return Page з активними клієнтами
     */
    @Transactional(readOnly = true)
    public Page<ClientEntity> getAllClients(Pageable pageable) {
        return clientRepository.findByIsActiveTrueOrderByLastNameAscFirstNameAsc(pageable);
    }

    /**
     * Перевірка чи існує клієнт з таким телефоном
     * Використовується для валідації унікальності при створенні/оновленні
     *
     * @param phone Номер телефону в форматі +380XXXXXXXXX
     * @return true якщо клієнт з таким телефоном існує
     */
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return Optional.ofNullable(phone)
            .filter(p -> !p.trim().isEmpty())
            .flatMap(clientRepository::findByPhoneAndIsActiveTrue)
            .isPresent();
    }

    /**
     * Кількість всіх активних клієнтів
     * Використовується для загальної статистики системи
     *
     * @return Кількість активних клієнтів
     */
    @Transactional(readOnly = true)
    public long countActiveClients() {
        return clientRepository.countByIsActiveTrue();
    }

    // === PRIVATE HELPER METHODS ===

    /**
     * Валідація нового клієнта перед створенням
     * Включає перевірку всіх обов'язкових полів та унікальності телефону
     */
    private boolean validateNewClient(ClientEntity client) {
        List<String> errors = clientValidator.validateNewClient(client);
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Помилки валідації: " + String.join(", ", errors));
        }
        return true;
    }

    /**
     * Валідація існуючого клієнта перед оновленням
     * Включає перевірку всіх полів та унікальності телефону (виключаючи поточного клієнта)
     */
    private boolean validateExistingClient(ClientEntity client) {
        List<String> errors = clientValidator.validateExistingClient(client);
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Помилки валідації: " + String.join(", ", errors));
        }
        return true;
    }
}
