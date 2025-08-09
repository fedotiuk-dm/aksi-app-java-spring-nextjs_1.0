package com.aksi.service.pricing.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for PricingQueryUtils.calculateFinalAmount verifying OrderWizard pricing logic step 8:
 * Final calculation: base + modifiers + urgency - discounts
 */
class PricingQueryUtilsFinalAmountTest {

  private PricingQueryUtils pricingQueryUtils;

  @BeforeEach
  void setUp() {
    pricingQueryUtils = new PricingQueryUtils();
  }

  @Test
  @DisplayName("Should calculate final amount with all positive values")
  void shouldCalculateFinalAmountWithAllPositiveValues() {
    // Given: typical pricing scenario
    int baseAmount = 2000; // base price * quantity
    int modifiersTotal = 500; // sum of all item modifiers
    int urgencyAmount = 1000; // 50% urgency
    int discountAmount = 350; // 10% discount

    // When: calculate final amount (step 8)
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: should apply formula: base + modifiers + urgency - discount
    // 2000 + 500 + 1000 - 350 = 3150
    assertEquals(3150, result);
  }

  @Test
  @DisplayName("Should calculate final amount with zero modifiers")
  void shouldCalculateFinalAmountWithZeroModifiers() {
    // Given: no modifiers applied
    int baseAmount = 1500;
    int modifiersTotal = 0; // no modifiers
    int urgencyAmount = 750; // 50% urgency
    int discountAmount = 225; // 10% discount

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 1500 + 0 + 750 - 225 = 2025
    assertEquals(2025, result);
  }

  @Test
  @DisplayName("Should calculate final amount with zero urgency")
  void shouldCalculateFinalAmountWithZeroUrgency() {
    // Given: no urgency applied (normal delivery)
    int baseAmount = 1000;
    int modifiersTotal = 300;
    int urgencyAmount = 0; // no urgency
    int discountAmount = 130; // 10% discount

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 1000 + 300 + 0 - 130 = 1170
    assertEquals(1170, result);
  }

  @Test
  @DisplayName("Should calculate final amount with zero discount")
  void shouldCalculateFinalAmountWithZeroDiscount() {
    // Given: no discount applied
    int baseAmount = 800;
    int modifiersTotal = 200;
    int urgencyAmount = 400; // 50% urgency
    int discountAmount = 0; // no discount

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 800 + 200 + 400 - 0 = 1400
    assertEquals(1400, result);
  }

  @Test
  @DisplayName("Should calculate final amount with all zeros")
  void shouldCalculateFinalAmountWithAllZeros() {
    // Given: all values are zero
    int baseAmount = 0;
    int modifiersTotal = 0;
    int urgencyAmount = 0;
    int discountAmount = 0;

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 0 + 0 + 0 - 0 = 0
    assertEquals(0, result);
  }

  @Test
  @DisplayName("Should calculate final amount with large values")
  void shouldCalculateFinalAmountWithLargeValues() {
    // Given: large pricing amounts (expensive items)
    int baseAmount = 100000; // 1000.00 грн
    int modifiersTotal = 25000; // 250.00 грн in modifiers
    int urgencyAmount = 62500; // 50% urgency (625.00 грн)
    int discountAmount = 18750; // 10% discount (187.50 грн)

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 100000 + 25000 + 62500 - 18750 = 168750
    assertEquals(168750, result);
  }

  @Test
  @DisplayName("Should calculate final amount with small values")
  void shouldCalculateFinalAmountWithSmallValues() {
    // Given: small pricing amounts (minimal items)
    int baseAmount = 100; // 1.00 грн
    int modifiersTotal = 25; // 0.25 грн
    int urgencyAmount = 50; // 0.50 грн
    int discountAmount = 10; // 0.10 грн

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 100 + 25 + 50 - 10 = 165
    assertEquals(165, result);
  }

  @Test
  @DisplayName("Should handle discount larger than subtotal (negative result)")
  void shouldHandleDiscountLargerThanSubtotal() {
    // Given: discount amount exceeds base + modifiers + urgency (edge case)
    int baseAmount = 1000;
    int modifiersTotal = 200;
    int urgencyAmount = 300;
    int discountAmount = 2000; // discount > total

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 1000 + 200 + 300 - 2000 = -500 (negative result allowed)
    assertEquals(-500, result);
  }

