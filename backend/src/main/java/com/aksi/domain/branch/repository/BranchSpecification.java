package com.aksi.domain.branch.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.enums.BranchStatus;

/**
 * JPA Specifications для композиційних запитів до BranchEntity. Замінює складні @Query методи на
 * type-safe конструкції.
 */
public class BranchSpecification {

  /** Філії за статусом */
  public static Specification<BranchEntity> hasStatus(BranchStatus status) {
    return (root, query, criteriaBuilder) -> {
      if (status == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("status"), status);
    };
  }

  /** Активні філії */
  public static Specification<BranchEntity> isActive() {
    return hasStatus(BranchStatus.ACTIVE);
  }

  /** Філії доступні для клієнтів (активні або тимчасово закриті) */
  public static Specification<BranchEntity> isAvailableForCustomers() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.or(
          criteriaBuilder.equal(root.get("status"), BranchStatus.ACTIVE),
          criteriaBuilder.equal(root.get("status"), BranchStatus.TEMPORARILY_CLOSED));
    };
  }

  /** Філії в конкретному місті */
  public static Specification<BranchEntity> inCity(String city) {
    return (root, query, criteriaBuilder) -> {
      if (city == null || city.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(criteriaBuilder.lower(root.get("city")), city.toLowerCase());
    };
  }

  /** Пошук за текстом (назва, код, місто) */
  public static Specification<BranchEntity> containsText(String searchText) {
    return (root, query, criteriaBuilder) -> {
      if (searchText == null || searchText.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }

      String likePattern = "%" + searchText.toLowerCase() + "%";

      return criteriaBuilder.or(
          criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), likePattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("city")), likePattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern));
    };
  }

  /** Філії з координатами */
  public static Specification<BranchEntity> hasCoordinates() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.and(
          criteriaBuilder.isNotNull(root.get("coordinates").get("latitude")),
          criteriaBuilder.isNotNull(root.get("coordinates").get("longitude")));
    };
  }

  /** Філії в радіусі від координат (формула Гаверсіна) */
  public static Specification<BranchEntity> withinRadius(
      double latitude, double longitude, double radiusKm) {
    return (root, query, criteriaBuilder) -> {
      // Формула Гаверсіна: 6371 * acos(cos(radians(lat1)) * cos(radians(lat2))
      // * cos(radians(lng2) - radians(lng1)) + sin(radians(lat1)) * sin(radians(lat2)))

      var latitudeRadians =
          criteriaBuilder.function("radians", Double.class, criteriaBuilder.literal(latitude));
      var longitudeRadians =
          criteriaBuilder.function("radians", Double.class, criteriaBuilder.literal(longitude));
      var branchLatRadians =
          criteriaBuilder.function(
              "radians", Double.class, root.get("coordinates").get("latitude"));
      var branchLngRadians =
          criteriaBuilder.function(
              "radians", Double.class, root.get("coordinates").get("longitude"));

      var cosLat1 = criteriaBuilder.function("cos", Double.class, latitudeRadians);
      var cosLat2 = criteriaBuilder.function("cos", Double.class, branchLatRadians);
      var sinLat1 = criteriaBuilder.function("sin", Double.class, latitudeRadians);
      var sinLat2 = criteriaBuilder.function("sin", Double.class, branchLatRadians);

      var deltaLng = criteriaBuilder.diff(branchLngRadians, longitudeRadians);
      var cosDeltaLng = criteriaBuilder.function("cos", Double.class, deltaLng);

      var a =
          criteriaBuilder.sum(
              criteriaBuilder.prod(criteriaBuilder.prod(cosLat1, cosLat2), cosDeltaLng),
              criteriaBuilder.prod(sinLat1, sinLat2));

      var acos = criteriaBuilder.function("acos", Double.class, a);
      var distance = criteriaBuilder.prod(criteriaBuilder.literal(6371.0), acos);

      return criteriaBuilder.and(
          hasCoordinates().toPredicate(root, query, criteriaBuilder),
          criteriaBuilder.lessThanOrEqualTo(distance, radiusKm));
    };
  }

  /** Філії з контактною інформацією */
  public static Specification<BranchEntity> hasContactInfo() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.or(
          criteriaBuilder.isNotNull(root.get("contactInfo").get("phone")),
          criteriaBuilder.isNotNull(root.get("contactInfo").get("email")));
    };
  }

  /** Філії з email */
  public static Specification<BranchEntity> hasEmail() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.isNotNull(root.get("contactInfo").get("email"));
    };
  }

  /** Філії з телефоном */
  public static Specification<BranchEntity> hasPhone() {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.isNotNull(root.get("contactInfo").get("phone"));
    };
  }

  /** Комплексний пошук з фільтрами */
  public static Specification<BranchEntity> searchWithFilters(
      String query, BranchStatus status, String city) {
    return Specification.where(containsText(query)).and(hasStatus(status)).and(inCity(city));
  }

  /** Філії поблизу з фільтрами */
  public static Specification<BranchEntity> nearbyWithFilters(
      double latitude, double longitude, double radiusKm, BranchStatus status) {
    return Specification.where(withinRadius(latitude, longitude, radiusKm)).and(hasStatus(status));
  }

  /** Готові для роботи філії (активні з контактами) */
  public static Specification<BranchEntity> readyForBusiness() {
    return Specification.where(isActive()).and(hasContactInfo());
  }
}
