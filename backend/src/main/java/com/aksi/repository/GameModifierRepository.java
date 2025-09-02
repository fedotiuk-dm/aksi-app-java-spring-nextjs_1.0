package com.aksi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.GameModifierEntity;

@Repository
public interface GameModifierRepository
    extends JpaRepository<GameModifierEntity, String>, JpaSpecificationExecutor<GameModifierEntity> {

  boolean existsByCodeAndGameCode(String code, String gameCode);

  /** Find active modifiers for a game using specifications. */
  default List<GameModifierEntity> findByActiveTrueOrderBySortOrderAsc(String gameCode) {
    return findAll(GameModifierSpecification.findActiveModifiersForGame(gameCode));
  }

  /** Find modifiers by game code and service type. */
  List<GameModifierEntity> findByGameCodeAndServiceTypeCodesContainingAndActiveTrue(
      String gameCode, String serviceTypeCode);
}
