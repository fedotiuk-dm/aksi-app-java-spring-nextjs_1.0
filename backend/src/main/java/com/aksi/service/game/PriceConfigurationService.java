package com.aksi.service.game;

import java.util.UUID;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;

/**
 * Service interface for PriceConfiguration operations. Provides basic CRUD operations used by the
 * REST API controller.
 */
public interface PriceConfigurationService {

  // Create operations
  PriceConfiguration createPriceConfiguration(CreatePriceConfigurationRequest request);

  // Read operations
  PriceConfiguration getPriceConfigurationById(UUID priceConfigurationId);

  PriceConfigurationListResponse getPriceConfigurations(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      UUID gameId,
      UUID difficultyLevelId,
      UUID serviceTypeId,
      Boolean active,
      Integer minBasePrice,
      Integer maxBasePrice);

  // Update operations
  PriceConfiguration updatePriceConfiguration(
      UUID priceConfigurationId, UpdatePriceConfigurationRequest request);

  // Delete operations
  void deletePriceConfiguration(UUID priceConfigurationId);
}
