package com.aksi.domain.cart;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Cart item entity representing a single product in the shopping cart. */
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_id", nullable = false)
  private CartEntity cartEntity;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "price_list_item_id", nullable = false)
  private PriceListItemEntity priceListItemEntity;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @OneToOne(mappedBy = "cartItem", cascade = CascadeType.ALL, orphanRemoval = true)
  private CartItemCharacteristicsEntity characteristics;

  @OneToMany(
      mappedBy = "cartItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<CartItemModifierEntity> modifiers = new ArrayList<>();
}
