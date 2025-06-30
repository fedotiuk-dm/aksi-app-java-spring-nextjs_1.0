package com.aksi.domain.client.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Адреса клієнта Синхронізовано з OpenAPI схемою Address. */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

  @Column(name = "street", length = 200)
  private String street;

  @Column(name = "city", length = 100)
  private String city;

  @Column(name = "region", length = 100)
  private String region;

  @Column(name = "postal_code", length = 10)
  private String postalCode;

  @Column(name = "country", length = 100)
  @Builder.Default
  private String country = "Україна";

  /** Domain-specific метод для отримання повної адреси. */
  public String getFullAddress() {
    StringBuilder fullAddress = new StringBuilder();

    if (street != null && !street.trim().isEmpty()) {
      fullAddress.append(street);
    }

    if (city != null && !city.trim().isEmpty()) {
      if (fullAddress.length() > 0) {
        fullAddress.append(", ");
      }
      fullAddress.append(city);
    }

    if (region != null && !region.trim().isEmpty()) {
      if (fullAddress.length() > 0) {
        fullAddress.append(", ");
      }
      fullAddress.append(region);
    }

    if (postalCode != null && !postalCode.trim().isEmpty()) {
      if (fullAddress.length() > 0) {
        fullAddress.append(", ");
      }
      fullAddress.append(postalCode);
    }

    if (country != null && !country.trim().isEmpty()) {
      if (fullAddress.length() > 0) {
        fullAddress.append(", ");
      }
      fullAddress.append(country);
    }

    return fullAddress.toString();
  }

  /** Domain-specific метод для перевірки чи адреса повна. */
  public boolean isComplete() {
    return street != null && !street.trim().isEmpty() && city != null && !city.trim().isEmpty();
  }
}
