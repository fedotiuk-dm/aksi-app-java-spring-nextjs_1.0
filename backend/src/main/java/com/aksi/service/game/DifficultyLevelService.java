package com.aksi.service.game;

import java.util.UUID;

import com.aksi.api.game.dto.CreateDifficultyLevelRequest;
import com.aksi.api.game.dto.DifficultyLevel;
import com.aksi.api.game.dto.DifficultyLevelListResponse;
import com.aksi.api.game.dto.UpdateDifficultyLevelRequest;

/**
 * Difficulty level service interface providing all difficulty level-related operations. Combines
 * command and query operations for difficulty level management.
 */
public interface DifficultyLevelService {

  // Command operations (write)

  /**
   * Create new difficulty level.
   *
   * @param request Create difficulty level request
   * @return Created difficulty level information
   */
  DifficultyLevel createDifficultyLevel(CreateDifficultyLevelRequest request);

  /**
   * Update existing difficulty level.
   *
   * @param difficultyLevelId Difficulty level ID
   * @param request Update difficulty level request
   * @return Updated difficulty level information
   */
  DifficultyLevel updateDifficultyLevel(
      UUID difficultyLevelId, UpdateDifficultyLevelRequest request);

  /**
   * Delete difficulty level.
   *
   * @param difficultyLevelId Difficulty level ID
   */
  void deleteDifficultyLevel(UUID difficultyLevelId);

  /**
   * Set difficulty level active status.
   *
   * @param difficultyLevelId Difficulty level ID
   * @param active Active status
   * @return Updated difficulty level information
   */
  DifficultyLevel setActive(UUID difficultyLevelId, boolean active);

  // Query operations (read)

  /**
   * Get difficulty level by ID.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Difficulty level information
   */
  DifficultyLevel getDifficultyLevelById(UUID difficultyLevelId);

  /**
   * List difficulty levels with pagination and filtering.
   *
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param sortBy Sort field
   * @param sortOrder Sort direction
   * @param active Filter by active status
   * @param gameId Filter by game ID
   * @param search Search by name or code
   * @return Difficulty levels response with pagination
   */
  DifficultyLevelListResponse listDifficultyLevels(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      Boolean active,
      UUID gameId,
      String search);
}
