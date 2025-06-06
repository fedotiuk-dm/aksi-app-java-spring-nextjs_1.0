package com.aksi.domain.order.statemachine.stage2.integration.domain.client;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientPageResponse;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Фасад для інтеграції з Client Domain.
 * Надає методи для роботи з клієнтами в рамках Stage 2.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientDomainFacade {

    private final ClientService clientService;

    /**
     * Отримує клієнта за ID
     */
    public ClientResponse getClientById(UUID clientId) {
        log.debug("Getting client by id: {}", clientId);
        return clientService.getClientById(clientId);
    }

    /**
     * Створює нового клієнта
     */
    public ClientResponse createClient(CreateClientRequest request) {
        log.debug("Creating new client: {}", request.getLastName());
        return clientService.createClient(request);
    }

    /**
     * Оновлює існуючого клієнта
     */
    public ClientResponse updateClient(UUID clientId, UpdateClientRequest request) {
        log.debug("Updating client: {}", clientId);
        return clientService.updateClient(clientId, request);
    }

    /**
     * Пошук клієнтів за критеріями (з пагінацією)
     */
    public ClientPageResponse searchClients(String searchTerm, int page, int size) {
        log.debug("Searching clients with term: {}, page: {}, size: {}", searchTerm, page, size);

        ClientSearchRequest request = ClientSearchRequest.builder()
                .query(searchTerm)
                .page(page)
                .size(size)
                .build();

        return clientService.searchClients(request);
    }

    /**
     * Отримує всіх клієнтів з пагінацією
     */
    public ClientPageResponse getAllClients(int page, int size) {
        log.debug("Getting all clients with pagination: page={}, size={}", page, size);
        return clientService.getAllClientsPaged(page, size);
    }
    
    /**
     * Видаляє клієнта
     */
    public void deleteClient(UUID clientId) {
        log.debug("Deleting client: {}", clientId);
        clientService.deleteClient(clientId);
    }

    /**
     * Перевіряє чи існує клієнт
     */
    public boolean clientExists(UUID clientId) {
        log.debug("Checking if client exists: {}", clientId);
        try {
            ClientResponse client = getClientById(clientId);
            return client != null;
        } catch (Exception e) {
            log.warn("Client not found: {}", clientId);
            return false;
        }
    }

    /**
     * Валідує дані клієнта
     */
    public boolean validateClientData(CreateClientRequest request) {
        log.debug("Validating client data for: {}", request.getLastName());

        // Базова валідація
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            log.warn("Client last name is required");
            return false;
        }

        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            log.warn("Client phone is required");
            return false;
        }

        return true;
    }
}
