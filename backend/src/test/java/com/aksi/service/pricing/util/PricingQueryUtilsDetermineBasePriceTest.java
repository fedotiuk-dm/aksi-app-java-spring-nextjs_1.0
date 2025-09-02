package com.aksi.service.pricing.util;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.aksi.api.pricelist.dto.PriceListItemInfo;

class PricingQueryUtilsDetermineBasePriceTest {

  private PricingQueryUtils utils;

  @BeforeEach
  void setUp() {
    utils = new PricingQueryUtils();
  }

  private PriceListItemInfo item(Integer base, Integer black, Integer color) {
    PriceListItemInfo i = new PriceListItemInfo();
    i.setId(UUID.randomUUID());
    i.setName("Test");
    i.setBasePrice(base);
    i.setPriceBlack(black);
    i.setPriceColor(color);
    return i;
  }

  @Test
  @DisplayName("No color → base price")
  void noColorUsesBase() {
    var i = item(1000, 1200, 1100);
    assertEquals(1000, utils.determineBasePrice(i, null));
  }

  @Test
  @DisplayName("Black color with priceBlack → uses black price")
  void blackUsesBlack() {
    var i = item(1000, 1200, 1100);
    assertEquals(1200, utils.determineBasePrice(i, "black"));
    assertEquals(1200, utils.determineBasePrice(i, "чорний"));
  }

  @Test
  @DisplayName("Black color without priceBlack but with priceColor → uses color price (fallback)")
  void blackWithoutBlackPriceUsesColorIfPresent() {
    var i = item(1000, null, 1100);
    assertEquals(1100, utils.determineBasePrice(i, "black"));
  }

  @Test
  @DisplayName("Black color without black/color prices → uses base price")
  void blackWithoutAnySpecificPricesUsesBase() {
    var i = item(1000, null, null);
    assertEquals(1000, utils.determineBasePrice(i, "black"));
  }

  @Test
  @DisplayName("Colored item with priceColor → uses color price")
  void coloredUsesColor() {
    var i = item(1000, 1200, 1100);
    assertEquals(1100, utils.determineBasePrice(i, "red"));
  }

  @Test
  @DisplayName("Colored item without priceColor → uses base price")
  void coloredWithoutColorPriceUsesBase() {
    var i = item(1000, 1200, null);
    assertEquals(1000, utils.determineBasePrice(i, "red"));
  }
}
