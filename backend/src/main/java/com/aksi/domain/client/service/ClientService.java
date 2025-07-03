package com.aksi.domain.client.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
import com.aksi.domain.client.enums.CommunicationMethodType;
import com.aksi.domain.client.exception.ClientNotFoundException;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.repository.ClientSpecification;
import com.aksi.domain.client.validation.ClientValidator;

import lombok.RequiredArgsConstructor;

/**
 * API-First Client Service Відповідальність: всі методи описані в OpenAPI (ClientsApi,
 * ClientSearchApi, ClientContactsApi).
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ClientService {

  private final ClientRepository clientRepository;
  private final ClientValidator clientValidator;
  private final ClientMapper clientMapper;

  // Константи для уникнення magic numbers
  private static final int DEFAULT_PAGE_SIZE = 20;
  private static final int DEFAULT_SEARCH_LIMIT = 10;
  private static final int DEFAULT_TOP_LIMIT = 50;
  private static final String DEFAULT_SORT_FIELD = "lastName";

  // ==============================
  // ClientsApi МЕТОДИ
  // ==============================

  /** POST /api/clients. */
  public ClientResponse createClient(CreateClientRequest request) {
    ClientEntity entity = clientMapper.toEntity(request);
    clientValidator.validateUniqueness(entity);
    clientValidator.validateContactInfo(entity);
    ClientEntity savedEntity = clientRepository.save(entity);
    return clientMapper.toResponse(savedEntity);
  }

  /** GET /api/clients/{id}. */
  @Transactional(readOnly = true)
  public ClientResponse getClientById(UUID uuid) {
    ClientEntity entity =
        clientRepository.findById(uuid).orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
    return clientMapper.toResponse(entity);
  }

  /** PUT /api/clients/{id}. */
  public ClientResponse updateClient(UUID uuid, UpdateClientRequest request) {
    ClientEntity existingEntity =
        clientRepository.findById(uuid).orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
    clientMapper.updateEntityFromRequest(request, existingEntity);
    clientValidator.validateUniquenessForUpdate(existingEntity);
    clientValidator.validateContactInfo(existingEntity);
    ClientEntity updatedEntity = clientRepository.save(existingEntity);
    return clientMapper.toResponse(updatedEntity);
  }

  /** DELETE /api/clients/{id}. */
  public void deleteClient(UUID uuid) {
    ClientEntity entity =
        clientRepository.findById(uuid).orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
    clientValidator.validateForDeletion(entity);
    clientRepository.delete(entity);
  }

  /** GET /api/clients. */
  @Transactional(readOnly = true)
  public ClientPageResponse getClients(Integer page, Integer size, String sort) {
    Pageable pageable = createPageable(page, size, sort);
    Page<ClientEntity> entityPage = clientRepository.findAll(pageable);

    List<ClientResponse> clients = clientMapper.toResponseList(entityPage.getContent());

    PageableInfo pageableInfo = createPageableInfo(entityPage);

    return new ClientPageResponse().content(clients).pageable(pageableInfo);
  }

  /** GET /api/clients/{id}/statistics. */
  @Transactional(readOnly = true)
  public ClientStatistics getClientStatistics(UUID uuid) {
    ClientEntity entity =
        clientRepository.findById(uuid).orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
    return clientMapper.toStatistics(entity);
  }

  // ==============================
  // ClientSearchApi МЕТОДИ
  // ==============================

  /** GET /api/clients/search. */
  @Transactional(readOnly = true)
  public ClientSearchResponse searchClients(String query, Integer limit) {
    // Валідація query (узгоджено з @Query логікою в quickSearch)
    if (query == null || query.trim().isEmpty()) {
      return new ClientSearchResponse().results(List.of()).totalFound(0).hasMore(false);
    }

    int searchLimit = limit != null ? limit : DEFAULT_SEARCH_LIMIT;
    Pageable pageable = PageRequest.of(0, searchLimit);
    List<ClientEntity> entities = clientRepository.quickSearch(query.trim(), pageable);

    return new ClientSearchResponse()
        .results(clientMapper.toSearchResultList(entities))
        .totalFound(entities.size())
        .hasMore(entities.size() >= searchLimit);
  }

  /** POST /api/clients/search/advanced. */
  @Transactional(readOnly = true)
  public ClientPageResponse advancedSearchClients(ClientSearchRequest request) {
    Integer page = request.getPage();
    Integer size = request.getSize();
    Pageable pageable =
        PageRequest.of(
            page != null ? page : 0,
            size != null ? size : DEFAULT_PAGE_SIZE,
            createSortFromRequest(request));

    // Конвертуємо API DTO в domain типи
    ClientSourceType sourceType =
        request.getSourceType() != null
            ? ClientSourceType.valueOf(request.getSourceType().getValue())
            : null;

    List<CommunicationMethodType> communicationMethods =
        request.getCommunicationMethods() != null
            ? request.getCommunicationMethods().stream()
                .map(method -> CommunicationMethodType.valueOf(method.getValue()))
                .collect(Collectors.toList())
            : null;

    Specification<ClientEntity> specification =
        ClientSpecification.buildAdvancedSearch(
            request.getQuery(),
            request.getFirstName(),
            request.getLastName(),
            request.getPhone(),
            request.getEmail(),
            request.getCity(),
            sourceType,
            communicationMethods,
            request.getRegistrationDateFrom(),
            request.getRegistrationDateTo(),
            request.getIsVip());

    Page<ClientEntity> entityPage = clientRepository.findAll(specification, pageable);
    List<ClientResponse> clients = clientMapper.toResponseList(entityPage.getContent());
    PageableInfo pageableInfo = createPageableInfo(entityPage);

    return new ClientPageResponse().content(clients).pageable(pageableInfo);
  }

  /** Спрощений метод для створення Sort з ClientSearchRequest. */
  private Sort createSortFromRequest(ClientSearchRequest request) {
    if (request.getSort() == null) {
      return Sort.by(DEFAULT_SORT_FIELD);
    }
    return Sort.by(request.getSort().getValue());
  }

  // ==============================
  // ClientContactsApi МЕТОДИ
  // ==============================

  /** GET /api/clients/{id}/contacts. */
  @Transactional(readOnly = true)
  public ClientContactsResponse getClientContacts(UUID uuid) {
    ClientEntity entity =
        clientRepository.findById(uuid).orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
    return clientMapper.toContactsResponse(entity);
  }

  /** PUT /api/clients/{id}/contacts. */
  public ClientContactsResponse updateClientContacts(
      UUID uuid, UpdateClientContactsRequest request) {
    ClientEntity existingEntity =
        clientRepository.findById(uuid).orElseThrow(() -> ClientNotFoundException.byUuid(uuid));
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
    int pageSize = size != null ? size : DEFAULT_PAGE_SIZE;
    Sort sortObject = createSort(sort, DEFAULT_SORT_FIELD);
    return PageRequest.of(pageNumber, pageSize, sortObject);
  }

  private Sort createSort(String sortString, String defaultField) {
    if (sortString == null || sortString.trim().isEmpty()) {
      return Sort.by(defaultField);
    }

    String[] sortParts = sortString.split(",");
    String field = sortParts[0].trim();
    Sort.Direction direction = Sort.Direction.ASC;

    if (sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1].trim())) {
      direction = Sort.Direction.DESC;
    }

    return Sort.by(direction, field);
  }

  private PageableInfo createPageableInfo(Page<?> page) {
    return new PageableInfo()
        .page(page.getNumber())
        .size(page.getSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .first(page.isFirst())
        .last(page.isLast())
        .numberOfElements(page.getNumberOfElements());
  }

  // ==============================
  // ДОДАТКОВІ МЕТОДИ З SPECIFICATION
  // ==============================

  /** Топ клієнти за замовленнями (через Specification). */
  @Transactional(readOnly = true)
  public List<ClientResponse> getTopClientsByOrders(int limit) {
    Specification<ClientEntity> spec = ClientSpecification.hasOrders();
    Pageable pageable =
        PageRequest.of(
            0, limit, Sort.by("totalOrders").descending().and(Sort.by("totalSpent").descending()));

    List<ClientEntity> entities = clientRepository.findAll(spec, pageable).getContent();
    return clientMapper.toResponseList(entities);
  }

  /** Топ клієнти за замовленнями з дефолтним лімітом. */
  @Transactional(readOnly = true)
  public List<ClientResponse> getTopClientsByOrders() {
    return getTopClientsByOrders(DEFAULT_TOP_LIMIT);
  }

  /** Неактивні клієнти з заданої дати (через Specification). */
  @Transactional(readOnly = true)
  public List<ClientResponse> getInactiveClientsSince(LocalDate cutoffDate, int limit) {
    Specification<ClientEntity> spec = ClientSpecification.inactiveSince(cutoffDate);
    Pageable pageable = PageRequest.of(0, limit, Sort.by("lastOrderDate").descending());

    List<ClientEntity> entities = clientRepository.findAll(spec, pageable).getContent();
    return clientMapper.toResponseList(entities);
  }

  /** Неактивні клієнти з заданої дати з дефолтним лімітом. */
  @Transactional(readOnly = true)
  public List<ClientResponse> getInactiveClientsSince(LocalDate cutoffDate) {
    return getInactiveClientsSince(cutoffDate, DEFAULT_TOP_LIMIT);
  }

  /** Клієнти без замовлень (через Specification). */
  @Transactional(readOnly = true)
  public List<ClientResponse> getClientsWithoutOrders(int limit) {
    Specification<ClientEntity> spec = ClientSpecification.hasNoOrders();
    Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());

    List<ClientEntity> entities = clientRepository.findAll(spec, pageable).getContent();
    return clientMapper.toResponseList(entities);
  }

  /** Клієнти без замовлень з дефолтним лімітом. */
  @Transactional(readOnly = true)
  public List<ClientResponse> getClientsWithoutOrders() {
    return getClientsWithoutOrders(DEFAULT_TOP_LIMIT);
  }

  /** Комбінований пошук VIP клієнтів з витратами (демонстрація композиції). */
  @Transactional(readOnly = true)
  public List<ClientResponse> getVipClientsWithSpending(int limit) {
    Specification<ClientEntity> spec =
        Specification.where(ClientSpecification.isVip(true)).and(ClientSpecification.hasSpending());

    Pageable pageable = PageRequest.of(0, limit, Sort.by("totalSpent").descending());

    List<ClientEntity> entities = clientRepository.findAll(spec, pageable).getContent();
    return clientMapper.toResponseList(entities);
  }

  /** VIP клієнти з витратами з дефолтним лімітом. */
  @Transactional(readOnly = true)
  public List<ClientResponse> getVipClientsWithSpending() {
    return getVipClientsWithSpending(DEFAULT_TOP_LIMIT);
  }
}
