package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.BoosterRepository;
import com.aksi.service.game.factory.BoosterFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for booster write operations. Uses BoosterFactory for consistent entity creation
 * and updates.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BoosterCommandService {

  private final BoosterRepository boosterRepository;
  private final BoosterValidationService validationService;
  private final BoosterFactory boosterFactory;

  /**
   * Create new booster.
   *
   * @param request Create request
   * @return Created booster DTO
   */
  public Booster createBooster(CreateBoosterRequest request) {
    log.info("Creating booster with Discord username: {}", request.getDiscordUsername());

    validationService.validateForCreate(request);

    BoosterEntity entity = boosterFactory.createEntity(request);
    BoosterEntity savedEntity = boosterRepository.save(entity);

    log.info("Created booster with id: {}", savedEntity.getId());
    return boosterFactory.toDto(savedEntity);
  }

  /**
   * Update existing booster.
   *
   * @param boosterId Booster ID
   * @param request Update request
   * @return Updated booster DTO
   */
  public Booster updateBooster(UUID boosterId, UpdateBoosterRequest request) {
    log.info("Updating booster: {}", boosterId);

    BoosterEntity existingEntity = findBoosterById(boosterId);
    validationService.validateForUpdate(request, existingEntity);

    BoosterEntity updatedEntity = boosterFactory.updateEntity(existingEntity, request);
    BoosterEntity savedEntity = boosterRepository.save(updatedEntity);

    log.info("Updated booster with id: {}", boosterId);
    return boosterFactory.toDto(savedEntity);
  }

  /**
   * Delete booster by ID.
   *
   * @param boosterId Booster ID
   */
  public void deleteBooster(UUID boosterId) {
    log.info("Deleting booster: {}", boosterId);

    if (!boosterRepository.existsById(boosterId)) {
      throw new NotFoundException("Booster not found: " + boosterId);
    }

    boosterRepository.deleteById(boosterId);
    log.info("Deleted booster with id: {}", boosterId);
  }

  /**
   * Find booster by ID with consistent error handling.
   *
   * @param boosterId Booster ID
   * @return Booster entity
   * @throws NotFoundException if not found
   */
  private BoosterEntity findBoosterById(UUID boosterId) {
    return boosterRepository
        .findById(boosterId)
        .orElseThrow(() -> new NotFoundException("Booster not found: " + boosterId));
  }
}
