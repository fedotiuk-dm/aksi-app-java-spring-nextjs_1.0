package com.aksi.domain.client.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.guard.ClientGuard;
import com.aksi.domain.client.port.ClientServicePort;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.utils.ClientUtils;
import com.aksi.domain.client.validation.ClientValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Основний сервіс для роботи з клієнтами.
 * Реалізує всю бізнес-логіку та координує взаємодію між компонентами домену.
 * Дотримується принципів DDD та функціонального програмування.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientService implements ClientServicePort {

    private final ClientRepository clientRepository;
    private final ClientValidator clientValidator;
    private final ClientGuard clientGuard;

    // === CRUD операції ===

    @Override
    @Transactional
    public ClientEntity createClient(String firstName, String lastName, String phone,
                                   String email, ClientSourceType sourceType,
                                   List<CommunicationMethodType> communicationMethods) {
        log.info("Creating new client: firstName={}, lastName={}, phone={}", firstName, lastName, phone);

        // Нормалізація вхідних даних
        String normalizedPhone = clientValidator.normalizePhone(phone);
        String normalizedFirstName = clientValidator.normalizeName(firstName);
        String normalizedLastName = clientValidator.normalizeName(lastName);
        List<CommunicationMethodType> validMethods = ClientUtils.filterValidCommunicationMethods(communicationMethods, email);

        // Створення entity
        ClientEntity client = ClientEntity.builder()
                .firstName(normalizedFirstName)
                .lastName(normalizedLastName)
                .phone(normalizedPhone)
                .email(email)
                .sourceType(sourceType)
                .communicationMethods(validMethods)
                .build();

        // Валідація та Guard перевірки
        clientValidator.validateForCreation(client);
        clientGuard.ensurePhoneNotExists(normalizedPhone);
        clientGuard.ensureEmailNotExists(email);

        ClientEntity savedClient = clientRepository.save(client);
        log.info("Client created successfully: {}", ClientUtils.generateClientLogDescription(savedClient));

        return savedClient;
    }

    @Override
    @Transactional
    public ClientEntity updateClient(Long clientId, String firstName, String lastName,
                                   String phone, String email, ClientSourceType sourceType,
                                   List<CommunicationMethodType> communicationMethods, String notes) {
        log.info("Updating client: clientId={}", clientId);

        // Перевірка існування та отримання клієнта
        ClientEntity existingClient = clientGuard.ensureClientExists(clientId);

        // Нормалізація вхідних даних
        String normalizedPhone = clientValidator.normalizePhone(phone);
        String normalizedFirstName = clientValidator.normalizeName(firstName);
        String normalizedLastName = clientValidator.normalizeName(lastName);
        List<CommunicationMethodType> validMethods = ClientUtils.filterValidCommunicationMethods(communicationMethods, email);

        // Guard перевірки для унікальності
        clientGuard.ensurePhoneNotExistsForUpdate(normalizedPhone, clientId);
        clientGuard.ensureEmailNotExistsForUpdate(email, clientId);

        // Оновлення полів
        existingClient.setFirstName(normalizedFirstName);
        existingClient.setLastName(normalizedLastName);
        existingClient.setPhone(normalizedPhone);
        existingClient.setEmail(email);
        existingClient.setSourceType(sourceType);
        existingClient.setCommunicationMethods(validMethods);
        existingClient.setNotes(notes);

        // Валідація після оновлення
        clientValidator.validateForUpdate(existingClient);

        ClientEntity updatedClient = clientRepository.save(existingClient);
        log.info("Client updated successfully: {}", ClientUtils.generateClientLogDescription(updatedClient));

        return updatedClient;
    }

    @Override
    public Optional<ClientEntity> findClientById(Long clientId) {
        log.debug("Finding client by ID: {}", clientId);
        return clientRepository.findById(clientId);
    }

    @Override
    @Transactional
    public void deleteClient(Long clientId) {
        log.info("Deleting client: clientId={}", clientId);

        ClientEntity client = clientGuard.ensureClientExists(clientId);
        clientGuard.ensureClientCanBeDeleted(client);

        client.deactivate();
        clientRepository.save(client);

        log.info("Client soft-deleted successfully: {}", ClientUtils.generateClientLogDescription(client));
    }

    // === Пошук та фільтрація ===

    @Override
    public List<ClientEntity> quickSearchClients(String query, int limit) {
        log.debug("Quick search clients: query='{}', limit={}", query, limit);

        // Guard перевірки
        clientGuard.ensureSearchQueryValid(query);
        clientGuard.ensureSearchLimitValid(limit);

        String normalizedQuery = ClientUtils.normalizeSearchQuery(query);
        Pageable pageable = ClientUtils.createQuickSearchPageable(limit);

        List<ClientEntity> results = clientRepository.quickSearch(normalizedQuery, pageable);

        log.debug("Quick search completed: found {} clients for query '{}'", results.size(), query);
        return results;
    }

    @Override
    public Optional<ClientEntity> findClientByPhone(String phone) {
        log.debug("Finding client by phone: {}", phone);

        return Optional.ofNullable(phone)
                .map(clientValidator::normalizePhone)
                .flatMap(clientRepository::findByPhone);
    }

    @Override
    public Optional<ClientEntity> findClientByEmail(String email) {
        log.debug("Finding client by email: {}", email);
        return clientRepository.findByEmail(email);
    }

    @Override
    public Page<ClientEntity> getAllClients(Pageable pageable) {
        log.debug("Getting all clients with pagination: page={}, size={}",
                 pageable.getPageNumber(), pageable.getPageSize());

        Pageable sortedPageable = ClientUtils.createDefaultPageable(pageable);
        return clientRepository.findByIsActiveTrue(sortedPageable);
    }

    @Override
    public Page<ClientEntity> searchClients(String firstName, String lastName, String phone,
                                          String email, String city, ClientSourceType sourceType,
                                          LocalDateTime registrationDateFrom, LocalDateTime registrationDateTo,
                                          Boolean isVip, Pageable pageable) {
        log.debug("Advanced search clients with filters");

        // Валідація діапазону дат
        if (!ClientUtils.isValidDateRange(registrationDateFrom, registrationDateTo)) {
            log.warn("Invalid date range: from={}, to={}", registrationDateFrom, registrationDateTo);
            return Page.empty(pageable);
        }

        Pageable sortedPageable = ClientUtils.createDefaultPageable(pageable);

        return clientRepository.advancedSearch(
                firstName, lastName, phone, email, city, sourceType,
                registrationDateFrom, registrationDateTo, isVip, sortedPageable);
    }

    // === Статистика та аналітика ===

    @Override
    @Transactional
    public void updateClientStatistics(Long clientId, int orderCount, double totalAmount,
                                     LocalDateTime lastOrderDate) {
        log.info("Updating client statistics: clientId={}, orders={}, total={}",
                clientId, orderCount, totalAmount);

        ClientEntity client = clientGuard.ensureClientExists(clientId);
        client.updateOrderStatistics(orderCount, totalAmount, lastOrderDate);

        clientRepository.save(client);
        log.info("Client statistics updated: {}", ClientUtils.generateClientLogDescription(client));
    }

    @Override
    public Page<ClientEntity> getVipClients(Pageable pageable) {
        log.debug("Getting VIP clients");
        return clientRepository.findVipClients(pageable);
    }

    @Override
    public Page<ClientEntity> getInactiveClients(Pageable pageable) {
        log.debug("Getting inactive clients");
        LocalDateTime cutoffDate = LocalDateTime.now().minusYears(1);
        return clientRepository.findInactiveClients(cutoffDate, pageable);
    }

    @Override
    public long countActiveClients() {
        log.debug("Counting active clients");
        return clientRepository.countByIsActiveTrue();
    }

    @Override
    public long countClientsBySource(ClientSourceType sourceType) {
        log.debug("Counting clients by source: {}", sourceType);
        return clientRepository.countBySourceTypeAndIsActiveTrue(sourceType);
    }

    // === Управління контактами ===

    @Override
    @Transactional
    public ClientEntity updateClientContacts(Long clientId, String phone, String email,
                                           List<CommunicationMethodType> communicationMethods) {
        log.info("Updating client contacts: clientId={}", clientId);

        ClientEntity client = clientGuard.ensureClientExists(clientId);

        // Нормалізація
        String normalizedPhone = clientValidator.normalizePhone(phone);
        List<CommunicationMethodType> validMethods = ClientUtils.filterValidCommunicationMethods(communicationMethods, email);

        // Guard перевірки
        clientGuard.ensurePhoneNotExistsForUpdate(normalizedPhone, clientId);
        clientGuard.ensureEmailNotExistsForUpdate(email, clientId);

        // Оновлення контактів через business method
        client.updateContactInfo(normalizedPhone, email, client.getAddress(), validMethods);

        // Валідація
        clientValidator.validateForUpdate(client);

        ClientEntity updatedClient = clientRepository.save(client);
        log.info("Client contacts updated: {}", ClientUtils.generateClientLogDescription(updatedClient));

        return updatedClient;
    }

    @Override
    @Transactional
    public void activateClient(Long clientId) {
        log.info("Activating client: clientId={}", clientId);

        ClientEntity client = clientGuard.ensureClientExists(clientId);
        clientGuard.ensureClientCanBeActivated(client);

        client.activate();
        clientRepository.save(client);

        log.info("Client activated: {}", ClientUtils.generateClientLogDescription(client));
    }

    @Override
    @Transactional
    public void deactivateClient(Long clientId) {
        log.info("Deactivating client: clientId={}", clientId);

        ClientEntity client = clientGuard.ensureClientExists(clientId);
        clientGuard.ensureClientCanBeDeactivated(client);

        client.deactivate();
        clientRepository.save(client);

        log.info("Client deactivated: {}", ClientUtils.generateClientLogDescription(client));
    }

    // === Валідація ===

    @Override
    public boolean existsByPhone(String phone) {
        return Optional.ofNullable(phone)
                .map(clientValidator::normalizePhone)
                .map(clientRepository::existsByPhone)
                .orElse(false);
    }

    @Override
    public boolean existsByEmail(String email) {
        return Optional.ofNullable(email)
                .filter(e -> !e.trim().isEmpty())
                .map(clientRepository::existsByEmail)
                .orElse(false);
    }
}
