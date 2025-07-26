package com.aksi.domain.client.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity representing a client of the dry cleaning service */
@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity extends BaseEntity {

  @Column(name = "first_name", nullable = false, length = 50)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 50)
  private String lastName;

  @Column(unique = true, nullable = false, length = 20)
  private String phone;

  @Column(length = 100)
  private String email;

  @Embedded private Address address;

  @ElementCollection
  @CollectionTable(
      name = "client_communication_methods",
      joinColumns = @JoinColumn(name = "client_id"))
  @Enumerated(EnumType.STRING)
  @Column(name = "method")
  private Set<CommunicationMethod> communicationMethods = new HashSet<>();

  @Column(name = "source_type", length = 20)
  @Enumerated(EnumType.STRING)
  private ClientSourceType sourceType;

  @Column(name = "source_other", length = 100)
  private String sourceOther;

  @Column(name = "preferred_branch_id")
  private UUID preferredBranchId;

  // Statistics (updated automatically from Order domain)
  @Column(name = "order_count", nullable = false)
  private Integer orderCount = 0;

  @Column(name = "total_spent", nullable = false, precision = 10, scale = 2)
  private BigDecimal totalSpent = BigDecimal.ZERO;

  @Column(name = "last_order_date")
  private LocalDate lastOrderDate;

  /**
   * VIP status is calculated dynamically based on order count and total spent Client is VIP if they
   * have 10+ orders OR spent 5000+ UAH
   */
  @Transient
  public boolean isVip() {
    return orderCount >= 10 || totalSpent.compareTo(new BigDecimal("5000")) >= 0;
  }
}
