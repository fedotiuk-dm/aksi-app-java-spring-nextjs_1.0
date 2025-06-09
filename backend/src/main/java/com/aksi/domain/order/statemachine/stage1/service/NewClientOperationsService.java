package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.service.ClientService;

/**
 * Тонка обгортка над ClientService для операцій з новими клієнтами в Stage1.
 */
@Service
public class NewClientOperationsService {

    private final ClientService clientService;

    public NewClientOperationsService(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Створює нового клієнта.
     */
    public ClientResponse createClient(CreateClientRequest request) {
        return clientService.createClient(request);
    }

    /**
     * Пошук клієнтів за номером телефону.
     */
    public List<ClientResponse> searchClientsByPhone(String phone) {
        ClientSearchRequest request = new ClientSearchRequest();
        request.setQuery(phone);
        request.setPage(0);
        request.setSize(10);
        return clientService.searchClients(request).getContent();
    }

    /**
     * Пошук клієнтів за іменем та прізвищем.
     */
    public List<ClientResponse> searchClientsByName(String firstName, String lastName) {
        String searchTerm = firstName + " " + lastName;
        ClientSearchRequest request = new ClientSearchRequest();
        request.setQuery(searchTerm);
        request.setPage(0);
        request.setSize(10);
        return clientService.searchClients(request).getContent();
    }

    /**
     * Загальний пошук клієнтів.
     */
    public List<ClientResponse> searchClients(String searchTerm) {
        ClientSearchRequest request = new ClientSearchRequest();
        request.setQuery(searchTerm);
        request.setPage(0);
        request.setSize(10);
        return clientService.searchClients(request).getContent();
    }
}
