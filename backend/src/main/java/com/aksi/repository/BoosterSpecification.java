package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.BoosterEntity;
import com.aksi.domain.game.BoosterGameSpecializationEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

public class BoosterSpecification {

  public static Specification<BoosterEntity> hasActive(Boolean active) {
    return (root, query, criteriaBuilder) -> {
      if (active == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("active"), active);
    };
  }

  public static Specification<BoosterEntity> hasVerified(Boolean verified) {
    return (root, query, criteriaBuilder) -> {
      if (verified == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("verified"), verified);
    };
  }

  public static Specification<BoosterEntity> hasRatingGreaterThan(Float minRating) {
    return (root, query, criteriaBuilder) -> {
      if (minRating == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), minRating);
    };
  }

  public static Specification<BoosterEntity> searchByNameOrContact(String search) {
    return (root, query, criteriaBuilder) -> {
      if (search == null || search.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }

      String searchPattern = "%" + search.toLowerCase() + "%";
      return criteriaBuilder.or(
          criteriaBuilder.like(criteriaBuilder.lower(root.get("displayName")), searchPattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("discordUsername")), searchPattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("contactEmail")), searchPattern));
    };
  }

  public static Specification<BoosterEntity> hasGameSpecialization(UUID gameId) {
    return (root, query, criteriaBuilder) -> {
      if (gameId == null) {
        return criteriaBuilder.conjunction();
      }

      // Join with booster_game_specializations to filter by game
      Join<BoosterEntity, BoosterGameSpecializationEntity> specializationsJoin =
          root.join("gameSpecializations", JoinType.INNER);

      return criteriaBuilder.equal(specializationsJoin.get("game").get("id"), gameId);
    };
  }

  public static Specification<BoosterEntity> orderByRating() {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.desc(root.get("rating")));
      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BoosterEntity> hasDiscordUsername(String discordUsername) {
    return (root, query, criteriaBuilder) -> {
      if (discordUsername == null || discordUsername.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("discordUsername"), discordUsername);
    };
  }

  public static Specification<BoosterEntity> hasContactEmail(String contactEmail) {
    return (root, query, criteriaBuilder) -> {
      if (contactEmail == null || contactEmail.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("contactEmail"), contactEmail);
    };
  }
}
