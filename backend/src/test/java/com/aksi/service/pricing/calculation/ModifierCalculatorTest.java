package com.aksi.service.pricing.calculation;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PricingModifierType;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.service.pricing.PriceCalculationService;
import com.aksi.service.pricing.calculation.ModifierCalculator.ModifierCalculationResult;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;

/**
 * Unit tests for ModifierCalculator verifying OrderWizard pricing logic steps 3-5: 3. Special
 * modifiers (may replace base price) 4. Multiplier modifiers (coefficients for material, condition,
 * additional services) 5. Fixed services (e.g., button sewing)
 */
@ExtendWith(MockitoExtension.class)
class ModifierCalculatorTest {

  @Mock private PriceCalculationService priceCalculationService;
  @Mock private PricingGuard guard;
  @Mock private PricingFactory factory;

  private ModifierCalculator calculator;

  @BeforeEach
  void setUp() {
    calculator = new ModifierCalculator(priceCalculationService, guard, factory);
  }

  @Test
  @DisplayName("Should calculate with no modifiers - return base amount as subtotal")
  void shouldCalculateWithNoModifiers() {
    // Given: item without modifiers
    PriceCalculationItem item = createItem(null);
    int baseAmount = 1000;

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should return base amount as subtotal with empty modifiers
    assertEquals(0, result.appliedModifiers().size());
    assertEquals(0, result.modifiersTotal());
    assertEquals(1000, result.subtotal()); // baseAmount + 0
  }

  @Test
  @DisplayName("Should calculate with empty modifiers list - return base amount as subtotal")
  void shouldCalculateWithEmptyModifiers() {
    // Given: item with empty modifiers list
    PriceCalculationItem item = createItem(Collections.emptyList());
    int baseAmount = 2000;

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should return base amount as subtotal with empty modifiers
    assertEquals(0, result.appliedModifiers().size());
    assertEquals(0, result.modifiersTotal());
    assertEquals(2000, result.subtotal()); // baseAmount + 0
  }

  @Test
  @DisplayName("Should calculate with single percentage modifier - apply percentage to base amount")
  void shouldCalculateWithSinglePercentageModifier() {
    // Given: item with one percentage modifier (+20%)
    List<String> modifierCodes = List.of("MATERIAL_BONUS");
    PriceCalculationItem item = createItem(modifierCodes);
    int baseAmount = 1000;

    // Mock modifier entity
    PriceModifierEntity modifier =
        createModifierEntity("MATERIAL_BONUS", PricingModifierType.PERCENTAGE, 2000); // 20%
    when(guard.loadActiveModifiers(modifierCodes)).thenReturn(List.of(modifier));

    // Mock calculation service (20% of 1000 = 200)
    when(priceCalculationService.calculateModifierAmount(eq(modifier), eq(baseAmount), anyInt()))
        .thenReturn(200);

    // Mock factory
    AppliedModifier appliedModifier = createAppliedModifier("MATERIAL_BONUS", 200);
    when(factory.createAppliedModifier(eq(modifier), eq(200))).thenReturn(appliedModifier);

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should apply percentage modifier
    assertEquals(1, result.appliedModifiers().size());
    assertEquals("MATERIAL_BONUS", result.appliedModifiers().getFirst().getCode());
    assertEquals(200, result.modifiersTotal());
    assertEquals(1200, result.subtotal()); // 1000 + 200
  }

