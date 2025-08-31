package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.BoosterMapper;
import com.aksi.repository.BoosterRepository;
import com.aksi.repository.BoosterSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for booster-related read operations. All methods are read-only and optimized for
 * queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BoosterQueryService {

  private final BoosterRepository boosterRepository;
  private final BoosterMapper boosterMapper;

  /**
   * Get booster by ID.
   *
   * @param boosterId Booster ID
   * @return Booster entity
   * @throws NotFoundException if booster not found
   */
  public BoosterEntity getBoosterById(UUID boosterId) {
    log.debug("Getting booster by id: {}", boosterId);

    return boosterRepository
        .findById(boosterId)
        .orElseThrow(() -> new NotFoundException("Booster not found with id: " + boosterId));
  }

  /**
   * Get booster DTO by ID.
   *
   * @param boosterId Booster ID
   * @return Booster DTO
   * @throws NotFoundException if booster not found
   */
  public Booster getBoosterDtoById(UUID boosterId) {
    BoosterEntity entity = getBoosterById(boosterId);
    return boosterMapper.toBoosterDto(entity);
  }

  /**
   * Get booster by Discord username.
   *
   * @param discordUsername Discord username
   * @return Optional booster entity
   */
  public Optional<BoosterEntity> getBoosterByDiscordUsername(String discordUsername) {
    log.debug("Getting booster by Discord username: {}", discordUsername);

    // Use specification for consistent validation
    Specification<BoosterEntity> spec = BoosterSpecification.hasDiscordUsername(discordUsername);

    List<BoosterEntity> results = boosterRepository.findAll(spec);
    return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
  }

  /**
   * Get booster DTO by Discord username.
   *
   * @param discordUsername Discord username
   * @return Optional booster DTO
   */
  public Optional<Booster> getBoosterDtoByDiscordUsername(String discordUsername) {
    return getBoosterByDiscordUsername(discordUsername).map(boosterMapper::toBoosterDto);
  }

  /**
   * Get booster by contact email.
   *
   * @param contactEmail Contact email
   * @return Optional booster entity
   */
  public Optional<BoosterEntity> getBoosterByContactEmail(String contactEmail) {
    log.debug("Getting booster by contact email: {}", contactEmail);

    // Use specification for consistent validation
    Specification<BoosterEntity> spec = BoosterSpecification.hasContactEmail(contactEmail);

    List<BoosterEntity> results = boosterRepository.findAll(spec);
    return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
  }

  /**
   * Get top rated boosters.
   *
   * @return List of top rated booster DTOs
   */
  public List<Booster> getTopRatedBoosterDtos() {
    log.debug("Getting top rated boosters");

    List<BoosterEntity> entities = boosterRepository.findTopRatedBoosters();
    return boosterMapper.toBoosterDtoList(entities);
  }

  /**
   * Get highly rated boosters.
   *
   * @param minRating Minimum rating
   * @return List of highly rated boosters
   */
  public List<BoosterEntity> getHighlyRatedBoosters(Integer minRating) {
    log.debug("Getting highly rated boosters with min rating: {}", minRating);

    // Use specification for consistent filtering
    Specification<BoosterEntity> spec =
        Specification.allOf(
            BoosterSpecification.hasActive(true), // Only active boosters
            BoosterSpecification.hasRatingGreaterThan(minRating.floatValue()),
            BoosterSpecification.orderByRating());

    return boosterRepository.findAll(spec);
  }

  /**
   * Search boosters by name.
   *
   * @param searchTerm Search term
   * @return List of matching boosters
   */
  public List<BoosterEntity> searchBoostersByName(String searchTerm) {
    log.debug("Searching boosters by name: {}", searchTerm);

    // Use specification for consistent filtering
    Specification<BoosterEntity> spec =
        Specification.allOf(
            BoosterSpecification.hasActive(true), // Only active boosters
            BoosterSpecification.searchByNameOrContact(searchTerm),
            BoosterSpecification.orderByRating());

    return boosterRepository.findAll(spec);
  }

  /**
   * Get average rating of active boosters.
   *
   * @return Average rating
   */
  public Double getAverageRating() {
    log.debug("Getting average rating of active boosters");

    return boosterRepository.getAverageRating();
  }

  /**
   * Count active boosters.
   *
   * @return Number of active boosters
   */
  public long countActiveBoosters() {
    log.debug("Counting active boosters");

    return boosterRepository.countActiveBoosters();
  }

  /**
   * Get all active boosters as entities (for service layer processing).
   *
   * @return List of active booster entities
   */
  public List<BoosterEntity> getAllActiveBoosterEntities() {
    log.debug("Getting all active booster entities");

    // Use specification for consistent filtering
    Specification<BoosterEntity> spec =
        Specification.allOf(
            BoosterSpecification.hasActive(true), BoosterSpecification.orderByRating());

    return boosterRepository.findAll(spec);
  }

  /**
   * Get all active boosters as DTOs (for direct API responses).
   *
   * @return List of active booster DTOs
   */
  public List<Booster> getAllActiveBoosterDtos() {
    log.debug("Getting all active booster DTOs");
    List<BoosterEntity> entities = getAllActiveBoosterEntities();
    return boosterMapper.toBoosterDtoList(entities);
  }

  /**
   * Create booster list response (following project patterns).
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

    // Get filtered data
    List<BoosterEntity> entities = boosterRepository.findAll(spec);
    List<Booster> boosters = boosterMapper.toBoosterDtoList(entities);

    // Create response using project pattern
    return new BoosterListResponse(
        boosters,
        (long) boosters.size(),
        1, // totalPages
        boosters.size(), // size
        0, // number
        boosters.size(), // numberOfElements
        true, // first
        true, // last
        boosters.isEmpty()); // empty
  }

  /**
   * Create booster list response with search functionality.
   *
   * @param page Page number
   * @param size Page size
   * @param search Search term
   * @param active Active status filter
   * @return BoosterListResponse
   */
  public BoosterListResponse createBoosterListResponseWithSearch(
      Integer page, Integer size, String search, Boolean active) {

    log.debug(
        "Creating booster list response with search - page: {}, size: {}, search: '{}', active: {}",
        page,
        size,
        search,
        active);

    // Build specification for filtering
    List<Specification<BoosterEntity>> specs = new java.util.ArrayList<>();

    // Apply filters using specifications
    if (active != null) {
      specs.add(BoosterSpecification.hasActive(active));
    }
    if (search != null && !search.trim().isEmpty()) {
      specs.add(BoosterSpecification.searchByNameOrContact(search.trim()));
    }

    // Apply default ordering
    specs.add(BoosterSpecification.orderByRating());

    Specification<BoosterEntity> spec = Specification.allOf(specs);

    // Get filtered data
    List<BoosterEntity> entities = boosterRepository.findAll(spec);
    List<Booster> boosters = boosterMapper.toBoosterDtoList(entities);

    // Create response using project pattern
    return new BoosterListResponse(
        boosters,
        (long) boosters.size(),
        1, // totalPages
        boosters.size(), // size
        0, // number
        boosters.size(), // numberOfElements
        true, // first
        true, // last
        boosters.isEmpty()); // empty
  }
}
