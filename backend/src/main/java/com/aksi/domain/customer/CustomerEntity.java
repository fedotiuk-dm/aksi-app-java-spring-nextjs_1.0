package com.aksi.domain.customer;

import java.util.HashSet;
import java.util.Set;

import com.aksi.api.customer.dto.ContactPreference;
import com.aksi.api.customer.dto.InfoSource;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
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
@ToString
public class CustomerEntity extends BaseEntity {

  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @Column(name = "phone_primary", nullable = false, length = 20)
  private String phonePrimary;

  @Column(name = "email")
  private String email;

  @Column(name = "address", columnDefinition = "TEXT")
  private String address;

  @ElementCollection(targetClass = ContactPreference.class, fetch = FetchType.EAGER)
  @CollectionTable(
      name = "customer_contact_preferences",
      joinColumns = @JoinColumn(name = "customer_id"))
  @Column(name = "preference")
  @Enumerated(EnumType.STRING)
  private Set<ContactPreference> contactPreferences = new HashSet<>();

  @Column(name = "info_source")
  @Enumerated(EnumType.STRING)
  private InfoSource infoSource;

  @Column(name = "info_source_other")
  private String infoSourceOther;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  @Column(name = "discount_card_number", unique = true, length = 20)
  private String discountCardNumber;

  @Column(name = "active", nullable = false)
  private boolean active = true;
}
