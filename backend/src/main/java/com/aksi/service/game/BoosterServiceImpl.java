package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.mapper.BoosterMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for Booster operations. Delegates to specialized command and query
 * services for proper separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BoosterServiceImpl implements BoosterService {

  private final BoosterCommandService commandService;
  private final BoosterQueryService queryService;
  private final BoosterMapper boosterMapper;

  // Create operations

  @Override
  public Booster createBooster(CreateBoosterRequest request) {
    log.info("Creating booster: {}", request.getDiscordUsername());
    return commandService.createBooster(request);
  }

  // Read operations

  @Override
  @Transactional(readOnly = true)
  public Booster getBoosterById(UUID boosterId) {
    return queryService.getBoosterDtoById(boosterId);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<Booster> getBoosterByDiscordUsername(String discordUsername) {
    return queryService.getBoosterDtoByDiscordUsername(discordUsername);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<Booster> getBoosterByContactEmail(String contactEmail) {
    return queryService.getBoosterByContactEmail(contactEmail).map(boosterMapper::toBoosterDto);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Booster> getAllActiveBoosters() {
    return queryService.getAllActiveBoosterDtos();
  }

  @Override
  @Transactional(readOnly = true)
  public List<Booster> getTopRatedBoosters() {
    return queryService.getTopRatedBoosterDtos();
  }

  @Override
  @Transactional(readOnly = true)
  public List<Booster> getHighlyRatedBoosters(Integer minRating) {
    return queryService.getHighlyRatedBoosters(minRating).stream()
        .map(boosterMapper::toBoosterDto)
        .toList();
  }

  // Update operations

  @Override
  public Booster updateBooster(UUID boosterId, UpdateBoosterRequest request) {
    log.info("Updating booster: {}", boosterId);
    return commandService.updateBooster(boosterId, request);
  }

  // Delete operations

  @Override
  public void deleteBooster(UUID boosterId) {
    log.info("Deleting booster: {}", boosterId);
    commandService.deleteBooster(boosterId);
  }

  // Special operations

  @Override
  public Booster incrementCompletedOrders(UUID boosterId) {
    log.info("Incrementing completed orders for booster: {}", boosterId);
    return commandService.incrementCompletedOrders(boosterId);
  }

  @Override
  public Booster updateBoosterRating(UUID boosterId, Integer newRating) {
    log.info("Updating rating for booster: {} to {}", boosterId, newRating);
    return commandService.updateBoosterRating(boosterId, newRating);
  }

  // Utility operations

  @Override
  @Transactional(readOnly = true)
  public List<Booster> searchBoostersByName(String searchTerm) {
    return queryService.searchBoostersByName(searchTerm).stream()
        .map(boosterMapper::toBoosterDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public Double getAverageRating() {
    return queryService.getAverageRating();
  }

  @Override
  @Transactional(readOnly = true)
  public long countActiveBoosters() {
    return queryService.countActiveBoosters();
  }

  @Override
  @Transactional(readOnly = true)
  public BoosterListResponse listBoosters(
      Integer page, Integer size, UUID gameId, Integer minRating, Boolean active) {

    // Delegate response creation to query service (following project patterns)
    return queryService.createBoosterListResponse(page, size, gameId, minRating, active);
  }

  @Override
  @Transactional(readOnly = true)
  public BoosterListResponse listBoosters(
      Integer page, Integer size, String search, Boolean active) {

    // Delegate response creation to query service with search parameter
    return queryService.createBoosterListResponseWithSearch(page, size, search, active);
  }
}
