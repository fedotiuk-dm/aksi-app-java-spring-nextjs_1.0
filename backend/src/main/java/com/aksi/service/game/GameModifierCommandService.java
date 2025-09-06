package com.aksi.service.game;

import java.util.UUID;

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
        log.info("🎯 Creating game modifier: {} for game: {}", request.getCode(), request.getGameCode());
        log.debug("🎯 Request details: name={}, type={}, operation={}, value={}",
                 request.getName(), request.getType(), request.getOperation(),
                 request.getValue());

        // Validate request
        gameModifierValidationService.validateCreateGameModifier(request);

        // Check if modifier code already exists for this game
        if (gameModifierRepository.existsByCodeAndGameCode(request.getCode(), request.getGameCode())) {
            log.warn("🎯 Modifier code already exists: {} for game: {}", request.getCode(), request.getGameCode());
            throw new BadRequestException("Modifier code already exists for this game: " + request.getCode());
        }

        GameModifierEntity entity = gameModifierMapper.toGameModifierEntity(request);
        log.debug("🎯 Mapped to entity: code={}, name={}, gameCode={}",
                 entity.getCode(), entity.getName(), entity.getGameCode());

        GameModifierEntity saved = gameModifierRepository.save(entity);
        log.info("✅ Created game modifier with ID: {} (code: {}, game: {})",
                saved.getId(), saved.getCode(), saved.getGameCode());

        GameModifierInfo response = gameModifierMapper.toGameModifierInfoDto(saved);
        log.debug("🎯 Returning response: code={}, name={}, type={}",
                 response.getCode(), response.getName(), response.getType());

        return response;
    }

    /**
     * Update an existing game modifier.
     */
    @Transactional
    public GameModifierInfo updateGameModifier(UUID modifierId, UpdateGameModifierRequest request) {
        log.info("Updating game modifier: {}", modifierId);

        // Validate request
        gameModifierValidationService.validateUpdateGameModifier(modifierId.toString(), request);

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
    public void deleteGameModifier(UUID modifierId) {
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
    public GameModifierInfo activateGameModifier(UUID modifierId) {
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
    public GameModifierInfo deactivateGameModifier(UUID modifierId) {
        log.info("Deactivating game modifier: {}", modifierId);

        GameModifierEntity entity = gameModifierRepository.findById(modifierId)
            .orElseThrow(() -> new NotFoundException("Game modifier not found: " + modifierId));

        entity.setActive(false);
        GameModifierEntity saved = gameModifierRepository.save(entity);

        log.info("Deactivated game modifier: {}", modifierId);
        return gameModifierMapper.toGameModifierInfoDto(saved);
    }
}
