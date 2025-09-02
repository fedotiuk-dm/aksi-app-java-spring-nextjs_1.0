package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateDifficultyLevelRequest;
import com.aksi.api.game.dto.DifficultyLevel;
import com.aksi.api.game.dto.DifficultyLevelListResponse;
import com.aksi.api.game.dto.UpdateDifficultyLevelRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of DifficultyLevelService providing all difficulty level-related operations.
 * Delegates to command and query services for specific operations.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DifficultyLevelServiceImpl implements DifficultyLevelService {

  private final DifficultyLevelCommandService commandService;
  private final DifficultyLevelQueryService queryService;

  // Command operations (write)

  @Override
  public DifficultyLevel createDifficultyLevel(CreateDifficultyLevelRequest request) {
    return commandService.createDifficultyLevel(request);
  }

  @Override
  public DifficultyLevel updateDifficultyLevel(
      UUID difficultyLevelId, UpdateDifficultyLevelRequest request) {
    return commandService.updateDifficultyLevel(difficultyLevelId, request);
  }

  @Override
  public void deleteDifficultyLevel(UUID difficultyLevelId) {
    commandService.deleteDifficultyLevel(difficultyLevelId);
  }

  @Override
  public DifficultyLevel setActive(UUID difficultyLevelId, boolean active) {
    return active
        ? commandService.activateDifficultyLevel(difficultyLevelId)
        : commandService.deactivateDifficultyLevel(difficultyLevelId);
  }

  // Query operations (read)

  @Override
  @Transactional(readOnly = true)
  public DifficultyLevel getDifficultyLevelById(UUID difficultyLevelId) {
    return queryService.getDifficultyLevelById(difficultyLevelId);
  }

  @Override
  @Transactional(readOnly = true)
  public DifficultyLevelListResponse listDifficultyLevels(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      Boolean active,
      UUID gameId,
      String search) {
    return queryService.listDifficultyLevels(page, size, sortBy, sortOrder, active, gameId, search);
  }
}
