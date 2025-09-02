package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.BoosterEntity;

@Repository
public interface BoosterRepository
    extends JpaRepository<BoosterEntity, UUID>, JpaSpecificationExecutor<BoosterEntity> {

  Optional<BoosterEntity> findByDiscordUsername(String discordUsername);

  Optional<BoosterEntity> findByContactEmail(String contactEmail);

  boolean existsByDiscordUsername(String discordUsername);

  boolean existsByContactEmail(String contactEmail);

  @Query(
      "SELECT b FROM BoosterEntity b WHERE b.active = true ORDER BY b.rating DESC, b.totalOrders DESC")
  List<BoosterEntity> findTopRatedBoosters();

  @Query("SELECT AVG(b.rating) FROM BoosterEntity b WHERE b.active = true")
  Double getAverageRating();

  @Query("SELECT COUNT(b) FROM BoosterEntity b WHERE b.active = true")
  long countActiveBoosters();
}
