package com.aksi.service.pricing.calculation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.*;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.service.pricing.rules.PricingRulesService;

@ExtendWith(MockitoExtension.class)
@DisplayName("ItemPriceCalculator Tests")
class ItemPriceCalculatorTest {

  @Mock private PricingRulesService pricingRulesService;

  @Mock private PriceCalculationService priceCalculationService;

  private ItemPriceCalculator itemPriceCalculator;

  @BeforeEach
  void setUp() {
    itemPriceCalculator = new ItemPriceCalculator(pricingRulesService, priceCalculationService);
  }

  @Nested
  @DisplayName("Basic Price Calculations")
  class BasicPriceCalculations {

    @Test
    @DisplayName("Should calculate simple item price without modifiers")
    void shouldCalculateSimpleItemPrice() {
      // Given
      UUID itemId = UUID.randomUUID();
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(itemId);
      item.setQuantity(2);

      PriceListItemInfo priceListItem = createPriceListItem("Пальто", 15000); // 150.00 UAH

      when(pricingRulesService.determineBasePrice(eq(priceListItem), isNull())).thenReturn(15000);

      // When
      CalculatedItemPrice result = itemPriceCalculator.calculate(item, priceListItem, null);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getPriceListItemId()).isEqualTo(itemId);
      assertThat(result.getItemName()).isEqualTo("Пальто");
      assertThat(result.getQuantity()).isEqualTo(2);
      assertThat(result.getBasePrice()).isEqualTo(15000);
      assertThat(result.getTotal()).isEqualTo(30000); // 150.00 * 2 = 300.00 UAH
      assertThat(result.getCalculations().getFinalAmount()).isEqualTo(30000);
    }

    @Test
    @DisplayName("Should determine price based on color")
    void shouldDeterminePriceBasedOnColor() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(1);

      ItemCharacteristics characteristics = new ItemCharacteristics();
      characteristics.setColor("чорний");
      item.setCharacteristics(characteristics);

      PriceListItemInfo priceListItem = createPriceListItem("Сукня", 10000);
      priceListItem.setPriceBlack(12000); // Black items cost more

      when(pricingRulesService.determineBasePrice(priceListItem, "чорний")).thenReturn(12000);

      // When
      CalculatedItemPrice result = itemPriceCalculator.calculate(item, priceListItem, null);

