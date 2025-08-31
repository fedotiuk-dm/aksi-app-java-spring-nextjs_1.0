package com.aksi.service.pricing.calculation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.service.pricing.PriceCalculationService;
import com.aksi.service.pricing.calculation.DiscountCalculator.DiscountCalculationResult;
import com.aksi.service.pricing.factory.PricingFactory;

/**
 * Unit tests for DiscountCalculator verifying OrderWizard pricing logic step 7: 7. Discounts (if
 * applicable and allowed for category) - discounts do not apply to ironing, laundry, and textile
 * dyeing
 */
@ExtendWith(MockitoExtension.class)
class DiscountCalculatorTest {

  @Mock private PriceCalculationService priceCalculationService;
  @Mock private PricingFactory factory;

  private DiscountCalculator calculator;

  @BeforeEach
  void setUp() {
    calculator = new DiscountCalculator(priceCalculationService, factory);
  }

  @Test
  @DisplayName("Should return no discount when globalModifiers is null")
  void shouldReturnNoDiscountWhenGlobalModifiersIsNull() {
    // Given: no global modifiers
    int subtotal = 2000;
    int urgencyAmount = 500;
    GlobalPriceModifiers globalModifiers = null;
    PriceListItemInfo priceListItem = createPriceListItem("LAUNDRY");

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should return no discount
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertFalse(result.discountEligible());
  }

