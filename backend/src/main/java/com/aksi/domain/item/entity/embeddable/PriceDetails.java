package com.aksi.domain.item.entity.embeddable;

import java.math.BigDecimal;

import com.aksi.domain.item.enums.ItemColor;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Embeddable object for storing different price variations */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceDetails {

  @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal basePrice;

  @Column(name = "price_black", precision = 10, scale = 2)
  private BigDecimal priceBlack;

  @Column(name = "price_color", precision = 10, scale = 2)
  private BigDecimal priceColor;

  /**
   * Get price based on item color
   *
   * @param color the color of the item
   * @return appropriate price based on color
   */
  public BigDecimal getPriceForColor(ItemColor color) {
    if (color != null && color.isBlack() && priceBlack != null) {
      return priceBlack;
    } else if (color != null && color.hasSpecialPricing() && priceColor != null) {
      return priceColor;
    }
    return basePrice;
  }
}