  @Test
  @DisplayName("Should calculate with maximum urgency (100% EXPRESS_24H)")
  void shouldCalculateWithMaximumUrgency() {
    // Given: maximum urgency applied (EXPRESS_24H = 100%)
    int baseAmount = 1500;
    int modifiersTotal = 300;
    int urgencyAmount = 1800; // 100% urgency (1500 + 300) * 100%
    int discountAmount = 270; // 15% student discount

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 1500 + 300 + 1800 - 270 = 3330
    assertEquals(3330, result);
  }

  @Test
  @DisplayName("Should calculate with multiple modifiers and high discount")
  void shouldCalculateWithMultipleModifiersAndHighDiscount() {
    // Given: multiple modifiers and high seasonal discount
    int baseAmount = 2500;
    int modifiersTotal = 1000; // multiple expensive modifiers
    int urgencyAmount = 1750; // 50% urgency on (2500+1000)
    int discountAmount = 1312; // 25% seasonal discount on (2500+1000+1750)

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 2500 + 1000 + 1750 - 1312 = 3938
    assertEquals(3938, result);
  }

  @Test
  @DisplayName("Should calculate complex real-world scenario")
  void shouldCalculateComplexRealWorldScenario() {
    // Given: complex real-world pricing scenario
    // Item: suit dry cleaning (3 pieces), colored fabric
    // Modifiers: stain removal, button repair, express cleaning
    // Urgency: EXPRESS_48H (+50%)
    // Discount: 12% loyalty discount
    int baseAmount = 4500; // 45.00 грн for 3 pieces
    int modifiersTotal = 1800; // 18.00 грн in modifiers
    int urgencyAmount = 3150; // 50% urgency on (4500+1800)
    int discountAmount = 1134; // 12% on (4500+1800+3150)

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 4500 + 1800 + 3150 - 1134 = 8316
    assertEquals(8316, result);
  }

  @Test
  @DisplayName("Should calculate minimum viable scenario")
  void shouldCalculateMinimumViableScenario() {
    // Given: minimum viable pricing (single small item, no extras)
    int baseAmount = 500; // 5.00 грн minimum service
    int modifiersTotal = 0; // no modifiers
    int urgencyAmount = 0; // normal delivery
    int discountAmount = 0; // no discount

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 500 + 0 + 0 - 0 = 500
    assertEquals(500, result);
  }

  @Test
  @DisplayName("Should handle edge case where only discount is applied")
  void shouldHandleEdgeCaseWithOnlyDiscount() {
    // Given: edge case with only discount (others are zero)
    int baseAmount = 0;
    int modifiersTotal = 0;
    int urgencyAmount = 0;
    int discountAmount = 100; // discount on something

    // When
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: 0 + 0 + 0 - 100 = -100
    assertEquals(-100, result);
  }

  @Test
  @DisplayName("Should verify formula correctness with step-by-step calculation")
  void shouldVerifyFormulaCorrectnessStepByStep() {
    // Given: clear step-by-step OrderWizard calculation
    // Step 1-2: Base amount (base price * quantity with color adjustment)
    int baseAmount = 1200;
    // Steps 3-5: Modifiers total (sum of all applicable modifiers)
    int modifiersTotal = 400;
    // Step 6: Urgency amount (+50% or +100%)
    int urgencyAmount = 800; // 50% on (1200+400)
    // Step 7: Discount amount (percentage on subtotal+urgency)
    int discountAmount = 240; // 10% on (1200+400+800)
    // Step 8: Final calculation

    // When: applying final formula
    int result =
        pricingQueryUtils.calculateFinalAmount(
            baseAmount, modifiersTotal, urgencyAmount, discountAmount);

    // Then: verify each step of the calculation
    int subtotal = baseAmount + modifiersTotal; // 1200 + 400 = 1600
    int afterUrgency = subtotal + urgencyAmount; // 1600 + 800 = 2400
    int finalAmount = afterUrgency - discountAmount; // 2400 - 240 = 2160

    assertEquals(2160, result);
    assertEquals(finalAmount, result); // confirm formula matches step-by-step
  }
}