  @Test
  @DisplayName("Should return no discount when discount type is NONE")
  void shouldReturnNoDiscountWhenDiscountTypeIsNone() {
    // Given: global modifiers with NONE discount type
    int subtotal = 1500;
    int urgencyAmount = 300;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.NONE, 20);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should return no discount
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertFalse(result.discountEligible());
  }

  @Test
  @DisplayName("Should return no discount when item category is not eligible for discount")
  void shouldReturnNoDiscountWhenCategoryNotEligible() {
    // Given: discount available but category not eligible (ironing, laundry, dyeing)
    int subtotal = 3000;
    int urgencyAmount = 600;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.EVERCARD, 15);
    PriceListItemInfo priceListItem = createPriceListItem("IRONING"); // not eligible

    // Mock discount eligibility check
    when(priceCalculationService.isDiscountApplicableToCategory(eq("IRONING"))).thenReturn(false);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should return no discount but category is not eligible
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertFalse(result.discountEligible()); // not eligible for this category
  }

  @Test
  @DisplayName("Should return no discount when discount percentage is null")
  void shouldReturnNoDiscountWhenPercentageIsNull() {
    // Given: eligible category but null discount percentage
    int subtotal = 2000;
    int urgencyAmount = 400;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.OTHER, null);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // Mock eligibility check as true
    when(priceCalculationService.isDiscountApplicableToCategory(eq("CLOTHING"))).thenReturn(true);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should return no discount but category is eligible
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertTrue(result.discountEligible()); // eligible but invalid percentage
  }

  @Test
  @DisplayName("Should return no discount when discount percentage is zero or negative")
  void shouldReturnNoDiscountWhenPercentageIsZeroOrNegative() {
    // Given: eligible category but zero discount percentage
    int subtotal = 1800;
    int urgencyAmount = 200;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.OTHER, 0);
    PriceListItemInfo priceListItem = createPriceListItem("ADDITIONAL_SERVICES");

    // Mock eligibility check as true
    when(priceCalculationService.isDiscountApplicableToCategory(eq("ADDITIONAL_SERVICES")))
        .thenReturn(true);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should return no discount but category is eligible
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertTrue(result.discountEligible()); // eligible but zero percentage
  }

  @Test
  @DisplayName("Should calculate valid discount for eligible category")
  void shouldCalculateValidDiscountForEligibleCategory() {
    // Given: eligible category with valid discount
    int subtotal = 2000;
    int urgencyAmount = 500;
    int discountableAmount = subtotal + urgencyAmount; // 2500
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.EVERCARD, 20);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("CLOTHING"))).thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(
            eq(discountableAmount), eq(DiscountType.EVERCARD), eq(20)))
        .thenReturn(500); // 20% of 2500

    // Mock factory
    AppliedModifier discountModifier = createAppliedModifier("EVERCARD", 500);
    when(factory.createDiscountModifier(eq(DiscountType.EVERCARD), eq(500), eq(20)))
        .thenReturn(discountModifier);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should apply discount correctly
    assertEquals("EVERCARD", result.discountModifier().getCode());
    assertEquals(500, result.discountModifier().getAmount());
    assertEquals(500, result.discountAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should calculate discount on subtotal + urgency amount")
  void shouldCalculateDiscountOnSubtotalPlusUrgency() {
    // Given: discount should be applied to (subtotal + urgency)
    int subtotal = 1000;
    int urgencyAmount = 1000; // 100% urgency
    int discountableAmount = 2000; // subtotal + urgency
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.SOCIAL_MEDIA, 10);
    PriceListItemInfo priceListItem = createPriceListItem("ADDITIONAL_SERVICES");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("ADDITIONAL_SERVICES")))
        .thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(
            eq(discountableAmount), eq(DiscountType.SOCIAL_MEDIA), eq(10)))
        .thenReturn(200); // 10% of 2000

    // Mock factory
    AppliedModifier discountModifier = createAppliedModifier("SOCIAL_MEDIA", 200);
    when(factory.createDiscountModifier(eq(DiscountType.SOCIAL_MEDIA), eq(200), eq(10)))
        .thenReturn(discountModifier);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should calculate discount on combined amount
    assertEquals(200, result.discountAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should handle multiple discount types - EVERCARD")
  void shouldHandleStudentDiscount() {
    // Given: student discount (typically 15-20%)
    int subtotal = 3000;
    int urgencyAmount = 0;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.EVERCARD, 15);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("CLOTHING"))).thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(
            eq(3000), eq(DiscountType.EVERCARD), eq(15)))
        .thenReturn(450); // 15% of 3000

    // Mock factory
    AppliedModifier discountModifier = createAppliedModifier("EVERCARD", 450);
    when(factory.createDiscountModifier(eq(DiscountType.EVERCARD), eq(450), eq(15)))
        .thenReturn(discountModifier);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should apply student discount
    assertEquals("EVERCARD", result.discountModifier().getCode());
    assertEquals(450, result.discountAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should handle multiple discount types - SOCIAL_MEDIA")
  void shouldHandleLoyaltyDiscount() {
    // Given: loyalty discount for regular customers
    int subtotal = 2500;
    int urgencyAmount = 750; // urgency applied
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.SOCIAL_MEDIA, 12);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("CLOTHING"))).thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(
            eq(3250), eq(DiscountType.SOCIAL_MEDIA), eq(12)))
        .thenReturn(390); // 12% of 3250

    // Mock factory
    AppliedModifier discountModifier = createAppliedModifier("SOCIAL_MEDIA", 390);
    when(factory.createDiscountModifier(eq(DiscountType.SOCIAL_MEDIA), eq(390), eq(12)))
        .thenReturn(discountModifier);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should apply social media discount
    assertEquals("SOCIAL_MEDIA", result.discountModifier().getCode());
    assertEquals(390, result.discountAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should handle multiple discount types - MILITARY")
  void shouldHandleSeasonalDiscount() {
    // Given: seasonal promotional discount
    int subtotal = 1200;
    int urgencyAmount = 400;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.MILITARY, 25);
    PriceListItemInfo priceListItem = createPriceListItem("ADDITIONAL_SERVICES");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("ADDITIONAL_SERVICES")))
        .thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(
            eq(1600), eq(DiscountType.MILITARY), eq(25)))
        .thenReturn(400); // 25% of 1600

    // Mock factory
    AppliedModifier discountModifier = createAppliedModifier("MILITARY", 400);
    when(factory.createDiscountModifier(eq(DiscountType.MILITARY), eq(400), eq(25)))
        .thenReturn(discountModifier);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should apply seasonal discount
    assertEquals("MILITARY", result.discountModifier().getCode());
    assertEquals(400, result.discountAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should return no discount when calculation service returns zero or negative")
  void shouldReturnNoDiscountWhenCalculationReturnsZeroOrNegative() {
    // Given: eligible discount but calculation returns zero
    int subtotal = 100;
    int urgencyAmount = 50;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.EVERCARD, 5);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("CLOTHING"))).thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(eq(150), eq(DiscountType.EVERCARD), eq(5)))
        .thenReturn(0); // calculation returns 0

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should return no discount but category is eligible
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should handle large discount amounts correctly")
  void shouldHandleLargeDiscountAmounts() {
    // Given: large amounts with discount
    int subtotal = 100000; // 1000.00 UAH
    int urgencyAmount = 50000; // 500.00 UAH urgency
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.MILITARY, 20);
    PriceListItemInfo priceListItem = createPriceListItem("CLOTHING");

    // Mock services
    when(priceCalculationService.isDiscountApplicableToCategory(eq("CLOTHING"))).thenReturn(true);
    when(priceCalculationService.calculateDiscountAmount(
            eq(150000), eq(DiscountType.MILITARY), eq(20)))
        .thenReturn(30000); // 20% of 150000

    // Mock factory
    AppliedModifier discountModifier = createAppliedModifier("MILITARY", 30000);
    when(factory.createDiscountModifier(eq(DiscountType.MILITARY), eq(30000), eq(20)))
        .thenReturn(discountModifier);

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should handle large amounts correctly
    assertEquals(30000, result.discountAmount());
    assertEquals(30000, result.discountModifier().getAmount());
    assertTrue(result.discountEligible());
  }

  @Test
  @DisplayName("Should verify restricted categories - IRONING should not allow discounts")
  void shouldVerifyRestrictedCategoriesIroning() {
    // Given: IRONING category (should be restricted for discounts)
    int subtotal = 1000;
    int urgencyAmount = 200;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.EVERCARD, 20);
    PriceListItemInfo priceListItem = createPriceListItem("IRONING");

    // Mock eligibility as false for restricted category
    when(priceCalculationService.isDiscountApplicableToCategory(eq("IRONING")))
        .thenReturn(false); // IRONING does not receive discounts

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should not apply discount to restricted category
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertFalse(result.discountEligible()); // not eligible for IRONING
  }

  @Test
  @DisplayName("Should verify restricted categories - LAUNDRY should not allow discounts")
  void shouldVerifyRestrictedCategoriesWashing() {
    // Given: WASHING category (should be restricted for discounts)
    int subtotal = 800;
    int urgencyAmount = 0;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.SOCIAL_MEDIA, 15);
    PriceListItemInfo priceListItem = createPriceListItem("LAUNDRY");

    // Mock eligibility as false for restricted category
    when(priceCalculationService.isDiscountApplicableToCategory(eq("LAUNDRY")))
        .thenReturn(false); // LAUNDRY does not receive discounts

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should not apply discount to restricted category
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertFalse(result.discountEligible()); // not eligible for WASHING
  }

  @Test
  @DisplayName("Should verify restricted categories - DYEING should not allow discounts")
  void shouldVerifyRestrictedCategoriesDyeing() {
    // Given: DYEING category (should be restricted for discounts)
    int subtotal = 1500;
    int urgencyAmount = 500;
    GlobalPriceModifiers globalModifiers = createGlobalModifiers(DiscountType.MILITARY, 30);
    PriceListItemInfo priceListItem = createPriceListItem("DYEING");

    // Mock eligibility as false for restricted category
    when(priceCalculationService.isDiscountApplicableToCategory(eq("DYEING")))
        .thenReturn(false); // DYEING does not receive discounts

    // When
    DiscountCalculationResult result =
        calculator.calculate(subtotal, urgencyAmount, globalModifiers, priceListItem);

    // Then: should not apply discount to restricted category
    assertNull(result.discountModifier());
    assertEquals(0, result.discountAmount());
    assertFalse(result.discountEligible()); // not eligible for DYEING
  }

  // Helper methods for creating test objects

  private GlobalPriceModifiers createGlobalModifiers(
      DiscountType discountType, Integer discountPercentage) {
    GlobalPriceModifiers modifiers = new GlobalPriceModifiers();
    modifiers.setDiscountType(discountType);
    modifiers.setDiscountPercentage(discountPercentage);
    return modifiers;
  }

  private PriceListItemInfo createPriceListItem(String categoryCode) {
    PriceListItemInfo priceListItem = new PriceListItemInfo();
    priceListItem.setCategoryCode(ServiceCategoryType.fromValue(categoryCode));
    return priceListItem;
  }

  private AppliedModifier createAppliedModifier(String code, int amount) {
    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(code);
    modifier.setAmount(amount);
    return modifier;
  }
}
