package com.aksi.api.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientSearchRequest;
import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP Controller для ClientSearchApi
 * Відповідальність: тільки HTTP делегація до ClientService
 */
@Controller
@RequiredArgsConstructor
public class ClientSearchApiController implements ClientSearchApi {

    private final ClientService clientService;

    @Override
    public ResponseEntity<ClientSearchResponse> searchClients(String query, Integer limit) {
        ClientSearchResponse response = clientService.searchClients(query, limit);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ClientPageResponse> advancedSearchClients(ClientSearchRequest clientSearchRequest) {
        ClientPageResponse response = clientService.advancedSearchClients(clientSearchRequest);
        return ResponseEntity.ok(response);
    }
}
