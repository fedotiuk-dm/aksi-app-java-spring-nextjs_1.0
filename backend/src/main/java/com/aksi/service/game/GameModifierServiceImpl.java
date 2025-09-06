package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.GameModifiersResponse;
import com.aksi.api.game.dto.SortOrder;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.repository.GameRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of GameModifierService that delegates to command and query services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameModifierServiceImpl implements GameModifierService {

    private final GameModifierCommandService gameModifierCommandService;
    private final GameModifierQueryService gameModifierQueryService;
    private final GameRepository gameRepository;

    @Override
    public GameModifierInfo createGameModifier(CreateGameModifierRequest request) {
        return gameModifierCommandService.createGameModifier(request);
    }

    @Override
    public GameModifierInfo updateGameModifier(UUID modifierId, UpdateGameModifierRequest request) {
        return gameModifierCommandService.updateGameModifier(modifierId, request);
    }

    @Override
    public void deleteGameModifier(UUID modifierId) {
        gameModifierCommandService.deleteGameModifier(modifierId);
    }

    @Override
    public GameModifierInfo activateGameModifier(UUID modifierId) {
        return gameModifierCommandService.activateGameModifier(modifierId);
    }

    @Override
    public GameModifierInfo deactivateGameModifier(UUID modifierId) {
        return gameModifierCommandService.deactivateGameModifier(modifierId);
    }

    @Override
    public GameModifiersResponse getAllGameModifiers(
            String gameCode,
            GameModifierType type,
            String serviceTypeCode,
            Boolean active,
            String search,
            int page,
            int size,
            String sortBy,
            SortOrder sortOrder,
            GameModifierOperation operation) {
        log.info("🔍 getAllGameModifiers called with filters: gameCode={}, type={}, serviceTypeCode={}, active={}, search={}, page={}, size={}, sortBy={}, sortOrder={}, operation={}",
                gameCode, type, serviceTypeCode, active, search, page, size, sortBy, sortOrder, operation);

        GameModifiersResponse response = gameModifierQueryService.getAllGameModifiers(gameCode, type, serviceTypeCode, active, search, page, size, sortBy, sortOrder, operation);

        log.info("✅ getAllGameModifiers returned {} modifiers (total: {}, active: {})",
                response.getModifiers().size(), response.getTotalCount(), response.getActiveCount());

        return response;
    }

    @Override
    public GameModifierInfo getGameModifierById(UUID modifierId) {
        return gameModifierQueryService.getGameModifierById(modifierId);
    }

    @Override
    public List<GameModifierEntity> getActiveModifiersForCalculation(
            UUID gameId, UUID serviceTypeId, List<String> modifierCodes) {

        log.info("🎯 getActiveModifiersForCalculation called with gameId={}, serviceTypeId={}, modifierCodes={}",
            gameId, serviceTypeId, modifierCodes);

        // Log the decision path
        if (modifierCodes == null || modifierCodes.isEmpty()) {
            log.info("🎯 No modifier codes provided, getting active modifiers for game");
            return getActiveModifiersForGameEntity(gameId);
        }

        log.info("🎯 Getting modifiers by codes: {}", modifierCodes);
        return getModifiersByCodes(modifierCodes);
    }

    @Override
    public List<GameModifierEntity> getModifiersByCodes(List<String> modifierCodes) {
        if (modifierCodes == null || modifierCodes.isEmpty()) {
            return List.of();
        }

        // Delegate to query service
        return gameModifierQueryService.getModifiersByCodes(modifierCodes);
    }

    @Override
    public void validateModifierCompatibility(List<GameModifierEntity> modifiers) {
        if (modifiers == null || modifiers.isEmpty()) {
            return;
        }

        // Basic validation - ensure no conflicting modifiers
        List<String> modifierCodes = modifiers.stream()
            .map(GameModifierEntity::getCode)
            .toList();

        long uniqueCodes = modifierCodes.stream().distinct().count();
        if (uniqueCodes != modifierCodes.size()) {
            throw new RuntimeException("Duplicate modifier codes found: " + modifierCodes);
        }

        // Additional validation logic can be added here
    }

    private List<GameModifierEntity> getActiveModifiersForGameEntity(UUID gameId) {
        // Get game code from gameId first
        String gameCode = gameRepository.findById(gameId)
            .map(GameEntity::getCode)
            .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId));

        return gameModifierQueryService.getActiveModifiersForGameEntity(gameCode);
    }
}
