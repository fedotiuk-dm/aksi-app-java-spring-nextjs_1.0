package com.aksi.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.CalculationTotals;
import com.aksi.api.pricing.dto.ItemPriceCalculation;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.ServiceCategoryType;
import com.aksi.exception.BadRequestException;
import com.aksi.service.pricing.PricingService;

@WebMvcTest(PricingController.class)
@ActiveProfiles("test")
@WithMockUser
class PricingControllerIT {

  @Autowired private MockMvc mockMvc;

  @MockBean private PricingService pricingService;
  // Prevent JPA auditing from loading mapping context in MVC slice
  @MockBean private JpaMetamodelMappingContext jpaMetamodelMappingContext;

  @Test
  @DisplayName("POST /api/pricing/calculate → успішний розрахунок з urgency та discount")
  void calculatePrice_success_withUrgencyAndDiscount() throws Exception {
    // Stub service response to match assertions
    var urgency = new AppliedModifier();
    urgency.setCode("EXPRESS_48H");
    var discount = new AppliedModifier();
    discount.setCode("EVERCARD");

    var calc = new ItemPriceCalculation();
    calc.setBaseAmount(1000);
    calc.setModifiersTotal(200);
    calc.setSubtotal(1200);
    calc.setUrgencyModifier(urgency);
    calc.setDiscountModifier(discount);
    calc.setDiscountEligible(true);
    calc.setFinalAmount(1300);

    var item = new CalculatedItemPrice();
    item.setPriceListItemId(UUID.randomUUID());
    item.setItemName("Test Item");
    item.setCategoryCode(ServiceCategoryType.CLOTHING);
    item.setQuantity(2);
    item.setBasePrice(500);
    item.setCalculations(calc);
    item.setTotal(calc.getFinalAmount());

    var totals = new CalculationTotals();
    totals.setItemsSubtotal(1200);
    totals.setUrgencyAmount(100);
    totals.setDiscountAmount(0);
    totals.setDiscountApplicableAmount(1200);
    totals.setTotal(1300);

    var response = new PriceCalculationResponse();
    response.setItems(List.of(item));
    response.setTotals(totals);

    when(pricingService.calculatePrice(any())).thenReturn(response);

    String body =
        "{\n"
            + "  \"items\": [\n"
            + "    { \"priceListItemId\": \""
            + UUID.randomUUID()
            + "\", \"quantity\": 2,\n"
            + "      \"characteristics\": { \"color\": \"black\" },\n"
            + "      \"modifierCodes\": [\"HAND_WASH\"] }\n"
            + "  ],\n"
            + "  \"globalModifiers\": { \"urgencyType\": \"EXPRESS_48H\", \"discountType\": \"EVERCARD\" }\n"
            + "}";

    mockMvc
        .perform(
            post("/api/pricing/calculate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items", hasSize(1)))
        .andExpect(jsonPath("$.items[0].calculations.baseAmount", greaterThan(0)))
        .andExpect(jsonPath("$.items[0].calculations.subtotal", greaterThan(0)))
        .andExpect(jsonPath("$.items[0].calculations.urgencyModifier.code", is("EXPRESS_48H")))
        .andExpect(jsonPath("$.items[0].calculations.discountModifier.code", is("EVERCARD")))
        .andExpect(jsonPath("$.totals.itemsSubtotal", greaterThan(0)))
        .andExpect(jsonPath("$.totals.urgencyAmount", greaterThanOrEqualTo(0)))
        .andExpect(jsonPath("$.totals.discountAmount", greaterThanOrEqualTo(0)))
        .andExpect(jsonPath("$.totals.total", greaterThan(0)));
  }

  @Test
  @DisplayName("POST /api/pricing/calculate → знижки не застосовуються до LAUNDRY/IRONING/DYEING")
  void calculatePrice_discountExcludedCategories() throws Exception {
    var calc = new ItemPriceCalculation();
    calc.setBaseAmount(800);
    calc.setModifiersTotal(0);
    calc.setSubtotal(800);
    calc.setDiscountEligible(false);
    calc.setFinalAmount(800);

    var item = new CalculatedItemPrice();
    item.setPriceListItemId(UUID.randomUUID());
    item.setItemName("Laundry Item");
    item.setCategoryCode(ServiceCategoryType.LAUNDRY);
    item.setQuantity(1);
    item.setBasePrice(800);
    item.setCalculations(calc);
    item.setTotal(800);

    var totals = new CalculationTotals();
    totals.setItemsSubtotal(800);
    totals.setUrgencyAmount(0);
    totals.setDiscountAmount(0);
    totals.setDiscountApplicableAmount(0);
    totals.setTotal(800);

    var response = new PriceCalculationResponse();
    response.setItems(List.of(item));
    response.setTotals(totals);

    when(pricingService.calculatePrice(any())).thenReturn(response);

    String body =
        "{\n"
            + "  \"items\": [\n"
            + "    { \"priceListItemId\": \""
            + UUID.randomUUID()
            + "\", \"quantity\": 1,\n"
            + "      \"characteristics\": { \"color\": \"red\" },\n"
            + "      \"modifierCodes\": [], \"categoryCode\": \"LAUNDRY\" }\n"
            + "  ],\n"
            + "  \"globalModifiers\": { \"urgencyType\": \"NORMAL\", \"discountType\": \"EVERCARD\" }\n"
            + "}";

    mockMvc
        .perform(
            post("/api/pricing/calculate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items[0].calculations.discountEligible", is(false)))
        .andExpect(jsonPath("$.items[0].calculations.discountModifier").doesNotExist())
        .andExpect(jsonPath("$.totals.discountAmount", is(0)));
  }

  @Test
  @DisplayName("POST /api/pricing/calculate → OTHER без discountPercentage → 400")
  void calculatePrice_otherWithoutPercentage_BadRequest() throws Exception {
    when(pricingService.calculatePrice(any()))
        .thenThrow(
            new BadRequestException("Discount percentage is required for OTHER discount type"));

    String body =
        "{\n"
            + "  \"items\": [ { \"priceListItemId\": \""
            + UUID.randomUUID()
            + "\", \"quantity\": 1 } ],\n"
            + "  \"globalModifiers\": { \"discountType\": \"OTHER\" }\n"
            + "}";

    mockMvc
        .perform(
            post("/api/pricing/calculate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isBadRequest());
  }
}
