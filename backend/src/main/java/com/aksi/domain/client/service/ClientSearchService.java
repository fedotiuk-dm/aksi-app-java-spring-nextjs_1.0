package com.aksi.domain.client.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.repository.ClientRepository;

/**
 * ============================================================================
 * CLIENT SEARCH SERVICE - ПОШУК ТА ФІЛЬТРАЦІЯ КЛІЄНТІВ
 * ============================================================================
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * • Швидкий пошук клієнтів для Order Wizard (quickSearch)
 * • Розширений пошук з фільтрами (advancedSearch)
 * • Пошук за окремими полями (firstName, lastName, email)
 * • Пошук за джерелом клієнтів (sourceType)
 * • Пошук за способами зв'язку (communicationMethod)
 * • Пошук за періодом реєстрації (registrationPeriod)
 *
 * ЩО НЕ ВХОДИТЬ В ВІДПОВІДАЛЬНІСТЬ:
 * ❌ CRUD операції з клієнтами (ClientCrudService)
 * ❌ Управління контактами (ClientContactService)
 * ❌ Статистика/аналітика (ClientAnalyticsService)
 *
 * АРХІТЕКТУРНІ ПРИНЦИПИ:
 * • Search Optimization: використання індексів БД для швидкого пошуку
 * • Flexible Criteria: можливість комбінувати різні критерії пошуку
 * • Read-Only Operations: всі методи тільки читають дані (@Transactional(readOnly = true))
 * • Pagination Support: підтримка пагінації для великих результатів
 * • Functional Programming: Optional + Stream API для безпечної обробки даних
 *
 * ІНТЕГРАЦІЯ З API:
 * • ClientSearchApiDelegateImpl - API endpoints для пошуку клієнтів
 * • Order Wizard - швидкий пошук при створенні замовлень
 * • Admin Interface - розширений пошук з фільтрами
 *
 * ВНУТРІШНІ КЛАСИ:
 * • AdvancedSearchCriteria - критерії для розширеного пошуку
 */
@Service
@Transactional(readOnly = true)
public class ClientSearchService {

    private final ClientRepository clientRepository;

    public ClientSearchService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Швидкий пошук клієнтів (для Order Wizard автозаповнення)
     */
    public List<ClientEntity> quickSearch(String query, int limit) {
        return Optional.ofNullable(query)
            .filter(q -> !q.trim().isEmpty() && q.trim().length() >= 2)
            .map(q -> {
                Pageable pageable = PageRequest.of(0, Math.min(limit, 50));
                return clientRepository.quickSearch(q.trim(), pageable);
            })
            .orElse(List.of());
    }

    /**
     * Розширений пошук з множинними фільтрами
     */
    public Page<ClientEntity> advancedSearch(AdvancedSearchCriteria criteria, Pageable pageable) {
        return Optional.ofNullable(criteria)
            .map(c -> performAdvancedSearch(c, pageable))
            .orElse(Page.empty());
    }

    /**
     * Пошук за ім'ям
     */
    public Page<ClientEntity> searchByFirstName(String firstName, Pageable pageable) {
        return Optional.ofNullable(firstName)
            .filter(name -> !name.trim().isEmpty())
            .map(name -> clientRepository.findByIsActiveTrueAndFirstNameContainingIgnoreCase(name.trim(), pageable))
            .orElse(Page.empty());
    }

    /**
     * Пошук за прізвищем
     */
    public Page<ClientEntity> searchByLastName(String lastName, Pageable pageable) {
        return Optional.ofNullable(lastName)
            .filter(name -> !name.trim().isEmpty())
            .map(name -> clientRepository.findByIsActiveTrueAndLastNameContainingIgnoreCase(name.trim(), pageable))
            .orElse(Page.empty());
    }

    /**
     * Пошук за email
     */
    public Page<ClientEntity> searchByEmail(String email, Pageable pageable) {
        return Optional.ofNullable(email)
            .filter(e -> !e.trim().isEmpty())
            .map(e -> clientRepository.findByIsActiveTrueAndEmailContainingIgnoreCase(e.trim(), pageable))
            .orElse(Page.empty());
    }

