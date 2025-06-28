package com.aksi.domain.client.delegate;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientsApiDelegate;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація ClientsApiDelegate для обробки API запитів клієнтів.
 * Координує взаємодію між API та доменним сервісом.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ClientsApiDelegateImpl implements ClientsApiDelegate {

    private final ClientService clientService;
    private final ClientMapper clientMapper;

    @Override
    public ResponseEntity<ClientResponse> createClient(CreateClientRequest createClientRequest) {
        log.info("Creating client via API: firstName={}, lastName={}, phone={}",
                createClientRequest.getFirstName(),
                createClientRequest.getLastName(),
                createClientRequest.getPhone());

        try {
            ClientEntity createdClient = clientService.createClient(
                    createClientRequest.getFirstName(),
                    createClientRequest.getLastName(),
                    createClientRequest.getPhone(),
                    createClientRequest.getEmail(),
                    clientMapper.extractSourceType(createClientRequest),
                    clientMapper.extractCommunicationMethods(createClientRequest)
            );

            ClientResponse response = clientMapper.toClientResponse(createdClient);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Error creating client: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public ResponseEntity<Void> deleteClient(UUID id) {
        log.info("Deleting client via API: id={}", id);

        try {
            Long clientId = convertUuidToLong(id);
            clientService.deleteClient(clientId);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Error deleting client: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public ResponseEntity<ClientResponse> getClientById(UUID id) {
        log.debug("Getting client by ID via API: id={}", id);

        try {
            Long clientId = convertUuidToLong(id);
            return clientService.findClientById(clientId)
                    .map(clientMapper::toClientResponse)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            log.error("Error getting client by ID: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public ResponseEntity<ClientStatistics> getClientStatistics(UUID id) {
        log.debug("Getting client statistics via API: id={}", id);

        try {
            Long clientId = convertUuidToLong(id);
            Optional<ClientEntity> clientOpt = clientService.findClientById(clientId);

            if (clientOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ClientStatistics statistics = clientMapper.createClientStatistics(clientOpt.get());
            return ResponseEntity.ok(statistics);

        } catch (Exception e) {
            log.error("Error getting client statistics: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public ResponseEntity<ClientPageResponse> getClients(Integer page, Integer size, String sort) {
        log.debug("Getting all clients via API: page={}, size={}, sort={}", page, size, sort);

        try {
            // Default values
            int pageNumber = page != null ? page : 0;
            int pageSize = size != null ? size : 20;
            String sortBy = sort != null ? sort : "lastName";

            // Create pageable
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy));

                        // Get clients page
            Page<ClientEntity> clientsPage = clientService.getAllClients(pageable);

            // Convert to response
            ClientPageResponse response = new ClientPageResponse();
            response.setContent(clientMapper.toClientResponseList(clientsPage.getContent()));
            response.setFirst(clientsPage.isFirst());
            response.setLast(clientsPage.isLast());
            response.setTotalElements(clientsPage.getTotalElements());
            response.setTotalPages(clientsPage.getTotalPages());
            response.setNumberOfElements(clientsPage.getNumberOfElements());

            // Set pageable info
            com.aksi.api.client.dto.PageableInfo pageableInfo = new com.aksi.api.client.dto.PageableInfo();
            pageableInfo.setPage(pageNumber);
            pageableInfo.setSize(pageSize);
            pageableInfo.setSort(clientsPage.getSort().stream()
                    .map(order -> order.getProperty() + "," + order.getDirection())
                    .toList());
            response.setPageable(pageableInfo);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting all clients: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public ResponseEntity<ClientResponse> updateClient(UUID id, UpdateClientRequest updateClientRequest) {
        log.info("Updating client via API: id={}", id);

        try {
            Long clientId = convertUuidToLong(id);
            ClientEntity updatedClient = clientService.updateClient(
                    clientId,
                    updateClientRequest.getFirstName(),
                    updateClientRequest.getLastName(),
                    updateClientRequest.getPhone(),
                    updateClientRequest.getEmail(),
                    clientMapper.extractSourceType(updateClientRequest),
                    clientMapper.extractCommunicationMethods(updateClientRequest),
                    updateClientRequest.getNotes()
            );

            ClientResponse response = clientMapper.toClientResponse(updatedClient);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error updating client: {}", e.getMessage(), e);
            throw e;
        }
    }

    // === Helper conversion methods ===

    private Long convertUuidToLong(UUID uuid) {
        if (uuid == null) {
            return null;
        }
        try {
            // Convert UUID to consistent Long using hash
            return (long) uuid.hashCode();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid UUID: " + uuid, e);
        }
    }
}
