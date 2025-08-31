package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.exception.ConflictException;
import com.aksi.repository.BoosterRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for Booster business rules. Contains business logic validation separate from
 * data access and API layers.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BoosterValidationService {

  private final BoosterRepository boosterRepository;

  /**
   * Validate booster for creation.
   *
   * @param request CreateBoosterRequest to validate
   */
  public void validateForCreate(CreateBoosterRequest request) {
    validateDiscordUsername(request.getDisplayName());
    validateDiscordUsernameUniqueness(request.getDiscordUsername());
    validateContactEmailUniqueness(request.getContactEmail());
  }

  /**
   * Validate booster for update.
   *
   * @param request UpdateBoosterRequest to validate
   * @param existingEntity Existing booster entity
   */
  public void validateForUpdate(UpdateBoosterRequest request, BoosterEntity existingEntity) {
    validateDiscordUsername(request.getDisplayName());
    validateDiscordUsernameUniquenessForUpdate(
        request.getDiscordUsername(), existingEntity.getId());
    validateContactEmailUniquenessForUpdate(request.getContactEmail(), existingEntity.getId());
  }

  /**
   * Validate booster Discord username uniqueness.
   *
   * @param discordUsername Discord username to validate
   * @throws ConflictException if username already exists
   */
  public void validateDiscordUsernameUniqueness(String discordUsername) {
    if (boosterRepository.existsByDiscordUsername(discordUsername)) {
      log.error("Discord username '{}' already exists", discordUsername);
      throw new ConflictException("Discord username '" + discordUsername + "' already exists");
    }
  }

  /**
   * Validate booster Discord username uniqueness for updates.
   *
   * @param discordUsername Discord username to validate
   * @param excludeBoosterId Booster ID to exclude from uniqueness check
   * @throws ConflictException if username already exists for another booster
   */
  public void validateDiscordUsernameUniquenessForUpdate(
      String discordUsername, java.util.UUID excludeBoosterId) {
    boolean exists = boosterRepository.existsByDiscordUsername(discordUsername);
    if (exists) {
      // Check if it's the same booster
      boosterRepository
          .findByDiscordUsername(discordUsername)
          .ifPresent(
              existingBooster -> {
                if (!existingBooster.getId().equals(excludeBoosterId)) {
                  log.error(
                      "Discord username '{}' already exists for another booster", discordUsername);
                  throw new ConflictException(
                      "Discord username '"
                          + discordUsername
                          + "' already exists for another booster");
                }
              });
    }
  }

  /**
   * Validate contact email uniqueness if provided.
   *
   * @param contactEmail Contact email to validate (nullable)
   * @throws ConflictException if email already exists
   */
  public void validateContactEmailUniqueness(String contactEmail) {
    if (contactEmail != null && !contactEmail.trim().isEmpty()) {
      if (boosterRepository.existsByContactEmail(contactEmail)) {
        log.error("Contact email '{}' already exists", contactEmail);
        throw new ConflictException("Contact email '" + contactEmail + "' already exists");
      }
    }
  }

  /**
   * Validate contact email uniqueness for updates.
   *
   * @param contactEmail Contact email to validate (nullable)
   * @param excludeBoosterId Booster ID to exclude from uniqueness check
   * @throws ConflictException if email already exists for another booster
   */
  public void validateContactEmailUniquenessForUpdate(
      String contactEmail, java.util.UUID excludeBoosterId) {
    if (contactEmail != null && !contactEmail.trim().isEmpty()) {
      boolean exists = boosterRepository.existsByContactEmail(contactEmail);
      if (exists) {
        // Check if it's the same booster
        boosterRepository
            .findByContactEmail(contactEmail)
            .ifPresent(
                existingBooster -> {
                  if (!existingBooster.getId().equals(excludeBoosterId)) {
                    log.error(
                        "Contact email '{}' already exists for another booster", contactEmail);
                    throw new ConflictException(
                        "Contact email '" + contactEmail + "' already exists for another booster");
                  }
                });
      }
    }
  }

  /**
   * Validate booster rating range.
   *
   * @param rating Rating value
   * @throws ConflictException if rating is invalid
   */
  public void validateRating(Integer rating) {
    if (rating != null && (rating < 0 || rating > 50)) {
      log.error("Rating must be between 0 and 50, got: {}", rating);
      throw new ConflictException("Rating must be between 0 and 50");
    }
  }

  /**
   * Validate booster display name.
   *
   * @param displayName Display name
   * @throws ConflictException if display name is invalid
   */
  public void validateDisplayName(String displayName) {
    if (displayName == null || displayName.trim().isEmpty()) {
      log.error("Display name cannot be empty");
      throw new ConflictException("Display name cannot be empty");
    }

    if (displayName.length() > 100) {
      log.error("Display name too long: {} characters (max 100)", displayName.length());
      throw new ConflictException("Display name cannot be longer than 100 characters");
    }
  }

  /**
   * Validate Discord username format.
   *
   * @param discordUsername Discord username
   * @throws ConflictException if username format is invalid
   */
  public void validateDiscordUsername(String discordUsername) {
    if (discordUsername == null || discordUsername.trim().isEmpty()) {
      log.error("Discord username cannot be empty");
      throw new ConflictException("Discord username cannot be empty");
    }

    if (discordUsername.length() > 100) {
      log.error("Discord username too long: {} characters (max 100)", discordUsername.length());
      throw new ConflictException("Discord username cannot be longer than 100 characters");
    }

    // Basic Discord username validation (no spaces, special characters check)
    if (!discordUsername.matches("^[a-zA-Z0-9._-]+$")) {
      log.error("Invalid Discord username format: {}", discordUsername);
      throw new ConflictException("Discord username contains invalid characters");
    }
  }

  /**
   * Validate contact email format if provided.
   *
   * @param contactEmail Contact email (nullable)
   * @throws ConflictException if email format is invalid
   */
  public void validateContactEmail(String contactEmail) {
    if (contactEmail != null && !contactEmail.trim().isEmpty()) {
      if (contactEmail.length() > 255) {
        log.error("Contact email too long: {} characters (max 255)", contactEmail.length());
        throw new ConflictException("Contact email cannot be longer than 255 characters");
      }

      // Basic email format validation
      if (!contactEmail.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
        log.error("Invalid email format: {}", contactEmail);
        throw new ConflictException("Invalid email format");
      }
    }
  }
}