  @Test
  @DisplayName("Should calculate with single fixed modifier - apply fixed amount per quantity")
  void shouldCalculateWithSingleFixedModifier() {
    // Given: item with one fixed modifier (button sewing - 50 kopiykas per item, quantity = 3)
    List<String> modifierCodes = List.of("BUTTON_SEWING");
    PriceCalculationItem item = createItem(modifierCodes);
    item.setQuantity(3);
    int baseAmount = 1500;

    // Mock modifier entity
    PriceModifierEntity modifier = createModifierEntity("BUTTON_SEWING", PricingModifierType.FIXED, 50);
    when(guard.loadActiveModifiers(modifierCodes)).thenReturn(List.of(modifier));

    // Mock calculation service (50 * 3 = 150)
    when(priceCalculationService.calculateModifierAmount(eq(modifier), eq(baseAmount), eq(3)))
        .thenReturn(150);

    // Mock factory
    AppliedModifier appliedModifier = createAppliedModifier("BUTTON_SEWING", 150);
    when(factory.createAppliedModifier(eq(modifier), eq(150))).thenReturn(appliedModifier);

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should apply fixed modifier
    assertEquals(1, result.appliedModifiers().size());
    assertEquals("BUTTON_SEWING", result.appliedModifiers().getFirst().getCode());
    assertEquals(150, result.modifiersTotal());
    assertEquals(1650, result.subtotal()); // 1500 + 150
  }

  @Test
  @DisplayName("Should calculate with multiple modifiers - combine all modifier amounts")
  void shouldCalculateWithMultipleModifiers() {
    // Given: item with multiple modifiers
    List<String> modifierCodes = Arrays.asList("URGENT_CLEAN", "HAND_WASH", "BUTTON_REPAIR");
    PriceCalculationItem item = createItem(modifierCodes);
    item.setQuantity(2);
    int baseAmount = 2000;

    // Mock modifier entities
    PriceModifierEntity urgentModifier =
        createModifierEntity("URGENT_CLEAN", PricingModifierType.PERCENTAGE, 5000); // 50%
    PriceModifierEntity handWashModifier =
        createModifierEntity("HAND_WASH", PricingModifierType.PERCENTAGE, 2000); // 20%
    PriceModifierEntity buttonModifier =
        createModifierEntity("BUTTON_REPAIR", PricingModifierType.FIXED, 100);

    List<PriceModifierEntity> modifiers =
        Arrays.asList(urgentModifier, handWashModifier, buttonModifier);
    when(guard.loadActiveModifiers(modifierCodes)).thenReturn(modifiers);

    // Mock calculation service
    when(priceCalculationService.calculateModifierAmount(eq(urgentModifier), eq(baseAmount), eq(2)))
        .thenReturn(1000); // 50% of 2000
    when(priceCalculationService.calculateModifierAmount(
            eq(handWashModifier), eq(baseAmount), eq(2)))
        .thenReturn(400); // 20% of 2000
    when(priceCalculationService.calculateModifierAmount(eq(buttonModifier), eq(baseAmount), eq(2)))
        .thenReturn(200); // 100 * 2

    // Mock factory
    when(factory.createAppliedModifier(eq(urgentModifier), eq(1000)))
        .thenReturn(createAppliedModifier("URGENT_CLEAN", 1000));
    when(factory.createAppliedModifier(eq(handWashModifier), eq(400)))
        .thenReturn(createAppliedModifier("HAND_WASH", 400));
    when(factory.createAppliedModifier(eq(buttonModifier), eq(200)))
        .thenReturn(createAppliedModifier("BUTTON_REPAIR", 200));

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should combine all modifiers
    assertEquals(3, result.appliedModifiers().size());
    assertEquals(1600, result.modifiersTotal()); // 1000 + 400 + 200
    assertEquals(3600, result.subtotal()); // 2000 + 1600
  }

