package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.UpdateGameRequest;
import com.aksi.domain.game.GameEntity;
import com.aksi.mapper.GameMapper;
import com.aksi.repository.GameRepository;
import com.aksi.service.game.util.EntityQueryUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for game operations (create, update, delete).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameCommandService {

    private final GameRepository gameRepository;
    private final GameMapper gameMapper;
    private final EntityQueryUtils entityQueryUtils;
    private final GameValidationService gameValidationService;

    // Game operations

    /**
     * Create a new game.
     */
    @Transactional
    public Game createGame(CreateGameRequest request) {
        log.info("Creating game: {}", request.getName());

        // Validate request
        gameValidationService.validateCreateGame(request);

        GameEntity entity = gameMapper.toGameEntity(request);
        entity.setActive(true);

        GameEntity saved = gameRepository.save(entity);
        log.info("Created game with ID: {}", saved.getId());

        return gameMapper.toGameDto(saved);
    }

    /**
     * Update an existing game.
     */
    @Transactional
    public Game updateGame(UUID gameId, UpdateGameRequest request) {
        log.info("Updating game: {}", gameId);

        // Validate request
        gameValidationService.validateUpdateGame(gameId, request);

        GameEntity entity = entityQueryUtils.findGameEntity(gameId);
        gameMapper.updateGameFromDto(request, entity);

        GameEntity saved = gameRepository.save(entity);
        log.info("Updated game: {}", gameId);

        return gameMapper.toGameDto(saved);
    }

    /**
     * Delete a game.
     */
    @Transactional
    public void deleteGame(UUID gameId) {
        log.info("Deleting game: {}", gameId);

        gameValidationService.validateGameExistsForDeletion(gameId);
        gameRepository.deleteById(gameId);

        log.info("Deleted game: {}", gameId);
    }

    /**
     * Set game active status.
     */
    @Transactional
    public Game setActive(UUID gameId, boolean active) {
        log.info("Setting game {} active status to: {}", gameId, active);

        GameEntity entity = entityQueryUtils.findGameEntity(gameId);

        // Validate activation/deactivation
        gameValidationService.validateGameActivation(gameId, entity.getActive(), active);

        entity.setActive(active);
        GameEntity saved = gameRepository.save(entity);

        log.info("Set game {} active status to: {}", gameId, active);
        return gameMapper.toGameDto(saved);
    }
}
