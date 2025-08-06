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

import com.aksi.api.pricing.dto.ItemCharacteristics;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UnitOfMeasure;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.repository.PriceModifierRepository;

/** Tests for item characteristics pricing logic Based on OrderWizard document sections 73-106 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ItemCharacteristicsEntityTest {

  @Autowired private PricingService pricingService;
  @Autowired private PriceListItemRepository priceListItemRepository;
  @Autowired private PriceModifierRepository priceModifierRepository;

  private PriceListItemEntity textileItem;
  private PriceListItemEntity leatherItem;
  private PriceListItemEntity coatItem;

  @BeforeEach
  void setUp() {
    // Create test price list items
    textileItem = createPriceListItem(ServiceCategoryType.CLOTHING, "Сукня", 80000); // 800 UAH
    leatherItem =
        createPriceListItem(ServiceCategoryType.LEATHER, "Куртка шкіряна", 200000); // 2000 UAH
    coatItem = createPriceListItem(ServiceCategoryType.CLOTHING, "Пальто", 150000); // 1500 UAH

    // Create modifiers for materials and characteristics
    createMaterialModifiers();
    createWearLevelModifiers();
    createFillerModifiers();
  }

  @Test
  @DisplayName("Матеріали текстилю: Бавовна, Шерсть, Шовк, Синтетика")
  void testTextileMaterials() {
    // Cotton - standard price
    PriceCalculationRequest request =
        createRequestWithCharacteristics(textileItem.getId(), "Бавовна", null, null);
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(80000, response.getTotals().getTotal()); // Base price

    // Wool - might have surcharge
    PriceModifierEntity woolModifier =
        createModifier("WOOL_MATERIAL", "Шерстяні вироби", 1500, List.of("CLOTHING"));
    request = createRequestWithCharacteristics(textileItem.getId(), "Шерсть", null, null);
    response = pricingService.calculatePrice(request);

    // Should apply material-based modifiers if configured
    // In real system, this would be handled by material-specific modifiers

    // Silk - premium material
    PriceModifierEntity silkModifier =
        createModifier("SILK_MATERIAL", "Шовкові вироби", 5000, List.of("CLOTHING"));
    request = createRequestWithCharacteristics(textileItem.getId(), "Шовк", null, null);
    response = pricingService.calculatePrice(request);

    // Synthetics - standard or discount
    request = createRequestWithCharacteristics(textileItem.getId(), "Синтетика", null, null);
    response = pricingService.calculatePrice(request);
    assertEquals(80000, response.getTotals().getTotal()); // Base price
  }

  @Test
  @DisplayName("Матеріали шкіри: Гладка шкіра, Нубук, Спілок, Замша")
  void testLeatherMaterials() {
    // Smooth leather - standard
    PriceCalculationRequest request =
        createRequestWithCharacteristics(leatherItem.getId(), "Гладка шкіра", null, null);
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    assertEquals(200000, response.getTotals().getTotal()); // Base price

    // Nubuck - special care needed
    PriceModifierEntity nubuckModifier =
        createModifier("NUBUCK_MATERIAL", "Нубук", 3000, List.of("LEATHER"));
    request = createRequestWithCharacteristics(leatherItem.getId(), "Нубук", null, null);
    response = pricingService.calculatePrice(request);

    // Split leather
    request = createRequestWithCharacteristics(leatherItem.getId(), "Спілок", null, null);
    response = pricingService.calculatePrice(request);

    // Suede - premium processing
    PriceModifierEntity suedeModifier =
        createModifier("SUEDE_MATERIAL", "Замша", 3500, List.of("LEATHER"));
    request = createRequestWithCharacteristics(leatherItem.getId(), "Замша", null, null);
    response = pricingService.calculatePrice(request);
  }

  @Test
  @DisplayName("Ступінь зносу: 10%, 30%, 50%, 75%")
  void testWearLevels() {
    // 10% wear - minimal surcharge
    ItemCharacteristics char10 = new ItemCharacteristics();
    char10.setWearLevel(ItemCharacteristics.WearLevelEnum.NUMBER_10);

    PriceCalculationRequest request =
        createRequestWithItemCharacteristics(textileItem.getId(), char10);
    PriceCalculationResponse response = pricingService.calculatePrice(request);
    // Base: 800, no surcharge for minimal wear
    assertEquals(80000, response.getTotals().getTotal());

    // 30% wear - small surcharge
    ItemCharacteristics char30 = new ItemCharacteristics();
    char30.setWearLevel(ItemCharacteristics.WearLevelEnum.NUMBER_30);

    request = createRequestWithItemCharacteristics(textileItem.getId(), char30);
    response = pricingService.calculatePrice(request);
    // Should apply wear level modifier if configured

    // 50% wear - moderate surcharge
    ItemCharacteristics char50 = new ItemCharacteristics();
    char50.setWearLevel(ItemCharacteristics.WearLevelEnum.NUMBER_50);

    request = createRequestWithItemCharacteristics(textileItem.getId(), char50);
    response = pricingService.calculatePrice(request);

    // 75% wear - significant surcharge
    ItemCharacteristics char75 = new ItemCharacteristics();
    char75.setWearLevel(ItemCharacteristics.WearLevelEnum.NUMBER_75);

    request = createRequestWithItemCharacteristics(textileItem.getId(), char75);
    response = pricingService.calculatePrice(request);
  }

  @Test
  @DisplayName("Наповнювачі: Пух, Синтепон, Інше")
  void testFillers() {
    // Down filler
    PriceCalculationRequest request =
        createRequestWithCharacteristics(coatItem.getId(), null, null, "Пух");
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Might have special handling for down items
    // Base: 1500

    // Synthetic filler
    request = createRequestWithCharacteristics(coatItem.getId(), null, null, "Синтепон");
    response = pricingService.calculatePrice(request);
    assertEquals(150000, response.getTotals().getTotal()); // Standard price

    // Other fillers
    request = createRequestWithCharacteristics(coatItem.getId(), null, null, "Холлофайбер");
    response = pricingService.calculatePrice(request);
  }

  @Test
  @DisplayName("Збитий наповнювач - додатковий модифікатор")
  void testCompactedFiller() {
    // Create modifier for compacted filler
    PriceModifierEntity compactedModifier =
        createModifier("COMPACTED_FILLER", "Збитий наповнювач", 5000, null);

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(coatItem.getId());
    item.setQuantity(1);
    item.setModifierCodes(List.of("COMPACTED_FILLER"));

    // Add characteristics with filler
    ItemCharacteristics characteristics = new ItemCharacteristics();
    characteristics.setMaterial("Поліестер");
    item.setCharacteristics(characteristics);

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Base: 1500, Compacted filler: +50% = +750, Total: 2250
    assertEquals(225000, response.getTotals().getTotal());
  }

  @Test
  @DisplayName("Колір впливає на ціну - чорний vs інші кольори")
  void testColorPricing() {
    // Black color - uses special price
    ItemCharacteristics blackChar = new ItemCharacteristics();
    blackChar.setColor("Чорний");

    PriceCalculationRequest request =
        createRequestWithItemCharacteristics(textileItem.getId(), blackChar);
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Should use blackItemPrice if color is black
    // Base has blackItemPrice = basePrice + 100 UAH

    // Other colors - standard price
    ItemCharacteristics colorChar = new ItemCharacteristics();
    colorChar.setColor("Червоний");

    request = createRequestWithItemCharacteristics(textileItem.getId(), colorChar);
    response = pricingService.calculatePrice(request);
    assertEquals(80000, response.getTotals().getTotal()); // Base price

    // Light colors might have surcharge
    colorChar.setColor("Білий");
    request = createRequestWithItemCharacteristics(textileItem.getId(), colorChar);
    response = pricingService.calculatePrice(request);
  }

  @Test
  @DisplayName("Complex characteristics combination")
  void testComplexCharacteristics() {
    // Create relevant modifiers
    createModifier("SILK_MATERIAL", "Шовкові вироби", 5000, List.of("CLOTHING"));
    createModifier("WEAR_50", "Знос 50%", 2000, null);

    // Item with multiple characteristics
    ItemCharacteristics characteristics = new ItemCharacteristics();
    characteristics.setMaterial("Шовк");
    characteristics.setColor("Чорний");
    characteristics.setWearLevel(ItemCharacteristics.WearLevelEnum.NUMBER_50);

    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(textileItem.getId());
    item.setQuantity(2); // 2 items
    item.setCharacteristics(characteristics);

    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(item));

    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Complex calculation with all characteristics
    // Should consider material, color, wear level, and quantity
    assertNotNull(response.getTotals().getTotal());
    assertTrue(response.getTotals().getTotal() > 160000); // More than 2x base price
  }

  // Helper methods
  private PriceListItemEntity createPriceListItem(
      ServiceCategoryType categoryCode, String name, Integer basePrice) {
    PriceListItemEntity item = new PriceListItemEntity();
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

  private PriceModifierEntity createModifier(
      String code, String name, Integer value, List<String> categories) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setCode(code);
    modifier.setName(name);
    modifier.setType(PriceModifierEntity.ModifierType.PERCENTAGE);
    modifier.setValue(value);
    modifier.setCategoryRestrictions(categories);
    modifier.setActive(true);
    modifier.setSortOrder(1);
    return priceModifierRepository.save(modifier);
  }

  private void createMaterialModifiers() {
    // Textile materials
    createModifier("WOOL_MATERIAL", "Шерстяні вироби", 1500, List.of("CLOTHING"));
    createModifier("SILK_MATERIAL", "Шовкові вироби", 5000, List.of("CLOTHING"));

    // Leather materials
    createModifier("NUBUCK_MATERIAL", "Нубук", 3000, List.of("LEATHER"));
    createModifier("SUEDE_MATERIAL", "Замша", 3500, List.of("LEATHER"));
  }

  private void createWearLevelModifiers() {
    createModifier("WEAR_30", "Знос 30%", 1000, null);
    createModifier("WEAR_50", "Знос 50%", 2000, null);
    createModifier("WEAR_75", "Знос 75%", 3500, null);
  }

  private void createFillerModifiers() {
    createModifier("DOWN_FILLER", "Пухові вироби", 2000, null);
    createModifier("COMPACTED_FILLER", "Збитий наповнювач", 5000, null);
  }

  private PriceCalculationRequest createRequestWithCharacteristics(
      UUID itemId, String material, String color, String filler) {

    ItemCharacteristics characteristics = new ItemCharacteristics();
    if (material != null) characteristics.setMaterial(material);
    if (color != null) characteristics.setColor(color);
    // Note: filler is not in pricing DTO, would need to be handled via modifiers

    return createRequestWithItemCharacteristics(itemId, characteristics);
  }

  private PriceCalculationRequest createRequestWithItemCharacteristics(
      UUID itemId, ItemCharacteristics characteristics) {

    PriceCalculationRequest request = new PriceCalculationRequest();
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(itemId);
    item.setQuantity(1);
    item.setCharacteristics(characteristics);
    request.setItems(List.of(item));
    return request;
  }
}
