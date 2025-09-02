package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.GameModifierMapper;
import com.aksi.repository.GameModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for GameModifier domain operations (create, update, delete).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameModifierCommandService {

    private final GameModifierRepository gameModifierRepository;
    private final GameModifierMapper gameModifierMapper;
  private final GameModifierValidationService gameModifierValidationService;

    /**
     * Create a new game modifier.
     */
    @Transactional
    public GameModifierInfo createGameModifier(CreateGameModifierRequest request) {
        log.info("Creating game modifier: {} for game: {}", request.getCode(), request.getGameCode());

        // Validate request
        gameModifierValidationService.validateCreateGameModifier(request);

        // Check if modifier code already exists for this game
        if (gameModifierRepository.existsByCodeAndGameCode(request.getCode(), request.getGameCode())) {
            throw new BadRequestException("Modifier code already exists for this game: " + request.getCode());
        }

        GameModifierEntity entity = gameModifierMapper.toGameModifierEntity(request);
        entity.setId(java.util.UUID.randomUUID());

        GameModifierEntity saved = gameModifierRepository.save(entity);
        log.info("Created game modifier with ID: {}", saved.getId());

        return gameModifierMapper.toGameModifierInfoDto(saved);
    }

    /**
     * Update an existing game modifier.
     */
    @Transactional
    public GameModifierInfo updateGameModifier(String modifierId, UpdateGameModifierRequest request) {
        log.info("Updating game modifier: {}", modifierId);

        // Validate request
        gameModifierValidationService.validateUpdateGameModifier(modifierId, request);

        GameModifierEntity entity = gameModifierRepository.findById(modifierId)
            .orElseThrow(() -> new NotFoundException("Game modifier not found: " + modifierId));

        gameModifierMapper.updateGameModifierFromDto(request, entity);

        GameModifierEntity saved = gameModifierRepository.save(entity);
        log.info("Updated game modifier: {}", modifierId);

        return gameModifierMapper.toGameModifierInfoDto(saved);
    }

    /**
     * Delete a game modifier.
     */
    @Transactional
    public void deleteGameModifier(String modifierId) {
        log.info("Deleting game modifier: {}", modifierId);

        if (!gameModifierRepository.existsById(modifierId)) {
            throw new NotFoundException("Game modifier not found: " + modifierId);
        }

        gameModifierRepository.deleteById(modifierId);
        log.info("Deleted game modifier: {}", modifierId);
    }

    /**
     * Activate a game modifier.
     */
    @Transactional
    public GameModifierInfo activateGameModifier(String modifierId) {
        log.info("Activating game modifier: {}", modifierId);

        GameModifierEntity entity = gameModifierRepository.findById(modifierId)
            .orElseThrow(() -> new NotFoundException("Game modifier not found: " + modifierId));

        entity.setActive(true);
        GameModifierEntity saved = gameModifierRepository.save(entity);

        log.info("Activated game modifier: {}", modifierId);
        return gameModifierMapper.toGameModifierInfoDto(saved);
    }

    /**
     * Deactivate a game modifier.
     */
    @Transactional
    public GameModifierInfo deactivateGameModifier(String modifierId) {
        log.info("Deactivating game modifier: {}", modifierId);

        GameModifierEntity entity = gameModifierRepository.findById(modifierId)
            .orElseThrow(() -> new NotFoundException("Game modifier not found: " + modifierId));

        entity.setActive(false);
        GameModifierEntity saved = gameModifierRepository.save(entity);

        log.info("Deactivated game modifier: {}", modifierId);
        return gameModifierMapper.toGameModifierInfoDto(saved);
    }
}
