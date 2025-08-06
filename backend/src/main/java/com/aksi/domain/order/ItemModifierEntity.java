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

  @Column(name = "modifier_name", nullable = false, length = 255)
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

  // Convenience constructor for percentage/fixed modifiers
  public ItemModifierEntity(
      OrderItemEntity orderItemEntity,
      String code,
      String name,
      ModifierType type,
      Integer value,
      Integer appliedAmount) {
    this.orderItemEntity = orderItemEntity;
    this.code = code;
    this.name = name;
    this.type = type;
    this.value = value;
    this.appliedAmount = appliedAmount;
  }

  // Convenience constructor for formula modifiers
  public ItemModifierEntity(
      OrderItemEntity orderItemEntity,
      String code,
      String name,
      String jexlFormula,
      Integer appliedAmount) {
    this.orderItemEntity = orderItemEntity;
    this.code = code;
    this.name = name;
    this.type = ModifierType.FORMULA;
    this.value = 0;
    this.appliedAmount = appliedAmount;
    this.jexlFormula = jexlFormula;
  }

  // Business methods
  public boolean isFormulaModifier() {
    return type == ModifierType.FORMULA;
  }

  public boolean isPercentageModifier() {
    return type == ModifierType.PERCENTAGE;
  }

  public boolean isFixedModifier() {
    return type == ModifierType.FIXED;
  }

  public String getFormattedValue() {
    return switch (type) {
      case PERCENTAGE -> (value / 100.0) + "%";
      case FIXED -> (value / 100.0) + " грн";
      case FORMULA -> "Формула: " + (jexlFormula != null ? jexlFormula : "Невідома");
    };
  }

  public String getFormattedAmount() {
    if (appliedAmount == null) return "0.00 грн";
    return String.format("%.2f грн", appliedAmount / 100.0);
  }
}