    /**
     * Пошук за джерелом надходження
     */
    public Page<ClientEntity> searchBySourceType(ClientSourceType sourceType, Pageable pageable) {
        return Optional.ofNullable(sourceType)
            .map(source -> clientRepository.findByIsActiveTrueAndSourceType(source, pageable))
            .orElse(Page.empty());
    }

    /**
     * Пошук за способом зв'язку
     */
    public Page<ClientEntity> searchByCommunicationMethod(CommunicationMethodType communicationMethod, Pageable pageable) {
        return Optional.ofNullable(communicationMethod)
            .map(method -> clientRepository.findByIsActiveTrueAndCommunicationMethodsContaining(method, pageable))
            .orElse(Page.empty());
    }

    /**
     * Пошук за періодом реєстрації
     */
    public Page<ClientEntity> searchByRegistrationPeriod(LocalDate dateFrom, LocalDate dateTo, Pageable pageable) {
        return Optional.ofNullable(dateFrom)
            .filter(from -> dateTo != null && !from.isAfter(dateTo))
            .map(from -> clientRepository.findByIsActiveTrueAndCreatedAtBetween(from, dateTo, pageable))
            .orElse(Page.empty());
    }

    // === PRIVATE HELPER METHODS ===

    /**
     * Виконання розширеного пошуку на основі критеріїв
     */
    private Page<ClientEntity> performAdvancedSearch(AdvancedSearchCriteria criteria, Pageable pageable) {
        // Якщо є загальний запит - використовуємо quickSearch
        if (criteria.getQuery() != null && !criteria.getQuery().trim().isEmpty()) {
            List<ClientEntity> quickResults = quickSearch(criteria.getQuery(), pageable.getPageSize());
            return new org.springframework.data.domain.PageImpl<>(quickResults, pageable, quickResults.size());
        }

        // Пошук за конкретними критеріями (пріоритет за специфічністю)
        if (criteria.getFirstName() != null && !criteria.getFirstName().trim().isEmpty()) {
            return searchByFirstName(criteria.getFirstName(), pageable);
        }

        if (criteria.getLastName() != null && !criteria.getLastName().trim().isEmpty()) {
            return searchByLastName(criteria.getLastName(), pageable);
        }

        if (criteria.getEmail() != null && !criteria.getEmail().trim().isEmpty()) {
            return searchByEmail(criteria.getEmail(), pageable);
        }

        if (criteria.getSourceType() != null) {
            return searchBySourceType(criteria.getSourceType(), pageable);
        }

        if (criteria.getCommunicationMethod() != null) {
            return searchByCommunicationMethod(criteria.getCommunicationMethod(), pageable);
        }

        if (criteria.getRegistrationDateFrom() != null && criteria.getRegistrationDateTo() != null) {
            return searchByRegistrationPeriod(criteria.getRegistrationDateFrom(), criteria.getRegistrationDateTo(), pageable);
        }

        // Якщо немає специфічних критеріїв - повертаємо всіх клієнтів
        return clientRepository.findByIsActiveTrueOrderByLastNameAscFirstNameAsc(pageable);
    }

    /**
     * Критерії для розширеного пошуку
     */
    public static class AdvancedSearchCriteria {
        private String query;
        private String firstName;
        private String lastName;
        private String email;
        private ClientSourceType sourceType;
        private CommunicationMethodType communicationMethod;
        private LocalDate registrationDateFrom;
        private LocalDate registrationDateTo;

        // Геттери та сеттери
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public ClientSourceType getSourceType() { return sourceType; }
        public void setSourceType(ClientSourceType sourceType) { this.sourceType = sourceType; }

        public CommunicationMethodType getCommunicationMethod() { return communicationMethod; }
        public void setCommunicationMethod(CommunicationMethodType communicationMethod) { this.communicationMethod = communicationMethod; }

        public LocalDate getRegistrationDateFrom() { return registrationDateFrom; }
        public void setRegistrationDateFrom(LocalDate registrationDateFrom) { this.registrationDateFrom = registrationDateFrom; }

        public LocalDate getRegistrationDateTo() { return registrationDateTo; }
        public void setRegistrationDateTo(LocalDate registrationDateTo) { this.registrationDateTo = registrationDateTo; }
    }
}
