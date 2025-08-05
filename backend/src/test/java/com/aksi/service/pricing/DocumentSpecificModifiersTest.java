package com.aksi.service.pricing;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UnitOfMeasure;
import com.aksi.domain.catalog.PriceListItem;
import com.aksi.domain.pricing.PriceModifier;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.repository.PriceModifierRepository;

/**
 * Tests for specific modifiers from OrderWizard document Testing exact percentages and business
 * rules from documentation
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DocumentSpecificModifiersTest {

  @Autowired private PricingService pricingService;
  @Autowired private PriceListItemRepository priceListItemRepository;
  @Autowired private PriceModifierRepository priceModifierRepository;

  private PriceListItem regularItem;
  private PriceListItem leatherItem;
  private PriceListItem silkItem;

  @BeforeEach
  void setUp() {
    // Create test price list items
    regularItem = createPriceListItem(ServiceCategoryType.CLOTHING, "Сукня", 80000); // 800 UAH
    leatherItem =
        createPriceListItem(ServiceCategoryType.LEATHER, "Куртка шкіряна", 200000); // 2000 UAH
    silkItem =
        createPriceListItem(ServiceCategoryType.CLOTHING, "Блузка шовкова", 60000); // 600 UAH

    // Create specific modifiers from document
    createGeneralModifiers();
    createTextileModifiers();
    createLeatherModifiers();
  }

  @Test
  @DisplayName("Дитячі речі (до 30 розміру) - знижка 30%")
  void testChildrenClothesDiscount() {
    // Create children's clothes modifier (-30%)
    PriceModifier childModifier =
        createModifier("CHILD_SIZE", "Дитячі речі (до 30 розміру)", -3000, null);

    PriceCalculationRequest request = createRequestWithModifier(regularItem.getId(), "CHILD_SIZE");

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Child discount: -30% = -240, Total: 560
    assertEquals(56000, response.getTotals().getTotal());
    assertEquals(80000, response.getItems().get(0).getBasePrice());
    assertEquals(-24000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Ручна чистка +20% до вартості")
  void testManualCleaningSurcharge() {
    PriceModifier manualModifier = createModifier("MANUAL_CLEAN", "Ручна чистка", 2000, null);

    PriceCalculationRequest request =
        createRequestWithModifier(regularItem.getId(), "MANUAL_CLEAN");

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Manual: +20% = +160, Total: 960
    assertEquals(96000, response.getTotals().getTotal());
    assertEquals(16000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Дуже забруднені речі +від 20 до 100%")
  void testHeavilySoiledItems() {
    // Test minimum (+20%)
    PriceModifier soiledMin =
        createModifier("HEAVILY_SOILED_MIN", "Дуже забруднені речі", 2000, null);
    PriceCalculationRequest request =
        createRequestWithModifier(regularItem.getId(), "HEAVILY_SOILED_MIN");
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(96000, response.getTotals().getTotal()); // 800 + 20%

    // Test maximum (+100%)
    PriceModifier soiledMax =
        createModifier("HEAVILY_SOILED_MAX", "Дуже забруднені речі (максимум)", 10000, null);
    request = createRequestWithModifier(regularItem.getId(), "HEAVILY_SOILED_MAX");
    response = pricingService.calculatePrice(request);
    assertEquals(160000, response.getTotals().getTotal()); // 800 + 100%
  }

  @Test
  @DisplayName("Чистка виробів з хутряними комірами та манжетами +30%")
  void testFurCollarsCuffs() {
    PriceModifier furModifier =
        createModifier(
            "FUR_COLLARS",
            "Чистка виробів з хутряними комірами та манжетами",
            3000,
            List.of("CLOTHING"));

    PriceCalculationRequest request = createRequestWithModifier(regularItem.getId(), "FUR_COLLARS");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Fur collars: +30% = +240, Total: 1040
    assertEquals(104000, response.getTotals().getTotal());
    assertEquals(24000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Нанесення водовідштовхуючого покриття +30%")
  void testWaterRepellentCoating() {
    PriceModifier waterModifier =
        createModifier("WATER_REPELLENT", "Нанесення водовідштовхуючого покриття", 3000, null);

    // Test on textile
    PriceCalculationRequest request =
        createRequestWithModifier(regularItem.getId(), "WATER_REPELLENT");
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(104000, response.getTotals().getTotal()); // 800 + 30%

    // Test on leather
    request = createRequestWithModifier(leatherItem.getId(), "WATER_REPELLENT");
    response = pricingService.calculatePrice(request);
    assertEquals(260000, response.getTotals().getTotal()); // 2000 + 30%
  }

  @Test
  @DisplayName("Чистка виробів із натурального шовку, атласу, шифону +50%")
  void testSilkSatinChiffon() {
    PriceModifier silkModifier =
        createModifier(
            "SILK_SATIN",
            "Чистка виробів із натурального шовку, атласу, шифону",
            5000,
            List.of("CLOTHING"));

    PriceCalculationRequest request = createRequestWithModifier(silkItem.getId(), "SILK_SATIN");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 600, Silk: +50% = +300, Total: 900
    assertEquals(90000, response.getTotals().getTotal());
    assertEquals(30000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Чистка комбінованих виробів (шкіра+текстиль) +100%")
  void testCombinedLeatherTextile() {
    PriceModifier combinedModifier =
        createModifier(
            "COMBINED_LEATHER_TEXTILE",
            "Чистка комбінованих виробів (шкіра+текстиль)",
            10000,
            null);

    PriceCalculationRequest request =
        createRequestWithModifier(regularItem.getId(), "COMBINED_LEATHER_TEXTILE");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Combined: +100% = +800, Total: 1600
    assertEquals(160000, response.getTotals().getTotal());
    assertEquals(80000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Прасування шкіряних виробів 70% від вартості чистки")
  void testLeatherIroning() {
    PriceModifier ironingModifier =
        createModifier("LEATHER_IRONING", "Прасування шкіряних виробів", 7000, List.of("LEATHER"));

    PriceCalculationRequest request =
        createRequestWithModifier(leatherItem.getId(), "LEATHER_IRONING");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 2000, Ironing: +70% = +1400, Total: 3400
    assertEquals(340000, response.getTotals().getTotal());
    assertEquals(140000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Чистка натуральних дублянок на штучному хутрі -20%")
  void testSheepskinArtificialFur() {
    PriceModifier sheepskinModifier =
        createModifier(
            "SHEEPSKIN_ARTIFICIAL",
            "Чистка натуральних дублянок на штучному хутрі",
            -2000,
            List.of("LEATHER"));

    PriceCalculationRequest request =
        createRequestWithModifier(leatherItem.getId(), "SHEEPSKIN_ARTIFICIAL");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 2000, Discount: -20% = -400, Total: 1600
    assertEquals(160000, response.getTotals().getTotal());
    assertEquals(-40000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Чистка виробів чорного та світлих тонів +20%")
  void testBlackAndLightColors() {
    PriceModifier colorModifier =
        createModifier(
            "BLACK_LIGHT_COLORS",
            "Чистка виробів чорного та світлих тонів",
            2000,
            List.of("CLOTHING"));

    PriceCalculationRequest request =
        createRequestWithModifier(regularItem.getId(), "BLACK_LIGHT_COLORS");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Color surcharge: +20% = +160, Total: 960
    assertEquals(96000, response.getTotals().getTotal());
    assertEquals(16000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Чистка весільної сукні зі шлейфом +30%")
  void testWeddingDressWithTrain() {
    PriceModifier weddingModifier =
        createModifier(
            "WEDDING_TRAIN", "Чистка весільної сукні зі шлейфом", 3000, List.of("CLOTHING"));

    PriceCalculationRequest request =
        createRequestWithModifier(regularItem.getId(), "WEDDING_TRAIN");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Wedding dress: +30% = +240, Total: 1040
    assertEquals(104000, response.getTotals().getTotal());
    assertEquals(24000, response.getItems().get(0).getCalculations().getModifiersTotal());
  }

  @Test
  @DisplayName("Complex calculation with multiple modifiers")
  void testComplexCalculationWithDocumentModifiers() {
    // Create modifiers
    createModifier("MANUAL_CLEAN", "Ручна чистка", 2000, null);
    createModifier("WATER_REPELLENT", "Водовідштовхуюче покриття", 3000, null);

    PriceCalculationRequest request = new PriceCalculationRequest();
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(regularItem.getId());
    item.setQuantity(1);
    item.setModifierCodes(List.of("MANUAL_CLEAN", "WATER_REPELLENT"));
    request.setItems(List.of(item));

    // Add urgency
    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);
    request.setGlobalModifiers(global);

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 800, Manual: +20% = 160, Water: +30% = 240
    // Subtotal: 800 + 160 + 240 = 1200
    // Urgency: +50% of 1200 = 600
    // Total: 1200 + 600 = 1800
    assertEquals(180000, response.getTotals().getTotal());
  }

  // Helper methods
  private PriceListItem createPriceListItem(
      ServiceCategoryType categoryCode, String name, Integer basePrice) {
    PriceListItem item = new PriceListItem();
    item.setCategoryCode(categoryCode);
    item.setCatalogNumber((int) (Math.random() * 10000));
    item.setName(name);
    item.setUnitOfMeasure(UnitOfMeasure.PIECE);
    item.setBasePrice(basePrice);
    item.setPriceBlack(basePrice + 10000); // +100 UAH for black
    item.setPriceColor(basePrice); // Same as base for colors
    item.setActive(true);
    return priceListItemRepository.save(item);
  }

  private PriceModifier createModifier(
      String code, String name, Integer value, List<String> categories) {
    PriceModifier modifier = new PriceModifier();
    modifier.setCode(code);
    modifier.setName(name);
    modifier.setType(PriceModifier.ModifierType.PERCENTAGE);
    modifier.setValue(value);
    modifier.setCategoryRestrictions(categories);
    modifier.setActive(true);
    modifier.setSortOrder(1);
    return priceModifierRepository.save(modifier);
  }

  private void createGeneralModifiers() {
    createModifier("CHILD_SIZE", "Дитячі речі (до 30 розміру)", -3000, null);
    createModifier("MANUAL_CLEAN", "Ручна чистка", 2000, null);
    createModifier("HEAVILY_SOILED_MIN", "Дуже забруднені речі", 2000, null);
    createModifier("HEAVILY_SOILED_MAX", "Дуже забруднені речі (максимум)", 10000, null);
  }

  private void createTextileModifiers() {
    createModifier(
        "FUR_COLLARS",
        "Чистка виробів з хутряними комірами та манжетами",
        3000,
        List.of("CLOTHING"));
    createModifier(
        "WATER_REPELLENT", "Нанесення водовідштовхуючого покриття", 3000, List.of("CLOTHING"));
    createModifier(
        "SILK_SATIN",
        "Чистка виробів із натурального шовку, атласу, шифону",
        5000,
        List.of("CLOTHING"));
    createModifier(
        "COMBINED_LEATHER_TEXTILE",
        "Чистка комбінованих виробів (шкіра+текстиль)",
        10000,
        List.of("CLOTHING"));
    createModifier(
        "BLACK_LIGHT_COLORS", "Чистка виробів чорного та світлих тонів", 2000, List.of("CLOTHING"));
    createModifier("WEDDING_TRAIN", "Чистка весільної сукні зі шлейфом", 3000, List.of("CLOTHING"));
  }

  private void createLeatherModifiers() {
    createModifier("LEATHER_IRONING", "Прасування шкіряних виробів", 7000, List.of("LEATHER"));
    createModifier(
        "WATER_REPELLENT_LEATHER",
        "Нанесення водовідштовхуючого покриття",
        3000,
        List.of("LEATHER"));
    createModifier(
        "LEATHER_DYEING_AFTER", "Фарбування (після нашої чистки)", 5000, List.of("LEATHER"));
    createModifier(
        "LEATHER_DYEING_OTHER", "Фарбування (після чистки деінде)", 10000, List.of("LEATHER"));
    createModifier(
        "LEATHER_WITH_INSERTS", "Чистка шкіряних виробів із вставками", 3000, List.of("LEATHER"));
    createModifier("PEARL_COATING", "Нанесення перламутрового покриття", 3000, List.of("LEATHER"));
    createModifier(
        "SHEEPSKIN_ARTIFICIAL",
        "Чистка натуральних дублянок на штучному хутрі",
        -2000,
        List.of("LEATHER"));
    createModifier("LEATHER_MANUAL", "Ручна чистка виробів зі шкіри", 3000, List.of("LEATHER"));
  }

  private PriceCalculationRequest createRequestWithModifier(UUID itemId, String modifierCode) {
    PriceCalculationRequest request = new PriceCalculationRequest();
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(1);
    item.setModifierCodes(List.of(modifierCode));
    request.setItems(List.of(item));
    return request;
  }
}
