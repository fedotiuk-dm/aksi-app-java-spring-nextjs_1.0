package com.aksi.domain.order;

import com.aksi.api.order.dto.RiskType;
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
public class ItemRiskEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItemEntity orderItemEntity;

  @Enumerated(EnumType.STRING)
  @Column(name = "risk_type", nullable = false, length = 20)
  private RiskType type;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;
}
