package com.aksi.domain.cart;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Applied modifiers for cart items (additional services, special handling, etc.) */
@Entity
@Table(
    name = "cart_item_modifiers",
    indexes = {@Index(name = "idx_cart_item_modifier_code", columnList = "cart_item_id, code")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemModifierEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_item_id", nullable = false)
  private CartItem cartItem;

  @Column(name = "code", nullable = false, length = 50)
  private String code;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "type", nullable = false, length = 20)
  private String type; // PERCENTAGE, FIXED

  @Column(name = "value", nullable = false)
  private Integer value; // For percentage: 50 means 50%, for fixed: amount in kopiykas
}
