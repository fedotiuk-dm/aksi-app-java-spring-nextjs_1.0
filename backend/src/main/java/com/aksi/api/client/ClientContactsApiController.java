package com.aksi.api.client;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.client.dto.ClientContactsResponse;
import com.aksi.api.client.dto.UpdateClientContactsRequest;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP Controller для ClientContactsApi Відповідальність: тільки HTTP делегація до ClientService.
 */
@Controller
@RequiredArgsConstructor
public class ClientContactsApiController implements ClientContactsApi {

  private final ClientService clientService;

  @Override
  public ResponseEntity<ClientContactsResponse> getClientContacts(UUID uuid) {
    ClientContactsResponse response = clientService.getClientContacts(uuid);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientContactsResponse> updateClientContacts(
      UUID uuid, UpdateClientContactsRequest updateClientContactsRequest) {
    ClientContactsResponse response =
        clientService.updateClientContacts(uuid, updateClientContactsRequest);
    return ResponseEntity.ok(response);
  }
}
