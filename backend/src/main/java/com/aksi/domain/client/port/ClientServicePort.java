package com.aksi.domain.client.port;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;

/**
 * Порт-інтерфейс для клієнтського сервісу.
 * Визначає контракт для бізнес-операцій з клієнтами.
 * Основа для "DDD inside, FSD outside" архітектури.
 */
public interface ClientServicePort {

    // === CRUD операції ===

    /**
     * Створення нового клієнта
     */
    ClientEntity createClient(String firstName, String lastName, String phone,
                             String email, ClientSourceType sourceType,
                             List<CommunicationMethodType> communicationMethods);

    /**
     * Оновлення існуючого клієнта
     */
    ClientEntity updateClient(Long clientId, String firstName, String lastName,
                             String phone, String email, ClientSourceType sourceType,
                             List<CommunicationMethodType> communicationMethods, String notes);

    /**
     * Отримання клієнта за ID
     */
    Optional<ClientEntity> findClientById(Long clientId);

    /**
     * Видалення клієнта (м'яке видалення)
     */
    void deleteClient(Long clientId);

    // === Пошук та фільтрація ===

    /**
     * Швидкий пошук клієнтів для OrderWizard - НАЙГОЛОВНІШИЙ МЕТОД
     */
    List<ClientEntity> quickSearchClients(String query, int limit);

    /**
     * Пошук клієнта за номером телефону
     */
    Optional<ClientEntity> findClientByPhone(String phone);

    /**
     * Пошук клієнта за email
     */
    Optional<ClientEntity> findClientByEmail(String email);

    /**
     * Отримання списку клієнтів з пагінацією
     */
    Page<ClientEntity> getAllClients(Pageable pageable);

    /**
     * Розширений пошук клієнтів з фільтрами
     */
    Page<ClientEntity> searchClients(String firstName, String lastName, String phone,
                                   String email, String city, ClientSourceType sourceType,
                                   LocalDateTime registrationDateFrom, LocalDateTime registrationDateTo,
                                   Boolean isVip, Pageable pageable);

    // === Статистика та аналітика ===

    /**
     * Оновлення статистики клієнта
     */
    void updateClientStatistics(Long clientId, int orderCount, double totalAmount,
                               LocalDateTime lastOrderDate);

    /**
     * Отримання VIP клієнтів
     */
    Page<ClientEntity> getVipClients(Pageable pageable);

    /**
     * Отримання неактивних клієнтів
     */
    Page<ClientEntity> getInactiveClients(Pageable pageable);

    /**
     * Підрахунок загальної кількості активних клієнтів
     */
    long countActiveClients();

    /**
     * Підрахунок клієнтів за джерелом
     */
    long countClientsBySource(ClientSourceType sourceType);

    // === Управління контактами ===

    /**
     * Оновлення контактної інформації клієнта
     */
    ClientEntity updateClientContacts(Long clientId, String phone, String email,
                                     List<CommunicationMethodType> communicationMethods);

    /**
     * Активація/деактивація клієнта
     */
    void activateClient(Long clientId);
    void deactivateClient(Long clientId);

    // === Валідація ===

    /**
     * Перевірка чи існує клієнт з таким телефоном
     */
    boolean existsByPhone(String phone);

    /**
     * Перевірка чи існує клієнт з таким email
     */
    boolean existsByEmail(String email);
}
