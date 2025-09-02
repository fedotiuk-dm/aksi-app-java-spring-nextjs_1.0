package com.aksi.service.pricing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.ItemPriceCalculation;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.mapper.PricingMapper;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;
import com.aksi.service.pricing.util.PricingQueryUtils;
import com.aksi.service.pricing.validator.PricingValidator;

@ExtendWith(MockitoExtension.class)
class PricingQueryServiceAggregationTest {

  @Mock private PricingMapper pricingMapper;
  @Mock private PricingCalculator pricingCalculator;
  @Mock private PricingValidator validator;
  @Mock private PricingGuard guard;
  @Mock private PricingFactory factory;
  @Mock private PriceCalculationService calculationService;

  private PricingQueryService queryService;

  @BeforeEach
  void setUp() {
    PricingQueryUtils utils = new PricingQueryUtils();
    queryService =
        new PricingQueryService(
            pricingMapper, pricingCalculator, validator, guard, factory, utils, calculationService);
  }

  @Test
  @DisplayName("Aggregates totals across multiple items correctly")
  void aggregatesTotalsForMultipleItems() {
    // Given: 2 items
    PriceCalculationRequest request = new PriceCalculationRequest();
    PriceCalculationItem i1 = new PriceCalculationItem();
    i1.setPriceListItemId(UUID.randomUUID());
    i1.setQuantity(1);
    PriceCalculationItem i2 = new PriceCalculationItem();
    i2.setPriceListItemId(UUID.randomUUID());
    i2.setQuantity(2);
    request.setItems(List.of(i1, i2));

    // Mock guard.loadPriceListItem
    when(guard.loadPriceListItem(any()))
        .thenReturn(new com.aksi.api.pricelist.dto.PriceListItemInfo());

    // Mock calculator results per item
    CalculatedItemPrice r1 = new CalculatedItemPrice();
    r1.setBasePrice(1000);
    r1.setQuantity(1);
    ItemPriceCalculation c1 = new ItemPriceCalculation();
    c1.setBaseAmount(1000);
    c1.setModifiersTotal(200);
    c1.setSubtotal(1200);
    c1.setUrgencyModifier(null);
    c1.setDiscountModifier(null);
    c1.setDiscountEligible(true);
    c1.setFinalAmount(1200);
    r1.setCalculations(c1);
    r1.setTotal(1200);

    CalculatedItemPrice r2 = new CalculatedItemPrice();
    r2.setBasePrice(1500);
    r2.setQuantity(2);
    ItemPriceCalculation c2 = new ItemPriceCalculation();
    c2.setBaseAmount(3000);
    c2.setModifiersTotal(0);
    c2.setSubtotal(3000);
    c2.setUrgencyModifier(null);
    c2.setDiscountModifier(null);
    c2.setDiscountEligible(false);
    c2.setFinalAmount(3000);
    r2.setCalculations(c2);
    r2.setTotal(3000);

    when(pricingCalculator.calculateItemPrice(any(), any(), any())).thenReturn(r1, r2);

    // Factory totals mapping
    when(factory.createCalculationTotals(
            org.mockito.ArgumentMatchers.anyInt(),
            org.mockito.ArgumentMatchers.anyInt(),
            org.mockito.ArgumentMatchers.anyInt(),
            org.mockito.ArgumentMatchers.anyInt(),
            org.mockito.ArgumentMatchers.anyInt()))
        .thenAnswer(
            inv -> {
              var t = new com.aksi.api.pricing.dto.CalculationTotals();
              t.setItemsSubtotal(inv.getArgument(0));
              t.setUrgencyAmount(inv.getArgument(1));
              t.setDiscountAmount(inv.getArgument(2));
              t.setDiscountApplicableAmount(inv.getArgument(3));
              t.setTotal(inv.getArgument(4));
              return t;
            });

    // Factory response mapping
    when(factory.createPriceCalculationResponse(any(), any()))
        .thenAnswer(
            inv -> {
              PriceCalculationResponse resp = new PriceCalculationResponse();
              resp.setItems(inv.getArgument(0));
              resp.setTotals(inv.getArgument(1));
              return resp;
            });

    // When
    PriceCalculationResponse response = queryService.calculatePrice(request);

    // Then: aggregated
    assertEquals(4200, response.getTotals().getItemsSubtotal()); // 1200 + 3000
    assertEquals(0, response.getTotals().getUrgencyAmount());
    assertEquals(0, response.getTotals().getDiscountAmount());
    assertEquals(1200, response.getTotals().getDiscountApplicableAmount());
    assertEquals(4200, response.getTotals().getTotal());
  }
}
