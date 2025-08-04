package com.aksi.domain.cart;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.customer.Customer;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Shopping cart entity for temporary order storage and price calculation.
 * Cart has TTL and automatically expires after certain time.
 */
@Entity
@Table(
    name = "carts",
    indexes = {
      @Index(name = "idx_cart_customer", columnList = "customer_id"),
      @Index(name = "idx_cart_expires_at", columnList = "expires_at"),
      @Index(name = "idx_cart_active", columnList = "expires_at, customer_id")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @OneToMany(
      mappedBy = "cart",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<CartItem> items = new ArrayList<>();

  @Column(name = "urgency_type", length = 20)
  private String urgencyType = "NORMAL";

  @Column(name = "discount_type", length = 20)
  private String discountType = "NONE";

  @Column(name = "discount_percentage")
  private Integer discountPercentage;

  @Column(name = "expected_completion_date")
  private Instant expectedCompletionDate;

  @Column(name = "expires_at", nullable = false)
  private Instant expiresAt;

  public void addItem(CartItem item) {
    items.add(item);
    item.setCart(this);
  }

  public void removeItem(CartItem item) {
    items.remove(item);
    item.setCart(null);
  }

  public boolean isExpired() {
    return Instant.now().isAfter(expiresAt);
  }

  public void extendTtl(Instant newExpiresAt) {
    this.expiresAt = newExpiresAt;
  }
}