  @Test
  @DisplayName("Should handle inactive modifiers - filter out inactive modifiers from guard")
  void shouldHandleInactiveModifiers() {
    // Given: item with modifiers but guard returns only active ones
    List<String> modifierCodes = Arrays.asList("ACTIVE_MOD", "INACTIVE_MOD");
    PriceCalculationItem item = createItem(modifierCodes);
    int baseAmount = 1000;

    // Guard filters out inactive modifiers
    PriceModifierEntity activeModifier =
        createModifierEntity("ACTIVE_MOD", PricingModifierType.PERCENTAGE, 1000); // 10%
    when(guard.loadActiveModifiers(modifierCodes)).thenReturn(List.of(activeModifier));

    when(priceCalculationService.calculateModifierAmount(
            eq(activeModifier), eq(baseAmount), anyInt()))
        .thenReturn(100);
    when(factory.createAppliedModifier(eq(activeModifier), eq(100)))
        .thenReturn(createAppliedModifier("ACTIVE_MOD", 100));

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should only include active modifier
    assertEquals(1, result.appliedModifiers().size());
    assertEquals("ACTIVE_MOD", result.appliedModifiers().getFirst().getCode());
    assertEquals(100, result.modifiersTotal());
    assertEquals(1100, result.subtotal());
  }

  @Test
  @DisplayName("Should handle zero modifier amounts - include modifiers with zero impact")
  void shouldHandleZeroModifierAmounts() {
    // Given: modifier that calculates to zero amount
    List<String> modifierCodes = List.of("ZERO_IMPACT");
    PriceCalculationItem item = createItem(modifierCodes);
    int baseAmount = 1000;

    PriceModifierEntity modifier =
        createModifierEntity("ZERO_IMPACT", PricingModifierType.PERCENTAGE, 0); // 0%
    when(guard.loadActiveModifiers(modifierCodes)).thenReturn(List.of(modifier));

    when(priceCalculationService.calculateModifierAmount(eq(modifier), eq(baseAmount), anyInt()))
        .thenReturn(0);
    when(factory.createAppliedModifier(eq(modifier), eq(0)))
        .thenReturn(createAppliedModifier("ZERO_IMPACT", 0));

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should include modifier with zero amount
    assertEquals(1, result.appliedModifiers().size());
    assertEquals("ZERO_IMPACT", result.appliedModifiers().getFirst().getCode());
    assertEquals(0, result.modifiersTotal());
    assertEquals(1000, result.subtotal()); // baseAmount + 0
  }

  @Test
  @DisplayName("Should handle large quantities correctly")
  void shouldHandleLargeQuantities() {
    // Given: item with large quantity
    List<String> modifierCodes = List.of("BULK_DISCOUNT");
    PriceCalculationItem item = createItem(modifierCodes);
    item.setQuantity(100);
    int baseAmount = 50000; // 500.00 грн per item * 100

    PriceModifierEntity modifier =
        createModifierEntity("BULK_DISCOUNT", PricingModifierType.PERCENTAGE, 500); // 5% discount
    when(guard.loadActiveModifiers(modifierCodes)).thenReturn(List.of(modifier));

    when(priceCalculationService.calculateModifierAmount(eq(modifier), eq(baseAmount), eq(100)))
        .thenReturn(-2500); // 5% discount
    when(factory.createAppliedModifier(eq(modifier), eq(-2500)))
        .thenReturn(createAppliedModifier("BULK_DISCOUNT", -2500));

    // When
    ModifierCalculationResult result = calculator.calculate(item, baseAmount);

    // Then: should handle large quantities and negative modifiers
    assertEquals(1, result.appliedModifiers().size());
    assertEquals(-2500, result.modifiersTotal());
    assertEquals(47500, result.subtotal()); // 50000 - 2500
  }

  // Helper methods for creating test objects

  private PriceCalculationItem createItem(List<String> modifierCodes) {
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(UUID.randomUUID());
    item.setQuantity(1);
    item.setModifierCodes(modifierCodes);
    return item;
  }

  private PriceModifierEntity createModifierEntity(String code, PricingModifierType type, int value) {
    PriceModifierEntity entity = new PriceModifierEntity();
    entity.setCode(code);
    entity.setType(type);
    entity.setValue(value);
    entity.setActive(true);
    return entity;
  }

  private AppliedModifier createAppliedModifier(String code, int amount) {
    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(code);
    modifier.setAmount(amount);
    return modifier;
  }
}
