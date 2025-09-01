package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for Booster operations required for game services calculator. Delegates to
 * specialized command and query services for proper separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BoosterServiceImpl implements BoosterService {

  private final BoosterCommandService commandService;
  private final BoosterQueryService queryService;

  // Core CRUD operations

  @Override
  public Booster createBooster(CreateBoosterRequest request) {
    log.info("Creating booster: {}", request.getDiscordUsername());
    return commandService.createBooster(request);
  }

  @Override
  @Transactional(readOnly = true)
  public Booster getBoosterById(UUID boosterId) {
    return queryService.getBoosterDtoById(boosterId);
  }

  @Override
  public Booster updateBooster(UUID boosterId, UpdateBoosterRequest request) {
    log.info("Updating booster: {}", boosterId);
    return commandService.updateBooster(boosterId, request);
  }

  @Override
  public void deleteBooster(UUID boosterId) {
    log.info("Deleting booster: {}", boosterId);
    commandService.deleteBooster(boosterId);
  }

  // Essential list operations for UI

  @Override
  @Transactional(readOnly = true)
  public BoosterListResponse listBoosters(
      Integer page, Integer size, UUID gameId, Integer minRating, Boolean active) {

    return queryService.createBoosterListResponse(page, size, gameId, minRating, active);
  }

  // Search functionality for admin panel with pagination

  @Override
  @Transactional(readOnly = true)
  public BoosterListResponse searchBoosters(
      String searchTerm, Boolean active, Integer page, Integer size) {
    return queryService.createBoosterSearchResponse(searchTerm, active, page, size);
  }
}
