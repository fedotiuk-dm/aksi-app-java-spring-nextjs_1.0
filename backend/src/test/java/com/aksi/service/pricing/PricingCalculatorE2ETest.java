package com.aksi.service.pricing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.ModifierType;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.service.pricing.calculation.BaseAmountCalculator;
import com.aksi.service.pricing.calculation.DiscountCalculator;
import com.aksi.service.pricing.calculation.ModifierCalculator;
import com.aksi.service.pricing.calculation.UrgencyCalculator;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;
import com.aksi.service.pricing.util.PricingQueryUtils;
import com.aksi.service.pricing.validator.PricingValidator;

@ExtendWith(MockitoExtension.class)
class PricingCalculatorE2ETest {

  @Mock private BaseAmountCalculator baseAmountCalculator;
  @Mock private ModifierCalculator modifierCalculator;
  @Mock private UrgencyCalculator urgencyCalculator;
  @Mock private DiscountCalculator discountCalculator;
  @Mock private PricingValidator validator;
  @Mock private PricingGuard guard;
  @Mock private PricingFactory factory;

  private PricingCalculator pricingCalculator;

  @BeforeEach
  void setUp() {
    PricingQueryUtils utils = new PricingQueryUtils();
    pricingCalculator =
        new PricingCalculator(
            baseAmountCalculator,
            modifierCalculator,
            urgencyCalculator,
            discountCalculator,
            validator,
            guard,
            factory,
            utils);
  }

  @Test
  @DisplayName("E2E: base→modifiers→urgency→discount→finalAmount")
  void fullFlowSingleItem() {
    // Given
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(UUID.randomUUID());
    item.setQuantity(2);

    PriceListItemInfo priceListItem = new PriceListItemInfo();
    priceListItem.setId(UUID.randomUUID());
    priceListItem.setName("Suit");

    GlobalPriceModifiers global = new GlobalPriceModifiers();
    global.setUrgencyType(UrgencyType.EXPRESS_48_H);

    // Base result: basePrice=1000, baseAmount=2000
    when(baseAmountCalculator.calculate(any(), any()))
        .thenReturn(new BaseAmountCalculator.BaseCalculationResult(1000, 2000));

    // Modifiers: applied one fixed 300, total=300, subtotal=2300
    AppliedModifier m = new AppliedModifier();
    m.setCode("BUTTON_REPAIR");
    m.setType(ModifierType.FIXED);
    m.setValue(300);
    m.setAmount(300);

    when(modifierCalculator.calculate(any(), anyInt()))
        .thenReturn(new ModifierCalculator.ModifierCalculationResult(List.of(m), 300, 2300));

    // Urgency: +50% of 2300 = 1150
    AppliedModifier u = new AppliedModifier();
    u.setCode("EXPRESS_48H");
    u.setType(ModifierType.PERCENTAGE);
    u.setValue(50);
    u.setAmount(1150);
    when(urgencyCalculator.calculate(anyInt(), any(), any()))
        .thenReturn(new UrgencyCalculator.UrgencyCalculationResult(u, 1150));

    // Discount: 10% on (2300+1150)=3450 => 345
    AppliedModifier d = new AppliedModifier();
    d.setCode("EVERCARD");
    d.setType(ModifierType.PERCENTAGE);
    d.setValue(10);
    d.setAmount(-345);
    when(discountCalculator.calculate(anyInt(), anyInt(), any(), any()))
        .thenReturn(new DiscountCalculator.DiscountCalculationResult(d, 345, true));

    // Factory create result
    when(factory.createCompleteCalculatedItemPrice(
            any(),
            any(),
            anyInt(),
            any(),
            anyInt(),
            anyInt(),
            any(),
            any(),
            org.mockito.ArgumentMatchers.anyBoolean(),
            anyInt()))
        .thenAnswer(
            inv -> {
              var result = new com.aksi.api.pricing.dto.CalculatedItemPrice();
              result.setBasePrice(1000);
              result.setQuantity(2);
              var calc = new com.aksi.api.pricing.dto.ItemPriceCalculation();
              calc.setBaseAmount(2000);
              calc.setModifiers(List.of(m));
              calc.setModifiersTotal(300);
              calc.setSubtotal(2300);
              calc.setUrgencyModifier(u);
              calc.setDiscountModifier(d);
              calc.setDiscountEligible(true);
              calc.setFinalAmount(3105); // 2000 + 300 + 1150 - 345
              result.setCalculations(calc);
              result.setTotal(calc.getFinalAmount());
              return result;
            });

    // When
    var result = pricingCalculator.calculateItemPrice(item, priceListItem, global);

    // Then
    assertEquals(3105, result.getTotal());
    assertEquals(1000, result.getBasePrice());
    assertEquals(2, result.getQuantity());
    assertEquals(2000, result.getCalculations().getBaseAmount());
    assertEquals(2300, result.getCalculations().getSubtotal());
    assertEquals(300, result.getCalculations().getModifiersTotal());
    assertEquals("EXPRESS_48H", result.getCalculations().getUrgencyModifier().getCode());
    assertEquals("EVERCARD", result.getCalculations().getDiscountModifier().getCode());
  }
}
