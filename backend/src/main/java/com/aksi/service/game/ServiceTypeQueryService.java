package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.ServiceTypeListResponse;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.ServiceTypeMapper;
import com.aksi.repository.ServiceTypeRepository;
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
  private final ServiceTypeMapper serviceTypeMapper;

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

    return serviceTypeMapper.toServiceTypeDto(entity);
  }

  /**
   * Get service type by code.
   *
   * @param code Service type code
   * @return Optional service type
   */
  public Optional<ServiceType> getServiceTypeByCode(String code) {
    log.debug("Getting service type by code: {}", code);

    return serviceTypeRepository.findByCode(code).map(serviceTypeMapper::toServiceTypeDto);
  }

  /**
   * Get all active service types.
   *
   * @return List of active service types
   */
  public List<ServiceType> getAllActiveServiceTypes() {
    log.debug("Getting all active service types");

    List<ServiceTypeEntity> entities = serviceTypeRepository.findByActiveTrueOrderBySortOrderAsc();
    return serviceTypeMapper.toServiceTypeDtoList(entities);
  }

  /**
   * Get service types by game ID.
   *
   * @param gameId Game ID
   * @return List of service types for the game
   */
  public List<ServiceType> getServiceTypesByGameId(UUID gameId) {
    log.debug("Getting service types by game id: {}", gameId);

    List<ServiceTypeEntity> entities = serviceTypeRepository.findByGameIdAndActiveTrue(gameId);
    return serviceTypeMapper.toServiceTypeDtoList(entities);
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
        "Getting service types with pagination - page: {}, size: {}, sortBy: {}, sortOrder: {}, active: {}, gameId: {}, search: {}",
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

    return buildServiceTypesResponse(serviceTypePage);
  }

  /**
   * Search service types by name.
   *
   * @param searchTerm Search term
   * @return List of matching service types
   */
  public List<ServiceType> searchServiceTypesByName(String searchTerm) {
    log.debug("Searching service types by name: {}", searchTerm);

    List<ServiceTypeEntity> entities = serviceTypeRepository.searchByName(searchTerm);
    return serviceTypeMapper.toServiceTypeDtoList(entities);
  }

  /**
   * Get distinct categories from active service types.
   *
   * @return List of distinct categories
   */
  public List<String> getDistinctCategories() {
    log.debug("Getting distinct categories from active service types");

    return serviceTypeRepository.findDistinctCategories();
  }

  /**
   * Build service types response from page.
   *
   * @param serviceTypePage Page of service type entities
   * @return Service types response
   */
  private ServiceTypeListResponse buildServiceTypesResponse(
      Page<ServiceTypeEntity> serviceTypePage) {
    List<ServiceType> serviceTypes =
        serviceTypeMapper.toServiceTypeDtoList(serviceTypePage.getContent());

    return new ServiceTypeListResponse(
        serviceTypes,
        serviceTypePage.getTotalElements(),
        serviceTypePage.getTotalPages(),
        serviceTypePage.getSize(),
        serviceTypePage.getNumber(),
        serviceTypePage.getNumberOfElements(),
        serviceTypePage.isFirst(),
        serviceTypePage.isLast(),
        serviceTypePage.isEmpty());
  }
}
