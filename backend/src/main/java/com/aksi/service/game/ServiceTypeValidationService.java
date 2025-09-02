package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.exception.ConflictException;
import com.aksi.service.game.util.EntityValidationUtils;

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

  private final EntityValidationUtils entityValidationUtils;

  /**
   * Validate service type creation request.
   *
   * @param request Create service type request
   * @throws ConflictException if validation fails
   */
  public void validateForCreate(CreateServiceTypeRequest request) {
    log.debug("Validating service type creation request: {}", request.getCode());

    // Validate game exists
    entityValidationUtils.validateGameExists(request.getGameId());

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
    entityValidationUtils.validateGameExists(request.getGameId());

    // Validate sort order
    validateSortOrder(request.getSortOrder());
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
}
