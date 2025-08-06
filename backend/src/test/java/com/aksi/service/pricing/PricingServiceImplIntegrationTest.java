package com.aksi.service.pricing;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.aksi.api.pricing.dto.*;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PricingMapper;
import com.aksi.repository.DiscountRepository;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.catalog.PriceListService;
import com.aksi.service.pricing.calculation.ItemPriceCalculator;
import com.aksi.service.pricing.calculation.PriceCalculationService;
import com.aksi.service.pricing.calculation.TotalsCalculator;
import com.aksi.service.pricing.rules.PricingRulesService;

@ExtendWith(MockitoExtension.class)
@DisplayName("PricingServiceImpl Integration Tests")
class PricingServiceImplIntegrationTest {

  @Mock private PriceModifierRepository priceModifierRepository;

  @Mock private DiscountRepository discountRepository;

  @Mock private PriceListService priceListService;

  @Mock private PricingMapper pricingMapper;

  // Real services (not mocked) - will be created in setUp

  private PricingServiceImpl pricingService;

  @BeforeEach
  void setUp() {
    // Create real instances of calculation services
    PriceCalculationService priceCalculationService = new PriceCalculationService();
    PricingRulesService pricingRulesService =
        new PricingRulesService(priceModifierRepository, priceCalculationService);
    ItemPriceCalculator itemPriceCalculator =
        new ItemPriceCalculator(pricingRulesService, priceCalculationService);
    TotalsCalculator totalsCalculator = new TotalsCalculator(priceCalculationService);

    // Create service under test with real dependencies
    pricingService =
        new PricingServiceImpl(
            priceModifierRepository,
            discountRepository,
            priceListService,
            pricingMapper,
            itemPriceCalculator,
            pricingRulesService,
            totalsCalculator);
  }

  @Nested
  @DisplayName("Price Calculation Integration")
  class PriceCalculationIntegration {

    @Test
    @DisplayName("Should calculate simple order without modifiers")
    void shouldCalculateSimpleOrder() {
      // Given
      UUID itemId = UUID.randomUUID();
      PriceCalculationRequest request = new PriceCalculationRequest();

      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(itemId);
      item.setQuantity(2);
      request.setItems(List.of(item));

      PriceListItemInfo priceListItem = createPriceListItem(itemId, "Пальто", 15000);

      when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

      // When
      PriceCalculationResponse response = pricingService.calculatePrice(request);

      // Then
      assertThat(response).isNotNull();
      assertThat(response.getItems()).hasSize(1);

      CalculatedItemPrice calculatedItem = response.getItems().getFirst();
      assertThat(calculatedItem.getItemName()).isEqualTo("Пальто");
      assertThat(calculatedItem.getQuantity()).isEqualTo(2);
      assertThat(calculatedItem.getBasePrice()).isEqualTo(15000);
      assertThat(calculatedItem.getTotal()).isEqualTo(30000); // 150.00 * 2

      assertThat(response.getTotals().getItemsSubtotal()).isEqualTo(30000);
      assertThat(response.getTotals().getTotal()).isEqualTo(30000);
    }

    @Test
    @DisplayName("Should calculate order with color-based pricing")
    void shouldCalculateOrderWithColorPricing() {
      // Given
      UUID itemId = UUID.randomUUID();
      PriceCalculationRequest request = new PriceCalculationRequest();

      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(itemId);
      item.setQuantity(1);

      ItemCharacteristics characteristics = new ItemCharacteristics();
      characteristics.setColor("чорний");
      item.setCharacteristics(characteristics);
      request.setItems(List.of(item));

      PriceListItemInfo priceListItem = createPriceListItem(itemId, "Сукня", 10000);
      priceListItem.setPriceBlack(12000); // Black items cost more

      when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

      // When
      PriceCalculationResponse response = pricingService.calculatePrice(request);

      // Then
      CalculatedItemPrice calculatedItem = response.getItems().getFirst();
      assertThat(calculatedItem.getBasePrice()).isEqualTo(12000);
      assertThat(calculatedItem.getTotal()).isEqualTo(12000);
    }

