package com.aksi.service.game;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.PriceConfigurationRepository;
import com.aksi.service.game.factory.PriceConfigurationFactory;
import com.aksi.service.game.util.PriceConfigurationQueryUtils;
import com.aksi.util.PaginationUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for price configuration-related read operations. Provides basic read operations
 * used by the main service layer.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationQueryService {

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final PriceConfigurationFactory priceConfigurationFactory;
  private final PriceConfigurationQueryUtils priceConfigurationQueryUtils;

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

    return priceConfigurationFactory.toDto(entity);
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

    // Use optimized query strategy
    Page<PriceConfigurationEntity> priceConfigurationPage =
        priceConfigurationQueryUtils.getPriceConfigurations(gameId, pageable);

    return priceConfigurationFactory.createListResponse(priceConfigurationPage);
  }
}
