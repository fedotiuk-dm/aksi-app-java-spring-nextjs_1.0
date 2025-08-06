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

/** Item stain entity for tracking stains on order items */
@Entity
@Table(
    name = "item_stains",
    indexes = {
      @Index(name = "idx_item_stain_order_item", columnList = "order_item_id"),
      @Index(name = "idx_item_stain_type", columnList = "stain_type")
    })
@Getter
@Setter
@NoArgsConstructor
public class ItemStainEntity extends BaseEntity {

  public enum StainType {
    GREASE,
    BLOOD,
    PROTEIN,
    WINE,
    COFFEE,
    GRASS,
    INK,
    COSMETICS,
    OTHER
  }

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItemEntity orderItemEntity;

  @Enumerated(EnumType.STRING)
  @Column(name = "stain_type", nullable = false, length = 20)
  private StainType type;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  // Convenience constructor
  public ItemStainEntity(OrderItemEntity orderItemEntity, StainType type, String description) {
    this.orderItemEntity = orderItemEntity;
    this.type = type;
    this.description = description;
  }

  // Business methods
  public boolean requiresSpecialTreatment() {
    return type == StainType.BLOOD
        || type == StainType.PROTEIN
        || type == StainType.INK
        || type == StainType.WINE;
  }

  public String getDisplayName() {
    return switch (type) {
      case GREASE -> "Жирна пляма";
      case BLOOD -> "Кров";
      case PROTEIN -> "Білкова пляма";
      case WINE -> "Вино";
      case COFFEE -> "Кава";
      case GRASS -> "Трава";
      case INK -> "Чорнило";
      case COSMETICS -> "Косметика";
      case OTHER -> "Інше";
    };
  }
}
