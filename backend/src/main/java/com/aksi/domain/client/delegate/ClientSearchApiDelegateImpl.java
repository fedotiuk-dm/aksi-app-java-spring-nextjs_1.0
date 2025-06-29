package com.aksi.domain.client.delegate;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientSearchApiDelegate;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientSearchRequest;
import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;

/**
 * Delegate Implementation для Client Search API
 * Відповідає за HTTP запити для пошуку клієнтів
 */
@Component
@RequiredArgsConstructor
public class ClientSearchApiDelegateImpl implements ClientSearchApiDelegate {

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
