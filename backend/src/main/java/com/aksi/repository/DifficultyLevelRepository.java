package com.aksi.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.DifficultyLevelEntity;

@Repository
public interface DifficultyLevelRepository
    extends JpaRepository<DifficultyLevelEntity, UUID>,
        JpaSpecificationExecutor<DifficultyLevelEntity> {

  Optional<DifficultyLevelEntity> findByCode(String code);

  boolean existsByGameIdAndCode(UUID gameId, String code);

  Optional<DifficultyLevelEntity> findByGameIdAndCode(UUID gameId, String code);

  /**
   * Find difficulty levels with search and pagination using specifications. This method uses
   * DifficultyLevelSpecification.filterDifficultyLevels()
   */
  default Page<DifficultyLevelEntity> findDifficultyLevelsWithSearch(
      Boolean active, UUID gameId, String search, Pageable pageable) {

    return findAll(
        DifficultyLevelSpecification.filterDifficultyLevels(active, gameId, search), pageable);
  }
}
