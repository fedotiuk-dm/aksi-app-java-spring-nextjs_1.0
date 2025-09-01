package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.BoosterRepository;
import com.aksi.repository.BoosterSpecification;
import com.aksi.service.game.factory.BoosterFactory;
import com.aksi.util.PaginationUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for booster-related read operations. All methods are read-only and optimized for
 * queries. Uses BoosterFactory for consistent DTO conversions.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BoosterQueryService {

  private final BoosterRepository boosterRepository;
  private final BoosterFactory boosterFactory;

  /**
   * Get booster DTO by ID.
   *
   * @param boosterId Booster ID
   * @return Booster DTO
   * @throws NotFoundException if booster not found
   */
  public Booster getBoosterDtoById(UUID boosterId) {
    log.debug("Getting booster by id: {}", boosterId);

    BoosterEntity entity =
        boosterRepository
            .findById(boosterId)
            .orElseThrow(() -> new NotFoundException("Booster not found with id: " + boosterId));

    return boosterFactory.toDto(entity);
  }

  /**
   * Create booster list response with filtering and pagination.
   *
   * @param page Page number
   * @param size Page size
   * @param gameId Game ID filter
   * @param minRating Minimum rating filter
   * @param active Active status filter
   * @return BoosterListResponse
   */
  public BoosterListResponse createBoosterListResponse(
      Integer page, Integer size, UUID gameId, Integer minRating, Boolean active) {

    log.debug(
        "Creating booster list response - page: {}, size: {}, gameId: {}, minRating: {}, active: {}",
        page,
        size,
        gameId,
        minRating,
        active);

    // Create pageable
    Pageable pageable = PaginationUtil.createPageable(page, size, "rating", "desc");

    // Build specification for filtering
    List<Specification<BoosterEntity>> specs = new java.util.ArrayList<>();

    // Apply filters using specifications
    if (active != null) {
      specs.add(BoosterSpecification.hasActive(active));
    }
    if (minRating != null) {
      specs.add(BoosterSpecification.hasRatingGreaterThan(minRating.floatValue()));
    }
    if (gameId != null) {
      specs.add(BoosterSpecification.hasGameSpecialization(gameId));
    }

    // Apply default ordering
    specs.add(BoosterSpecification.orderByRating());

    Specification<BoosterEntity> spec = Specification.allOf(specs);

    // Get filtered data with pagination
    Page<BoosterEntity> boosterPage = boosterRepository.findAll(spec, pageable);

    // Create response using factory
    return boosterFactory.createListResponse(boosterPage);
  }

  /**
   * Create booster list response with search functionality and pagination.
   *
   * @param searchTerm Search term
   * @param active Active status filter
   * @param page Page number
   * @param size Page size
   * @return BoosterListResponse
   */
  public BoosterListResponse createBoosterSearchResponse(
      String searchTerm, Boolean active, Integer page, Integer size) {
    log.debug(
        "Creating booster search response - search: '{}', active: {}, page: {}, size: {}",
        searchTerm,
        active,
        page,
        size);

    // Create pageable
    Pageable pageable = PaginationUtil.createPageable(page, size, "rating", "desc");

    // Build specification for filtering
    List<Specification<BoosterEntity>> specs = new java.util.ArrayList<>();

    // Apply filters using specifications
    if (active != null) {
      specs.add(BoosterSpecification.hasActive(active));
    }
    if (searchTerm != null && !searchTerm.trim().isEmpty()) {
      specs.add(BoosterSpecification.searchByNameOrContact(searchTerm.trim()));
    }

    // Apply default ordering
    specs.add(BoosterSpecification.orderByRating());

    Specification<BoosterEntity> spec = Specification.allOf(specs);

    // Get filtered data with pagination
    Page<BoosterEntity> boosterPage = boosterRepository.findAll(spec, pageable);

    // Create response using factory
    return boosterFactory.createListResponse(boosterPage);
  }
}
