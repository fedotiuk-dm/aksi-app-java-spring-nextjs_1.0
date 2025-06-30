package com.aksi.api.client;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;

/** HTTP Controller для ClientsApi Відповідальність: тільки HTTP делегація до ClientService */
@Controller
@RequiredArgsConstructor
public class ClientsApiController implements ClientsApi {

  private final ClientService clientService;

  @Override
  public ResponseEntity<ClientResponse> createClient(CreateClientRequest createClientRequest) {
    ClientResponse response = clientService.createClient(createClientRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<ClientResponse> getClientById(UUID uuid) {
    ClientResponse response = clientService.getClientById(uuid);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientResponse> updateClient(
      UUID uuid, UpdateClientRequest updateClientRequest) {
    ClientResponse response = clientService.updateClient(uuid, updateClientRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<Void> deleteClient(UUID uuid) {
    clientService.deleteClient(uuid);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<ClientPageResponse> getClients(Integer page, Integer size, String sort) {
    ClientPageResponse response = clientService.getClients(page, size, sort);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientStatistics> getClientStatistics(UUID uuid) {
    ClientStatistics response = clientService.getClientStatistics(uuid);
    return ResponseEntity.ok(response);
  }
}
