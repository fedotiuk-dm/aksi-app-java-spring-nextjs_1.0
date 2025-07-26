package com.aksi.api.client;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.client.dto.ClientListResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for client management Implements OpenAPI generated ClientsApi interface */
@RestController
@RequiredArgsConstructor
@Slf4j
public class ClientController implements ClientsApi {

  private final ClientService clientService;

  @Override
  public ResponseEntity<ClientResponse> createClient(CreateClientRequest createClientRequest) {
    log.info(
        "Creating new client: {} {}",
        createClientRequest.getLastName(),
        createClientRequest.getFirstName());

    ClientResponse response = clientService.createClient(createClientRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<ClientResponse> getClientById(UUID id) {
    log.debug("Getting client by id: {}", id);

    ClientResponse response = clientService.getClientById(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientResponse> getClientByPhone(String phone) {
    log.debug("Getting client by phone: {}", phone);

    ClientResponse response = clientService.getClientByPhone(phone);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientListResponse> getClients() {
    log.debug("Getting all clients");

    ClientListResponse response = clientService.getClients();
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientResponse> updateClient(
      UUID id, UpdateClientRequest updateClientRequest) {
    log.info("Updating client: {}", id);

    ClientResponse response = clientService.updateClient(id, updateClientRequest);
    return ResponseEntity.ok(response);
  }
}
