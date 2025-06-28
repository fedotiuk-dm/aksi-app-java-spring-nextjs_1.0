package com.aksi.domain.client.service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.repository.ClientRepository;

/**
 * ============================================================================
 * CLIENT ANALYTICS SERVICE - СТАТИСТИКА ТА АНАЛІТИКА КЛІЄНТІВ
 * ============================================================================
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * • Загальна статистика клієнтів (кількість, активні/неактивні)
 * • Статистика за джерелами клієнтів (REFERRAL, ADVERTISING, etc.)
 * • Статистика за способами зв'язку (PHONE, EMAIL, VIBER, etc.)
 * • Системна статистика для адміністративної панелі
 * • Аналітика активності клієнтів
 *
 * ЩО НЕ ВХОДИТЬ В ВІДПОВІДАЛЬНІСТЬ:
 * ❌ CRUD операції з клієнтами (ClientCrudService)
 * ❌ Пошук клієнтів (ClientSearchService)
 * ❌ Управління контактами (ClientContactService)
 *
 * АРХІТЕКТУРНІ ПРИНЦИПИ:
 * • Read-Only Operations: всі методи тільки читають дані (@Transactional(readOnly = true))
 * • Aggregation Focus: методи повертають агреговані дані, не raw entities
 * • Functional Programming: Stream API для обчислень та групування
 * • Performance: оптимізовані запити для великих обсягів даних
 *
 * ВИКОРИСТАННЯ:
 * • Адміністративна панель - загальна статистика системи
 * • Звіти та дашборди - аналітика клієнтської бази
 * • API endpoints для внутрішньої аналітики
 *
 * ВНУТРІШНІ DTO КЛАСИ:
 * • ClientStatistics - загальна статистика клієнтів
 * • SystemStatistics - системна статистика
 */
@Service
@Transactional(readOnly = true)
public class ClientAnalyticsService {

    private final ClientRepository clientRepository;

    public ClientAnalyticsService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Отримання статистики конкретного клієнта
     */
    public Optional<ClientStatistics> getClientStatistics(UUID clientUuid) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .map(this::calculateStatisticsForClient);
    }

    /**
     * Загальна кількість активних клієнтів
     */
    public long getTotalActiveClients() {
        return clientRepository.countByIsActiveTrue();
    }

    /**
     * Кількість клієнтів зареєстрованих сьогодні
     */
    public long getClientsRegisteredToday() {
        return clientRepository.countRegisteredToday();
    }

    /**
     * Кількість клієнтів за джерелом надходження
     */
    public long getClientsBySourceType(ClientSourceType sourceType) {
        return Optional.ofNullable(sourceType)
            .map(clientRepository::countByIsActiveTrueAndSourceType)
            .orElse(0L);
    }

    /**
     * Чи є клієнт VIP
     */
    public boolean isVipClient(UUID clientUuid) {
        // TODO: Інтеграція з Order domain для визначення VIP статусу
        // Поки що базова логіка - клієнт існує більше 6 місяців
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .map(client -> client.getCreatedAt().toLocalDate().isBefore(LocalDate.now().minusMonths(6)))
            .orElse(false);
    }

    /**
     * Загальна статистика системи
     */
    public SystemStatistics getSystemStatistics() {
        SystemStatistics stats = new SystemStatistics();
        stats.setTotalActiveClients(getTotalActiveClients());
        stats.setClientsRegisteredToday(getClientsRegisteredToday());

        // Статистика за джерелами
        for (ClientSourceType sourceType : ClientSourceType.values()) {
            long count = getClientsBySourceType(sourceType);
            stats.addSourceTypeCount(sourceType, count);
        }

        return stats;
    }

    // === PRIVATE HELPER METHODS ===

    /**
     * Розрахунок статистики для конкретного клієнта
     */
    private ClientStatistics calculateStatisticsForClient(ClientEntity client) {
        ClientStatistics stats = new ClientStatistics();
        stats.setClientUuid(client.getUuid());
        stats.setRegistrationDate(client.getCreatedAt().toLocalDate());
        stats.setIsVip(isVipClient(client.getUuid()));

        // TODO: Інтеграція з Order domain для реальної статистики замовлень
        stats.setTotalOrders(0);
        stats.setTotalSpent(0.0);
        stats.setAverageOrderValue(0.0);
        stats.setLastOrderDate(null);

        return stats;
    }

    // === DTO CLASSES ===

    /**
     * DTO для статистики клієнта
     */
    public static class ClientStatistics {
        private UUID clientUuid;
        private LocalDate registrationDate;
        private int totalOrders;
        private double totalSpent;
        private double averageOrderValue;
        private LocalDate lastOrderDate;
        private boolean isVip;

        // Геттери та сеттери
        public UUID getClientUuid() { return clientUuid; }
        public void setClientUuid(UUID clientUuid) { this.clientUuid = clientUuid; }

        public LocalDate getRegistrationDate() { return registrationDate; }
        public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }

        public int getTotalOrders() { return totalOrders; }
        public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }

        public double getTotalSpent() { return totalSpent; }
        public void setTotalSpent(double totalSpent) { this.totalSpent = totalSpent; }

        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }

        public LocalDate getLastOrderDate() { return lastOrderDate; }
        public void setLastOrderDate(LocalDate lastOrderDate) { this.lastOrderDate = lastOrderDate; }

        public boolean isVip() { return isVip; }
        public void setIsVip(boolean vip) { isVip = vip; }
    }

    /**
     * DTO для загальної статистики системи
     */
    public static class SystemStatistics {
        private long totalActiveClients;
        private long clientsRegisteredToday;
        private java.util.Map<ClientSourceType, Long> sourceTypeCounts;

        public SystemStatistics() {
            this.sourceTypeCounts = new java.util.HashMap<>();
        }

        // Геттери та сеттери
        public long getTotalActiveClients() { return totalActiveClients; }
        public void setTotalActiveClients(long totalActiveClients) { this.totalActiveClients = totalActiveClients; }

        public long getClientsRegisteredToday() { return clientsRegisteredToday; }
        public void setClientsRegisteredToday(long clientsRegisteredToday) { this.clientsRegisteredToday = clientsRegisteredToday; }

        public java.util.Map<ClientSourceType, Long> getSourceTypeCounts() { return sourceTypeCounts; }
        public void setSourceTypeCounts(java.util.Map<ClientSourceType, Long> sourceTypeCounts) { this.sourceTypeCounts = sourceTypeCounts; }

        public void addSourceTypeCount(ClientSourceType sourceType, long count) {
            this.sourceTypeCounts.put(sourceType, count);
        }
    }
}
