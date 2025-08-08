package com.aksi.domain.order;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Order item entity representing individual items within an order */
@Entity
@Table(
    name = "order_items",
    indexes = {
      @Index(name = "idx_order_item_order", columnList = "order_id"),
      @Index(name = "idx_order_item_price_list", columnList = "price_list_item_id")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false)
  private OrderEntity orderEntity;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "price_list_item_id", nullable = false)
  private PriceListItemEntity priceListItemEntity;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @OneToOne(
      mappedBy = "orderItemEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true)
  private ItemCharacteristicsEntity characteristics;

  @OneToMany(
      mappedBy = "orderItemEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemStainEntity> stains = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItemEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemDefectEntity> defects = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItemEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemRiskEntity> risks = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItemEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemPhotoEntity> photos = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItemEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemModifierEntity> modifiers = new ArrayList<>();

  // Pricing snapshot fields
  @Column(name = "base_price", nullable = false)
  private Integer basePrice = 0;

  @Column(name = "modifiers_total_amount", nullable = false)
  private Integer modifiersTotalAmount = 0;

  @Column(name = "subtotal", nullable = false)
  private Integer subtotal = 0;

  @Column(name = "urgency_amount", nullable = false)
  private Integer urgencyAmount = 0;

  @Column(name = "discount_amount", nullable = false)
  private Integer discountAmount = 0;

  @Column(name = "total_amount", nullable = false)
  private Integer totalAmount = 0;

  @Column(name = "discount_eligible", nullable = false)
  private boolean discountEligible = true;

}
