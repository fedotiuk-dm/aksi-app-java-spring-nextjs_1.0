package com.aksi.service.game;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

        log.info("🔍 Getting game modifiers - gameCode: {}, type: {}, serviceType: {}, active: {}, search: {}, page: {}, size: {}",
                gameCode, type, serviceTypeCode, active, search, page, size);

        try {
            // Use specifications for efficient database-level filtering
            var specification = GameModifierSpecification.filterModifiers(
                active, gameCode, search, type, serviceTypeCode);
            log.debug("🔍 Using specification for filtering modifiers");

            // Apply pagination
            Pageable pageable = PageRequest.of(page, size);
            Page<GameModifierEntity> entitiesPage = gameModifierRepository.findAll(specification, pageable);

            List<GameModifierEntity> entities = entitiesPage.getContent();
            log.info("🔍 Found {} modifiers (total: {}, active: {})",
                    entities.size(), entitiesPage.getTotalElements(),
                    entities.stream().filter(GameModifierEntity::getActive).count());

            // Log first few modifiers for debugging
            if (!entities.isEmpty()) {
                log.debug("🔍 First modifier: code={}, name={}, gameCode={}, active={}",
                         entities.get(0).getCode(), entities.get(0).getName(),
                         entities.get(0).getGameCode(), entities.get(0).getActive());
            }

            // Create response with statistics
            List<GameModifier> modifiers = gameModifierMapper.toGameModifierDtoList(entities);
            long activeCount = entities.stream().filter(GameModifierEntity::getActive).count();

            log.debug("🔄 Mapped {} entities to {} DTOs", entities.size(), modifiers.size());

            // Log sample DTO for debugging
            if (!modifiers.isEmpty()) {
                GameModifier first = modifiers.get(0);
                log.debug("🔄 First DTO: code={}, name={}, type={}, operation={}, value={}, active={}",
                         first.getCode(), first.getName(), first.getType(), first.getOperation(),
                         first.getValue(), first.getActive());
            }

            GameModifiersResponse response = new GameModifiersResponse();
            response.setModifiers(modifiers);
            response.setTotalCount((int) entitiesPage.getTotalElements());
            response.setActiveCount((int) activeCount);

            log.info("✅ Returning {} modifiers to frontend (total: {}, active: {})",
                    modifiers.size(), response.getTotalCount(), response.getActiveCount());
            return response;
        } catch (Exception e) {
            log.error("Error in getAllGameModifiers", e);

            // Return empty response on error for debugging
            GameModifiersResponse response = new GameModifiersResponse();
            response.setModifiers(new java.util.ArrayList<>());
            response.setTotalCount(0);
            response.setActiveCount(0);
            return response;
        }
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
        log.info("🚀 getModifiersByCodes called with: {}", modifierCodes);

        if (modifierCodes == null || modifierCodes.isEmpty()) {
            log.info("🚫 No modifier codes provided, returning empty list");
            return List.of();
        }

        log.debug("Getting modifiers by codes: {}", modifierCodes);

        try {
            // Use repository method to find by codes directly
            List<GameModifierEntity> foundModifiers = gameModifierRepository.findByCodeInAndActive(modifierCodes, true);
            log.info("🔍 Repository findByCodeInAndActive returned {} modifiers for codes: {}", foundModifiers.size(), modifierCodes);

            // Show details of all found modifiers
            for (GameModifierEntity mod : foundModifiers) {
                log.info("📋 Found modifier: code={}, id={}, gameCode={}, active={}",
                    mod.getCode(), mod.getId(), mod.getGameCode(), mod.getActive());
            }

            // Debug: show all found modifiers with their details
            for (GameModifierEntity modifier : foundModifiers) {
                log.debug("Found modifier: code={}, id={}, gameCode={}, active={}",
                    modifier.getCode(), modifier.getId(), modifier.getGameCode(), modifier.getActive());
            }

            // Check for duplicates before grouping
            Map<String, List<GameModifierEntity>> duplicatesCheck = foundModifiers.stream()
                .collect(Collectors.groupingBy(GameModifierEntity::getCode));
            for (Map.Entry<String, List<GameModifierEntity>> entry : duplicatesCheck.entrySet()) {
                if (entry.getValue().size() > 1) {
                    log.warn("Found {} duplicates for modifier code: {}", entry.getValue().size(), entry.getKey());
                    for (GameModifierEntity dup : entry.getValue()) {
                        log.warn("  Duplicate: id={}, gameCode={}", dup.getId(), dup.getGameCode());
                    }
                }
            }

            // Group by code to ensure uniqueness
            Map<String, GameModifierEntity> modifierMap = new HashMap<>();
            for (GameModifierEntity modifier : foundModifiers) {
                modifierMap.put(modifier.getCode(), modifier);
                log.debug("Added modifier to map: {} (id: {})", modifier.getCode(), modifier.getId());
            }

            List<GameModifierEntity> result = new ArrayList<>(modifierMap.values());
            log.debug("Returning {} unique modifiers: {}", result.size(),
                result.stream().map(GameModifierEntity::getCode).toList());

            return result;

        } catch (Exception e) {
            log.error("❌ Error in getModifiersByCodes {}: {}", modifierCodes, e.getMessage(), e);
            log.error("❌ Exception type: {}", e.getClass().getName());

            // Fallback: get all active and filter manually
            log.warn("⚠️ Using fallback method for modifier lookup");
            List<GameModifierEntity> allActive = gameModifierRepository.findAll()
                .stream()
                .filter(GameModifierEntity::getActive)
                .toList();

            log.debug("Fallback: found {} total active modifiers", allActive.size());

            Map<String, GameModifierEntity> modifierMap = new HashMap<>();
            for (GameModifierEntity modifier : allActive) {
                if (modifierCodes.contains(modifier.getCode())) {
                    modifierMap.put(modifier.getCode(), modifier);
                    log.debug("Fallback: added modifier {} (id: {})", modifier.getCode(), modifier.getId());
                }
            }

            List<GameModifierEntity> fallbackResult = new ArrayList<>(modifierMap.values());
            log.info("🔄 Fallback returned {} unique modifiers: {}", fallbackResult.size(),
                fallbackResult.stream().map(GameModifierEntity::getCode).toList());

            return fallbackResult;
        }
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
