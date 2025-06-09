package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.service.ClientService;

/**
 * Тонкі обгортки над ClientService для Stage1.
 */
@Service
public class Stage1ClientOperationsService {

    private final ClientService clientService;

    public Stage1ClientOperationsService(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Пошук клієнтів за критеріями.
     */
    public List<ClientResponse> searchClients(String searchTerm) {
        ClientSearchRequest request = new ClientSearchRequest();
        request.setQuery(searchTerm);
        request.setPage(0);
        request.setSize(100); // Default size for all results
        return clientService.searchClients(request).getContent();
    }

    /**
     * Отримання клієнта за ID.
     */
    public ClientResponse getClientById(UUID clientId) {
        return clientService.getClientById(clientId);
    }

    /**
     * Створення нового клієнта.
     */
    public ClientResponse createClient(CreateClientRequest createClientRequest) {
        return clientService.createClient(createClientRequest);
    }

    /**
     * Перевірка існування клієнта за ID.
     */
    public boolean clientExists(UUID clientId) {
        try {
            clientService.getClientById(clientId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
