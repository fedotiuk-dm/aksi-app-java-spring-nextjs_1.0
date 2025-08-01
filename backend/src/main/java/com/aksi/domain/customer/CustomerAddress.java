package com.aksi.domain.customer;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Customer addresses for delivery service. */
@Entity
@Table(
    name = "customer_addresses",
    indexes = {
      @Index(name = "idx_address_customer", columnList = "customer_id"),
      @Index(name = "idx_address_type", columnList = "address_type")
    })
@Getter
@Setter
public class CustomerAddress extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @Column(name = "address_type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private AddressType addressType = AddressType.HOME;

  @Column(name = "street", nullable = false)
  private String street;

  @Column(name = "building", nullable = false, length = 20)
  private String building;

  @Column(name = "apartment", length = 20)
  private String apartment;

  @Column(name = "entrance", length = 10)
  private String entrance;

  @Column(name = "floor", length = 10)
  private String floor;

  @Column(name = "intercom_code", length = 20)
  private String intercomCode;

  @Column(name = "city", nullable = false, length = 100)
  private String city = "Київ";

  @Column(name = "postal_code", length = 10)
  private String postalCode;

  @Column(name = "notes")
  private String notes;

  @Column(name = "is_primary", nullable = false)
  private boolean primary;

  @Column(name = "active", nullable = false)
  private boolean active;

  public enum AddressType {
    HOME,
    WORK,
    OTHER
  }
}
