package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.exception.BadRequestException;
import com.aksi.service.game.util.EntityQueryUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for GameModifier-related business rules and constraints.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameModifierValidationService {

    private final EntityQueryUtils entityQueryUtils;

    /**
     * Validate create game modifier request.
     */
    public void validateCreateGameModifier(CreateGameModifierRequest request) {
        log.debug("Validating create game modifier request: {}", request.getCode());

        // Validate required fields
        if (!StringUtils.hasText(request.getCode())) {
            throw new BadRequestException("Game modifier code is required");
        }

        if (!StringUtils.hasText(request.getName())) {
            throw new BadRequestException("Game modifier name is required");
        }

        if (!StringUtils.hasText(request.getGameCode())) {
            throw new BadRequestException("Game code is required");
        }

        if (request.getType() == null) {
            throw new BadRequestException("Game modifier type is required");
        }

        // Validate code format (uppercase letters, numbers, underscores)
        if (!request.getCode().matches("^[A-Z0-9_]+$")) {
            throw new BadRequestException(
                "Game modifier code must contain only uppercase letters, numbers, and underscores");
        }

        // Validate code length
        if (request.getCode().length() < 2 || request.getCode().length() > 50) {
            throw new BadRequestException("Game modifier code must be between 2 and 50 characters");
        }

        // Validate game exists
        if (!entityQueryUtils.existsByCode(request.getGameCode())) {
            throw new BadRequestException("Game not found: " + request.getGameCode());
        }

        // Validate name length
        if (request.getName().length() > 100) {
            throw new BadRequestException("Game modifier name must not exceed 100 characters");
        }

        // Validate description length if provided
        String description = request.getDescription();
        if (description != null && description.length() > 500) {
            throw new BadRequestException("Game modifier description must not exceed 500 characters");
        }
    }

    /**
     * Validate update game modifier request.
     */
    public void validateUpdateGameModifier(String modifierId, UpdateGameModifierRequest request) {
        log.debug("Validating update game modifier request for modifier: {}", modifierId);

        // Validate modifier exists (this will be checked in repository)
        if (request == null) {
            throw new BadRequestException("Update request cannot be null");
        }

        // Validate name if provided
        String name = request.getName();
        if (name != null) {
            if (!StringUtils.hasText(name)) {
                throw new BadRequestException("Game modifier name cannot be empty");
            }
            if (name.length() > 100) {
                throw new BadRequestException("Game modifier name must not exceed 100 characters");
            }
        }

        // Validate description if provided
        String description = request.getDescription();
        if (description != null && description.length() > 500) {
            throw new BadRequestException("Game modifier description must not exceed 500 characters");
        }
    }
}
