package com.aksi.domain.cart;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class CartItemCharacteristics extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_item_id", nullable = false)
  private CartItem cartItem;

  @Column(name = "material")
  private String material;

  @Column(name = "color")
  private String color;

  @Column(name = "filler")
  private String filler;

  @Column(name = "filler_condition", length = 20)
  private String fillerCondition; // NORMAL, COMPRESSED

  @Column(name = "wear_level")
  private Integer wearLevel; // 10, 30, 50, 75
}
