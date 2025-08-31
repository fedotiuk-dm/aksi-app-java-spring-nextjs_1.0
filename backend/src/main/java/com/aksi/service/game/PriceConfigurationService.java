package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;

/**
 * Service interface for PriceConfiguration operations. Combines read and write operations with
 * proper separation of concerns.
 */
public interface PriceConfigurationService {

  // Create operations
  PriceConfiguration createPriceConfiguration(CreatePriceConfigurationRequest request);

  // Read operations
  PriceConfiguration getPriceConfigurationById(UUID priceConfigurationId);

  Optional<PriceConfiguration> getPriceConfigurationByCombination(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId);

  List<PriceConfiguration> getPriceConfigurationsByGameId(UUID gameId);

  List<PriceConfiguration> getAllActivePriceConfigurations();

  List<PriceConfiguration> getDefaultPriceConfigurations();

  List<PriceConfiguration> getDefaultPriceConfigurationsByGameId(UUID gameId);

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

  // Bulk operations
  int bulkUpdatePriceConfigurations(
      UUID gameId, Double basePriceMultiplier, Double pricePerLevelMultiplier);

  // Utility operations
  long countActiveByGameId(UUID gameId);
}
