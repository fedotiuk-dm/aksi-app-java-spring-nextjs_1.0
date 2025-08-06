package com.aksi.service.pricing;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.*;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.mapper.PricingMapper;
import com.aksi.repository.DiscountRepository;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.catalog.PriceListService;
import com.aksi.service.pricing.calculation.ItemPriceCalculator;
import com.aksi.service.pricing.calculation.PriceCalculationService;
import com.aksi.service.pricing.calculation.TotalsCalculator;
import com.aksi.service.pricing.rules.PricingRulesService;

/** Isolated unit tests for pricing calculations only. No Order domain dependencies. */
@ExtendWith(MockitoExtension.class)
@DisplayName("Pricing Service Calculation Tests")
class PricingServiceCalculationTest {

  @Mock private PriceModifierRepository priceModifierRepository;

  @Mock private DiscountRepository discountRepository;

  @Mock private PriceListService priceListService;

  @Mock private PricingMapper pricingMapper;

  private PricingServiceImpl pricingService;

  @BeforeEach
  void setUp() {
    // Create real calculation services
    PriceCalculationService priceCalculationService = new PriceCalculationService();
    PricingRulesService pricingRulesService =
        new PricingRulesService(priceModifierRepository, priceCalculationService);
    ItemPriceCalculator itemPriceCalculator =
        new ItemPriceCalculator(pricingRulesService, priceCalculationService);
    TotalsCalculator totalsCalculator = new TotalsCalculator(priceCalculationService);

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

  @Test
  @DisplayName("Should calculate simple price without modifiers")
  void testSimplePriceCalculation() {
    // Given
    UUID itemId = UUID.randomUUID();
    PriceCalculationRequest request = new PriceCalculationRequest();

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(2);
    request.setItems(List.of(item));

    PriceListItemInfo priceListItem = createPriceListItem(itemId, "Test Item", 10000); // 100.00 UAH

    when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.getItems()).hasSize(1);
    assertThat(response.getItems().get(0).getTotal()).isEqualTo(20000); // 200.00 UAH
    assertThat(response.getTotals().getTotal()).isEqualTo(20000);
  }

