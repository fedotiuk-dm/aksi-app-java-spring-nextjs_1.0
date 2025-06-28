package com.aksi.domain.client.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.exception.ClientNotFoundException;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.validation.ClientValidator;

import lombok.RequiredArgsConstructor;

/**
 * Service для бізнес-логіки клієнтів
 * Містить всю бізнес-логіку + транзакції
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientValidator clientValidator;

    // CRUD операції

    /**
     * Створення нового клієнта
     */
    public ClientEntity create(ClientEntity client) {
        clientValidator.validateForCreate(client);
        clientValidator.validateContactInfo(client);
        return clientRepository.save(client);
    }

    /**
     * Пошук клієнта за UUID
     */
    @Transactional(readOnly = true)
    public ClientEntity findByUuid(UUID uuid) {
        return clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
    }

    /**
     * Пошук клієнта за ID
     */
    @Transactional(readOnly = true)
    public ClientEntity findById(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> ClientNotFoundException.byId(id));
    }

    /**
     * Пошук клієнта за телефоном
     */
    @Transactional(readOnly = true)
    public ClientEntity findByPhone(String phone) {
        return clientRepository.findByPhone(phone)
            .orElseThrow(() -> ClientNotFoundException.byPhone(phone));
    }

    /**
     * Пошук клієнта за email
     */
    @Transactional(readOnly = true)
    public ClientEntity findByEmail(String email) {
        return clientRepository.findByEmail(email)
            .orElseThrow(() -> ClientNotFoundException.byEmail(email));
    }

    /**
     * Отримання всіх клієнтів з пагінацією
     */
    @Transactional(readOnly = true)
    public Page<ClientEntity> findAll(Pageable pageable) {
        return clientRepository.findAll(pageable);
    }

    /**
     * Оновлення існуючого клієнта
     */
    public ClientEntity update(ClientEntity client) {
        clientValidator.validateForUpdate(client);
        clientValidator.validateContactInfo(client);
        clientValidator.validateVipStatus(client);
        return clientRepository.save(client);
    }

    /**
     * Видалення клієнта
     */
    public void delete(UUID uuid) {
        ClientEntity client = findByUuid(uuid);
        clientValidator.validateForDeletion(client);
        clientRepository.delete(client);
    }

    /**
     * М'яке видалення клієнта за ID
     */
    public void deleteById(Long id) {
        ClientEntity client = findById(id);
        clientValidator.validateForDeletion(client);
        clientRepository.delete(client);
    }

    // Пошукові операції

    /**
     * Швидкий пошук клієнтів (для OrderWizard)
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> quickSearch(String query, Pageable pageable) {
        return clientRepository.quickSearch(query, pageable);
    }

    /**
     * Розширений пошук клієнтів з фільтрами
     */
    @Transactional(readOnly = true)
    public Page<ClientEntity> advancedSearch(
            String query,
            String firstName,
            String lastName,
            String phone,
            String email,
            String city,
            ClientSourceType sourceType,
            LocalDate registrationDateFrom,
            LocalDate registrationDateTo,
            Boolean isVip,
            Pageable pageable) {

        return clientRepository.advancedSearch(
            query, firstName, lastName, phone, email, city,
            sourceType, registrationDateFrom, registrationDateTo, isVip,
            pageable);
    }

    /**
     * Пошук клієнтів за джерелом надходження
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> findBySourceType(ClientSourceType sourceType) {
        return clientRepository.findBySourceType(sourceType);
    }

    /**
     * Пошук клієнтів зареєстрованих в певний період
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> findByRegistrationDateBetween(LocalDate fromDate, LocalDate toDate) {
        return clientRepository.findByRegistrationDateBetween(fromDate, toDate);
    }

    // Статистичні операції

    /**
     * Підрахунок загальної кількості клієнтів
     */
    @Transactional(readOnly = true)
    public Long countTotalClients() {
        return clientRepository.countTotalClients();
    }

    /**
     * Підрахунок VIP клієнтів
     */
    @Transactional(readOnly = true)
    public Long countVipClients() {
        return clientRepository.countVipClients();
    }

    /**
     * Топ клієнти за кількістю замовлень
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> findTopClientsByOrders(Pageable pageable) {
        return clientRepository.findTopClientsByOrders(pageable);
    }

    /**
     * Топ клієнти за сумою витрат
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> findTopClientsBySpending(Pageable pageable) {
        return clientRepository.findTopClientsBySpending(pageable);
    }

    /**
     * Клієнти без замовлень
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> findClientsWithoutOrders() {
        return clientRepository.findClientsWithoutOrders();
    }

    /**
     * Неактивні клієнти (не робили замовлень після певної дати)
     */
    @Transactional(readOnly = true)
    public List<ClientEntity> findInactiveClientsSince(LocalDate cutoffDate) {
        return clientRepository.findInactiveClientsSince(cutoffDate);
    }

    // Бізнес-логіка операції

    /**
     * Оновлення статистики клієнта після нового замовлення
     */
    public ClientEntity updateStatisticsAfterOrder(UUID clientUuid, BigDecimal orderAmount, LocalDate orderDate) {
        ClientEntity client = findByUuid(clientUuid);
        client.updateStatisticsAfterOrder(orderAmount, orderDate);
        return clientRepository.save(client);
    }

    /**
     * Перевірка існування клієнта за UUID
     */
    @Transactional(readOnly = true)
    public boolean existsByUuid(UUID uuid) {
        return clientRepository.existsByUuid(uuid);
    }

    /**
     * Перевірка існування клієнта за телефоном
     */
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return clientRepository.existsByPhone(phone);
    }

    /**
     * Перевірка існування клієнта за email
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return clientRepository.existsByEmail(email);
    }

    /**
     * Бізнес-правило: Надання VIP статусу
     */
    public ClientEntity promoteToVip(UUID clientUuid) {
        ClientEntity client = findByUuid(clientUuid);
        client.setIsVip(true);
        clientValidator.validateVipStatus(client);
        return clientRepository.save(client);
    }

    /**
     * Бізнес-правило: Скасування VIP статусу
     */
    public ClientEntity demoteFromVip(UUID clientUuid) {
        ClientEntity client = findByUuid(clientUuid);
        client.setIsVip(false);
        return clientRepository.save(client);
    }
}
