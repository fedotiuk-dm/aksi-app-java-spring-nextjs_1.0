package com.aksi.domain.client.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.client.dto.ClientListResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.exception.ClientNotFoundException;
import com.aksi.domain.client.exception.DuplicateClientException;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.util.ClientUtils;
import com.aksi.shared.validation.ValidationConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service class for client business logic */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClientService {

  private final ClientRepository clientRepository;
  private final ClientMapper clientMapper;

  /** Create a new client */
  public ClientResponse createClient(CreateClientRequest request) {
    log.info(
        ValidationConstants.Messages.CREATING_CLIENT,
        request.getLastName(),
        request.getFirstName());

    // Normalize phone number
    String normalizedPhone = ClientUtils.normalizePhone(request.getPhone());

    // Check if client with this phone already exists
    if (clientRepository.existsByPhone(normalizedPhone)) {
      throw new DuplicateClientException(normalizedPhone);
    }

    // Create entity from request
    ClientEntity client = clientMapper.toEntity(request);
    client.setPhone(normalizedPhone);

    // Save and return response
    client = clientRepository.save(client);
    log.info("Client created successfully with id: {}", client.getId());

    return clientMapper.toResponse(client);
  }

  /** Get client by ID */
  @Transactional(readOnly = true)
  public ClientResponse getClientById(UUID id) {
    log.debug("Getting client by id: {}", id);

    ClientEntity client =
        clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));

    return clientMapper.toResponse(client);
  }

  /** Get client by phone number */
  @Transactional(readOnly = true)
  public ClientResponse getClientByPhone(String phone) {
    log.debug("Getting client by phone: {}", phone);

    String normalizedPhone = ClientUtils.normalizePhone(phone);
    ClientEntity client =
        clientRepository
            .findByPhone(normalizedPhone)
            .orElseThrow(
                () -> new ClientNotFoundException("Client not found with phone: " + phone));

    return clientMapper.toResponse(client);
  }

  /** Update existing client */
  public ClientResponse updateClient(UUID id, UpdateClientRequest request) {
    log.info("Updating client with id: {}", id);

    ClientEntity client =
        clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));

    // Normalize phone if it's being updated
    if (request.getPhone() != null) {
      String normalizedPhone = ClientUtils.normalizePhone(request.getPhone());

      // Check if new phone is already taken by another client
      if (!normalizedPhone.equals(client.getPhone())
          && clientRepository.existsByPhone(normalizedPhone)) {
        throw new DuplicateClientException(normalizedPhone);
      }

      request.setPhone(normalizedPhone);
    }

    // Update entity from request
    clientMapper.updateEntityFromRequest(client, request);

    // Save and return response
    client = clientRepository.save(client);
    log.info("Client updated successfully with id: {}", client.getId());

    return clientMapper.toResponse(client);
  }

  /** Get all clients */
  @Transactional(readOnly = true)
  public ClientListResponse getClients() {
    log.debug("Getting all clients");

    List<ClientEntity> clients = clientRepository.findAll();

    ClientListResponse response = new ClientListResponse();
    response.setItems(clientMapper.toResponseList(clients));

    return response;
  }

  /**
   * Update client statistics after order creation This method should be called from Order domain
   */
  public void updateClientStatistics(UUID clientId, BigDecimal orderAmount) {
    log.debug("Updating statistics for client: {}, amount: {}", clientId, orderAmount);

    if (!clientRepository.existsById(clientId)) {
      log.warn("Client not found for statistics update: {}", clientId);
      return;
    }

    clientRepository.updateStatistics(clientId, orderAmount, LocalDate.now());
    log.debug("Client statistics updated successfully");
  }
}
