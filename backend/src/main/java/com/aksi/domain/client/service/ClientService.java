package com.aksi.domain.client.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.client.dto.ClientContactsResponse;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientSearchRequest;
import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.PageableInfo;
import com.aksi.api.client.dto.UpdateClientContactsRequest;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.exception.ClientNotFoundException;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.validation.ClientValidator;

import lombok.RequiredArgsConstructor;

/**
 * API-First Client Service
 * Відповідальність: всі методи описані в OpenAPI (ClientsApi, ClientSearchApi, ClientContactsApi)
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientValidator clientValidator;
    private final ClientMapper clientMapper;

    // ==============================
    // ClientsApi МЕТОДИ
    // ==============================

    /**
     * POST /api/clients
     */
    public ClientResponse createClient(CreateClientRequest request) {
        ClientEntity entity = clientMapper.toEntity(request);
        clientValidator.validateUniqueness(entity);
        clientValidator.validateContactInfo(entity);
        ClientEntity savedEntity = clientRepository.save(entity);
        return clientMapper.toResponse(savedEntity);
    }

    /**
     * GET /api/clients/{id}
     */
    @Transactional(readOnly = true)
    public ClientResponse getClientById(UUID uuid) {
        ClientEntity entity = clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
        return clientMapper.toResponse(entity);
    }

    /**
     * PUT /api/clients/{id}
     */
    public ClientResponse updateClient(UUID uuid, UpdateClientRequest request) {
        ClientEntity existingEntity = clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
        clientMapper.updateEntityFromRequest(request, existingEntity);
        clientValidator.validateUniquenessForUpdate(existingEntity);
        clientValidator.validateContactInfo(existingEntity);
        ClientEntity updatedEntity = clientRepository.save(existingEntity);
        return clientMapper.toResponse(updatedEntity);
    }

    /**
     * DELETE /api/clients/{id}
     */
    public void deleteClient(UUID uuid) {
        ClientEntity entity = clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
        clientValidator.validateForDeletion(entity);
        clientRepository.delete(entity);
    }

    /**
     * GET /api/clients
     */
    @Transactional(readOnly = true)
    public ClientPageResponse getClients(Integer page, Integer size, String sort) {
        Pageable pageable = createPageable(page, size, sort);
        Page<ClientEntity> entityPage = clientRepository.findAll(pageable);

        List<ClientResponse> clients = clientMapper.toResponseList(entityPage.getContent());

        PageableInfo pageableInfo = new PageableInfo()
            .page(entityPage.getNumber())
            .size(entityPage.getSize())
            .totalElements(entityPage.getTotalElements())
            .totalPages(entityPage.getTotalPages())
            .first(entityPage.isFirst())
            .last(entityPage.isLast())
            .numberOfElements(entityPage.getNumberOfElements());

        return new ClientPageResponse()
            .content(clients)
            .pageable(pageableInfo);
    }

    /**
     * GET /api/clients/{id}/statistics
     */
    @Transactional(readOnly = true)
    public ClientStatistics getClientStatistics(UUID uuid) {
        ClientEntity entity = clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
        return clientMapper.toStatistics(entity);
    }

    // ==============================
    // ClientSearchApi МЕТОДИ
    // ==============================

    /**
     * GET /api/clients/search
     */
    @Transactional(readOnly = true)
    public ClientSearchResponse searchClients(String query, Integer limit) {
        Pageable pageable = PageRequest.of(0, limit != null ? limit : 10);
        List<ClientEntity> entities = clientRepository.quickSearch(query, pageable);

        return new ClientSearchResponse()
            .results(clientMapper.toSearchResultList(entities))
            .totalFound(entities.size())
            .hasMore(entities.size() >= (limit != null ? limit : 10));
    }

    /**
     * POST /api/clients/search/advanced
     */
    @Transactional(readOnly = true)
    public ClientPageResponse advancedSearchClients(ClientSearchRequest request) {
        Integer page = request.getPage();
        Integer size = request.getSize();
        Pageable pageable = PageRequest.of(
            page != null ? page : 0,
            size != null ? size : 20,
            createSortFromRequest(request)
        );

        Page<ClientEntity> entityPage = clientRepository.advancedSearch(
            request.getQuery(),
            request.getFirstName(),
            request.getLastName(),
            request.getPhone(),
            request.getEmail(),
            request.getCity(),
            request.getSourceType() != null ?
                ClientSourceType.valueOf(request.getSourceType().getValue()) : null,
            request.getRegistrationDateFrom(),
            request.getRegistrationDateTo(),
            request.getIsVip(),
            pageable);

        List<ClientResponse> clients = clientMapper.toResponseList(entityPage.getContent());

        PageableInfo pageableInfo = new PageableInfo()
            .page(entityPage.getNumber())
            .size(entityPage.getSize())
            .totalElements(entityPage.getTotalElements())
            .totalPages(entityPage.getTotalPages())
            .first(entityPage.isFirst())
            .last(entityPage.isLast())
            .numberOfElements(entityPage.getNumberOfElements());

        return new ClientPageResponse()
            .content(clients)
            .pageable(pageableInfo);
    }

    // ==============================
    // ClientContactsApi МЕТОДИ
    // ==============================

    /**
     * GET /api/clients/{id}/contacts
     */
    @Transactional(readOnly = true)
    public ClientContactsResponse getClientContacts(UUID uuid) {
        ClientEntity entity = clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
        return clientMapper.toContactsResponse(entity);
    }

    /**
     * PUT /api/clients/{id}/contacts
     */
    public ClientContactsResponse updateClientContacts(UUID uuid, UpdateClientContactsRequest request) {
        ClientEntity existingEntity = clientRepository.findByUuid(uuid)
            .orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
        clientMapper.updateContactsFromRequest(request, existingEntity);
        clientValidator.validateContactInfo(existingEntity);
        ClientEntity updatedEntity = clientRepository.save(existingEntity);
        return clientMapper.toContactsResponse(updatedEntity);
    }

    // ==============================
    // UTILITY МЕТОДИ
    // ==============================

    private Pageable createPageable(Integer page, Integer size, String sort) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 20;

        if (sort != null && !sort.trim().isEmpty()) {
            String[] sortParts = sort.split(",");
            String field = sortParts[0].trim();
            org.springframework.data.domain.Sort.Direction direction =
                org.springframework.data.domain.Sort.Direction.ASC;

            if (sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1].trim())) {
                direction = org.springframework.data.domain.Sort.Direction.DESC;
            }

            return PageRequest.of(pageNumber, pageSize, direction, field);
        }

        return PageRequest.of(pageNumber, pageSize);
    }

    private org.springframework.data.domain.Sort createSortFromRequest(ClientSearchRequest request) {
        if (request.getSort() == null) {
            return org.springframework.data.domain.Sort.by("lastName");
        }
        return org.springframework.data.domain.Sort.by(request.getSort().getValue());
    }
}
