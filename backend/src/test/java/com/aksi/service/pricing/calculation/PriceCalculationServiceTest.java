package com.aksi.service.pricing.calculation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.domain.pricing.PriceModifier;

@DisplayName("PriceCalculationService Tests")
class PriceCalculationServiceTest {

  private PriceCalculationService priceCalculationService;

  @BeforeEach
  void setUp() {
    priceCalculationService = new PriceCalculationService();
  }

  @Nested
  @DisplayName("Modifier Amount Calculations")
  class ModifierAmountTests {

    @Test
    @DisplayName("Should calculate percentage modifier correctly")
    void shouldCalculatePercentageModifier() {
      // Given
      PriceModifier modifier = new PriceModifier();
      modifier.setType(PriceModifier.ModifierType.PERCENTAGE);
      modifier.setValue(1550); // 15.5% in basis points
      int baseAmount = 10000; // 100.00 UAH
      int quantity = 1;

      // When
      int result = priceCalculationService.calculateModifierAmount(modifier, baseAmount, quantity);

      // Then
      assertThat(result).isEqualTo(1550); // 15.50 UAH
    }

    @Test
    @DisplayName("Should calculate fixed modifier correctly")
    void shouldCalculateFixedModifier() {
      // Given
      PriceModifier modifier = new PriceModifier();
      modifier.setType(PriceModifier.ModifierType.FIXED);
      modifier.setValue(500); // 5.00 UAH per item
      int baseAmount = 10000;
      int quantity = 3;

      // When
      int result = priceCalculationService.calculateModifierAmount(modifier, baseAmount, quantity);

      // Then
      assertThat(result).isEqualTo(1500); // 5.00 * 3 = 15.00 UAH
    }

    @Test
    @DisplayName("Should return 0 for unknown modifier type")
    void shouldReturnZeroForUnknownModifierType() {
      // Given
      PriceModifier modifier = new PriceModifier();
      modifier.setType(null);
      modifier.setValue(1000);

      // When
      int result = priceCalculationService.calculateModifierAmount(modifier, 10000, 1);

      // Then
      assertThat(result).isEqualTo(0);
    }
  }

  @Nested
  @DisplayName("Urgency Amount Calculations")
  class UrgencyAmountTests {

    @Test
    @DisplayName("Should calculate normal urgency (0%)")
    void shouldCalculateNormalUrgency() {
      // Given
      int amount = 10000;
      GlobalPriceModifiers.UrgencyTypeEnum urgencyType =
          GlobalPriceModifiers.UrgencyTypeEnum.NORMAL;

      // When
      int result = priceCalculationService.calculateUrgencyAmount(amount, urgencyType);

      // Then
      assertThat(result).isEqualTo(0);
    }

    @Test
    @DisplayName("Should calculate express 48h urgency (50%)")
    void shouldCalculateExpress48hUrgency() {
      // Given
      int amount = 10000; // 100.00 UAH
      GlobalPriceModifiers.UrgencyTypeEnum urgencyType =
          GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H;

      // When
      int result = priceCalculationService.calculateUrgencyAmount(amount, urgencyType);

      // Then
      assertThat(result).isEqualTo(5000); // 50.00 UAH (50%)
    }

    @Test
    @DisplayName("Should calculate express 24h urgency (100%)")
    void shouldCalculateExpress24hUrgency() {
      // Given
      int amount = 10000; // 100.00 UAH
      GlobalPriceModifiers.UrgencyTypeEnum urgencyType =
          GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H;

      // When
      int result = priceCalculationService.calculateUrgencyAmount(amount, urgencyType);

      // Then
      assertThat(result).isEqualTo(10000); // 100.00 UAH (100%)
    }

    @Test
    @DisplayName("Should return 0 for null urgency type")
    void shouldReturnZeroForNullUrgencyType() {
      // When
      int result = priceCalculationService.calculateUrgencyAmount(10000, null);

      // Then
      assertThat(result).isEqualTo(0);
    }
  }

  @Nested
  @DisplayName("Discount Amount Calculations")
  class DiscountAmountTests {

    @Test
    @DisplayName("Should calculate Evercard discount (10%)")
    void shouldCalculateEvercardDiscount() {
      // Given
      int amount = 10000; // 100.00 UAH
      GlobalPriceModifiers.DiscountTypeEnum discountType =
          GlobalPriceModifiers.DiscountTypeEnum.EVERCARD;

      // When
      int result = priceCalculationService.calculateDiscountAmount(amount, discountType, null);

      // Then
      assertThat(result).isEqualTo(1000); // 10.00 UAH (10%)
    }

    @Test
    @DisplayName("Should calculate Military discount (10%)")
    void shouldCalculateMilitaryDiscount() {
      // Given
      int amount = 20000; // 200.00 UAH
      GlobalPriceModifiers.DiscountTypeEnum discountType =
          GlobalPriceModifiers.DiscountTypeEnum.MILITARY;

      // When
      int result = priceCalculationService.calculateDiscountAmount(amount, discountType, null);

      // Then
      assertThat(result).isEqualTo(2000); // 20.00 UAH (10%)
    }

    @Test
    @DisplayName("Should calculate Social Media discount (5%)")
    void shouldCalculateSocialMediaDiscount() {
      // Given
      int amount = 10000; // 100.00 UAH
      GlobalPriceModifiers.DiscountTypeEnum discountType =
          GlobalPriceModifiers.DiscountTypeEnum.SOCIAL_MEDIA;

      // When
      int result = priceCalculationService.calculateDiscountAmount(amount, discountType, null);

      // Then
      assertThat(result).isEqualTo(500); // 5.00 UAH (5%)
    }

