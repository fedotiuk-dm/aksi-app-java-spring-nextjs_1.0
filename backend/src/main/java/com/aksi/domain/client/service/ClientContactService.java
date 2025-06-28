package com.aksi.domain.client.service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.validation.ClientValidator;

/**
 * ============================================================================
 * CLIENT CONTACT SERVICE - УПРАВЛІННЯ КОНТАКТНОЮ ІНФОРМАЦІЄЮ КЛІЄНТІВ
 * ============================================================================
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * • Отримання контактної інформації клієнта (getClientContacts)
 * • Оновлення контактної інформації (updateClientContacts)
 * • Оновлення окремих контактних полів (phone, email, address)
 * • Управління способами зв'язку (updateCommunicationMethods)
 * • Валідація контактних даних
 *
 * ЩО НЕ ВХОДИТЬ В ВІДПОВІДАЛЬНІСТЬ:
 * ❌ CRUD операції з клієнтами (ClientCrudService)
 * ❌ Пошук клієнтів (ClientSearchService)
 * ❌ Статистика/аналітика (ClientAnalyticsService)
 *
 * АРХІТЕКТУРНІ ПРИНЦИПИ:
 * • Single Responsibility: тільки управління контактами
 * • Functional Programming: Optional + map/filter замість if-statements
 * • Validation: використання ClientValidator для перевірок
 * • Immutable Data: внутрішні DTO для безпечної передачі даних
 *
 * ІНТЕГРАЦІЯ З API:
 * • ClientContactsApiDelegateImpl - API endpoints для управління контактами
 * • DTO конвертація через ClientMapper
 *
 * ВНУТРІШНІ DTO КЛАСИ:
 * • ClientContactInfo - контактна інформація клієнта
 * • ContactUpdateRequest - запит на оновлення контактів
 */
@Service
@Transactional
public class ClientContactService {

    private final ClientRepository clientRepository;
    private final ClientValidator clientValidator;

    public ClientContactService(ClientRepository clientRepository, ClientValidator clientValidator) {
        this.clientRepository = clientRepository;
        this.clientValidator = clientValidator;
    }

    /**
     * Отримання контактної інформації клієнта
     */
    @Transactional(readOnly = true)
    public Optional<ClientContactInfo> getClientContacts(UUID clientUuid) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .map(this::mapToContactInfo);
    }

    /**
     * Оновлення контактної інформації клієнта
     */
    public Optional<ClientContactInfo> updateClientContacts(UUID clientUuid, ContactUpdateRequest updateRequest) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .filter(client -> validateContactUpdate(updateRequest))
            .map(client -> applyContactUpdates(client, updateRequest))
            .map(clientRepository::save)
            .map(this::mapToContactInfo);
    }

    /**
     * Оновлення тільки телефону клієнта
     */
    public boolean updateClientPhone(UUID clientUuid, String newPhone) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .filter(client -> clientValidator.isValidPhone(newPhone))
            .filter(client -> !clientRepository.findByPhoneAndIsActiveTrue(newPhone)
                .filter(existing -> !existing.getUuid().equals(clientUuid))
                .isPresent())
            .map(client -> {
                client.setPhone(newPhone);
                clientRepository.save(client);
                return true;
            })
            .orElse(false);
    }

    /**
     * Оновлення тільки email клієнта
     */
    public boolean updateClientEmail(UUID clientUuid, String newEmail) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .filter(client -> newEmail == null || clientValidator.isValidEmail(newEmail))
            .map(client -> {
                client.setEmail(newEmail);
                clientRepository.save(client);
                return true;
            })
            .orElse(false);
    }

    /**
     * Оновлення способів зв'язку клієнта
     */
    public boolean updateCommunicationMethods(UUID clientUuid, Set<CommunicationMethodType> communicationMethods) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .map(client -> {
                client.setCommunicationMethods(communicationMethods != null ? communicationMethods : Set.of());
                clientRepository.save(client);
                return true;
            })
            .orElse(false);
    }

    /**
     * Оновлення адреси клієнта
     */
    public boolean updateClientAddress(UUID clientUuid, String newAddress) {
        return Optional.ofNullable(clientUuid)
            .flatMap(clientRepository::findByUuidAndIsActiveTrue)
            .map(client -> {
                client.setAddress(newAddress);
                clientRepository.save(client);
                return true;
            })
            .orElse(false);
    }

    // === PRIVATE HELPER METHODS ===

    /**
     * Маппінг Entity до контактної інформації
     */
    private ClientContactInfo mapToContactInfo(ClientEntity client) {
        ClientContactInfo contactInfo = new ClientContactInfo();
        contactInfo.setClientUuid(client.getUuid());
        contactInfo.setPhone(client.getPhone());
        contactInfo.setEmail(client.getEmail());
        contactInfo.setAddress(client.getAddress());
        contactInfo.setCommunicationMethods(client.getCommunicationMethods());
        return contactInfo;
    }

    /**
     * Валідація запиту на оновлення контактів
     */
    private boolean validateContactUpdate(ContactUpdateRequest request) {
        if (request == null) {
            return false;
        }

        // Валідація телефону якщо він вказаний
        if (request.getPhone() != null && !clientValidator.isValidPhone(request.getPhone())) {
            throw new IllegalArgumentException("Некоректний формат телефону");
        }

        // Валідація email якщо він вказаний
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() &&
            !clientValidator.isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Некоректний формат email");
        }

        return true;
    }

    /**
     * Застосування оновлень до клієнта
     */
    private ClientEntity applyContactUpdates(ClientEntity client, ContactUpdateRequest request) {
        if (request.getPhone() != null) {
            client.setPhone(request.getPhone());
        }

        if (request.getEmail() != null) {
            client.setEmail(request.getEmail().trim().isEmpty() ? null : request.getEmail());
        }

        if (request.getAddress() != null) {
            client.setAddress(request.getAddress().trim().isEmpty() ? null : request.getAddress());
        }

        if (request.getCommunicationMethods() != null) {
            client.setCommunicationMethods(request.getCommunicationMethods());
        }

        return client;
    }

    // === DTO CLASSES ===

    /**
     * DTO для контактної інформації клієнта
     */
    public static class ClientContactInfo {
        private UUID clientUuid;
        private String phone;
        private String email;
        private String address;
        private Set<CommunicationMethodType> communicationMethods;

        // Геттери та сеттери
        public UUID getClientUuid() { return clientUuid; }
        public void setClientUuid(UUID clientUuid) { this.clientUuid = clientUuid; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public Set<CommunicationMethodType> getCommunicationMethods() { return communicationMethods; }
        public void setCommunicationMethods(Set<CommunicationMethodType> communicationMethods) {
            this.communicationMethods = communicationMethods;
        }
    }

    /**
     * DTO для оновлення контактної інформації
     */
    public static class ContactUpdateRequest {
        private String phone;
        private String email;
        private String address;
        private Set<CommunicationMethodType> communicationMethods;

        // Геттери та сеттери
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public Set<CommunicationMethodType> getCommunicationMethods() { return communicationMethods; }
        public void setCommunicationMethods(Set<CommunicationMethodType> communicationMethods) {
            this.communicationMethods = communicationMethods;
        }
    }
}
