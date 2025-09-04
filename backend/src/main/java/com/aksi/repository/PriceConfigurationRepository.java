package com.aksi.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.PriceConfigurationEntity;

@Repository
public interface PriceConfigurationRepository
    extends JpaRepository<PriceConfigurationEntity, UUID>,
        JpaSpecificationExecutor<PriceConfigurationEntity> {

  /**
   * Find active price configurations by game ID with pagination using specifications. Used in
   * PriceConfigurationQueryService.
   */
  default Page<PriceConfigurationEntity> findActiveByGameIdOrderBySortOrder(
      UUID gameId, Pageable pageable) {

    return findAll(
        PriceConfigurationSpecification.findActiveByGameIdOrderedBySortOrder(gameId), pageable);
  }

  /**
   * Find all active price configurations with pagination using specifications. Used in
   * PriceConfigurationQueryService.
   */
  default Page<PriceConfigurationEntity> findAllActiveOrderBySortOrder(Pageable pageable) {
    return findAll(PriceConfigurationSpecification.findAllActiveOrderedBySortOrder(), pageable);
  }

  /**
   * Find price configuration by game, difficulty level and service type combination using
   * specifications. Used in GameEntityQueryService.
   */
  default Optional<PriceConfigurationEntity> findByGameIdAndDifficultyLevelIdAndServiceTypeId(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    return findAll(
            PriceConfigurationSpecification.findByGameDifficultyLevelAndServiceType(
                gameId, difficultyLevelId, serviceTypeId))
        .stream()
        .findFirst();
  }

  /**
   * Find active price configuration by game, difficulty level and service type combination using
   * specifications. Used in PriceConfigurationValidationService and PriceConfigurationQueryService.
   */
  default Optional<PriceConfigurationEntity> findByIdsAndActive(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    return findAll(
            PriceConfigurationSpecification.findByGameDifficultyLevelAndServiceType(
                gameId, difficultyLevelId, serviceTypeId))
        .stream()
        .findFirst();
  }

}
