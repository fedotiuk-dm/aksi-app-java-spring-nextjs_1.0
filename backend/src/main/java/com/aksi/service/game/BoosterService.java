package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;

/**
 * Service interface for Booster operations. Combines read and write operations with proper
 * separation of concerns.
 */
public interface BoosterService {

  // Create operations
  Booster createBooster(CreateBoosterRequest request);

  // Read operations
  Booster getBoosterById(UUID boosterId);

  Optional<Booster> getBoosterByDiscordUsername(String discordUsername);

  Optional<Booster> getBoosterByContactEmail(String contactEmail);

  List<Booster> getAllActiveBoosters();

  List<Booster> getTopRatedBoosters();

  List<Booster> getHighlyRatedBoosters(Integer minRating);

  // Update operations
  Booster updateBooster(UUID boosterId, UpdateBoosterRequest request);

  // Delete operations
  void deleteBooster(UUID boosterId);

  // Special operations
  Booster incrementCompletedOrders(UUID boosterId);

  Booster updateBoosterRating(UUID boosterId, Integer newRating);

  // Utility operations
  List<Booster> searchBoostersByName(String searchTerm);

  Double getAverageRating();

  long countActiveBoosters();

  // List operations
  BoosterListResponse listBoosters(
      Integer page, Integer size, UUID gameId, Integer minRating, Boolean active);

  BoosterListResponse listBoosters(Integer page, Integer size, String search, Boolean active);
}
