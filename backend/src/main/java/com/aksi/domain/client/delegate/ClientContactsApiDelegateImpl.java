package com.aksi.domain.client.delegate;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientContactsApiDelegate;
import com.aksi.api.client.dto.ClientContactsResponse;
import com.aksi.api.client.dto.UpdateClientContactsRequest;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;

/**
 * Delegate Implementation для Client Contacts API
 * Відповідає за HTTP запити для керування контактною інформацією клієнтів
 */
@Component
@RequiredArgsConstructor
public class ClientContactsApiDelegateImpl implements ClientContactsApiDelegate {

    private final ClientService clientService;

    @Override
    public ResponseEntity<ClientContactsResponse> getClientContacts(UUID clientId) {
        ClientContactsResponse response = clientService.getClientContacts(clientId);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ClientContactsResponse> updateClientContacts(UUID clientId, UpdateClientContactsRequest updateClientContactsRequest) {
        ClientContactsResponse response = clientService.updateClientContacts(clientId, updateClientContactsRequest);
        return ResponseEntity.ok(response);
    }
}
