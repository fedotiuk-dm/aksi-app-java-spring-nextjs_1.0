package com.aksi.service.pricing.calculation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TotalsCalculator Tests")
class TotalsCalculatorTest {

  @Mock private PriceCalculationService priceCalculationService;

  private TotalsCalculator totalsCalculator;

  @BeforeEach
  void setUp() {
    totalsCalculator = new TotalsCalculator(priceCalculationService);
  }

  @Test
  @DisplayName("Should calculate totals for empty list")
  void shouldCalculateTotalsForEmptyList() {
    // When
    CalculationTotals result = totalsCalculator.calculate(Collections.emptyList(), null);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getItemsSubtotal()).isEqualTo(0);
    assertThat(result.getUrgencyAmount()).isEqualTo(0);
    assertThat(result.getDiscountAmount()).isEqualTo(0);
    assertThat(result.getDiscountApplicableAmount()).isEqualTo(0);
    assertThat(result.getTotal()).isEqualTo(0);
  }

  @Test
  @DisplayName("Should calculate totals for single item without modifiers")
  void shouldCalculateTotalsForSingleItem() {
    // Given
    CalculatedItemPrice item =
        createCalculatedItem(
            15000, // subtotal
            0, // urgency
            0, // discount
            false, // not discount eligible
            15000 // total
            );

    // When
    CalculationTotals result = totalsCalculator.calculate(List.of(item), null);

    // Then
    assertThat(result.getItemsSubtotal()).isEqualTo(15000);
    assertThat(result.getUrgencyAmount()).isEqualTo(0);
    assertThat(result.getDiscountAmount()).isEqualTo(0);
    assertThat(result.getDiscountApplicableAmount()).isEqualTo(0);
    assertThat(result.getTotal()).isEqualTo(15000);
  }

  @Test
  @DisplayName("Should calculate totals for multiple items")
  void shouldCalculateTotalsForMultipleItems() {
    // Given
    List<CalculatedItemPrice> items =
        Arrays.asList(
            createCalculatedItem(10000, 0, 0, false, 10000),
            createCalculatedItem(20000, 0, 0, false, 20000),
            createCalculatedItem(15000, 0, 0, false, 15000));

    // When
    CalculationTotals result = totalsCalculator.calculate(items, null);

    // Then
    assertThat(result.getItemsSubtotal()).isEqualTo(45000); // 100 + 200 + 150
    assertThat(result.getTotal()).isEqualTo(45000);
  }

  @Test
  @DisplayName("Should calculate totals with urgency")
  void shouldCalculateTotalsWithUrgency() {
    // Given
    List<CalculatedItemPrice> items =
        Arrays.asList(
            createCalculatedItem(10000, 5000, 0, false, 15000), // 100 + 50
            createCalculatedItem(20000, 10000, 0, false, 30000) // 200 + 100
            );

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);

    when(priceCalculationService.getUrgencyPercentage(
            GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H))
        .thenReturn(50);

    // When
    CalculationTotals result = totalsCalculator.calculate(items, globalModifiers);

    // Then
    assertThat(result.getItemsSubtotal()).isEqualTo(30000); // 100 + 200
    assertThat(result.getUrgencyAmount()).isEqualTo(15000); // 50 + 100
    assertThat(result.getUrgencyPercentage()).isEqualTo(50);
    assertThat(result.getTotal()).isEqualTo(45000); // 300 + 150
  }

  @Test
  @DisplayName("Should calculate totals with discounts")
  void shouldCalculateTotalsWithDiscounts() {
    // Given
    List<CalculatedItemPrice> items =
        Arrays.asList(
            createCalculatedItem(10000, 0, 1000, true, 9000), // Eligible: 100 - 10 = 90
            createCalculatedItem(20000, 0, 2000, true, 18000), // Eligible: 200 - 20 = 180
            createCalculatedItem(5000, 0, 0, false, 5000) // Not eligible: 50
            );

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);

    when(priceCalculationService.getDiscountPercentage(
            GlobalPriceModifiers.DiscountTypeEnum.EVERCARD, null))
        .thenReturn(10);

    // When
    CalculationTotals result = totalsCalculator.calculate(items, globalModifiers);

    // Then
    assertThat(result.getItemsSubtotal()).isEqualTo(35000); // 100 + 200 + 50
    assertThat(result.getDiscountAmount()).isEqualTo(3000); // 10 + 20 + 0
    assertThat(result.getDiscountPercentage()).isEqualTo(10);
    assertThat(result.getDiscountApplicableAmount())
        .isEqualTo(30000); // 100 + 200 (eligible items only)
    assertThat(result.getTotal()).isEqualTo(32000); // 350 - 30
  }

  @Test
  @DisplayName("Should calculate complex totals with urgency and discounts")
  void shouldCalculateComplexTotals() {
    // Given
    List<CalculatedItemPrice> items =
        Arrays.asList(
            // Item 1: Clothing with urgency and discount
            createComplexCalculatedItem(20000, 10000, 3000, true, 27000),
            // Item 2: Laundry with urgency but no discount (excluded category)
            createComplexCalculatedItem(10000, 5000, 0, false, 15000),
            // Item 3: Clothing with urgency and discount
            createComplexCalculatedItem(30000, 15000, 4500, true, 40500));

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);
    globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.MILITARY);

    when(priceCalculationService.getUrgencyPercentage(
            GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H))
        .thenReturn(50);
    when(priceCalculationService.getDiscountPercentage(
            GlobalPriceModifiers.DiscountTypeEnum.MILITARY, null))
        .thenReturn(10);

    // When
    CalculationTotals result = totalsCalculator.calculate(items, globalModifiers);

    // Then
    assertThat(result.getItemsSubtotal()).isEqualTo(60000); // 200 + 100 + 300
    assertThat(result.getUrgencyAmount()).isEqualTo(30000); // 100 + 50 + 150
    assertThat(result.getUrgencyPercentage()).isEqualTo(50);
    assertThat(result.getDiscountAmount()).isEqualTo(7500); // 30 + 0 + 45
    assertThat(result.getDiscountPercentage()).isEqualTo(10);
    assertThat(result.getDiscountApplicableAmount()).isEqualTo(50000); // 200 + 300 (eligible only)
    assertThat(result.getTotal()).isEqualTo(82500); // 270 + 150 + 405
  }

  @Test
  @DisplayName("Should handle null global modifiers")
  void shouldHandleNullGlobalModifiers() {
    // Given
    List<CalculatedItemPrice> items =
        Arrays.asList(
            createCalculatedItem(10000, 0, 0, false, 10000),
            createCalculatedItem(20000, 0, 0, false, 20000));

    // When
    CalculationTotals result = totalsCalculator.calculate(items, null);

    // Then
    assertThat(result.getItemsSubtotal()).isEqualTo(30000);
    assertThat(result.getUrgencyAmount()).isEqualTo(0);
    assertThat(result.getUrgencyPercentage()).isNull();
    assertThat(result.getDiscountAmount()).isEqualTo(0);
    assertThat(result.getDiscountPercentage()).isNull();
    assertThat(result.getTotal()).isEqualTo(30000);
  }

  @Test
  @DisplayName("Should calculate custom discount percentage")
  void shouldCalculateCustomDiscountPercentage() {
    // Given
    List<CalculatedItemPrice> items = List.of(createCalculatedItem(10000, 0, 2000, true, 8000));

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.OTHER);
    globalModifiers.setDiscountPercentage(20);

    when(priceCalculationService.getDiscountPercentage(
            GlobalPriceModifiers.DiscountTypeEnum.OTHER, 20))
        .thenReturn(20);

    // When
    CalculationTotals result = totalsCalculator.calculate(items, globalModifiers);

    // Then
    assertThat(result.getDiscountPercentage()).isEqualTo(20);
  }

  // Helper methods

  private CalculatedItemPrice createCalculatedItem(
      int subtotal, int urgencyAmount, int discountAmount, boolean discountEligible, int total) {

    CalculatedItemPrice item = new CalculatedItemPrice();
    item.setPriceListItemId(UUID.randomUUID());
    item.setItemName("Test Item");
    item.setCategoryCode("CLOTHING");
    item.setQuantity(1);
    item.setBasePrice(subtotal);
    item.setTotal(total);

    ItemPriceCalculation calc = new ItemPriceCalculation();
    calc.setBaseAmount(subtotal);
    calc.setModifiers(Collections.emptyList());
    calc.setModifiersTotal(0);
    calc.setSubtotal(subtotal);

    if (urgencyAmount > 0) {
      AppliedModifier urgencyModifier = new AppliedModifier();
      urgencyModifier.setCode("EXPRESS");
      urgencyModifier.setName("Urgency");
      urgencyModifier.setType(AppliedModifier.TypeEnum.PERCENTAGE);
      urgencyModifier.setValue(50);
      urgencyModifier.setAmount(urgencyAmount);
      calc.setUrgencyModifier(urgencyModifier);
    }

    if (discountAmount > 0) {
      AppliedModifier discountModifier = new AppliedModifier();
      discountModifier.setCode("DISCOUNT");
      discountModifier.setName("Discount");
      discountModifier.setType(AppliedModifier.TypeEnum.PERCENTAGE);
      discountModifier.setValue(10);
      discountModifier.setAmount(discountAmount);
      calc.setDiscountModifier(discountModifier);
    }

    calc.setDiscountEligible(discountEligible);
    calc.setFinalAmount(total);

    item.setCalculations(calc);
    return item;
  }

  private CalculatedItemPrice createComplexCalculatedItem(
      int subtotal, int urgencyAmount, int discountAmount, boolean discountEligible, int total) {

    return createCalculatedItem(subtotal, urgencyAmount, discountAmount, discountEligible, total);
  }
}
