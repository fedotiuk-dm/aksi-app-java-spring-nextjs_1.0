package com.aksi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;

@Repository
public interface DifficultyLevelRepository
    extends JpaRepository<DifficultyLevelEntity, java.util.UUID>,
        JpaSpecificationExecutor<DifficultyLevelEntity> {

  Optional<DifficultyLevelEntity> findByCode(String code);

  boolean existsByCode(String code);

  List<DifficultyLevelEntity> findByGame(GameEntity game);

  List<DifficultyLevelEntity> findByGameId(java.util.UUID gameId);

  List<DifficultyLevelEntity> findByGameAndActiveTrue(GameEntity game);

  List<DifficultyLevelEntity> findByGameIdAndActiveTrue(java.util.UUID gameId);

  List<DifficultyLevelEntity> findByGameIdAndActiveTrueOrderBySortOrderAsc(java.util.UUID gameId);

  List<DifficultyLevelEntity> findByActiveTrueOrderBySortOrderAsc();

  List<DifficultyLevelEntity> findByGameAndActiveTrueOrderBySortOrderAsc(GameEntity game);

  @Query(
      "SELECT dl FROM DifficultyLevelEntity dl WHERE dl.game.id = :gameId AND dl.active = true ORDER BY dl.sortOrder ASC")
  List<DifficultyLevelEntity> findActiveByGameIdOrderBySortOrder(
      @Param("gameId") java.util.UUID gameId);

  @Query("SELECT dl FROM DifficultyLevelEntity dl WHERE dl.active = true ORDER BY dl.sortOrder ASC")
  List<DifficultyLevelEntity> findAllActiveOrderBySortOrder();

  @Query(
      "SELECT DISTINCT dl.code FROM DifficultyLevelEntity dl WHERE dl.active = true ORDER BY dl.code")
  List<String> findDistinctCodes();

  boolean existsByGameIdAndCode(java.util.UUID gameId, String code);

  Optional<DifficultyLevelEntity> findByGameIdAndCode(java.util.UUID gameId, String code);

  @Query(
      "SELECT dl FROM DifficultyLevelEntity dl WHERE "
          + "(:active IS NULL OR dl.active = :active) AND "
          + "(:gameId IS NULL OR dl.game.id = :gameId) AND "
          + "(:search IS NULL OR LOWER(dl.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(dl.code) LIKE LOWER(CONCAT('%', :search, '%')))")
  org.springframework.data.domain.Page<DifficultyLevelEntity> findDifficultyLevelsWithSearch(
      @Param("active") Boolean active,
      @Param("gameId") java.util.UUID gameId,
      @Param("search") String search,
      org.springframework.data.domain.Pageable pageable);
}