  @Test
  @DisplayName("Should calculate price with percentage modifier")
  void testPriceWithPercentageModifier() {
    // Given
    UUID itemId = UUID.randomUUID();
    PriceCalculationRequest request = new PriceCalculationRequest();

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(1);
    item.setModifierCodes(List.of("TEST_MOD"));
    request.setItems(List.of(item));

    PriceListItemInfo priceListItem = createPriceListItem(itemId, "Test Item", 10000);
    PriceModifierEntity modifier =
        createPercentageModifier("TEST_MOD", "Test Modifier", 5000); // 50%

    when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);
    when(priceModifierRepository.findByCode("TEST_MOD")).thenReturn(Optional.of(modifier));

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    assertThat(response.getItems().get(0).getTotal()).isEqualTo(15000); // 100 + 50% = 150
  }

  @Test
  @DisplayName("Should calculate price with urgency")
  void testPriceWithUrgency() {
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

    PriceListItemInfo priceListItem = createPriceListItem(itemId, "Test Item", 10000);

    when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    assertThat(response.getItems().get(0).getTotal()).isEqualTo(15000); // 100 + 50% urgency = 150
    assertThat(response.getTotals().getUrgencyAmount()).isEqualTo(5000);
  }

  @Test
  @DisplayName("Should calculate price with discount on eligible category")
  void testPriceWithDiscount() {
    // Given
    UUID itemId = UUID.randomUUID();
    PriceCalculationRequest request = new PriceCalculationRequest();

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(1);
    request.setItems(List.of(item));

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);
    request.setGlobalModifiers(globalModifiers);

    PriceListItemInfo priceListItem = createPriceListItem(itemId, "Test Item", 10000);
    priceListItem.setCategoryCode(ServiceCategoryType.CLOTHING);

    when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    assertThat(response.getItems().get(0).getTotal()).isEqualTo(9000); // 100 - 10% = 90
    assertThat(response.getTotals().getDiscountAmount()).isEqualTo(1000);
  }

  @Test
  @DisplayName("Should not apply discount to excluded category")
  void testNoDiscountOnExcludedCategory() {
    // Given
    UUID itemId = UUID.randomUUID();
    PriceCalculationRequest request = new PriceCalculationRequest();

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(1);
    request.setItems(List.of(item));

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);
    request.setGlobalModifiers(globalModifiers);

    PriceListItemInfo priceListItem = createPriceListItem(itemId, "Laundry Service", 10000);
    priceListItem.setCategoryCode(ServiceCategoryType.LAUNDRY);

    when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    assertThat(response.getItems().get(0).getTotal()).isEqualTo(10000); // No discount
    assertThat(response.getTotals().getDiscountAmount()).isEqualTo(0);
  }

  @Test
  @DisplayName("Should calculate complex order with all modifiers")
  void testComplexCalculation() {
    // Given
    UUID itemId = UUID.randomUUID();
    PriceCalculationRequest request = new PriceCalculationRequest();

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(2);
    item.setModifierCodes(List.of("SILK"));

    ItemCharacteristics characteristics = new ItemCharacteristics();
    characteristics.setColor("чорний");
    item.setCharacteristics(characteristics);
    request.setItems(List.of(item));

    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();
    globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H);
    globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.MILITARY);
    request.setGlobalModifiers(globalModifiers);

    PriceListItemInfo priceListItem = createPriceListItem(itemId, "Dress", 10000);
    priceListItem.setPriceBlack(12000); // Black price
    priceListItem.setCategoryCode(ServiceCategoryType.CLOTHING);

    PriceModifierEntity silkModifier = createPercentageModifier("SILK", "Silk", 5000); // 50%

    when(priceListService.getPriceListItemById(itemId)).thenReturn(priceListItem);
    when(priceModifierRepository.findByCode("SILK")).thenReturn(Optional.of(silkModifier));

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    // Base: 120 * 2 = 240
    // Silk: +50% = 120
    // Subtotal: 360
    // Urgency: +100% = 360
    // Before discount: 720
    // Military discount: -10% = -72
    // Final: 648
    assertThat(response.getItems().get(0).getTotal()).isEqualTo(64800);
    assertThat(response.getTotals().getTotal()).isEqualTo(64800);
  }

  @Test
  @DisplayName("Should calculate multiple items correctly")
  void testMultipleItems() {
    // Given
    UUID itemId1 = UUID.randomUUID();
    UUID itemId2 = UUID.randomUUID();

    PriceCalculationRequest request = new PriceCalculationRequest();

    PriceCalculationItem item1 = new PriceCalculationItem();
    item1.setPriceListItemId(itemId1);
    item1.setQuantity(1);

    PriceCalculationItem item2 = new PriceCalculationItem();
    item2.setPriceListItemId(itemId2);
    item2.setQuantity(2);

    request.setItems(Arrays.asList(item1, item2));

    PriceListItemInfo priceListItem1 = createPriceListItem(itemId1, "Item 1", 10000);
    PriceListItemInfo priceListItem2 = createPriceListItem(itemId2, "Item 2", 15000);

    when(priceListService.getPriceListItemById(itemId1)).thenReturn(priceListItem1);
    when(priceListService.getPriceListItemById(itemId2)).thenReturn(priceListItem2);

    // When
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Then
    assertThat(response.getItems()).hasSize(2);
    assertThat(response.getTotals().getTotal()).isEqualTo(40000); // 100 + 150*2 = 400
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

  private PriceModifierEntity createPercentageModifier(String code, String name, int value) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode(code);
    modifier.setName(name);
    modifier.setType(PriceModifierEntity.ModifierType.PERCENTAGE);
    modifier.setValue(value);
    modifier.setActive(true);
    return modifier;
  }
}
