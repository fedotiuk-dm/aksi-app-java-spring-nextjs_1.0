package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceConfigurationMapper;
import com.aksi.repository.PriceConfigurationRepository;
import com.aksi.util.PaginationUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for price configuration-related read operations. All methods are read-only and
 * optimized for queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationQueryService {

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final PriceConfigurationMapper priceConfigurationMapper;

  /**
   * Get price configuration by ID.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Price configuration
   * @throws NotFoundException if price configuration not found
   */
  public PriceConfiguration getPriceConfigurationById(UUID priceConfigurationId) {
    log.debug("Getting price configuration by id: {}", priceConfigurationId);

    PriceConfigurationEntity entity =
        priceConfigurationRepository
            .findById(priceConfigurationId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price configuration not found with id: " + priceConfigurationId));

    return priceConfigurationMapper.toPriceConfigurationDto(entity);
  }

  /**
   * Check if price configuration exists by ID.
   *
   * @param priceConfigurationId Price configuration ID
   * @return true if price configuration exists
   */
  public boolean existsById(UUID priceConfigurationId) {
    return priceConfigurationRepository.existsById(priceConfigurationId);
  }

  /**
   * Get price configuration by combination of game, difficulty level and service type.
   *
   * @param gameId Game ID
   * @param difficultyLevelId Difficulty level ID
   * @param serviceTypeId Service type ID
   * @return Optional price configuration
   */
  public Optional<PriceConfiguration> getPriceConfigurationByCombination(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    log.debug(
        "Getting price configuration by combination: game={}, difficulty={}, service={}",
        gameId,
        difficultyLevelId,
        serviceTypeId);

    return priceConfigurationRepository
        .findByIdsAndActive(gameId, difficultyLevelId, serviceTypeId)
        .map(priceConfigurationMapper::toPriceConfigurationDto);
  }

  /**
   * Get all price configurations for a game.
   *
   * @param gameId Game ID
   * @return List of price configurations
   */
  public List<PriceConfiguration> getPriceConfigurationsByGameId(UUID gameId) {
    log.debug("Getting price configurations by game id: {}", gameId);

    List<PriceConfigurationEntity> entities =
        priceConfigurationRepository.findByGameIdAndActiveTrue(gameId);
    return priceConfigurationMapper.toPriceConfigurationDtoList(entities);
  }

  /**
   * Get all active price configurations.
   *
   * @return List of active price configurations
   */
  public List<PriceConfiguration> getAllActivePriceConfigurations() {
    log.debug("Getting all active price configurations");

    List<PriceConfigurationEntity> entities =
        priceConfigurationRepository.findAllActiveOrderBySortOrder();
    return priceConfigurationMapper.toPriceConfigurationDtoList(entities);
  }

  /**
   * Get default price configurations.
   *
   * @return List of default price configurations
   */
  public List<PriceConfiguration> getDefaultPriceConfigurations() {
    log.debug("Getting default price configurations");

    List<PriceConfigurationEntity> entities =
        priceConfigurationRepository.findDefaultConfigurations();
    return priceConfigurationMapper.toPriceConfigurationDtoList(entities);
  }

  /**
   * Get default price configurations for a specific game.
   *
   * @param gameId Game ID
   * @return List of default price configurations for the game
   */
  public List<PriceConfiguration> getDefaultPriceConfigurationsByGameId(UUID gameId) {
    log.debug("Getting default price configurations for game: {}", gameId);

    List<PriceConfigurationEntity> entities =
        priceConfigurationRepository.findDefaultByGameId(gameId);
    return priceConfigurationMapper.toPriceConfigurationDtoList(entities);
  }

  /**
   * Get paginated price configurations with search and filtering.
   *
   * @param page Page number (0-based)
   * @param size Page size
   * @param sortBy Sort field
   * @param sortOrder Sort direction ("asc" or "desc")
   * @param gameId Filter by game ID
   * @param difficultyLevelId Filter by difficulty level ID
   * @param serviceTypeId Filter by service type ID
   * @param active Filter by active status
   * @param minBasePrice Filter by minimum base price
   * @param maxBasePrice Filter by maximum base price
   * @return Paginated price configurations response
   */
  public PriceConfigurationListResponse getPriceConfigurations(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      UUID gameId,
      UUID difficultyLevelId,
      UUID serviceTypeId,
      Boolean active,
      Integer minBasePrice,
      Integer maxBasePrice) {

    log.debug(
        "Getting price configurations with pagination - page: {}, size: {}, sortBy: {}, "
            + "sortOrder: {}, gameId: {}, difficultyLevelId: {}, serviceTypeId: {}, "
            + "active: {}, minBasePrice: {}, maxBasePrice: {}",
        page,
        size,
        sortBy,
        sortOrder,
        gameId,
        difficultyLevelId,
        serviceTypeId,
        active,
        minBasePrice,
        maxBasePrice);

    // Create pageable
    Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortOrder);

    // Use proper database pagination for efficiency
    Page<PriceConfigurationEntity> priceConfigurationPage;

    if (gameId != null) {
      priceConfigurationPage =
          priceConfigurationRepository.findActiveByGameIdOrderBySortOrder(gameId, pageable);
    } else {
      priceConfigurationPage = priceConfigurationRepository.findAllActiveOrderBySortOrder(pageable);
    }

    return buildPriceConfigurationsResponse(priceConfigurationPage);
  }

  /**
   * Count active price configurations for a game.
   *
   * @param gameId Game ID
   * @return Count of active price configurations
   */
  public long countActiveByGameId(UUID gameId) {
    log.debug("Counting active price configurations for game: {}", gameId);

    return priceConfigurationRepository.countActiveByGameId(gameId);
  }

  /**
   * Build price configurations response from page.
   *
   * @param priceConfigurationPage Page of price configuration entities
   * @return Price configurations response
   */
  private PriceConfigurationListResponse buildPriceConfigurationsResponse(
      Page<PriceConfigurationEntity> priceConfigurationPage) {
    List<PriceConfiguration> priceConfigurations =
        priceConfigurationMapper.toPriceConfigurationDtoList(priceConfigurationPage.getContent());

    return new PriceConfigurationListResponse(
        priceConfigurations,
        priceConfigurationPage.getTotalElements(),
        priceConfigurationPage.getTotalPages(),
        priceConfigurationPage.getSize(),
        priceConfigurationPage.getNumber(),
        priceConfigurationPage.getNumberOfElements(),
        priceConfigurationPage.isFirst(),
        priceConfigurationPage.isLast(),
        priceConfigurationPage.isEmpty());
  }
}
