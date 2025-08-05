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
import com.aksi.api.pricing.dto.ItemCharacteristics;
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
 * Tests for intelligent dependencies and automatic recommendations Based on OrderWizard document
 * smart features
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class IntelligentDependenciesTest {

  @Autowired private PricingService pricingService;
  @Autowired private PriceListItemRepository priceListItemRepository;
  @Autowired private PriceModifierRepository priceModifierRepository;

  // Service items
  private PriceListItem jacket;
  private PriceListItem jacketLining;
  private PriceListItem jacketIroning;
  private PriceListItem waterRepellent;
  private PriceListItem leatherJacket;
  private PriceListItem leatherRestoration;
  private PriceListItem weddingDress;
  private PriceListItem weddingAccessories;

  @BeforeEach
  void setUp() {
    createServiceItems();
    createRelatedModifiers();
  }

  @Test
  @DisplayName("Якщо обрано куртку - розрахунок з підкладкою")
  void testJacketWithLiningCombination() {
    // Calculate jacket alone
    PriceCalculationRequest request = createSimpleRequest(jacket.getId());
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(150000, response.getTotals().getTotal()); // 1500 UAH

    // Calculate with both jacket and lining
    request = new PriceCalculationRequest();
    request.setItems(List.of(createItem(jacket.getId(), 1), createItem(jacketLining.getId(), 1)));

    response = pricingService.calculatePrice(request);

    // Should calculate both items correctly
    assertEquals(220000, response.getTotals().getTotal()); // 1500 + 700

    // Verify both items are calculated
    assertEquals(2, response.getItems().size());
    assertTrue(
        response.getItems().stream().anyMatch(item -> item.getItemName().contains("Куртка")));
    assertTrue(
        response.getItems().stream().anyMatch(item -> item.getItemName().contains("Підкладка")));
  }

  @Test
  @DisplayName("Шкіряні вироби з водовідштовхуючим покриттям")
  void testLeatherWithWaterRepellentModifier() {
    // Calculate leather item alone
    PriceCalculationRequest request = createSimpleRequest(leatherJacket.getId());
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(200000, response.getTotals().getTotal()); // 2000 UAH base

    // Calculate with water repellent modifier
    PriceCalculationItem item = createItem(leatherJacket.getId(), 1);
    item.setModifierCodes(List.of("WATER_REPELLENT"));
    request.setItems(List.of(item));

    response = pricingService.calculatePrice(request);

    // Base: 2000, Water repellent: +30% = 600, Total: 2600
    assertEquals(260000, response.getTotals().getTotal());

    // Verify modifier was applied
    assertEquals(1, response.getItems().get(0).getCalculations().getModifiers().size());
    assertEquals(
        "WATER_REPELLENT",
        response.getItems().get(0).getCalculations().getModifiers().get(0).getCode());
  }

  @Test
  @DisplayName("Після чистки - додати прасування")
  void testCleaningWithIroningCombination() {
    // Create shirt item
    PriceListItem shirt = createTextileItem("SHIRT", "Сорочка", 50000);

    // Calculate cleaning only
    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(
        List.of(
            createItem(jacket.getId(), 2), // 2 jackets
            createItem(shirt.getId(), 5) // 5 shirts
            ));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // 2 jackets (1500 * 2) + 5 shirts (500 * 5) = 5500
    assertEquals(550000, response.getTotals().getTotal());

    // Add ironing services
    PriceListItem shirtIroning =
        createServiceItem(ServiceCategoryType.IRONING, "SHIRT_IRON", "Прасування сорочки", 20000);

    request.setItems(
        List.of(
            createItem(jacket.getId(), 2),
            createItem(shirt.getId(), 5),
            createItem(jacketIroning.getId(), 2),
            createItem(shirtIroning.getId(), 5)));

    response = pricingService.calculatePrice(request);

    // Cleaning: 5500 + Ironing: 2*500 + 5*200 = 5500 + 1000 + 1000 = 7500
    assertEquals(750000, response.getTotals().getTotal());
  }

  @Test
  @DisplayName("Весільна сукня - комплексний пакет послуг")
  void testWeddingDressPackageCalculation() {
    // Wedding dress alone
    PriceCalculationRequest request = createSimpleRequest(weddingDress.getId());
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(350000, response.getTotals().getTotal()); // 3500 UAH

    // Wedding dress + accessories without package discount
    request = new PriceCalculationRequest();
    request.setItems(
        List.of(createItem(weddingDress.getId(), 1), createItem(weddingAccessories.getId(), 1)));

    response = pricingService.calculatePrice(request);
    assertEquals(450000, response.getTotals().getTotal()); // 3500 + 1000 = 4500

    // Apply wedding package modifier for discount
    PriceCalculationItem dressItem = createItem(weddingDress.getId(), 1);
    dressItem.setModifierCodes(List.of("WEDDING_PACKAGE"));

    request.setItems(List.of(dressItem, createItem(weddingAccessories.getId(), 1)));

    response = pricingService.calculatePrice(request);

    // Wedding dress with -10% package discount: 3500 * 0.9 = 3150
    // Accessories: 1000
    // Total: 3150 + 1000 = 4150
    assertEquals(415000, response.getTotals().getTotal());
  }

  @Test
  @DisplayName("Сильно забруднені речі - додатковий модифікатор")
  void testHeavilySoiledModifier() {
    // Item with heavy soiling modifier
    PriceCalculationItem item = createItem(jacket.getId(), 1);
    item.setModifierCodes(List.of("HEAVILY_SOILED_MAX"));

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 1500, Heavy soiling: +100% = 1500, Total: 3000
    assertEquals(300000, response.getTotals().getTotal());

    // Verify modifier was applied
    assertEquals(1, response.getItems().get(0).getCalculations().getModifiers().size());
    assertEquals(
        "HEAVILY_SOILED_MAX",
        response.getItems().get(0).getCalculations().getModifiers().get(0).getCode());
    assertEquals(
        10000,
        response.getItems().get(0).getCalculations().getModifiers().get(0).getValue()); // 100%
  }

  @Test
  @DisplayName("Знос більше 50% - застосування модифікатора")
  void testHighWearLevelPricing() {
    // Create wear level modifier
    createModifier("WEAR_75", "Знос 75%", 3500, null);

    // Leather item with high wear
    ItemCharacteristics characteristics = new ItemCharacteristics();
    characteristics.setWearLevel(ItemCharacteristics.WearLevelEnum.NUMBER_75);
    characteristics.setMaterial("Натуральна шкіра");

    PriceCalculationItem item = createItem(leatherJacket.getId(), 1);
    item.setCharacteristics(characteristics);
    item.setModifierCodes(List.of("WEAR_75"));

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 2000, Wear 75%: +35% = 700, Total: 2700
    assertEquals(270000, response.getTotals().getTotal());
  }

  @Test
  @DisplayName("Сезонні послуги - зимове пальто з антимільною обробкою")
  void testSeasonalServices() {
    // Winter coat
    PriceListItem winterCoat =
        createServiceItem(ServiceCategoryType.CLOTHING, "WINTER_COAT", "Зимове пальто", 200000);

    // Create anti-moth treatment modifier
    createModifier("ANTI_MOTH", "Антимільна обробка", 2000, List.of("CLOTHING"));

    // Calculate with anti-moth treatment for summer storage
    PriceCalculationItem item = createItem(winterCoat.getId(), 1);
    item.setModifierCodes(List.of("ANTI_MOTH"));

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 2000, Anti-moth: +20% = 400, Total: 2400
    assertEquals(240000, response.getTotals().getTotal());
  }

  @Test
  @DisplayName("Комбіновані матеріали - подвійна вартість")
  void testCombinedMaterialPricing() {
    // Item with leather and textile
    PriceListItem combinedItem =
        createServiceItem(ServiceCategoryType.CLOTHING, "COMBINED", "Куртка комбінована", 180000);

    ItemCharacteristics characteristics = new ItemCharacteristics();
    characteristics.setMaterial("Шкіра + Текстиль");

    PriceCalculationItem item = createItem(combinedItem.getId(), 1);
    item.setCharacteristics(characteristics);
    item.setModifierCodes(List.of("COMBINED_LEATHER_TEXTILE"));

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 1800, Combined material: +100% = 1800, Total: 3600
    assertEquals(360000, response.getTotals().getTotal());

    // Verify modifier
    assertEquals(1, response.getItems().get(0).getCalculations().getModifiers().size());
    assertEquals(
        10000,
        response.getItems().get(0).getCalculations().getModifiers().get(0).getValue()); // 100%
  }

  @Test
  @DisplayName("Великі замовлення - розрахунок без знижок")
  void testBulkOrderCalculation() {
    // Large order of similar items
    PriceListItem shirt =
        createServiceItem(ServiceCategoryType.CLOTHING, "SHIRT", "Сорочка", 50000);

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(
        List.of(
            createItem(shirt.getId(), 10), // 10 shirts
            createItem(jacket.getId(), 5) // 5 jackets
            ));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Total without bulk discount: (500 * 10) + (1500 * 5) = 5000 + 7500 = 12500
    assertEquals(1250000, response.getTotals().getTotal());

    // Apply bulk discount modifier to shirts
    PriceCalculationItem shirtItem = createItem(shirt.getId(), 10);
    shirtItem.setModifierCodes(List.of("BULK_DISCOUNT_10"));

    request.setItems(List.of(shirtItem, createItem(jacket.getId(), 5)));

    response = pricingService.calculatePrice(request);

    // Shirts with -10% bulk discount: 5000 * 0.9 = 4500
    // Jackets: 7500
    // Total: 4500 + 7500 = 12000
    assertEquals(1200000, response.getTotals().getTotal());
  }

  @Test
  @DisplayName("Делікатні тканини - автоматичні обмеження")
  void testDelicateFabricDependencies() {
    // Silk item
    PriceListItem silkDress =
        createServiceItem(ServiceCategoryType.CLOTHING, "SILK_DRESS", "Сукня шовкова", 100000);

    ItemCharacteristics characteristics = new ItemCharacteristics();
    characteristics.setMaterial("100% натуральний шовк");

    PriceCalculationItem item = createItem(silkDress.getId(), 1);
    item.setCharacteristics(characteristics);

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    // Try to add incompatible urgency
    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H);
    request.setGlobalModifiers(global);

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Should warn about limitations
    assertNotNull(response.getWarnings());
    assertTrue(
        response.getWarnings().stream()
            .anyMatch(w -> w.contains("делікатна") || w.contains("термін виконання")));
  }

  @Test
  @DisplayName("Кольорові речі - різні ціни для чорного кольору")
  void testColorBasedPricing() {
    // Mix of black and colored items
    PriceCalculationRequest request = new PriceCalculationRequest();

    ItemCharacteristics blackChar = new ItemCharacteristics();
    blackChar.setColor("Чорний");

    ItemCharacteristics whiteChar = new ItemCharacteristics();
    whiteChar.setColor("Білий");

    ItemCharacteristics redChar = new ItemCharacteristics();
    redChar.setColor("Червоний");

    PriceCalculationItem blackItem = createItem(jacket.getId(), 2);
    blackItem.setCharacteristics(blackChar);

    PriceCalculationItem whiteItem = createItem(jacket.getId(), 1);
    whiteItem.setCharacteristics(whiteChar);

    PriceCalculationItem redItem = createItem(jacket.getId(), 1);
    redItem.setCharacteristics(redChar);

    request.setItems(List.of(blackItem, whiteItem, redItem));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Black items: 2 * (1500 + 100) = 3200 (using blackItemPrice)
    // White item: 1 * 1500 = 1500 (base price for white/natural)
    // Red item: 1 * 1500 = 1500 (base price for colors)
    // Total: 3200 + 1500 + 1500 = 6200

    // Check individual item prices
    assertEquals(3, response.getItems().size());

    // Find black item (quantity 2)
    response.getItems().stream()
        .filter(item -> item.getQuantity() == 2)
        .findFirst()
        .ifPresent(
            item -> {
              // Black item should use blackItemPrice
              assertEquals(160000, item.getBasePrice()); // 1600 per item
              assertEquals(320000, item.getTotal()); // 1600 * 2
            });
  }

  // Helper methods
  private void createServiceItems() {
    jacket = createServiceItem(ServiceCategoryType.CLOTHING, "JACKET", "Куртка", 150000);
    jacketLining =
        createServiceItem(ServiceCategoryType.CLOTHING, "JACKET_LINING", "Підкладка куртки", 70000);
    jacketIroning =
        createServiceItem(ServiceCategoryType.IRONING, "JACKET_IRON", "Прасування куртки", 50000);
    waterRepellent =
        createServiceItem(
            ServiceCategoryType.ADDITIONAL_SERVICES,
            "WATER_REPEL",
            "Водовідштовхуюче покриття",
            60000);
    leatherJacket =
        createServiceItem(ServiceCategoryType.LEATHER, "LEATHER_JACKET", "Куртка шкіряна", 200000);
    leatherRestoration =
        createServiceItem(
            ServiceCategoryType.LEATHER, "LEATHER_RESTORE", "Відновлення шкіри", 150000);
    weddingDress =
        createServiceItem(ServiceCategoryType.CLOTHING, "WEDDING_DRESS", "Весільна сукня", 350000);
    weddingAccessories =
        createServiceItem(
            ServiceCategoryType.CLOTHING, "WEDDING_ACC", "Весільні аксесуари", 100000);
  }

  private void createRelatedModifiers() {
    createModifier("HEAVILY_SOILED_MAX", "Дуже забруднені речі (максимум)", 10000, null);
    createModifier("COMBINED_LEATHER_TEXTILE", "Комбіновані вироби", 10000, null);
    createModifier("WATER_REPELLENT", "Водовідштовхуюче покриття", 3000, null);
    createModifier("WEDDING_PACKAGE", "Весільний пакет", -1000, null);
    createModifier("BULK_DISCOUNT_10", "Знижка за кількість 10+", -1000, null);
  }

  private PriceListItem createServiceItem(
      ServiceCategoryType categoryCode, String itemNumber, String name, Integer basePrice) {
    PriceListItem item = new PriceListItem();
    item.setCategoryCode(categoryCode);
    item.setCatalogNumber(Integer.parseInt(itemNumber.replaceAll("[^0-9]", "1")));
    item.setName(name);
    item.setUnitOfMeasure(UnitOfMeasure.PIECE);
    item.setBasePrice(basePrice);
    item.setPriceBlack(basePrice + 10000); // +100 UAH for black
    item.setPriceColor(basePrice); // Same as base for colors
    item.setActive(true);
    return priceListItemRepository.save(item);
  }

  private PriceListItem createTextileItem(String itemNumber, String name, Integer basePrice) {
    return createServiceItem(ServiceCategoryType.CLOTHING, itemNumber, name, basePrice);
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

  private PriceCalculationRequest createSimpleRequest(UUID itemId) {
    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(createItem(itemId, 1)));
    return request;
  }

  private PriceCalculationItem createItem(UUID itemId, Integer quantity) {
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(quantity);
    return item;
  }
}
