package com.aksi.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.GameModifierEntity;

@Repository
public interface GameModifierRepository
    extends JpaRepository<GameModifierEntity, UUID>, JpaSpecificationExecutor<GameModifierEntity> {

  List<GameModifierEntity> findByCode(String code);

  List<GameModifierEntity> findByGameCode(String gameCode);

  boolean existsByCodeAndGameCode(String code, String gameCode);

  /** Find active modifiers for a game using specifications. */
  default List<GameModifierEntity> findByActiveTrueOrderBySortOrderAsc(String gameCode) {
    return findAll(GameModifierSpecification.findActiveModifiersForGame(gameCode));
  }

  /** Find modifiers by game code and service type. */
  List<GameModifierEntity> findByGameCodeAndServiceTypeCodesContainingAndActiveTrue(
      String gameCode, String serviceTypeCode);

  /** Find active modifiers by list of codes. */
  List<GameModifierEntity> findByCodeInAndActive(List<String> codes, Boolean active);
}
