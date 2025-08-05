package com.aksi.domain.order;

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
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item risk entity for tracking potential risks associated with order items */
@Entity
@Table(
    name = "item_risks",
    indexes = {
      @Index(name = "idx_item_risk_order_item", columnList = "order_item_id"),
      @Index(name = "idx_item_risk_type", columnList = "risk_type")
    })
@Getter
@Setter
@NoArgsConstructor
public class ItemRisk extends BaseEntity {

  public enum RiskType {
    COLOR_CHANGE,
    DEFORMATION,
    NO_WARRANTY
  }

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItem orderItem;

  @Enumerated(EnumType.STRING)
  @Column(name = "risk_type", nullable = false, length = 20)
  private RiskType type;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  // Convenience constructor
  public ItemRisk(OrderItem orderItem, RiskType type, String description) {
    this.orderItem = orderItem;
    this.type = type;
    this.description = description;
  }

  // Business methods
  public boolean requiresCustomerAcknowledgment() {
    return type == RiskType.COLOR_CHANGE
        || type == RiskType.DEFORMATION
        || type == RiskType.NO_WARRANTY;
  }

  public String getDisplayName() {
    return switch (type) {
      case COLOR_CHANGE -> "Можлива зміна кольору";
      case DEFORMATION -> "Можлива деформація";
      case NO_WARRANTY -> "Без гарантії";
    };
  }

  public String getWarningMessage() {
    return switch (type) {
      case COLOR_CHANGE -> "Увага! Можлива зміна або втрата кольору під час обробки.";
      case DEFORMATION -> "Увага! Можлива деформація виробу під час обробки.";
      case NO_WARRANTY -> "Увага! Обробка виконується без гарантії якості.";
    };
  }
}
