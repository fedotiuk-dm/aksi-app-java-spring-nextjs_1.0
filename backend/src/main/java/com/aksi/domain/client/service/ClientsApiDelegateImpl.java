package com.aksi.domain.client.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.aksi.api.client.ClientsApiDelegate;
import com.aksi.api.client.dto.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація delegate для Client API. Делегує виклики до доменних сервісів.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClientsApiDelegateImpl implements ClientsApiDelegate {

  private final ClientService clientService;

  @Override
  public ResponseEntity<ClientResponse> createClient(CreateClientRequest createClientRequest) {
    log.info("Створення нового клієнта: {}", createClientRequest.getPhone());

    try {
      ClientResponse response = clientService.createClient(createClientRequest);
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      log.error("Помилка при створенні клієнта: {}", e.getMessage());
      throw e;
    }
  }

  @Override
  public ResponseEntity<ClientResponse> getClientById(UUID id) {
    log.info("Отримання клієнта за ID: {}", id);

    ClientResponse response = clientService.getClientById(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientPageResponse> getClients(Integer page, Integer size, String sort) {
    log.info("Отримання списку клієнтів: page={}, size={}, sort={}", page, size, sort);

    ClientPageResponse response = clientService.getClients(page, size, sort);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ClientResponse> updateClient(
      UUID id, UpdateClientRequest updateClientRequest) {
    log.info("Оновлення клієнта: {}", id);

    ClientResponse response = clientService.updateClient(id, updateClientRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<Void> deleteClient(UUID id) {
    log.info("Видалення клієнта: {}", id);

    clientService.deleteClient(id);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<ClientStatistics> getClientStatistics(UUID id) {
    log.info("Отримання статистики клієнта: {}", id);

    ClientStatistics response = clientService.getClientStatistics(id);
    return ResponseEntity.ok(response);
  }
}
