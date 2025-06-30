package com.aksi.domain.branch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Embedded клас для географічних координат філії. */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coordinates {

  @Column(name = "latitude")
  private Double latitude;

  @Column(name = "longitude")
  private Double longitude;

  @Column(name = "map_url", length = 500)
  private String mapUrl;

  /** Перевіряє чи координати валідні. */
  public boolean isValid() {
    return latitude != null
        && longitude != null
        && latitude >= -90
        && latitude <= 90
        && longitude >= -180
        && longitude <= 180;
  }

  /** Розраховує відстань в кілометрах до інших координат за формулою Гаверсіна. */
  public double calculateDistanceKm(double targetLatitude, double targetLongitude) {
    if (!isValid()) {
      return Double.MAX_VALUE;
    }

    final int EARTH_RADIUS_KM = 6371;

    double latDistance = Math.toRadians(targetLatitude - this.latitude);
    double lonDistance = Math.toRadians(targetLongitude - this.longitude);

    double a =
        Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
            + Math.cos(Math.toRadians(this.latitude))
                * Math.cos(Math.toRadians(targetLatitude))
                * Math.sin(lonDistance / 2)
                * Math.sin(lonDistance / 2);

    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
  }

  /** Перевіряє чи є URL карти. */
  public boolean hasMapUrl() {
    return mapUrl != null && !mapUrl.trim().isEmpty();
  }

  /** Отримує координати як рядок для відображення. */
  public String getDisplayCoordinates() {
    if (!isValid()) {
      return "Координати не задані";
    }
    return String.format("%.6f, %.6f", latitude, longitude);
  }
}
