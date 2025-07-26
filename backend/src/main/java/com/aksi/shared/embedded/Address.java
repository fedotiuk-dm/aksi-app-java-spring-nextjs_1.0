package com.aksi.shared.embedded;

import com.aksi.shared.validation.ValidationConstants;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Embeddable class representing an address. Can be reused across different entities (branches,
 * clients, etc.).
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

  @NotBlank(message = ValidationConstants.Messages.STREET_CANNOT_BE_BLANK)
  @Size(max = ValidationConstants.Branch.STREET_MAX_LENGTH)
  private String street;

  @NotBlank(message = ValidationConstants.Messages.CITY_CANNOT_BE_BLANK)
  @Size(max = ValidationConstants.Branch.CITY_MAX_LENGTH)
  private String city;

  @Size(max = ValidationConstants.Branch.REGION_MAX_LENGTH)
  private String region;

  @Pattern(
      regexp = ValidationConstants.Patterns.POSTAL_CODE_PATTERN,
      message = ValidationConstants.Messages.POSTAL_CODE_INVALID_FORMAT)
  private String postalCode;

  @Size(max = ValidationConstants.Branch.COUNTRY_MAX_LENGTH)
  @Builder.Default
  private String country = "Україна";
}
