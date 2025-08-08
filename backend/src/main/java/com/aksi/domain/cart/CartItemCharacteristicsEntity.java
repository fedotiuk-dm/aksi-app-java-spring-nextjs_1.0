package com.aksi.domain.cart;

import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.order.ItemCharacteristicsEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Physical characteristics of a cart item (material, color, wear level, etc.) */
@Entity
@Table(name = "cart_item_characteristics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemCharacteristicsEntity extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_item_id", nullable = false)
  private CartItem cartItem;

  @Column(name = "material")
  private String material;

  @Column(name = "color")
  private String color;

  @Column(name = "filler")
  private String filler;

  @Enumerated(EnumType.STRING)
  @Column(name = "filler_condition", length = 20)
  private ItemCharacteristicsEntity.FillerCondition fillerCondition; // NORMAL, COMPRESSED

  @Column(name = "wear_level")
  private Integer wearLevel; // 10, 30, 50, 75
}
