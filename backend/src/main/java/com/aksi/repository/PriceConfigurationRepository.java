package com.aksi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;

@Repository
public interface PriceConfigurationRepository
    extends JpaRepository<PriceConfigurationEntity, java.util.UUID>,
        JpaSpecificationExecutor<PriceConfigurationEntity> {

  List<PriceConfigurationEntity> findByGame(GameEntity game);

  List<PriceConfigurationEntity> findByGameId(java.util.UUID gameId);

  List<PriceConfigurationEntity> findByDifficultyLevel(DifficultyLevelEntity difficultyLevel);

  List<PriceConfigurationEntity> findByServiceType(ServiceTypeEntity serviceType);

  List<PriceConfigurationEntity> findByGameAndActiveTrue(GameEntity game);

  List<PriceConfigurationEntity> findByGameIdAndActiveTrue(java.util.UUID gameId);

  Optional<PriceConfigurationEntity> findByGameAndDifficultyLevelAndServiceTypeAndActiveTrue(
      GameEntity game, DifficultyLevelEntity difficultyLevel, ServiceTypeEntity serviceType);

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.game.id = :gameId AND pc.difficultyLevel.id = :difficultyLevelId AND pc.serviceType.id = :serviceTypeId AND pc.active = true")
  Optional<PriceConfigurationEntity> findByIdsAndActive(
      @Param("gameId") java.util.UUID gameId,
      @Param("difficultyLevelId") java.util.UUID difficultyLevelId,
      @Param("serviceTypeId") java.util.UUID serviceTypeId);

  Optional<PriceConfigurationEntity> findByGameIdAndDifficultyLevelIdAndServiceTypeId(
      java.util.UUID gameId, java.util.UUID difficultyLevelId, java.util.UUID serviceTypeId);

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.active = true ORDER BY pc.sortOrder ASC")
  List<PriceConfigurationEntity> findAllActiveOrderBySortOrder();

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.game.id = :gameId AND pc.active = true ORDER BY pc.sortOrder ASC")
  List<PriceConfigurationEntity> findActiveByGameIdOrderBySortOrder(
      @Param("gameId") java.util.UUID gameId);

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.isDefault = true AND pc.active = true")
  List<PriceConfigurationEntity> findDefaultConfigurations();

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.game.id = :gameId AND pc.isDefault = true AND pc.active = true")
  List<PriceConfigurationEntity> findDefaultByGameId(@Param("gameId") java.util.UUID gameId);

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.active = true ORDER BY pc.basePrice ASC")
  List<PriceConfigurationEntity> findAllActiveOrderByPriceAsc();

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.active = true ORDER BY pc.basePrice DESC")
  List<PriceConfigurationEntity> findAllActiveOrderByPriceDesc();

  @Query(
      "SELECT COUNT(pc) FROM PriceConfigurationEntity pc WHERE pc.game.id = :gameId AND pc.active = true")
  long countActiveByGameId(@Param("gameId") java.util.UUID gameId);

  // Paginated methods for efficient database queries

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.active = true ORDER BY pc.sortOrder ASC")
  Page<PriceConfigurationEntity> findAllActiveOrderBySortOrder(Pageable pageable);

  @Query(
      "SELECT pc FROM PriceConfigurationEntity pc WHERE pc.game.id = :gameId AND pc.active = true ORDER BY pc.sortOrder ASC")
  Page<PriceConfigurationEntity> findActiveByGameIdOrderBySortOrder(
      @Param("gameId") java.util.UUID gameId, Pageable pageable);
}
