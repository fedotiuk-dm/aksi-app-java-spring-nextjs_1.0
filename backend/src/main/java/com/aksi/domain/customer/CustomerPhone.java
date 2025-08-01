package com.aksi.domain.customer;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Additional phone numbers for customers. */
@Entity
@Table(
    name = "customer_phones",
    indexes = {
      @Index(name = "idx_phone_customer", columnList = "customer_id"),
      @Index(name = "idx_phone_number", columnList = "phone_number")
    })
@Getter
@Setter
public class CustomerPhone extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @Column(name = "phone_number", nullable = false, length = 20)
  private String phoneNumber;

  @Column(name = "label", length = 50)
  private String label;

  @Column(name = "is_primary", nullable = false)
  private boolean primary;

  @Column(name = "active", nullable = false)
  private boolean active;
}
