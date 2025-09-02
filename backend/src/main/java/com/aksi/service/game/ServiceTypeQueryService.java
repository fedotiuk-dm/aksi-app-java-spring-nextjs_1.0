package com.aksi.service.game;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.ServiceTypeListResponse;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.ServiceTypeRepository;
import com.aksi.service.game.factory.ServiceTypeFactory;
import com.aksi.util.PaginationUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for service type-related read operations. All methods are read-only and optimized
 * for queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ServiceTypeQueryService {

  private final ServiceTypeRepository serviceTypeRepository;
  private final ServiceTypeFactory serviceTypeFactory;

  /**
   * Get service type by ID.
   *
   * @param serviceTypeId Service type ID
   * @return Service type
   * @throws NotFoundException if service type not found
   */
  public ServiceType getServiceTypeById(UUID serviceTypeId) {
    log.debug("Getting service type by id: {}", serviceTypeId);

    ServiceTypeEntity entity =
        serviceTypeRepository
            .findById(serviceTypeId)
            .orElseThrow(
                () -> new NotFoundException("Service type not found with id: " + serviceTypeId));

    return serviceTypeFactory.toDto(entity);
  }

  /**
   * Get paginated service types with search and filtering.
   *
   * @param page Page number (0-based)
   * @param size Page size
   * @param sortBy Sort field
   * @param sortOrder Sort direction ("asc" or "desc")
   * @param active Filter by active status
   * @param gameId Filter by game ID
   * @param search Search term
   * @return Paginated service types response
   */
  public ServiceTypeListResponse getServiceTypes(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      Boolean active,
      UUID gameId,
      String search) {

    log.debug(
        "Getting service types with pagination - page: {}, size: {}, sortBy: {}, "
            + "sortOrder: {}, active: {}, gameId: {}, search: {}",
        page,
        size,
        sortBy,
        sortOrder,
        active,
        gameId,
        search);

    // Create pageable and search
    Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortOrder);
    String searchTerm = search != null && !search.trim().isEmpty() ? search.trim() : null;

    Page<ServiceTypeEntity> serviceTypePage =
        serviceTypeRepository.findServiceTypesWithSearch(active, gameId, searchTerm, pageable);

    return serviceTypeFactory.createListResponse(serviceTypePage);
  }
}