      // Then
      assertThat(result.getBasePrice()).isEqualTo(12000);
      assertThat(result.getTotal()).isEqualTo(12000);
    }
  }

  @Nested
  @DisplayName("Modifier Calculations")
  class ModifierCalculations {

    @Test
    @DisplayName("Should apply single modifier correctly")
    void shouldApplySingleModifier() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(1);
      item.setModifierCodes(List.of("SILK_FABRIC"));

      PriceListItemInfo priceListItem = createPriceListItem("Блуза", 8000);

      PriceModifierEntity silkModifier = createModifier("SILK_FABRIC", "Шовк", 5000); // 50%

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(8000);
      when(pricingRulesService.getModifier("SILK_FABRIC")).thenReturn(silkModifier);
      when(priceCalculationService.calculateModifierAmount(silkModifier, 8000, 1))
          .thenReturn(4000); // 50% of 80.00 = 40.00

      // When
      CalculatedItemPrice result = itemPriceCalculator.calculate(item, priceListItem, null);

      // Then
      assertThat(result.getCalculations().getBaseAmount()).isEqualTo(8000);
      assertThat(result.getCalculations().getModifiers()).hasSize(1);
      assertThat(result.getCalculations().getModifiersTotal()).isEqualTo(4000);
      assertThat(result.getCalculations().getSubtotal()).isEqualTo(12000); // 80 + 40 = 120
      assertThat(result.getTotal()).isEqualTo(12000);
    }

    @Test
    @DisplayName("Should apply multiple modifiers")
    void shouldApplyMultipleModifiers() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(2);
      item.setModifierCodes(Arrays.asList("WATER_REPELLENT", "MANUAL_CLEAN"));

      PriceListItemInfo priceListItem = createPriceListItem("Куртка", 20000);

      PriceModifierEntity waterModifier =
          createModifier("WATER_REPELLENT", "Водовідштовхування", 3000); // 30%
      PriceModifierEntity manualModifier =
          createModifier("MANUAL_CLEAN", "Ручна чистка", 2000); // 20%

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(20000);
      when(pricingRulesService.getModifier("WATER_REPELLENT")).thenReturn(waterModifier);
      when(pricingRulesService.getModifier("MANUAL_CLEAN")).thenReturn(manualModifier);
      when(priceCalculationService.calculateModifierAmount(waterModifier, 40000, 2))
          .thenReturn(12000); // 30% of 400.00 = 120.00
      when(priceCalculationService.calculateModifierAmount(manualModifier, 40000, 2))
          .thenReturn(8000); // 20% of 400.00 = 80.00

      // When
      CalculatedItemPrice result = itemPriceCalculator.calculate(item, priceListItem, null);

      // Then
      assertThat(result.getCalculations().getModifiers()).hasSize(2);
      assertThat(result.getCalculations().getModifiersTotal()).isEqualTo(20000); // 120 + 80
      assertThat(result.getCalculations().getSubtotal()).isEqualTo(60000); // 400 + 200 = 600
    }
  }

  @Nested
  @DisplayName("Urgency Calculations")
  class UrgencyCalculations {

    @Test
    @DisplayName("Should apply urgency modifier to subtotal")
    void shouldApplyUrgencyModifier() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(1);

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);

      PriceListItemInfo priceListItem = createPriceListItem("Костюм", 30000);

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(30000);
      when(priceCalculationService.calculateUrgencyAmount(
              30000, GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H))
          .thenReturn(15000); // 50% urgency
      when(priceCalculationService.getUrgencyPercentage(
              GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H))
          .thenReturn(50);

      // When
      CalculatedItemPrice result =
          itemPriceCalculator.calculate(item, priceListItem, globalModifiers);

      // Then
      assertThat(result.getCalculations().getSubtotal()).isEqualTo(30000);
      assertThat(result.getCalculations().getUrgencyModifier()).isNotNull();
      assertThat(result.getCalculations().getUrgencyModifier().getAmount()).isEqualTo(15000);
      assertThat(result.getTotal()).isEqualTo(45000); // 300 + 150 = 450
    }

    @Test
    @DisplayName("Should apply urgency to items with modifiers")
    void shouldApplyUrgencyToItemsWithModifiers() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(1);
      item.setModifierCodes(List.of("SILK_FABRIC"));

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H);

      PriceListItemInfo priceListItem = createPriceListItem("Сукня", 10000);

      PriceModifierEntity silkModifier = createModifier("SILK_FABRIC", "Шовк", 5000);

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(10000);
      when(pricingRulesService.getModifier("SILK_FABRIC")).thenReturn(silkModifier);
      when(priceCalculationService.calculateModifierAmount(silkModifier, 10000, 1))
          .thenReturn(5000); // 50% modifier
      when(priceCalculationService.calculateUrgencyAmount(
              15000, GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H))
          .thenReturn(15000); // 100% urgency on subtotal
      when(priceCalculationService.getUrgencyPercentage(
              GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H))
          .thenReturn(100);

      // When
      CalculatedItemPrice result =
          itemPriceCalculator.calculate(item, priceListItem, globalModifiers);

      // Then
      assertThat(result.getCalculations().getSubtotal()).isEqualTo(15000); // 100 + 50
      assertThat(result.getCalculations().getUrgencyModifier().getAmount())
          .isEqualTo(15000); // 100%
      assertThat(result.getTotal()).isEqualTo(30000); // 150 + 150 = 300
    }
  }

  @Nested
  @DisplayName("Discount Calculations")
  class DiscountEntityCalculations {

    @Test
    @DisplayName("Should apply discount to eligible category")
    void shouldApplyDiscountToEligibleCategory() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(1);

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);

      PriceListItemInfo priceListItem = createPriceListItem("Пальто", 20000);
      priceListItem.setCategoryCode(ServiceCategoryType.CLOTHING);

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(20000);
      when(pricingRulesService.isDiscountApplicableToCategory("EVERCARD", "CLOTHING"))
          .thenReturn(true);
      when(priceCalculationService.calculateDiscountAmount(
              20000, GlobalPriceModifiers.DiscountTypeEnum.EVERCARD, null))
          .thenReturn(2000); // 10% discount
      when(priceCalculationService.getDiscountPercentage(
              GlobalPriceModifiers.DiscountTypeEnum.EVERCARD, null))
          .thenReturn(10);

      // When
      CalculatedItemPrice result =
          itemPriceCalculator.calculate(item, priceListItem, globalModifiers);

      // Then
      assertThat(result.getCalculations().getDiscountEligible()).isTrue();
      assertThat(result.getCalculations().getDiscountModifier()).isNotNull();
      assertThat(result.getCalculations().getDiscountModifier().getAmount()).isEqualTo(2000);
      assertThat(result.getTotal()).isEqualTo(18000); // 200 - 20 = 180
    }

    @Test
    @DisplayName("Should not apply discount to excluded category")
    void shouldNotApplyDiscountToExcludedCategory() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(2);

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.MILITARY);

      PriceListItemInfo priceListItem = createPriceListItem("Прання білизни", 5000);
      priceListItem.setCategoryCode(ServiceCategoryType.LAUNDRY);

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(5000);
      when(pricingRulesService.isDiscountApplicableToCategory("MILITARY", "LAUNDRY"))
          .thenReturn(false);

      // When
      CalculatedItemPrice result =
          itemPriceCalculator.calculate(item, priceListItem, globalModifiers);

      // Then
      assertThat(result.getCalculations().getDiscountEligible()).isFalse();
      assertThat(result.getCalculations().getDiscountModifier()).isNull();
      assertThat(result.getTotal()).isEqualTo(10000); // No discount applied
    }

    @Test
    @DisplayName("Should apply custom discount percentage")
    void shouldApplyCustomDiscountPercentage() {
      // Given
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(1);

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.OTHER);
      globalModifiers.setDiscountPercentage(15);

      PriceListItemInfo priceListItem = createPriceListItem("Сорочка", 6000);
      priceListItem.setCategoryCode(ServiceCategoryType.CLOTHING);

      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(6000);
      when(pricingRulesService.isDiscountApplicableToCategory("OTHER", "CLOTHING"))
          .thenReturn(true);
      when(priceCalculationService.calculateDiscountAmount(
              6000, GlobalPriceModifiers.DiscountTypeEnum.OTHER, 15))
          .thenReturn(900); // 15% discount
      when(priceCalculationService.getDiscountPercentage(
              GlobalPriceModifiers.DiscountTypeEnum.OTHER, 15))
          .thenReturn(15);

      // When
      CalculatedItemPrice result =
          itemPriceCalculator.calculate(item, priceListItem, globalModifiers);

      // Then
      assertThat(result.getCalculations().getDiscountModifier().getAmount()).isEqualTo(900);
      assertThat(result.getTotal()).isEqualTo(5100); // 60 - 9 = 51
    }
  }

  @Nested
  @DisplayName("Complex Calculations")
  class ComplexCalculations {

    @Test
    @DisplayName("Should apply all modifiers in correct order")
    void shouldApplyAllModifiersInCorrectOrder() {
      // Given: Item with modifiers + urgency + discount
      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(UUID.randomUUID());
      item.setQuantity(2);
      item.setModifierCodes(List.of("SILK_FABRIC"));

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);
      globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.SOCIAL_MEDIA);

      PriceListItemInfo priceListItem = createPriceListItem("Блуза", 10000);
      priceListItem.setCategoryCode(ServiceCategoryType.CLOTHING);

      PriceModifierEntity silkModifier = createModifier("SILK_FABRIC", "Шовк", 5000);

      // Setup mocks
      when(pricingRulesService.determineBasePrice(any(), isNull())).thenReturn(10000);
      when(pricingRulesService.getModifier("SILK_FABRIC")).thenReturn(silkModifier);
      when(priceCalculationService.calculateModifierAmount(silkModifier, 20000, 2))
          .thenReturn(10000); // 50% of base amount
      when(priceCalculationService.calculateUrgencyAmount(
              30000, GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H))
          .thenReturn(15000); // 50% urgency
      when(pricingRulesService.isDiscountApplicableToCategory("SOCIAL_MEDIA", "CLOTHING"))
          .thenReturn(true);
      when(priceCalculationService.calculateDiscountAmount(
              45000, GlobalPriceModifiers.DiscountTypeEnum.SOCIAL_MEDIA, null))
          .thenReturn(2250); // 5% discount
      when(priceCalculationService.getUrgencyPercentage(any())).thenReturn(50);
      when(priceCalculationService.getDiscountPercentage(any(), any())).thenReturn(5);

      // When
      CalculatedItemPrice result =
          itemPriceCalculator.calculate(item, priceListItem, globalModifiers);

      // Then
      // Base: 100 * 2 = 200
      // + Modifiers: 100 (50% silk)
      // = Subtotal: 300
      // + Urgency: 150 (50% of subtotal)
      // = Before discount: 450
      // - Discount: 22.50 (5% of 450)
      // = Final: 427.50
      assertThat(result.getCalculations().getBaseAmount()).isEqualTo(20000);
      assertThat(result.getCalculations().getModifiersTotal()).isEqualTo(10000);
      assertThat(result.getCalculations().getSubtotal()).isEqualTo(30000);
      assertThat(result.getCalculations().getUrgencyModifier().getAmount()).isEqualTo(15000);
      assertThat(result.getCalculations().getDiscountModifier().getAmount()).isEqualTo(2250);
      assertThat(result.getCalculations().getFinalAmount()).isEqualTo(42750);
      assertThat(result.getTotal()).isEqualTo(42750);
    }
  }

  // Helper methods

  private PriceListItemInfo createPriceListItem(String name, int basePrice) {
    PriceListItemInfo item = new PriceListItemInfo();
    item.setId(UUID.randomUUID());
    item.setName(name);
    item.setBasePrice(basePrice);
    item.setCategoryCode(ServiceCategoryType.CLOTHING);
    return item;
  }

  private PriceModifierEntity createModifier(String code, String name, int value) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setCode(code);
    modifier.setName(name);
    modifier.setType(PriceModifierEntity.ModifierType.PERCENTAGE);
    modifier.setValue(value);
    return modifier;
  }
}
