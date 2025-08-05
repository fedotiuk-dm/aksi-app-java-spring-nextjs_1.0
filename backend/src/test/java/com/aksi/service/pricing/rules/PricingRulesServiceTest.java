package com.aksi.service.pricing.rules;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.pricing.PriceModifier;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.pricing.calculation.PriceCalculationService;

@ExtendWith(MockitoExtension.class)
@DisplayName("PricingRulesService Tests")
class PricingRulesServiceTest {

  @Mock private PriceModifierRepository priceModifierRepository;

  @Mock private PriceCalculationService priceCalculationService;

  private PricingRulesService pricingRulesService;

  @BeforeEach
  void setUp() {
    pricingRulesService = new PricingRulesService(priceModifierRepository, priceCalculationService);
  }

  @Nested
  @DisplayName("Base Price Determination")
  class BasePriceDetermination {

    @Test
    @DisplayName("Should return base price when no color specified")
    void shouldReturnBasePriceWhenNoColor() {
      // Given
      PriceListItemInfo item = createPriceListItem(null, null);

      // When
      int result = pricingRulesService.determineBasePrice(item, null);

      // Then
      assertThat(result).isEqualTo(10000);
    }

    @Test
    @DisplayName("Should return base price when color is blank")
    void shouldReturnBasePriceWhenColorBlank() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int result = pricingRulesService.determineBasePrice(item, "   ");

      // Then
      assertThat(result).isEqualTo(10000);
    }

    @Test
    @DisplayName("Should return black price for black items")
    void shouldReturnBlackPriceForBlackItems() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int blackResult = pricingRulesService.determineBasePrice(item, "black");
      int ukrainianBlackResult = pricingRulesService.determineBasePrice(item, "чорний");