    @Test
    @DisplayName("Should calculate order with modifiers")
    void shouldCalculateOrderWithModifiers() {
      // Given
      UUID itemId = UUID.randomUUID();
      PriceCalculationRequest request = new PriceCalculationRequest();

      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(itemId);
      item.setQuantity(1);
      item.setModifierCodes(List.of("SILK_FABRIC"));
      request.setItems(List.of(item));

      PriceListItemInfo priceListItem = createPriceListItem(itemId, "Блуза", 8000);
      PriceModifierEntity silkModifier = createModifier("SILK_FABRIC", "Шовк", 5000); // 50%

      when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);
      when(priceModifierRepository.findByCode("SILK_FABRIC")).thenReturn(Optional.of(silkModifier));

      // When
      PriceCalculationResponse response = pricingService.calculatePrice(request);

      // Then
      CalculatedItemPrice calculatedItem = response.getItems().getFirst();
      assertThat(calculatedItem.getCalculations().getModifiers()).hasSize(1);
      assertThat(calculatedItem.getCalculations().getModifiersTotal())
          .isEqualTo(4000); // 50% of 80.00
      assertThat(calculatedItem.getTotal()).isEqualTo(12000); // 80 + 40
    }

    @Test
    @DisplayName("Should calculate order with urgency")
    void shouldCalculateOrderWithUrgency() {
      // Given
      UUID itemId = UUID.randomUUID();
      PriceCalculationRequest request = new PriceCalculationRequest();

      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(itemId);
      item.setQuantity(1);
      request.setItems(List.of(item));

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);
      request.setGlobalModifiers(globalModifiers);

      PriceListItemInfo priceListItem = createPriceListItem(itemId, "Костюм", 30000);

      when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

      // When
      PriceCalculationResponse response = pricingService.calculatePrice(request);

      // Then
      CalculatedItemPrice calculatedItem = response.getItems().getFirst();
      assertThat(calculatedItem.getCalculations().getUrgencyModifier()).isNotNull();
      assertThat(calculatedItem.getCalculations().getUrgencyModifier().getAmount())
          .isEqualTo(15000); // 50%
      assertThat(calculatedItem.getTotal()).isEqualTo(45000); // 300 + 150

