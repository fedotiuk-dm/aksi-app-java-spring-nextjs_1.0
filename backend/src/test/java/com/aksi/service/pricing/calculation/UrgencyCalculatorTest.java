package com.aksi.service.pricing.calculation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.service.pricing.PriceCalculationService;
import com.aksi.service.pricing.calculation.UrgencyCalculator.UrgencyCalculationResult;
import com.aksi.service.pricing.factory.PricingFactory;

/**
 * Unit tests for UrgencyCalculator verifying OrderWizard pricing logic step 6: 6. Urgency (if
 * selected): +50% for EXPRESS_48H or +100% for EXPRESS_24H to intermediate sum
 */
@ExtendWith(MockitoExtension.class)
class UrgencyCalculatorTest {

  @Mock private PriceCalculationService priceCalculationService;
  @Mock private PricingFactory factory;

  private UrgencyCalculator calculator;

  @BeforeEach
  void setUp() {
    calculator = new UrgencyCalculator(priceCalculationService, factory);
  }

  @Test
  @DisplayName("Should return zero urgency when globalModifiers is null")
  void shouldReturnZeroWhenGlobalModifiersIsNull() {
    // Given: no global modifiers
    int subtotal = 1000;
    GlobalPriceModifiers globalModifiers = null;

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should return zero urgency
    assertNull(result.urgencyModifier());
    assertEquals(0, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should return zero urgency when urgency type is null")
  void shouldReturnZeroWhenUrgencyTypeIsNull() {
    // Given: global modifiers with null urgency type
    int subtotal = 1000;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(null);

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should return zero urgency
    assertNull(result.urgencyModifier());
    assertEquals(0, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should return zero urgency when urgency type is NORMAL")
  void shouldReturnZeroWhenUrgencyTypeIsNormal() {
    // Given: global modifiers with NORMAL urgency (no surcharge)
    int subtotal = 2000;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.NORMAL);

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should return zero urgency
    assertNull(result.urgencyModifier());
    assertEquals(0, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should calculate 50% urgency for EXPRESS_48H")
  void shouldCalculate50PercentForExpress48H() {
    // Given: EXPRESS_48H urgency (+50%)
    int subtotal = 2000;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.EXPRESS_48_H);

    // Mock calculation service (50% of 2000 = 1000)
    when(priceCalculationService.calculateUrgencyAmount(eq(subtotal), eq(UrgencyType.EXPRESS_48_H)))
        .thenReturn(1000);
    when(priceCalculationService.getUrgencyPercentage(eq(UrgencyType.EXPRESS_48_H))).thenReturn(50);

    // Mock factory
    AppliedModifier urgencyModifier = createAppliedModifier("EXPRESS_48H", 1000);
    when(factory.createUrgencyModifier(eq(UrgencyType.EXPRESS_48_H), eq(1000), eq(50)))
        .thenReturn(urgencyModifier);

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should apply 50% urgency surcharge
    assertEquals("EXPRESS_48H", result.urgencyModifier().getCode());
    assertEquals(1000, result.urgencyModifier().getAmount());
    assertEquals(1000, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should calculate 100% urgency for EXPRESS_24H")
  void shouldCalculate100PercentForExpress24H() {
    // Given: EXPRESS_24H urgency (+100%)
    int subtotal = 1500;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.EXPRESS_24_H);

    // Mock calculation service (100% of 1500 = 1500)
    when(priceCalculationService.calculateUrgencyAmount(eq(subtotal), eq(UrgencyType.EXPRESS_24_H)))
        .thenReturn(1500);
    when(priceCalculationService.getUrgencyPercentage(eq(UrgencyType.EXPRESS_24_H)))
        .thenReturn(100);

    // Mock factory
    AppliedModifier urgencyModifier = createAppliedModifier("EXPRESS_24H", 1500);
    when(factory.createUrgencyModifier(eq(UrgencyType.EXPRESS_24_H), eq(1500), eq(100)))
        .thenReturn(urgencyModifier);

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should apply 100% urgency surcharge
    assertEquals("EXPRESS_24H", result.urgencyModifier().getCode());
    assertEquals(1500, result.urgencyModifier().getAmount());
    assertEquals(1500, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should return zero when calculation service returns zero or negative amount")
  void shouldReturnZeroWhenCalculationReturnsZeroOrNegative() {
    // Given: urgency type but calculation service returns 0
    int subtotal = 500;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.EXPRESS_48_H);

    when(priceCalculationService.calculateUrgencyAmount(eq(subtotal), eq(UrgencyType.EXPRESS_48_H)))
        .thenReturn(0); // or negative

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should return zero urgency
    assertNull(result.urgencyModifier());
    assertEquals(0, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should return zero when calculation service returns negative amount")
  void shouldReturnZeroWhenCalculationReturnsNegativeAmount() {
    // Given: urgency type but calculation service returns negative amount
    int subtotal = 100;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.EXPRESS_24_H);

    when(priceCalculationService.calculateUrgencyAmount(eq(subtotal), eq(UrgencyType.EXPRESS_24_H)))
        .thenReturn(-50); // negative amount

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should return zero urgency
    assertNull(result.urgencyModifier());
    assertEquals(0, result.urgencyAmount());
  }

  @Test
  @DisplayName("Should handle large subtotal amounts correctly")
  void shouldHandleLargeSubtotalAmounts() {
    // Given: large subtotal amount
    int subtotal = 100000; // 1000.00 грн
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.EXPRESS_48_H);

    // Mock calculation service (50% of 100000 = 50000)
    when(priceCalculationService.calculateUrgencyAmount(eq(subtotal), eq(UrgencyType.EXPRESS_48_H)))
        .thenReturn(50000);
    when(priceCalculationService.getUrgencyPercentage(eq(UrgencyType.EXPRESS_48_H))).thenReturn(50);

    // Mock factory
    AppliedModifier urgencyModifier = createAppliedModifier("EXPRESS_48H", 50000);
    when(factory.createUrgencyModifier(eq(UrgencyType.EXPRESS_48_H), eq(50000), eq(50)))
        .thenReturn(urgencyModifier);

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should handle large amounts correctly
    assertEquals(50000, result.urgencyAmount());
    assertEquals(50000, result.urgencyModifier().getAmount());
  }

  @Test
  @DisplayName("Should handle small subtotal amounts correctly")
  void shouldHandleSmallSubtotalAmounts() {
    // Given: small subtotal amount
    int subtotal = 10; // 0.10 грн (10 kopiykas)
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(UrgencyType.EXPRESS_24_H);

    // Mock calculation service (100% of 10 = 10)
    when(priceCalculationService.calculateUrgencyAmount(eq(subtotal), eq(UrgencyType.EXPRESS_24_H)))
        .thenReturn(10);
    when(priceCalculationService.getUrgencyPercentage(eq(UrgencyType.EXPRESS_24_H)))
        .thenReturn(100);

    // Mock factory
    AppliedModifier urgencyModifier = createAppliedModifier("EXPRESS_24H", 10);
    when(factory.createUrgencyModifier(eq(UrgencyType.EXPRESS_24_H), eq(10), eq(100)))
        .thenReturn(urgencyModifier);

    // When
    UrgencyCalculationResult result = calculator.calculate(subtotal, globalModifiers);

    // Then: should handle small amounts correctly
    assertEquals(10, result.urgencyAmount());
    assertEquals(10, result.urgencyModifier().getAmount());
  }

  // Helper methods for creating test objects

  private GlobalPriceModifiers createGlobalModifiers(UrgencyType urgencyType) {
    GlobalPriceModifiers modifiers = new GlobalPriceModifiers();
    modifiers.setUrgencyType(urgencyType);
    return modifiers;
  }

  private AppliedModifier createAppliedModifier(String code, int amount) {
    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(code);
    modifier.setAmount(amount);
    return modifier;
  }
}
