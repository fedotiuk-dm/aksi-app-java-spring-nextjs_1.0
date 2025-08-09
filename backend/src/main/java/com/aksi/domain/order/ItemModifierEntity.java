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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item modifier entity for storing applied modifiers for order items */
@Entity
@Table(
    name = "item_modifiers",
    indexes = {
      @Index(name = "idx_item_modifier_order_item", columnList = "order_item_id"),
      @Index(name = "idx_item_modifier_code", columnList = "modifier_code")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemModifierEntity extends BaseEntity {

  public enum ModifierType {
    PERCENTAGE,
    FIXED,
    FORMULA
  }

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItemEntity orderItemEntity;

  @Column(name = "modifier_code", nullable = false, length = 50)
  private String code;

  @Column(name = "modifier_name", nullable = false)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "modifier_type", nullable = false, length = 20)
  private ModifierType type;

  @Column(name = "modifier_value", nullable = false)
  private Integer value;

  @Column(name = "applied_amount", nullable = false)
  private Integer appliedAmount;

  @Column(name = "jexl_formula", columnDefinition = "TEXT")
  private String jexlFormula;
}
