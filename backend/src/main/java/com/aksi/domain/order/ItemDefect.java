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

/** Item defect entity for tracking defects on order items */
@Entity
@Table(
    name = "item_defects",
    indexes = {
      @Index(name = "idx_item_defect_order_item", columnList = "order_item_id"),
      @Index(name = "idx_item_defect_type", columnList = "defect_type")
    })
@Getter
@Setter
@NoArgsConstructor
public class ItemDefect extends BaseEntity {

  public enum DefectType {
    WORN,
    TORN,
    MISSING_ACCESSORIES,
    DAMAGED_ACCESSORIES,
    OTHER
  }

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItem orderItem;

  @Enumerated(EnumType.STRING)
  @Column(name = "defect_type", nullable = false, length = 30)
  private DefectType type;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  // Convenience constructor
  public ItemDefect(OrderItem orderItem, DefectType type, String description) {
    this.orderItem = orderItem;
    this.type = type;
    this.description = description;
  }

  // Business methods
  public boolean affectsWarranty() {
    return type == DefectType.WORN || 
           type == DefectType.TORN || 
           type == DefectType.DAMAGED_ACCESSORIES;
  }

  public String getDisplayName() {
    return switch (type) {
      case WORN -> "Зношеність";
      case TORN -> "Розрив";
      case MISSING_ACCESSORIES -> "Відсутні аксесуари";
      case DAMAGED_ACCESSORIES -> "Пошкоджені аксесуари";
      case OTHER -> "Інше";
    };
  }
}