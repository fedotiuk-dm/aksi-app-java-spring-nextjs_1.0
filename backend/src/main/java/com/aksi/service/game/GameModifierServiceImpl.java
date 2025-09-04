package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.GameModifiersResponse;
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
    public GameModifierInfo updateGameModifier(String modifierId, UpdateGameModifierRequest request) {
        return gameModifierCommandService.updateGameModifier(modifierId, request);
    }

    @Override
    public void deleteGameModifier(String modifierId) {
        gameModifierCommandService.deleteGameModifier(modifierId);
    }

    @Override
    public GameModifierInfo activateGameModifier(String modifierId) {
        return gameModifierCommandService.activateGameModifier(modifierId);
    }

    @Override
    public GameModifierInfo deactivateGameModifier(String modifierId) {
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
            int size) {
        return gameModifierQueryService.getAllGameModifiers(gameCode, type, serviceTypeCode, active, search, page, size);
    }

    @Override
    public GameModifierInfo getGameModifierById(String modifierId) {
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
