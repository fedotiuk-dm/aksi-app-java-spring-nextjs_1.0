package com.aksi.service.game;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.GameModifier;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.GameModifiersResponse;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.GameModifierMapper;
import com.aksi.repository.GameModifierRepository;
import com.aksi.repository.GameModifierSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for GameModifier domain read operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class GameModifierQueryService {

    private final GameModifierRepository gameModifierRepository;
    private final GameModifierMapper gameModifierMapper;

    /**
     * Get all game modifiers with optional filtering and pagination.
     */
    public GameModifiersResponse getAllGameModifiers(
            String gameCode,
            GameModifierType type,
            String serviceTypeCode,
            Boolean active,
            String search,
            int page,
            int size) {

        log.info("Getting game modifiers - gameCode: {}, type: {}, serviceType: {}, active: {}, search: {}",
                gameCode, type, serviceTypeCode, active, search);

        // Use specifications for efficient database-level filtering
        var specification = GameModifierSpecification.filterModifiers(
            active, gameCode, search, type, serviceTypeCode);

        // Apply pagination
        Pageable pageable = PageRequest.of(page, size);
        Page<GameModifierEntity> entitiesPage = gameModifierRepository.findAll(specification, pageable);

        List<GameModifierEntity> entities = entitiesPage.getContent();

        // Create response with statistics
        List<GameModifier> modifiers = gameModifierMapper.toGameModifierDtoList(entities);
        long activeCount = entities.stream().filter(GameModifierEntity::getActive).count();

        GameModifiersResponse response = new GameModifiersResponse();
        response.setModifiers(modifiers);
        response.setTotalCount((int) entitiesPage.getTotalElements());
        response.setActiveCount((int) activeCount);
        return response;
    }

    /**
     * Get game modifier by ID.
     */
    public GameModifierInfo getGameModifierById(String modifierId) {
        log.info("Getting game modifier by ID: {}", modifierId);

        GameModifierEntity entity = gameModifierRepository.findById(modifierId)
            .orElseThrow(() -> new NotFoundException("Game modifier not found: " + modifierId));

        return gameModifierMapper.toGameModifierInfoDto(entity);
    }


    /**
     * Get modifiers by their codes (returns Entity objects for calculations)
     */
    public List<GameModifierEntity> getModifiersByCodes(List<String> modifierCodes) {
        if (modifierCodes == null || modifierCodes.isEmpty()) {
            return List.of();
        }

        log.debug("Getting modifiers by codes: {}", modifierCodes);

        // Get all active modifiers and filter by codes
        List<GameModifierEntity> allActive = gameModifierRepository.findAll()
            .stream()
            .filter(GameModifierEntity::getActive)
            .toList();

        return allActive.stream()
            .filter(modifier -> modifierCodes.contains(modifier.getCode()))
            .collect(Collectors.toList());
    }

    /**
     * Get active modifiers for a game (returns Entity objects for calculations)
     */
    public List<GameModifierEntity> getActiveModifiersForGameEntity(String gameCode) {
        log.debug("Getting active modifiers for game entity: {}", gameCode);

        return gameModifierRepository
            .findByActiveTrueOrderBySortOrderAsc(gameCode);
    }
}
