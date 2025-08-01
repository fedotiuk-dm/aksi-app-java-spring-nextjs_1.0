package com.aksi.domain.customer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** Customer entity representing clients of the dry cleaning service. */
@Entity
@Table(
    name = "customers",
    indexes = {
      @Index(name = "idx_customer_phone", columnList = "phone_primary"),
      @Index(name = "idx_customer_email", columnList = "email"),
      @Index(name = "idx_customer_name", columnList = "first_name, last_name"),
      @Index(
          name = "idx_customer_discount_card",
          columnList = "discount_card_number",
          unique = true)
    })
@Getter
@Setter
@ToString(exclude = {"phones", "addresses", "preferences"})
public class Customer extends BaseEntity {

  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @Column(name = "phone_primary", nullable = false, length = 20)
  private String phonePrimary;

  @Column(name = "email")
  private String email;

  @Column(name = "birth_date")
  private LocalDate birthDate;

  @Column(name = "discount_percentage", precision = 5, scale = 2)
  private BigDecimal discountPercentage = BigDecimal.ZERO;

  @Column(name = "discount_card_number", unique = true, length = 20)
  private String discountCardNumber;

  @Column(name = "loyalty_points")
  private Integer loyaltyPoints;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  @Column(name = "active", nullable = false)
  private boolean active;

  @Column(name = "blacklisted", nullable = false)
  private boolean blacklisted;

  @Column(name = "blacklist_reason")
  private String blacklistReason;

  @OneToMany(
      mappedBy = "customer",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private Set<CustomerPhone> phones = new HashSet<>();

  @OneToMany(
      mappedBy = "customer",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private Set<CustomerAddress> addresses = new HashSet<>();

  @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
  private CustomerPreferences preferences;
}