      assertThat(response.getTotals().getUrgencyAmount()).isEqualTo(15000);
      assertThat(response.getTotals().getUrgencyPercentage()).isEqualTo(50);
    }

    @Test
    @DisplayName("Should calculate order with discounts on eligible categories")
    void shouldCalculateOrderWithDiscounts() {
      // Given
      UUID clothingId = UUID.randomUUID();
      UUID laundryId = UUID.randomUUID();

      PriceCalculationRequest request = new PriceCalculationRequest();

      PriceCalculationItem clothingItem = new PriceCalculationItem();
      clothingItem.setPriceListItemId(clothingId);
      clothingItem.setQuantity(1);

      PriceCalculationItem laundryItem = new PriceCalculationItem();
      laundryItem.setPriceListItemId(laundryId);
      laundryItem.setQuantity(2);

      request.setItems(Arrays.asList(clothingItem, laundryItem));

      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);
      request.setGlobalModifiers(globalModifiers);

      PriceListItemInfo clothingInfo = createPriceListItem(clothingId, "Пальто", 20000);
      clothingInfo.setCategoryCode(ServiceCategoryType.CLOTHING);

      PriceListItemInfo laundryInfo = createPriceListItem(laundryId, "Прання білизни", 5000);
      laundryInfo.setCategoryCode(ServiceCategoryType.LAUNDRY);

      when(priceListService.getPriceListItemById(clothingId)).thenReturn(clothingInfo);
      when(priceListService.getPriceListItemById(laundryId)).thenReturn(laundryInfo);

      // When
      PriceCalculationResponse response = pricingService.calculatePrice(request);

      // Then
      // Clothing item should have discount
      CalculatedItemPrice clothingCalculated = response.getItems().getFirst();
      assertThat(clothingCalculated.getCalculations().getDiscountEligible()).isTrue();
      assertThat(clothingCalculated.getCalculations().getDiscountModifier()).isNotNull();
      assertThat(clothingCalculated.getCalculations().getDiscountModifier().getAmount())
          .isEqualTo(2000); // 10%
      assertThat(clothingCalculated.getTotal()).isEqualTo(18000); // 200 - 20

      // Laundry item should NOT have discount
      CalculatedItemPrice laundryCalculated = response.getItems().get(1);
      assertThat(laundryCalculated.getCalculations().getDiscountEligible()).isFalse();
      assertThat(laundryCalculated.getCalculations().getDiscountModifier()).isNull();
      assertThat(laundryCalculated.getTotal()).isEqualTo(10000); // 50 * 2, no discount

      // Totals
      assertThat(response.getTotals().getDiscountAmount()).isEqualTo(2000);
      assertThat(response.getTotals().getDiscountApplicableAmount())
          .isEqualTo(20000); // Only clothing
      assertThat(response.getTotals().getTotal()).isEqualTo(28000); // 180 + 100
    }

    @Test
    @DisplayName("Should calculate complex order with all types of modifiers")
    void shouldCalculateComplexOrder() {
      // Given
      UUID itemId1 = UUID.randomUUID();
      UUID itemId2 = UUID.randomUUID();

      PriceCalculationRequest request = new PriceCalculationRequest();

      // Item 1: Black silk blouse
      PriceCalculationItem item1 = new PriceCalculationItem();
      item1.setPriceListItemId(itemId1);
      item1.setQuantity(2);
      item1.setModifierCodes(List.of("SILK_FABRIC"));
      ItemCharacteristics char1 = new ItemCharacteristics();
      char1.setColor("чорний");
      item1.setCharacteristics(char1);

      // Item 2: Regular clothing
      PriceCalculationItem item2 = new PriceCalculationItem();
      item2.setPriceListItemId(itemId2);
      item2.setQuantity(1);
      item2.setModifierCodes(List.of("WATER_REPELLENT"));

      request.setItems(Arrays.asList(item1, item2));

      // Global modifiers: urgency + discount
      GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
      globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H);
      globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.MILITARY);
      request.setGlobalModifiers(globalModifiers);

      // Setup price list items
      PriceListItemInfo item1Info = createPriceListItem(itemId1, "Блуза", 10000);
      item1Info.setPriceBlack(12000);
      item1Info.setCategoryCode(ServiceCategoryType.CLOTHING);

      PriceListItemInfo item2Info = createPriceListItem(itemId2, "Куртка", 25000);
      item2Info.setCategoryCode(ServiceCategoryType.CLOTHING);

      // Setup modifiers
      PriceModifierEntity silkModifier = createModifier("SILK_FABRIC", "Шовк", 5000); // 50%
      PriceModifierEntity waterModifier =
          createModifier("WATER_REPELLENT", "Водовідштовхування", 3000); // 30%

      when(priceListService.getPriceListItemById(itemId1)).thenReturn(item1Info);
      when(priceListService.getPriceListItemById(itemId2)).thenReturn(item2Info);
      when(priceModifierRepository.findByCode("SILK_FABRIC")).thenReturn(Optional.of(silkModifier));
      when(priceModifierRepository.findByCode("WATER_REPELLENT"))
          .thenReturn(Optional.of(waterModifier));

      // When
      PriceCalculationResponse response = pricingService.calculatePrice(request);

      // Then
      assertThat(response.getItems()).hasSize(2);

      // Item 1 calculations
      CalculatedItemPrice item1Calculated = response.getItems().getFirst();
      assertThat(item1Calculated.getBasePrice()).isEqualTo(12000); // Black price
      assertThat(item1Calculated.getQuantity()).isEqualTo(2);
      // Base: 120 * 2 = 240
      // Silk modifier: 50% of 240 = 120
      // Subtotal: 360
      // Urgency: 100% of 360 = 360
      // Before discount: 720
      // Discount: 10% of 720 = 72
      // Final: 648
      assertThat(item1Calculated.getCalculations().getBaseAmount()).isEqualTo(24000);
      assertThat(item1Calculated.getCalculations().getModifiersTotal()).isEqualTo(12000);
      assertThat(item1Calculated.getCalculations().getSubtotal()).isEqualTo(36000);
      assertThat(item1Calculated.getCalculations().getUrgencyModifier().getAmount())
          .isEqualTo(36000);
      assertThat(item1Calculated.getCalculations().getDiscountModifier().getAmount())
          .isEqualTo(7200);
      assertThat(item1Calculated.getTotal()).isEqualTo(64800);

      // Item 2 calculations
      CalculatedItemPrice item2Calculated = response.getItems().get(1);
      assertThat(item2Calculated.getBasePrice()).isEqualTo(25000);
      // Base: 250
      // Water modifier: 30% of 250 = 75
      // Subtotal: 325
      // Urgency: 100% of 325 = 325
      // Before discount: 650
      // Discount: 10% of 650 = 65
      // Final: 585
      assertThat(item2Calculated.getCalculations().getModifiersTotal()).isEqualTo(7500);
      assertThat(item2Calculated.getCalculations().getSubtotal()).isEqualTo(32500);
      assertThat(item2Calculated.getCalculations().getUrgencyModifier().getAmount())
          .isEqualTo(32500);
      assertThat(item2Calculated.getCalculations().getDiscountModifier().getAmount())
          .isEqualTo(6500);
      assertThat(item2Calculated.getTotal()).isEqualTo(58500);

      // Totals
      CalculationTotals totals = response.getTotals();
      assertThat(totals.getItemsSubtotal()).isEqualTo(68500); // 360 + 325
      assertThat(totals.getUrgencyAmount()).isEqualTo(68500); // 100% urgency
      assertThat(totals.getUrgencyPercentage()).isEqualTo(100);
      assertThat(totals.getDiscountAmount()).isEqualTo(13700); // 72 + 65
      assertThat(totals.getDiscountPercentage()).isEqualTo(10);
      assertThat(totals.getTotal()).isEqualTo(123300); // 648 + 585
    }

    @Test
    @DisplayName("Should handle non-existent price list item")
    void shouldHandleNonExistentPriceListItem() {
      // Given
      UUID itemId = UUID.randomUUID();
      PriceCalculationRequest request = new PriceCalculationRequest();

      PriceCalculationItem item = new PriceCalculationItem();
      item.setPriceListItemId(itemId);
      item.setQuantity(1);
      request.setItems(List.of(item));

      when(priceListService.getPriceListItemById(itemId))
          .thenThrow(new NotFoundException("PriceListItem not found: " + itemId));

      // When & Then
      assertThatThrownBy(() -> pricingService.calculatePrice(request))
          .isInstanceOf(NotFoundException.class)
          .hasMessageContaining("PriceListItem");
    }
  }

  @Nested
  @DisplayName("Price Modifiers Listing")
  class PriceModifiersListingEntity {

    @Test
    @DisplayName("Should list all active modifiers")
    void shouldListAllActiveModifiers() {
      // Given
      List<PriceModifierEntity> modifiers =
          Arrays.asList(
              createModifier("SILK_FABRIC", "Шовк", 5000),
              createModifier("WATER_REPELLENT", "Водовідштовхування", 3000));

      Pageable pageable = Pageable.unpaged();
      Page<PriceModifierEntity> modifierPage =
          new PageImpl<>(modifiers, pageable, modifiers.size());

      when(priceModifierRepository.findAll(any(Pageable.class))).thenReturn(modifierPage);
      when(pricingMapper.toPriceModifierDto(any()))
          .thenAnswer(
              invocation -> {
                PriceModifierEntity modifier = invocation.getArgument(0);
                com.aksi.api.pricing.dto.PriceModifier dto =
                    new com.aksi.api.pricing.dto.PriceModifier();
                dto.setCode(modifier.getCode());
                dto.setName(modifier.getName());
                dto.setType(
                    com.aksi.api.pricing.dto.PriceModifier.TypeEnum.valueOf(
                        modifier.getType().name()));
                dto.setValue(modifier.getValue());
                return dto;
              });

      // When
      PriceModifiersResponse response = pricingService.listPriceModifiers(null, null);

      // Then
      assertThat(response.getModifiers()).hasSize(2);
      assertThat(response.getModifiers().getFirst().getCode()).isEqualTo("SILK_FABRIC");
      assertThat(response.getModifiers().get(1).getCode()).isEqualTo("WATER_REPELLENT");
    }

    @Test
    @DisplayName("Should filter modifiers by category")
    void shouldFilterModifiersByCategory() {
      // Given
      String categoryCode = "CLOTHING";

      List<PriceModifierEntity> modifiers = List.of(createModifier("SILK_FABRIC", "Шовк", 5000));

      when(priceModifierRepository.findActiveByCategoryCode(eq(categoryCode)))
          .thenReturn(modifiers);
      when(pricingMapper.toPriceModifierDto(any()))
          .thenAnswer(
              invocation -> {
                PriceModifierEntity modifier = invocation.getArgument(0);
                com.aksi.api.pricing.dto.PriceModifier dto =
                    new com.aksi.api.pricing.dto.PriceModifier();
                dto.setCode(modifier.getCode());
                dto.setName(modifier.getName());
                dto.setType(com.aksi.api.pricing.dto.PriceModifier.TypeEnum.PERCENTAGE);
                dto.setValue(modifier.getValue());
                return dto;
              });

      // When
      PriceModifiersResponse response = pricingService.listPriceModifiers(categoryCode, null);

      // Then
      assertThat(response.getModifiers()).hasSize(1);
      assertThat(response.getModifiers().getFirst().getCode()).isEqualTo("SILK_FABRIC");
    }
  }

  @Nested
  @DisplayName("Discounts Listing")
  class DiscountsListing {

    @Test
    @DisplayName("Should list all active discounts")
    void shouldListAllActiveDiscounts() {
      // Given
      List<DiscountEntity> discountEntities =
          Arrays.asList(
              createDiscount("EVERCARD", "Еверкарт", 10),
              createDiscount("MILITARY", "Військовий", 10));

      // No need for Page when using findAllActiveOrderedBySortOrder

      when(discountRepository.findAllActiveOrderedBySortOrder()).thenReturn(discountEntities);
      when(pricingMapper.toDiscountDto(any()))
          .thenAnswer(
              invocation -> {
                DiscountEntity discountEntity = invocation.getArgument(0);
                com.aksi.api.pricing.dto.Discount dto = new com.aksi.api.pricing.dto.Discount();
                dto.setCode(discountEntity.getCode());
                dto.setName(discountEntity.getName());
                dto.setPercentage(discountEntity.getPercentage());
                dto.setActive(discountEntity.isActive());
                return dto;
              });

      // When
      DiscountsResponse response = pricingService.listDiscounts(true);

      // Then
      assertThat(response.getDiscounts()).hasSize(2);
      assertThat(response.getDiscounts().getFirst().getCode()).isEqualTo("EVERCARD");
      assertThat(response.getDiscounts().get(1).getCode()).isEqualTo("MILITARY");
    }
  }

  @Nested
  @DisplayName("Utility Methods")
  class UtilityMethods {

    @Test
    @DisplayName("Should get applicable modifier codes for category")
    void shouldGetApplicableModifierCodes() {
      // Given
      String categoryCode = "CLOTHING";

      List<PriceModifierEntity> modifiers =
          Arrays.asList(
              createModifier("SILK_FABRIC", "Шовк", 5000),
              createModifier("WATER_REPELLENT", "Водовідштовхування", 3000));

      when(priceModifierRepository.findActiveByCategoryCode(categoryCode)).thenReturn(modifiers);

      // When
      List<String> codes = pricingService.getApplicableModifierCodes(categoryCode);

      // Then
      assertThat(codes).containsExactly("SILK_FABRIC", "WATER_REPELLENT");
    }

    @Test
    @DisplayName("Should check discount applicability to category")
    void shouldCheckDiscountApplicability() {
      // Given
      String discountCode = "EVERCARD";
      String eligibleCategory = "CLOTHING";
      String excludedCategory = "LAUNDRY";

      // When
      boolean eligibleResult =
          pricingService.isDiscountApplicableToCategory(discountCode, eligibleCategory);
      boolean excludedResult =
          pricingService.isDiscountApplicableToCategory(discountCode, excludedCategory);

      // Then
      assertThat(eligibleResult).isTrue();
      assertThat(excludedResult).isFalse();
    }
  }

  // Helper methods

  private PriceListItemInfo createPriceListItem(UUID id, String name, int basePrice) {
    PriceListItemInfo item = new PriceListItemInfo();
    item.setId(id);
    item.setName(name);
    item.setBasePrice(basePrice);
    item.setCategoryCode(ServiceCategoryType.CLOTHING);
    return item;
  }

  private PriceModifierEntity createModifier(String code, String name, int value) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode(code);
    modifier.setName(name);
    modifier.setType(PriceModifierEntity.ModifierType.PERCENTAGE);
    modifier.setValue(value);
    modifier.setActive(true);
    return modifier;
  }

  private DiscountEntity createDiscount(String code, String name, int percentage) {
    DiscountEntity discountEntity = new DiscountEntity();
    discountEntity.setId(UUID.randomUUID());
    discountEntity.setCode(code);
    discountEntity.setName(name);
    discountEntity.setPercentage(percentage);
    discountEntity.setActive(true);
    return discountEntity;
  }
}