    @Test
    @DisplayName("Should calculate custom discount for OTHER type")
    void shouldCalculateCustomDiscount() {
      // Given
      int amount = 10000; // 100.00 UAH
      GlobalPriceModifiers.DiscountTypeEnum discountType =
          GlobalPriceModifiers.DiscountTypeEnum.OTHER;
      Integer customPercentage = 15;

      // When
      int result =
          priceCalculationService.calculateDiscountAmount(amount, discountType, customPercentage);

      // Then
      assertThat(result).isEqualTo(1500); // 15.00 UAH (15%)
    }

    @Test
    @DisplayName("Should return 0 for OTHER type without custom percentage")
    void shouldReturnZeroForOtherTypeWithoutCustomPercentage() {
      // Given
      GlobalPriceModifiers.DiscountTypeEnum discountType =
          GlobalPriceModifiers.DiscountTypeEnum.OTHER;

      // When
      int result = priceCalculationService.calculateDiscountAmount(10000, discountType, null);

      // Then
      assertThat(result).isEqualTo(0);
    }

    @Test
    @DisplayName("Should return 0 for NONE discount type")
    void shouldReturnZeroForNoneDiscountType() {
      // Given
      GlobalPriceModifiers.DiscountTypeEnum discountType =
          GlobalPriceModifiers.DiscountTypeEnum.NONE;

      // When
      int result = priceCalculationService.calculateDiscountAmount(10000, discountType, null);

      // Then
      assertThat(result).isEqualTo(0);
    }
  }

  @Nested
  @DisplayName("Discount Applicability")
  class DiscountApplicabilityTests {

    @Test
    @DisplayName("Should not apply discount to LAUNDRY category")
    void shouldNotApplyDiscountToLaundry() {
      // When
      boolean result = priceCalculationService.isDiscountApplicableToCategory("LAUNDRY");

      // Then
      assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should not apply discount to IRONING category")
    void shouldNotApplyDiscountToIroning() {
      // When
      boolean result = priceCalculationService.isDiscountApplicableToCategory("IRONING");

      // Then
      assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should not apply discount to DYEING category")
    void shouldNotApplyDiscountToDyeing() {
      // When
      boolean result = priceCalculationService.isDiscountApplicableToCategory("DYEING");

      // Then
      assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should apply discount to other categories")
    void shouldApplyDiscountToOtherCategories() {
      // When
      boolean clothingResult = priceCalculationService.isDiscountApplicableToCategory("CLOTHING");
      boolean leatherResult = priceCalculationService.isDiscountApplicableToCategory("LEATHER");
      boolean furResult = priceCalculationService.isDiscountApplicableToCategory("FUR");

      // Then
      assertThat(clothingResult).isTrue();
      assertThat(leatherResult).isTrue();
      assertThat(furResult).isTrue();
    }
  }

  @Nested
  @DisplayName("Percentage Getter Methods")
  class PercentageGetterTests {

    @Test
    @DisplayName("Should return correct urgency percentages")
    void shouldReturnCorrectUrgencyPercentages() {
      assertThat(
              priceCalculationService.getUrgencyPercentage(
                  GlobalPriceModifiers.UrgencyTypeEnum.NORMAL))
          .isEqualTo(0);
      assertThat(
              priceCalculationService.getUrgencyPercentage(
                  GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H))
          .isEqualTo(50);
      assertThat(
              priceCalculationService.getUrgencyPercentage(
                  GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H))
          .isEqualTo(100);
      assertThat(priceCalculationService.getUrgencyPercentage(null)).isEqualTo(0);
    }

    @Test
    @DisplayName("Should return correct discount percentages")
    void shouldReturnCorrectDiscountPercentages() {
      assertThat(
              priceCalculationService.getDiscountPercentage(
                  GlobalPriceModifiers.DiscountTypeEnum.NONE, null))
          .isEqualTo(0);
      assertThat(
              priceCalculationService.getDiscountPercentage(
                  GlobalPriceModifiers.DiscountTypeEnum.EVERCARD, null))
          .isEqualTo(10);
      assertThat(
              priceCalculationService.getDiscountPercentage(
                  GlobalPriceModifiers.DiscountTypeEnum.MILITARY, null))
          .isEqualTo(10);
      assertThat(
              priceCalculationService.getDiscountPercentage(
                  GlobalPriceModifiers.DiscountTypeEnum.SOCIAL_MEDIA, null))
          .isEqualTo(5);
      assertThat(
              priceCalculationService.getDiscountPercentage(
                  GlobalPriceModifiers.DiscountTypeEnum.OTHER, 20))
          .isEqualTo(20);
      assertThat(priceCalculationService.getDiscountPercentage(null, null)).isEqualTo(0);
    }
  }

  @Nested
  @DisplayName("Edge Cases and Rounding")
  class EdgeCasesTests {

    @Test
    @DisplayName("Should handle rounding correctly for percentage calculations")
    void shouldHandleRoundingCorrectly() {
      // Given
      PriceModifier modifier = new PriceModifier();
      modifier.setType(PriceModifier.ModifierType.PERCENTAGE);
      modifier.setValue(333); // 3.33% in basis points
      int baseAmount = 1000; // 10.00 UAH

      // When
      int result = priceCalculationService.calculateModifierAmount(modifier, baseAmount, 1);

      // Then
      assertThat(result).isEqualTo(33); // 0.33 UAH (rounded)
    }

    @Test
    @DisplayName("Should handle very large amounts")
    void shouldHandleVeryLargeAmounts() {
      // Given
      int largeAmount = 10000000; // 100,000.00 UAH
      GlobalPriceModifiers.UrgencyTypeEnum urgencyType =
          GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H;

      // When
      int result = priceCalculationService.calculateUrgencyAmount(largeAmount, urgencyType);

      // Then
      assertThat(result).isEqualTo(5000000); // 50,000.00 UAH (50%)
    }
  }
}
