package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.GameEntity;

@Repository
public interface GameRepository
    extends JpaRepository<GameEntity, UUID>, JpaSpecificationExecutor<GameEntity> {

  Optional<GameEntity> findByCode(String code);

  /** Find active games ordered by sort order using specifications. */
  default List<GameEntity> findByActiveTrueOrderBySortOrderAsc() {
    return findAll(GameSpecification.findActiveOrderedBySortOrder());
  }

  /** Find games with search and pagination using specifications. */
  default Page<GameEntity> findGamesWithSearchAndPagination(
      Boolean active, String search, Pageable pageable) {

    return findAll(GameSpecification.filterGames(active, search), pageable);
  }
}
