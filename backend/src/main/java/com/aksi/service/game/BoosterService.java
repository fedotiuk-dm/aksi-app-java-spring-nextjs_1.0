package com.aksi.service.game;

import java.util.UUID;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;

/**
 * Service interface for Booster operations required for game services calculator. Provides
 * essential CRUD operations and basic queries for Order Wizard integration.
 */
public interface BoosterService {

  // Core CRUD operations
  Booster createBooster(CreateBoosterRequest request);

  Booster getBoosterById(UUID boosterId);

  Booster updateBooster(UUID boosterId, UpdateBoosterRequest request);

  void deleteBooster(UUID boosterId);

  // Essential list operations for UI
  BoosterListResponse listBoosters(
      Integer page, Integer size, UUID gameId, Integer minRating, Boolean active);

  // Search functionality for admin panel with pagination
  BoosterListResponse searchBoosters(String searchTerm, Boolean active, Integer page, Integer size);
}
