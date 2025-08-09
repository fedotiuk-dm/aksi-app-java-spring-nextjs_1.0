package com.aksi.service.pricing.calculation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.ItemCharacteristics;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.service.pricing.calculation.BaseAmountCalculator.BaseCalculationResult;
import com.aksi.service.pricing.util.PricingQueryUtils;

/**
 * Unit tests for BaseAmountCalculator verifying OrderWizard pricing logic steps 1-2: 1. Base price
 * from price list 2. Color-specific pricing adjustments (black vs colored vs no color)
 */
@ExtendWith(MockitoExtension.class)
class BaseAmountCalculatorTest {

  @Mock private PricingQueryUtils utils;

  private BaseAmountCalculator calculator;

  @BeforeEach
  void setUp() {
    calculator = new BaseAmountCalculator(utils);
  }

  @Test
  @DisplayName("Should calculate base amount without color - use basePrice")
  void shouldCalculateBaseAmountWithoutColor() {
    // Given: item without color characteristics
    PriceCalculationItem item = createItem(2, null);
    PriceListItemInfo priceListItem = createPriceListItem(1000, 1200, 1100);

    when(utils.determineBasePrice(priceListItem, null)).thenReturn(1000);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should use base price * quantity
    assertEquals(1000, result.basePrice());
    assertEquals(2000, result.baseAmount()); // 1000 * 2
  }

  @Test
  @DisplayName("Should calculate base amount with black color - use priceBlack")
  void shouldCalculateBaseAmountWithBlackColor() {
    // Given: item with black color
    PriceCalculationItem item = createItem(3, "black");
    PriceListItemInfo priceListItem = createPriceListItem(1000, 1200, 1100);

    when(utils.determineBasePrice(eq(priceListItem), eq("black"))).thenReturn(1200);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should use black price * quantity
    assertEquals(1200, result.basePrice());
    assertEquals(3600, result.baseAmount()); // 1200 * 3
  }

  @Test
  @DisplayName("Should calculate base amount with black color (Ukrainian) - use priceBlack")
  void shouldCalculateBaseAmountWithBlackColorUkrainian() {
    // Given: item with Ukrainian black color
    PriceCalculationItem item = createItem(1, "чорний");
    PriceListItemInfo priceListItem = createPriceListItem(1000, 1200, 1100);

    when(utils.determineBasePrice(eq(priceListItem), eq("чорний"))).thenReturn(1200);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should use black price * quantity
    assertEquals(1200, result.basePrice());
    assertEquals(1200, result.baseAmount()); // 1200 * 1
  }

  @Test
  @DisplayName("Should calculate base amount with colored item - use priceColor")
  void shouldCalculateBaseAmountWithColoredItem() {
    // Given: item with any color (not black)
    PriceCalculationItem item = createItem(4, "red");
    PriceListItemInfo priceListItem = createPriceListItem(1000, 1200, 1100);

    when(utils.determineBasePrice(eq(priceListItem), eq("red"))).thenReturn(1100);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should use color price * quantity
    assertEquals(1100, result.basePrice());
    assertEquals(4400, result.baseAmount()); // 1100 * 4
  }

  @Test
  @DisplayName("Should calculate base amount with empty color - use basePrice")
  void shouldCalculateBaseAmountWithEmptyColor() {
    // Given: item with empty color string
    PriceCalculationItem item = createItem(5, "");
    PriceListItemInfo priceListItem = createPriceListItem(1000, 1200, 1100);

    when(utils.determineBasePrice(eq(priceListItem), eq(""))).thenReturn(1000);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should use base price * quantity
    assertEquals(1000, result.basePrice());
    assertEquals(5000, result.baseAmount()); // 1000 * 5
  }

  @Test
  @DisplayName("Should calculate base amount with blank color - use basePrice")
  void shouldCalculateBaseAmountWithBlankColor() {
    // Given: item with blank color string
    PriceCalculationItem item = createItem(2, "   ");
    PriceListItemInfo priceListItem = createPriceListItem(1000, 1200, 1100);

    when(utils.determineBasePrice(eq(priceListItem), eq("   "))).thenReturn(1000);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should use base price * quantity
    assertEquals(1000, result.basePrice());
    assertEquals(2000, result.baseAmount()); // 1000 * 2
  }

  @Test
  @DisplayName("Should handle single item quantity correctly")
  void shouldHandleSingleItemQuantity() {
    // Given: single item
    PriceCalculationItem item = createItem(1, "blue");
    PriceListItemInfo priceListItem = createPriceListItem(1500, 1800, 1600);

    when(utils.determineBasePrice(any(), any())).thenReturn(1600);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: baseAmount should equal basePrice for quantity 1
    assertEquals(1600, result.basePrice());
    assertEquals(1600, result.baseAmount()); // 1600 * 1
  }

  @Test
  @DisplayName("Should handle large quantities correctly")
  void shouldHandleLargeQuantities() {
    // Given: large quantity item
    PriceCalculationItem item = createItem(100, "green");
    PriceListItemInfo priceListItem = createPriceListItem(500, 600, 550);

    when(utils.determineBasePrice(any(), any())).thenReturn(550);

    // When
    BaseCalculationResult result = calculator.calculate(item, priceListItem);

    // Then: should calculate correctly for large quantities
    assertEquals(550, result.basePrice());
    assertEquals(55000, result.baseAmount()); // 550 * 100
  }

  // Helper methods for creating test objects

  private PriceCalculationItem createItem(int quantity, String color) {
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(UUID.randomUUID());
    item.setQuantity(quantity);

    if (color != null) {
      ItemCharacteristics characteristics = new ItemCharacteristics();
      characteristics.setColor(color);
      item.setCharacteristics(characteristics);
    }

    return item;
  }

  private PriceListItemInfo createPriceListItem(
      Integer basePrice, Integer priceBlack, Integer priceColor) {
    PriceListItemInfo info = new PriceListItemInfo();
    info.setId(UUID.randomUUID());
    info.setName("Test Item");
    info.setBasePrice(basePrice);
    info.setPriceBlack(priceBlack);
    info.setPriceColor(priceColor);
    return info;
  }
}
