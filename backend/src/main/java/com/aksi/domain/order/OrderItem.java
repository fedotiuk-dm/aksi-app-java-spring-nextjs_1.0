package com.aksi.domain.order;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.catalog.PriceListItem;
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
public class OrderItem extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "price_list_item_id", nullable = false)
  private PriceListItem priceListItem;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @OneToOne(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private ItemCharacteristics characteristics;

  @OneToMany(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemStain> stains = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemDefect> defects = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemRisk> risks = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemPhoto> photos = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<ItemModifier> modifiers = new ArrayList<>();

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

  // Business methods
  public void addStain(ItemStain stain) {
    stains.add(stain);
    stain.setOrderItem(this);
  }

  public void removeStain(ItemStain stain) {
    stains.remove(stain);
    stain.setOrderItem(null);
  }

  public void addDefect(ItemDefect defect) {
    defects.add(defect);
    defect.setOrderItem(this);
  }

  public void removeDefect(ItemDefect defect) {
    defects.remove(defect);
    defect.setOrderItem(null);
  }

  public void addRisk(ItemRisk risk) {
    risks.add(risk);
    risk.setOrderItem(this);
  }

  public void removeRisk(ItemRisk risk) {
    risks.remove(risk);
    risk.setOrderItem(null);
  }

  public void addPhoto(ItemPhoto photo) {
    photos.add(photo);
    photo.setOrderItem(this);
  }

  public void removePhoto(ItemPhoto photo) {
    photos.remove(photo);
    photo.setOrderItem(null);
  }

  public void addModifier(ItemModifier modifier) {
    modifiers.add(modifier);
    modifier.setOrderItem(this);
  }

  public void removeModifier(ItemModifier modifier) {
    modifiers.remove(modifier);
    modifier.setOrderItem(null);
  }

  public void setCharacteristics(ItemCharacteristics characteristics) {
    this.characteristics = characteristics;
    if (characteristics != null) {
      characteristics.setOrderItem(this);
    }
  }
}
