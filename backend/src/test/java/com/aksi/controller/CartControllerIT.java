package com.aksi.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.aksi.service.cart.CartService;

@WebMvcTest(CartController.class)
@ActiveProfiles("test")
@WithMockUser
class CartControllerIT {

  @Autowired private MockMvc mockMvc;

  @MockBean private CartService cartService;

  @Test
  @DisplayName("POST /api/cart/modifiers → оновлення глобальних модифікаторів")
  void updateCartModifiers_success() throws Exception {
    String body =
        "{\n"
            + "  \"urgencyType\": \"EXPRESS_24H\",\n"
            + "  \"discountType\": \"SOCIAL_MEDIA\",\n"
            + "  \"discountPercentage\": 5\n"
            + "}";

    mockMvc
        .perform(
            post("/api/cart/modifiers")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("POST /api/cart/calculate → перерахунок кошика")
  void calculateCart_success() throws Exception {
    mockMvc
        .perform(post("/api/cart/calculate").with(csrf()).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("POST /api/pricing/calculate → OTHER без процента в cart context → 400")
  void calculatePrice_otherWithoutPercentage_cartContext_BadRequest() throws Exception {
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
