package com.aksi.domain.customer;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Customer preferences for services and notifications. */
@Entity
@Table(name = "customer_preferences")
@Getter
@Setter
public class CustomerPreferences extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false, unique = true)
  private Customer customer;

  @Column(name = "email_notifications", nullable = false)
  private boolean emailNotifications;

  @Column(name = "sms_notifications", nullable = false)
  private boolean smsNotifications;

  @Column(name = "marketing_emails", nullable = false)
  private boolean marketingEmails;

  @Column(name = "preferred_language", nullable = false, length = 5)
  private String preferredLanguage = "uk";

  @Column(name = "preferred_contact_method", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private ContactMethod preferredContactMethod = ContactMethod.PHONE;

  @Column(name = "preferred_pickup_time")
  private String preferredPickupTime;

  @Column(name = "preferred_delivery_time")
  private String preferredDeliveryTime;

  @Column(name = "special_instructions", columnDefinition = "TEXT")
  private String specialInstructions;

  public enum ContactMethod {
    PHONE,
    SMS,
    EMAIL,
    VIBER,
    TELEGRAM
  }
}
