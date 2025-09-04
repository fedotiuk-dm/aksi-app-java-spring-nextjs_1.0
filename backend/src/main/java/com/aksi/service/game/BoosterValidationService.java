package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.repository.BoosterRepository;
import com.aksi.service.game.util.ValidationUtils;

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
    ValidationUtils.validateDisplayName(request.getDisplayName(), "Display name");
    ValidationUtils.validateDiscordUsername(request.getDiscordUsername(), "Discord username");
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
    ValidationUtils.validateDisplayName(request.getDisplayName(), "Display name");
    ValidationUtils.validateDiscordUsername(request.getDiscordUsername(), "Discord username");
    validateDiscordUsernameUniquenessForUpdate(
        request.getDiscordUsername(), existingEntity.getId());
    validateContactEmailUniquenessForUpdate(request.getContactEmail(), existingEntity.getId());
  }

  /**
   * Validate booster Discord username uniqueness.
   *
   * @param discordUsername Discord username to validate
   */
  public void validateDiscordUsernameUniqueness(String discordUsername) {
    boolean exists = boosterRepository.existsByDiscordUsername(discordUsername);
    ValidationUtils.validateUniqueness(exists, "Discord username", discordUsername);
  }

  /**
   * Validate booster Discord username uniqueness for updates.
   *
   * @param discordUsername Discord username to validate
   * @param excludeBoosterId Booster ID to exclude from uniqueness check
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
                  ValidationUtils.validateUniquenessForUpdate(
                      true, "Discord username", discordUsername);
                }
              });
    }
  }

  /**
   * Validate contact email uniqueness if provided.
   *
   * @param contactEmail Contact email to validate (nullable)
   */
  public void validateContactEmailUniqueness(String contactEmail) {
    if (contactEmail != null && !contactEmail.trim().isEmpty()) {
      ValidationUtils.validateEmail(contactEmail, "Contact email");

      boolean exists = boosterRepository.existsByContactEmail(contactEmail);
      ValidationUtils.validateUniqueness(exists, "Contact email", contactEmail);
    }
  }

  /**
   * Validate contact email uniqueness for updates.
   *
   * @param contactEmail Contact email to validate (nullable)
   * @param excludeBoosterId Booster ID to exclude from uniqueness check
   */
  public void validateContactEmailUniquenessForUpdate(
      String contactEmail, java.util.UUID excludeBoosterId) {

    if (contactEmail != null && !contactEmail.trim().isEmpty()) {
      ValidationUtils.validateEmail(contactEmail, "Contact email");

      boolean exists = boosterRepository.existsByContactEmail(contactEmail);
      if (exists) {
        // Check if it's the same booster
        boosterRepository
            .findByContactEmail(contactEmail)
            .ifPresent(
                existingBooster -> {
                  if (!existingBooster.getId().equals(excludeBoosterId)) {
                    ValidationUtils.validateUniquenessForUpdate(
                        true, "Contact email", contactEmail);
                  }
                });
      }
    }
  }
}