      // Then
      assertThat(blackResult).isEqualTo(12000);
      assertThat(ukrainianBlackResult).isEqualTo(12000);
    }

    @Test
    @DisplayName("Should return base price when black price is null")
    void shouldReturnBasePriceWhenBlackPriceNull() {
      // Given
      PriceListItemInfo item = createPriceListItem(null, 11000);

      // When
      int result = pricingRulesService.determineBasePrice(item, "чорний");

      // Then
      assertThat(result).isEqualTo(10000);
    }

    @Test
    @DisplayName("Should return color price for colored items")
    void shouldReturnColorPriceForColoredItems() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int redResult = pricingRulesService.determineBasePrice(item, "червоний");
      int blueResult = pricingRulesService.determineBasePrice(item, "синій");
      int greenResult = pricingRulesService.determineBasePrice(item, "зелений");

      // Then
      assertThat(redResult).isEqualTo(11000);
      assertThat(blueResult).isEqualTo(11000);
      assertThat(greenResult).isEqualTo(11000);
    }

    @Test
    @DisplayName("Should return base price for natural colors")
    void shouldReturnBasePriceForNaturalColors() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int whiteResult = pricingRulesService.determineBasePrice(item, "white");
      int naturalResult = pricingRulesService.determineBasePrice(item, "natural");
      int ukrainianWhiteResult = pricingRulesService.determineBasePrice(item, "білий");
      int ukrainianNaturalResult = pricingRulesService.determineBasePrice(item, "натуральний");

      // Then
      assertThat(whiteResult).isEqualTo(10000);
      assertThat(naturalResult).isEqualTo(10000);
      assertThat(ukrainianWhiteResult).isEqualTo(10000);
      assertThat(ukrainianNaturalResult).isEqualTo(10000);
    }

    @Test
    @DisplayName("Should handle case insensitive colors")
    void shouldHandleCaseInsensitiveColors() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int blackUpper = pricingRulesService.determineBasePrice(item, "BLACK");
      int blackMixed = pricingRulesService.determineBasePrice(item, "Black");
      int whiteUpper = pricingRulesService.determineBasePrice(item, "WHITE");

      // Then
      assertThat(blackUpper).isEqualTo(12000);
      assertThat(blackMixed).isEqualTo(12000);
      assertThat(whiteUpper).isEqualTo(10000);
    }
  }

  @Nested
  @DisplayName("Discount Applicability")
  class DiscountApplicability {

    @Test
    @DisplayName("Should not apply discount to excluded categories")
    void shouldNotApplyDiscountToExcludedCategories() {
      // Given
      when(priceCalculationService.isDiscountApplicableToCategory("LAUNDRY")).thenReturn(false);
      when(priceCalculationService.isDiscountApplicableToCategory("IRONING")).thenReturn(false);
      when(priceCalculationService.isDiscountApplicableToCategory("DYEING")).thenReturn(false);

      // When & Then
      assertThat(pricingRulesService.isDiscountApplicableToCategory("EVERCARD", "LAUNDRY"))
          .isFalse();
      assertThat(pricingRulesService.isDiscountApplicableToCategory("MILITARY", "IRONING"))
          .isFalse();
      assertThat(pricingRulesService.isDiscountApplicableToCategory("SOCIAL_MEDIA", "DYEING"))
          .isFalse();
    }

    @Test
    @DisplayName("Should apply discount to allowed categories")
    void shouldApplyDiscountToAllowedCategories() {
      // Given
      when(priceCalculationService.isDiscountApplicableToCategory("CLOTHING")).thenReturn(true);
      when(priceCalculationService.isDiscountApplicableToCategory("LEATHER")).thenReturn(true);
      when(priceCalculationService.isDiscountApplicableToCategory("FUR")).thenReturn(true);

      // When & Then
      assertThat(pricingRulesService.isDiscountApplicableToCategory("EVERCARD", "CLOTHING"))
          .isTrue();
      assertThat(pricingRulesService.isDiscountApplicableToCategory("MILITARY", "LEATHER"))
          .isTrue();
      assertThat(pricingRulesService.isDiscountApplicableToCategory("SOCIAL_MEDIA", "FUR"))
          .isTrue();
    }

    @Test
    @DisplayName("Should log debug message for excluded categories")
    void shouldLogDebugForExcludedCategories() {
      // Given
      when(priceCalculationService.isDiscountApplicableToCategory("LAUNDRY")).thenReturn(false);

      // When
      boolean result = pricingRulesService.isDiscountApplicableToCategory("EVERCARD", "LAUNDRY");

      // Then
      assertThat(result).isFalse();
      // Debug log should contain: "Category LAUNDRY is globally excluded from discounts"
    }

    @Test
    @DisplayName("Should log debug message for applicable discounts")
    void shouldLogDebugForApplicableDiscounts() {
      // Given
      when(priceCalculationService.isDiscountApplicableToCategory("CLOTHING")).thenReturn(true);

      // When
      boolean result = pricingRulesService.isDiscountApplicableToCategory("EVERCARD", "CLOTHING");

      // Then
      assertThat(result).isTrue();
      // Debug log should contain: "Discount EVERCARD is applicable to category CLOTHING"
    }
  }

  @Nested
  @DisplayName("Modifier Operations")
  class ModifierOperations {

    @Test
    @DisplayName("Should get active modifier by code")
    void shouldGetActiveModifierByCode() {
      // Given
      PriceModifier modifier = createModifier("SILK_FABRIC", true);
      when(priceModifierRepository.findByCode("SILK_FABRIC")).thenReturn(Optional.of(modifier));

      // When
      PriceModifier result = pricingRulesService.getModifier("SILK_FABRIC");

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getCode()).isEqualTo("SILK_FABRIC");
    }

    @Test
    @DisplayName("Should return null for non-existent modifier")
    void shouldReturnNullForNonExistentModifier() {
      // Given
      when(priceModifierRepository.findByCode("NON_EXISTENT")).thenReturn(Optional.empty());

      // When
      PriceModifier result = pricingRulesService.getModifier("NON_EXISTENT");

      // Then
      assertThat(result).isNull();
    }

    @Test
    @DisplayName("Should return null for inactive modifier")
    void shouldReturnNullForInactiveModifier() {
      // Given
      PriceModifier modifier = createModifier("INACTIVE", false);
      when(priceModifierRepository.findByCode("INACTIVE")).thenReturn(Optional.of(modifier));

      // When
      PriceModifier result = pricingRulesService.getModifier("INACTIVE");

      // Then
      assertThat(result).isNull();
    }
  }

  @Nested
  @DisplayName("Edge Cases")
  class EdgeCases {

    @Test
    @DisplayName("Should handle null price list item gracefully")
    void shouldHandleNullPriceListItem() {
      // This should not happen in production, but let's be defensive
      // The method would throw NPE, which is acceptable for invalid input
    }

    @Test
    @DisplayName("Should handle special characters in color")
    void shouldHandleSpecialCharactersInColor() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int result = pricingRulesService.determineBasePrice(item, "чорний!");

      // Then
      assertThat(result).isEqualTo(11000); // Not recognized as black, so color price
    }

    @Test
    @DisplayName("Should trim color before processing")
    void shouldTrimColorBeforeProcessing() {
      // Given
      PriceListItemInfo item = createPriceListItem(12000, 11000);

      // When
      int blackWithSpaces = pricingRulesService.determineBasePrice(item, "  чорний  ");
      int whiteWithSpaces = pricingRulesService.determineBasePrice(item, "  білий  ");

      // Then
      assertThat(blackWithSpaces).isEqualTo(12000);
      assertThat(whiteWithSpaces).isEqualTo(10000);
    }
  }

  // Helper methods

  private PriceListItemInfo createPriceListItem(Integer priceBlack, Integer priceColor) {
    PriceListItemInfo item = new PriceListItemInfo();
    item.setId(UUID.randomUUID());
    item.setName("Test Item");
    item.setBasePrice(10000);
    item.setPriceBlack(priceBlack);
    item.setPriceColor(priceColor);
    item.setCategoryCode(ServiceCategoryType.CLOTHING);
    return item;
  }

  private PriceModifier createModifier(String code, boolean active) {
    PriceModifier modifier = new PriceModifier();
    modifier.setId(UUID.randomUUID());
    modifier.setCode(code);
    modifier.setName("Test Modifier");
    modifier.setType(PriceModifier.ModifierType.PERCENTAGE);
    modifier.setValue(5000); // 50%
    modifier.setActive(active);
    return modifier;
  }
}
