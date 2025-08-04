package com.aksi.domain.cart;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.catalog.PriceListItem;
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

/**
 * Cart item entity representing a single product in the shopping cart.
 */
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_id", nullable = false)
  private Cart cart;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "price_list_item_id", nullable = false)
  private PriceListItem priceListItem;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @OneToOne(
      mappedBy = "cartItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private CartItemCharacteristics characteristics;

  @OneToMany(
      mappedBy = "cartItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<CartItemModifier> modifiers = new ArrayList<>();

  public void addModifier(CartItemModifier modifier) {
    modifiers.add(modifier);
    modifier.setCartItem(this);
  }

  public void removeModifier(CartItemModifier modifier) {
    modifiers.remove(modifier);
    modifier.setCartItem(null);
  }

  public void setCharacteristics(CartItemCharacteristics characteristics) {
    if (characteristics == null) {
      if (this.characteristics != null) {
        this.characteristics.setCartItem(null);
      }
    } else {
      characteristics.setCartItem(this);
    }
    this.characteristics = characteristics;
  }
}