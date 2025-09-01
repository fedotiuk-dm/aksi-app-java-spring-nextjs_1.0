package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.PriceConfigurationEntity;

public class PriceConfigurationSpecification {

  public static Specification<PriceConfigurationEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<PriceConfigurationEntity> hasGameId(UUID gameId) {
    return SpecificationUtils.hasGameId(gameId);
  }

  public static Specification<PriceConfigurationEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  public static Specification<PriceConfigurationEntity> hasIsDefault(Boolean isDefault) {
    return SpecificationUtils.hasIsDefault(isDefault);
  }

  public static Specification<PriceConfigurationEntity> hasDifficultyLevelId(
      UUID difficultyLevelId) {
    return SpecificationUtils.hasDifficultyLevelId(difficultyLevelId);
  }

  public static Specification<PriceConfigurationEntity> hasServiceTypeId(UUID serviceTypeId) {
    return SpecificationUtils.hasServiceTypeId(serviceTypeId);
  }

  /** Creates a specification for finding active price configurations by game ID. */
  public static Specification<PriceConfigurationEntity> findActiveByGameId(UUID gameId) {
    return Specification.allOf(hasActive(true), hasGameId(gameId));
  }

  /** Creates a specification for finding all active price configurations ordered by sort order. */
  public static Specification<PriceConfigurationEntity> findAllActiveOrderedBySortOrder() {
    return Specification.allOf(hasActive(true), orderBySortOrder());
  }

  /** Creates a specification for finding active price configurations by game ID with ordering. */
  public static Specification<PriceConfigurationEntity> findActiveByGameIdOrderedBySortOrder(
      UUID gameId) {
    return Specification.allOf(hasActive(true), hasGameId(gameId), orderBySortOrder());
  }

  /** Creates a specification for finding default price configurations. */
  public static Specification<PriceConfigurationEntity> findDefaultConfigurations() {
    return Specification.allOf(hasActive(true), hasIsDefault(true));
  }

  /** Creates a specification for finding default price configurations by game ID. */
  public static Specification<PriceConfigurationEntity> findDefaultByGameId(UUID gameId) {
    return Specification.allOf(hasActive(true), hasGameId(gameId), hasIsDefault(true));
  }

  /** Creates a specification for counting active price configurations by game ID. */
  public static Specification<PriceConfigurationEntity> countActiveByGameId(UUID gameId) {
    return Specification.allOf(hasActive(true), hasGameId(gameId));
  }

  /**
   * Creates a specification for finding price configuration by game, difficulty level and service
   * type combination.
   */
  public static Specification<PriceConfigurationEntity> findByGameDifficultyLevelAndServiceType(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    return Specification.allOf(
        hasActive(true),
        hasGameId(gameId),
        hasDifficultyLevelId(difficultyLevelId),
        hasServiceTypeId(serviceTypeId));
  }

  /** Creates a specification for finding all price configurations by game ID. */
  public static Specification<PriceConfigurationEntity> findByGameId(UUID gameId) {
    return hasGameId(gameId);
  }
}
