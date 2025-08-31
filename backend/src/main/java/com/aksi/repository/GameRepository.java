package com.aksi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.GameEntity;

@Repository
public interface GameRepository
    extends JpaRepository<GameEntity, java.util.UUID>, JpaSpecificationExecutor<GameEntity> {

  Optional<GameEntity> findByCode(String code);

  boolean existsByCode(String code);

  List<GameEntity> findByActiveTrue();

  List<GameEntity> findByCategory(String category);

  List<GameEntity> findByActiveTrueOrderBySortOrderAsc();

  @Query(
      "SELECT g FROM GameEntity g WHERE g.active = true AND g.category = :category ORDER BY g.sortOrder ASC")
  List<GameEntity> findActiveByCategoryOrderBySortOrder(@Param("category") String category);

  @Query("SELECT DISTINCT g.category FROM GameEntity g WHERE g.active = true ORDER BY g.category")
  List<String> findDistinctCategories();

  @Query(
      "SELECT g FROM GameEntity g WHERE g.active = true AND LOWER(g.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY g.sortOrder ASC")
  List<GameEntity> searchByName(@Param("searchTerm") String searchTerm);

  @Query(
      "SELECT g FROM GameEntity g WHERE "
          + "(:active IS NULL OR g.active = :active) AND "
          + "(:search IS NULL OR LOWER(g.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.code) LIKE LOWER(CONCAT('%', :search, '%')))")
  org.springframework.data.domain.Page<GameEntity> findGamesWithSearchAndPagination(
      @Param("active") Boolean active,
      @Param("search") String search,
      org.springframework.data.domain.Pageable pageable);
}
