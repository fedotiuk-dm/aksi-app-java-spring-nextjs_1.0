package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.exception.ConflictException;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for ServiceType business rules. Contains business logic validation separate
 * from data access and API layers.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ServiceTypeValidationService {

  private final ServiceTypeRepository serviceTypeRepository;
  private final GameRepository gameRepository;

  /**
   * Validate service type creation request.
   *
   * @param request Create service type request
   * @throws ConflictException if validation fails
   */
  public void validateForCreate(CreateServiceTypeRequest request) {
    log.debug("Validating service type creation request: {}", request.getCode());

    // Validate game exists
    validateGameExists(request.getGameId());

    // Validate code uniqueness
    validateCodeUniqueness(request.getCode(), null);

    // Validate sort order
    validateSortOrder(request.getSortOrder());
  }

  /**
   * Validate service type update request.
   *
   * @param serviceTypeId Service type ID being updated
   * @param request Update service type request
   * @throws ConflictException if validation fails
   */
  public void validateForUpdate(UUID serviceTypeId, UpdateServiceTypeRequest request) {
    log.debug("Validating service type update request for id: {}", serviceTypeId);

    // Validate game exists
    validateGameExists(request.getGameId());

    // Validate code uniqueness (excluding current service type)
    validateCodeUniqueness(request.getCode(), serviceTypeId);

    // Validate sort order
    validateSortOrder(request.getSortOrder());
  }

  /**
   * Validate that game exists.
   *
   * @param gameId Game ID
   * @throws ConflictException if game not found
   */
  private void validateGameExists(UUID gameId) {
    if (!gameRepository.existsById(gameId)) {
      log.error("Game not found with id: {}", gameId);
      throw new ConflictException("Game not found with id: " + gameId);
    }
  }

  /**
   * Validate code uniqueness.
   *
   * @param code Service type code
   * @param excludeServiceTypeId Service type ID to exclude from uniqueness check (for updates)
   * @throws ConflictException if code already exists
   */
  private void validateCodeUniqueness(String code, UUID excludeServiceTypeId) {
    boolean exists =
        excludeServiceTypeId != null
            ? serviceTypeRepository.existsByCodeAndIdNot(code, excludeServiceTypeId)
            : serviceTypeRepository.existsByCode(code);

    if (exists) {
      log.error("Service type with code '{}' already exists", code);
      throw new ConflictException("Service type with code '" + code + "' already exists");
    }
  }

  /**
   * Validate sort order.
   *
   * @param sortOrder Sort order value
   * @throws ConflictException if sort order is invalid
   */
  private void validateSortOrder(Integer sortOrder) {
    if (sortOrder != null && sortOrder < 0) {
      log.error("Sort order must be non-negative, got: {}", sortOrder);
      throw new ConflictException("Sort order must be non-negative");
    }
  }

  /**
   * Validate that service type can be deleted (no dependencies).
   *
   * @param serviceTypeId Service type ID
   * @throws ConflictException if service type cannot be deleted
   */
  public void validateForDelete(UUID serviceTypeId) {
    log.debug("Validating service type deletion for id: {}", serviceTypeId);

    // Check if service type has active price configurations
    if (serviceTypeRepository.hasActivePriceConfigurations(serviceTypeId)) {
      log.error("Cannot delete service type with active price configurations: {}", serviceTypeId);
      throw new ConflictException("Cannot delete service type with active price configurations");
    }
  }

  /**
   * Validate that service type exists.
   *
   * @param serviceTypeId Service type ID
   * @throws ConflictException if service type not found
   */
  public void validateServiceTypeExists(UUID serviceTypeId) {
    if (!serviceTypeRepository.existsById(serviceTypeId)) {
      log.error("Service type not found with id: {}", serviceTypeId);
      throw new ConflictException("Service type not found with id: " + serviceTypeId);
    }
  }
}
