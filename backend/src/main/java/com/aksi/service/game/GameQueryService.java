package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.domain.game.GameEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.GameMapper;
import com.aksi.repository.GameRepository;
import com.aksi.util.ResponseBuilderUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for game read operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class GameQueryService {

    private final GameRepository gameRepository;
    private final GameMapper gameMapper;

    // Game operations

    /**
     * Get game by ID.
     */
    public Game getGameById(UUID gameId) {
        log.info("Getting game by ID: {}", gameId);

        GameEntity entity = gameRepository.findById(gameId)
            .orElseThrow(() -> new NotFoundException("Game not found with ID: " + gameId));

        return gameMapper.toGameDto(entity);
    }

    /**
     * Get game by code.
     */
    public Game getGameByCode(String gameCode) {
        log.info("Getting game by code: {}", gameCode);

        GameEntity entity = gameRepository.findByCode(gameCode)
            .orElseThrow(() -> new NotFoundException("Game not found with code: " + gameCode));

        return gameMapper.toGameDto(entity);
    }

    /**
     * Get all active games.
     */
    public List<Game> getAllActiveGames() {
        log.info("Getting all active games");

        List<GameEntity> entities = gameRepository.findByActiveTrueOrderBySortOrderAsc();
        return gameMapper.toGameDtoList(entities);
    }

    /**
     * List games with optional filtering and pagination.
     */
    public GameListResponse listGames(int page, int size, String sortBy, String sortOrder, Boolean active, String search) {
        log.info("Listing games - page: {}, size: {}, sortBy: {}, sortOrder: {}, active: {}, search: {}",
                page, size, sortBy, sortOrder, active, search);

        // Build pageable
        Sort sort = createSort(sortBy, sortOrder);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Use repository method with specifications for filtering
        Page<GameEntity> entitiesPage = gameRepository.findGamesWithSearchAndPagination(active, search, pageable);

        log.info("Found {} games in database", entitiesPage.getTotalElements());

        // Convert to DTOs
        List<Game> games = gameMapper.toGameDtoList(entitiesPage.getContent());

        log.info("Converted {} games to DTOs", games.size());

        // Create response with pagination data using reflection for generated classes
        return ResponseBuilderUtil.buildGeneratedPaginatedResponse(
            GameListResponse::new, games, entitiesPage);
    }

    /**
     * Create sort object from parameters.
     */
    private Sort createSort(String sortBy, String sortOrder) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? DESC : ASC;
        String sortField = (sortBy != null && !sortBy.trim().isEmpty()) ? sortBy : "name";
        return Sort.by(direction, sortField);
    }
}
