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
 * Tests for category-specific business rules Based on OrderWizard document sections 57-66 and
 * 302-320
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CategoryBusinessRulesTest {

  @Autowired private PricingService pricingService;
  @Autowired private PriceListItemRepository priceListItemRepository;
  @Autowired private PriceModifierRepository priceModifierRepository;

  @BeforeEach
  void setUp() {
    createCategoryItems();
    createCategorySpecificModifiers();
  }

  @Test
  @DisplayName("Категорія: Чистка одягу та текстилю")
  void testTextileCleaning() {
    PriceListItem dress =
        createItem(ServiceCategoryType.CLOTHING, "DRESS", "Сукня", UnitOfMeasure.PIECE, 80000);
    PriceListItem coat =
        createItem(ServiceCategoryType.CLOTHING, "COAT", "Пальто", UnitOfMeasure.PIECE, 150000);

    // Standard textile cleaning
    PriceCalculationRequest request = createSimpleRequest(dress.getId());
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(80000, response.getTotals().getTotal());

    // Textile with special material modifier
    PriceModifier silkModifier = createModifier("SILK_MATERIAL", "Шовк", 5000, List.of("CLOTHING"));
    request = createRequestWithModifier(dress.getId(), "SILK_MATERIAL");
    response = pricingService.calculatePrice(request);
    assertEquals(120000, response.getTotals().getTotal()); // 800 + 50%
  }

  @Test
  @DisplayName("Категорія: Прання білизни - одиниця виміру кілограми")
  void testLaundryByWeight() {
    // Laundry is measured in kilograms
    PriceListItem laundry =
        createItem(
            ServiceCategoryType.LAUNDRY,
            "BEDDING",
            "Постільна білизна",
            UnitOfMeasure.KILOGRAM,
            15000); // 150 UAH/kg

    // 3 kg of laundry
    PriceCalculationRequest request = createSimpleRequest(laundry.getId(), 3);
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(45000, response.getTotals().getTotal()); // 150 * 3

    // Verify discount exclusion for laundry
    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);
    request.setGlobalModifiers(global);

    response = pricingService.calculatePrice(request);
    assertEquals(45000, response.getTotals().getTotal()); // No discount applied
    assertNotNull(response.getWarnings());
    assertTrue(response.getWarnings().stream().anyMatch(w -> w.contains("LAUNDRY")));
  }

  @Test
  @DisplayName("Категорія: Прасування - знижки не застосовуються")
  void testIroningNoDiscounts() {
    PriceListItem ironing =
        createItem(
            ServiceCategoryType.IRONING, "SHIRT", "Сорочка", UnitOfMeasure.PIECE, 5000); // 50 UAH

    // Try to apply discount
    PriceCalculationRequest request = createSimpleRequest(ironing.getId());
    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.MILITARY);
    request.setGlobalModifiers(global);

    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(5000, response.getTotals().getTotal()); // No discount
    assertEquals(0, response.getTotals().getDiscountAmount());
  }

  @Test
  @DisplayName("Категорія: Чистка та відновлення шкіряних виробів")
  void testLeatherCleaning() {
    PriceListItem leatherJacket =
        createItem(
            ServiceCategoryType.LEATHER, "JACKET", "Куртка шкіряна", UnitOfMeasure.PIECE, 200000);

    // Standard leather cleaning
    PriceCalculationRequest request = createSimpleRequest(leatherJacket.getId());
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(200000, response.getTotals().getTotal());

    // Leather-specific modifiers
    createModifier("LEATHER_RESTORE", "Відновлення шкіри", 5000, List.of("LEATHER"));
    request = createRequestWithModifier(leatherJacket.getId(), "LEATHER_RESTORE");
    response = pricingService.calculatePrice(request);
    assertEquals(300000, response.getTotals().getTotal()); // 2000 + 50%
  }

  @Test
  @DisplayName("Категорія: Дублянки - специфічні модифікатори")
  void testSheepskinCleaning() {
    PriceListItem sheepskin =
        createItem(ServiceCategoryType.LEATHER, "COAT", "Дублянка", UnitOfMeasure.PIECE, 300000);

    // Natural sheepskin on artificial fur - discount
    createModifier("SHEEPSKIN_ARTIFICIAL", "Дублянка на штучному хутрі", -2000, List.of("LEATHER"));
    PriceCalculationRequest request =
        createRequestWithModifier(sheepskin.getId(), "SHEEPSKIN_ARTIFICIAL");
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(240000, response.getTotals().getTotal()); // 3000 - 20%
  }

  @Test
  @DisplayName("Категорія: Вироби із натурального хутра")
  void testFurCleaning() {
    PriceListItem furCoat =
        createItem(ServiceCategoryType.FUR, "COAT", "Шуба", UnitOfMeasure.PIECE, 500000);

    // Fur requires special handling
    PriceCalculationRequest request = createSimpleRequest(furCoat.getId());
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(500000, response.getTotals().getTotal());

    // Fur restoration modifier
    createModifier("FUR_RESTORE", "Відновлення хутра", 3000, List.of("FUR"));
    request = createRequestWithModifier(furCoat.getId(), "FUR_RESTORE");
    response = pricingService.calculatePrice(request);
    assertEquals(650000, response.getTotals().getTotal()); // 5000 + 30%
  }

  @Test
  @DisplayName("Категорія: Фарбування текстильних виробів - знижки не застосовуються")
  void testDyeingNoDiscounts() {
    PriceListItem dyeing =
        createItem(
            ServiceCategoryType.DYEING, "DRESS", "Фарбування сукні", UnitOfMeasure.PIECE, 120000);

    // Try multiple discount types
    GlobalPriceModifiers global = new GlobalPriceModifiers();

    // EVERCARD
    global.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);
    PriceCalculationRequest request = createSimpleRequest(dyeing.getId());
    request.setGlobalModifiers(global);
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(120000, response.getTotals().getTotal()); // No discount

    // SOCIAL_MEDIA
    global.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.SOCIAL_MEDIA);
    response = pricingService.calculatePrice(request);
    assertEquals(120000, response.getTotals().getTotal()); // No discount

    // OTHER with custom percentage
    global.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.OTHER);
    global.setDiscountPercentage(15);
    response = pricingService.calculatePrice(request);
    assertEquals(120000, response.getTotals().getTotal()); // Still no discount
  }

  @Test
  @DisplayName("Терміни виконання за категоріями")
  void testCategoryCompletionTimes() {
    // Document states: 48 hours for standard, 14 days for leather

    // Standard textile - 48 hours base
    PriceListItem textile =
        createItem(ServiceCategoryType.CLOTHING, "ITEM", "Виріб", UnitOfMeasure.PIECE, 100000);

    // Leather - 14 days base
    PriceListItem leather =
        createItem(
            ServiceCategoryType.LEATHER, "ITEM", "Шкіряний виріб", UnitOfMeasure.PIECE, 200000);

    // This would be handled by the order service for actual completion dates
    // Here we test urgency pricing

    // Express 48h on textile
    PriceCalculationRequest request = createSimpleRequest(textile.getId());
    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H);
    request.setGlobalModifiers(global);

    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(150000, response.getTotals().getTotal()); // +50%

    // Express 24h on leather (might not be feasible in real business)
    request = createSimpleRequest(leather.getId());
    global.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H);
    request.setGlobalModifiers(global);

    response = pricingService.calculatePrice(request);
    assertEquals(400000, response.getTotals().getTotal()); // +100%
  }

  @Test
  @DisplayName("Модифікатори обмежені категоріями")
  void testCategoryRestrictedModifiers() {
    PriceListItem textile =
        createItem(ServiceCategoryType.CLOTHING, "ITEM", "Текстиль", UnitOfMeasure.PIECE, 100000);
    PriceListItem leather =
        createItem(ServiceCategoryType.LEATHER, "ITEM", "Шкіра", UnitOfMeasure.PIECE, 200000);

    // Create textile-only modifier
    createModifier("TEXTILE_ONLY", "Тільки для текстилю", 2000, List.of("CLOTHING"));

    // Try on textile - should work
    PriceCalculationRequest request = createRequestWithModifier(textile.getId(), "TEXTILE_ONLY");
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(120000, response.getTotals().getTotal()); // 1000 + 20%

    // Try on leather - should not apply
    request = createRequestWithModifier(leather.getId(), "TEXTILE_ONLY");
    response = pricingService.calculatePrice(request);
    assertEquals(200000, response.getTotals().getTotal()); // Base price only
  }

  @Test
  @DisplayName("Змішані замовлення з різними категоріями")
  void testMixedCategoryOrder() {
    PriceListItem textile =
        createItem(ServiceCategoryType.CLOTHING, "DRESS", "Сукня", UnitOfMeasure.PIECE, 80000);
    PriceListItem laundry =
        createItem(
            ServiceCategoryType.LAUNDRY, "SHEETS", "Простирадла", UnitOfMeasure.KILOGRAM, 15000);
    PriceListItem ironing =
        createItem(ServiceCategoryType.IRONING, "SHIRT", "Сорочка", UnitOfMeasure.PIECE, 5000);

    PriceCalculationRequest request = new PriceCalculationRequest();

    // Add items from different categories
    PriceCalculationItem item1 = new PriceCalculationItem();
    item1.setPriceListItemId(textile.getId());
    item1.setQuantity(1);

    PriceCalculationItem item2 = new PriceCalculationItem();
    item2.setPriceListItemId(laundry.getId());
    item2.setQuantity(2); // 2 kg

    PriceCalculationItem item3 = new PriceCalculationItem();
    item3.setPriceListItemId(ironing.getId());
    item3.setQuantity(3); // 3 shirts

    request.setItems(List.of(item1, item2, item3));

    // Apply discount
    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.EVERCARD);
    request.setGlobalModifiers(global);

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Textile: 800, -10% = 720
    // Laundry: 150 * 2 = 300 (no discount)
    // Ironing: 50 * 3 = 150 (no discount)
    // Total: 720 + 300 + 150 = 1170
    assertEquals(117000, response.getTotals().getTotal());

    // Verify discount was applied only to eligible items
    assertEquals(8000, response.getTotals().getDiscountAmount()); // Only textile discount
    assertEquals(
        80000, response.getTotals().getDiscountApplicableAmount()); // Only textile eligible
  }

  // Helper methods
  private void createCategoryItems() {
    // Created in individual tests as needed
  }

  private void createCategorySpecificModifiers() {
    // Created in individual tests as needed
  }

  private PriceListItem createItem(
      ServiceCategoryType categoryCode,
      String itemNumber,
      String name,
      UnitOfMeasure unit,
      Integer basePrice) {
    PriceListItem item = new PriceListItem();
    item.setCategoryCode(categoryCode);
    item.setCatalogNumber(Integer.parseInt(itemNumber.replaceAll("[^0-9]", "1")));
    item.setName(name);
    item.setUnitOfMeasure(unit);
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

  private PriceCalculationRequest createSimpleRequest(UUID itemId) {
    return createSimpleRequest(itemId, 1);
  }

  private PriceCalculationRequest createSimpleRequest(UUID itemId, Integer quantity) {
    PriceCalculationRequest request = new PriceCalculationRequest();
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(quantity);
    request.setItems(List.of(item));
    return request;
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
