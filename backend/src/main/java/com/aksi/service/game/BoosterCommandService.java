package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.BoosterMapper;
import com.aksi.repository.BoosterRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Command service for booster write operations. */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BoosterCommandService {

  private final BoosterRepository boosterRepository;
  private final BoosterMapper boosterMapper;
  private final BoosterValidationService validationService;

  public Booster createBooster(CreateBoosterRequest request) {
    log.info("Creating booster with Discord username: {}", request.getDiscordUsername());

    validationService.validateForCreate(request);

    BoosterEntity entity = boosterMapper.toBoosterEntity(request);
    BoosterEntity savedEntity = boosterRepository.save(entity);

    log.info("Created booster with id: {}", savedEntity.getId());
    return boosterMapper.toBoosterDto(savedEntity);
  }

  public Booster updateBooster(UUID boosterId, UpdateBoosterRequest request) {
    log.info("Updating booster: {}", boosterId);

    BoosterEntity existingEntity =
        boosterRepository
            .findById(boosterId)
            .orElseThrow(() -> new NotFoundException("Booster not found: " + boosterId));

    validationService.validateForUpdate(request, existingEntity);

    BoosterEntity updatedEntity = boosterMapper.toBoosterEntity(request);
    updatedEntity.setId(boosterId);
    BoosterEntity savedEntity = boosterRepository.save(updatedEntity);

    log.info("Updated booster with id: {}", boosterId);
    return boosterMapper.toBoosterDto(savedEntity);
  }

  public void deleteBooster(UUID boosterId) {
    log.info("Deleting booster: {}", boosterId);

    if (!boosterRepository.existsById(boosterId)) {
      throw new NotFoundException("Booster not found: " + boosterId);
    }

    boosterRepository.deleteById(boosterId);
    log.info("Deleted booster with id: {}", boosterId);
  }

  public Booster incrementCompletedOrders(UUID boosterId) {
    log.info("Incrementing completed orders for booster: {}", boosterId);

    BoosterEntity entity =
        boosterRepository
            .findById(boosterId)
            .orElseThrow(() -> new NotFoundException("Booster not found: " + boosterId));

    entity.setCompletedOrders(entity.getCompletedOrders() + 1);
    BoosterEntity savedEntity = boosterRepository.save(entity);

    log.info("Incremented completed orders for booster: {}", boosterId);
    return boosterMapper.toBoosterDto(savedEntity);
  }

  public Booster updateBoosterRating(UUID boosterId, Integer newRating) {
    log.info("Updating rating for booster: {} to {}", boosterId, newRating);

    BoosterEntity entity =
        boosterRepository
            .findById(boosterId)
            .orElseThrow(() -> new NotFoundException("Booster not found: " + boosterId));

    entity.setRating(newRating);
    BoosterEntity savedEntity = boosterRepository.save(entity);

    log.info("Updated rating for booster: {}", boosterId);
    return boosterMapper.toBoosterDto(savedEntity);
  }
}
