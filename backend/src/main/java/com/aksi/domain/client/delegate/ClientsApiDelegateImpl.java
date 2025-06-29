package com.aksi.domain.client.delegate;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientsApiDelegate;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;

/**
 * Delegate Implementation для Client CRUD API
 * Відповідає за HTTP запити для керування клієнтами
 */
@Component
@RequiredArgsConstructor
public class ClientsApiDelegateImpl implements ClientsApiDelegate {

    private final ClientService clientService;

    @Override
    public ResponseEntity<ClientResponse> createClient(CreateClientRequest createClientRequest) {
        ClientResponse response = clientService.createClient(createClientRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<Void> deleteClient(UUID clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<ClientResponse> getClientById(UUID clientId) {
        ClientResponse response = clientService.getClientById(clientId);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ClientPageResponse> getClients(Integer page, Integer size, String sort) {
        ClientPageResponse response = clientService.getClients(page, size, sort);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ClientStatistics> getClientStatistics(UUID clientId) {
        ClientStatistics response = clientService.getClientStatistics(clientId);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ClientResponse> updateClient(UUID clientId, UpdateClientRequest updateClientRequest) {
        ClientResponse response = clientService.updateClient(clientId, updateClientRequest);
        return ResponseEntity.ok(response);
    }
}
