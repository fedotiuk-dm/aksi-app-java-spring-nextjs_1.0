package com.aksi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.BoosterEntity;

@Repository
public interface BoosterRepository
    extends JpaRepository<BoosterEntity, java.util.UUID>, JpaSpecificationExecutor<BoosterEntity> {

  Optional<BoosterEntity> findByDiscordUsername(String discordUsername);

  Optional<BoosterEntity> findByContactEmail(String contactEmail);

  boolean existsByDiscordUsername(String discordUsername);

  boolean existsByContactEmail(String contactEmail);

  List<BoosterEntity> findByActiveTrue();

  @Query(
      "SELECT b FROM BoosterEntity b WHERE b.active = true ORDER BY b.rating DESC, b.completedOrders DESC")
  List<BoosterEntity> findTopRatedBoosters();

  @Query(
      "SELECT b FROM BoosterEntity b WHERE b.active = true AND LOWER(b.displayName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY b.rating DESC")
  List<BoosterEntity> searchByName(@Param("searchTerm") String searchTerm);

  @Query(
      "SELECT b FROM BoosterEntity b WHERE b.active = true AND b.rating >= :minRating ORDER BY b.rating DESC")
  List<BoosterEntity> findHighlyRatedBoosters(@Param("minRating") Integer minRating);

  @Query("SELECT AVG(b.rating) FROM BoosterEntity b WHERE b.active = true")
  Double getAverageRating();

  @Query("SELECT COUNT(b) FROM BoosterEntity b WHERE b.active = true")
  long countActiveBoosters();
}
