package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.DifficultyLevel;
import com.aksi.api.game.dto.DifficultyLevelListResponse;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.DifficultyLevelMapper;
import com.aksi.repository.DifficultyLevelRepository;
import com.aksi.util.PaginationUtil;
import com.aksi.util.ResponseBuilderUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for difficulty level-related read operations. All methods are read-only and
 * optimized for queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class DifficultyLevelQueryService {

  private final DifficultyLevelRepository difficultyLevelRepository;
  private final DifficultyLevelMapper difficultyLevelMapper;

  /**
   * Get difficulty level by ID.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Difficulty level information
   * @throws NotFoundException if difficulty level not found
   */
  public DifficultyLevel getDifficultyLevelById(UUID difficultyLevelId) {
    log.debug("Getting difficulty level by id: {}", difficultyLevelId);

    DifficultyLevelEntity difficultyLevelEntity = findByIdOrThrow(difficultyLevelId);
    return difficultyLevelMapper.toDifficultyLevelDto(difficultyLevelEntity);
  }

  /**
   * Find difficulty level entity by ID (internal method).
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Optional difficulty level entity
   */
  public Optional<DifficultyLevelEntity> findById(UUID difficultyLevelId) {
    return difficultyLevelRepository.findById(difficultyLevelId);
  }

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
  public DifficultyLevelListResponse listDifficultyLevels(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      Boolean active,
      UUID gameId,
      String search) {
    log.debug(
        "Listing difficulty levels - page: {}, size: {}, sortBy: {}, sortOrder: {}, active: {}, gameId: {}, search: '{}'",
        page,
        size,
        sortBy,
        sortOrder,
        active,
        gameId,
        search);

    // Create pageable and search
    Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortOrder);

    Page<DifficultyLevelEntity> difficultyLevelPage =
        difficultyLevelRepository.findDifficultyLevelsWithSearch(active, gameId, search, pageable);

    return buildDifficultyLevelsResponse(difficultyLevelPage);
  }

  /**
   * Build difficulty levels response from page.
   *
   * @param difficultyLevelPage Page of difficulty level entities
   * @return Difficulty levels response
   */
  private DifficultyLevelListResponse buildDifficultyLevelsResponse(
      Page<DifficultyLevelEntity> difficultyLevelPage) {

    List<DifficultyLevel> difficultyLevels =
        difficultyLevelMapper.toDifficultyLevelDtoList(difficultyLevelPage.getContent());

    ResponseBuilderUtil.PaginationData pagination =
        ResponseBuilderUtil.extractPaginationData(difficultyLevelPage);

    return new DifficultyLevelListResponse(
        difficultyLevels,
        pagination.totalElements,
        pagination.totalPages,
        pagination.size,
        pagination.number,
        pagination.numberOfElements,
        pagination.first,
        pagination.last,
        pagination.empty);
  }

  /**
   * Helper method to get difficulty level entity or throw exception.
   *
   * @param difficultyLevelId difficulty level ID
   * @return difficulty level entity
   * @throws NotFoundException if difficulty level not found
   */
  /**
   * Check if difficulty level exists by game ID and code.
   *
   * @param gameId Game ID
   * @param code Difficulty level code
   * @return true if difficulty level exists
   */
  public boolean existsByGameIdAndCode(UUID gameId, String code) {
    return difficultyLevelRepository.existsByGameIdAndCode(gameId, code);
  }

  /**
   * Check if difficulty level exists by ID.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return true if difficulty level exists
   */
  public boolean existsById(UUID difficultyLevelId) {
    return difficultyLevelRepository.existsById(difficultyLevelId);
  }

  private DifficultyLevelEntity findByIdOrThrow(UUID difficultyLevelId) {
    return difficultyLevelRepository
        .findById(difficultyLevelId)
        .orElseThrow(
            () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));
  }
}
