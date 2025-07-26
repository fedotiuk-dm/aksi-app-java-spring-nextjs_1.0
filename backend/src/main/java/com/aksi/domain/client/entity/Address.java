package com.aksi.domain.client.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Embeddable class representing client's address */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

  @Column(name = "street", length = 200)
  private String street;

  @Column(name = "city", length = 100)
  private String city;

  @Column(name = "region", length = 100)
  private String region;

  @Column(name = "postal_code", length = 5)
  private String postalCode;

  @Column(name = "country", length = 100)
  private String country = "Україна";
}
