package com.aksi.api;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(PriceCalculationController.class)
@Import(PriceCalculationControllerTest.TestConfig.class)
public class PriceCalculationControllerTest {
    
    @TestConfiguration
    static class TestConfig {
        @Bean
        public PriceCalculationService priceCalculationService() {
            return mock(PriceCalculationService.class);
        }
    }

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private PriceCalculationService priceCalculationService;
    
    private PriceCalculationResponseDTO responseDTO;

    @Test
    @DisplayName("Успішний розрахунок ціни з усіма параметрами")
    void calculatePriceWithAllParameters() throws Exception {
        // Given
        PriceCalculationController.PriceCalculationRequestDTO requestDTO = new PriceCalculationController.PriceCalculationRequestDTO();
        requestDTO.setCategoryCode("CLOTHING");
        requestDTO.setItemName("Піджак");
        requestDTO.setColor("black");
        requestDTO.setQuantity(2);
        requestDTO.setModifierCodes(Arrays.asList("manual_cleaning", "dirt_level"));
        requestDTO.setRangeModifierValues(Collections.singletonList(new RangeModifierValue("dirt_level", new BigDecimal("30"))));
        requestDTO.setFixedModifierQuantities(Collections.singletonList(new FixedModifierQuantity("buttons", 5)));
        requestDTO.setExpedited(true);
        requestDTO.setExpeditePercent(new BigDecimal("50"));
        requestDTO.setDiscountPercent(new BigDecimal("10"));
        
        responseDTO = PriceCalculationResponseDTO.builder()
                .baseUnitPrice(new BigDecimal("300.00"))
                .finalUnitPrice(new BigDecimal("405.00")) // З урахуванням модифікаторів та знижки
                .finalTotalPrice(new BigDecimal("810.00")) // На кількість 2
                .quantity(2)
                .baseTotalPrice(new BigDecimal("600.00"))
                .unitOfMeasure("шт")
                .calculationDetails(new ArrayList<>())
                .build();
        
        when(priceCalculationService.calculatePrice(
                eq(requestDTO.getCategoryCode()),
                eq(requestDTO.getItemName()),
                eq(requestDTO.getQuantity()),
                eq(requestDTO.getColor()),
                eq(requestDTO.getModifierCodes()),
                eq(requestDTO.getRangeModifierValues()),
                eq(requestDTO.getFixedModifierQuantities()),
                eq(requestDTO.isExpedited()),
                eq(requestDTO.getExpeditePercent()),
                eq(requestDTO.getDiscountPercent())
        )).thenReturn(responseDTO);
        
        // When & Then
        mockMvc.perform(post("/price-calculation/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.baseUnitPrice").value("300.00"))
                .andExpect(jsonPath("$.data.finalUnitPrice").value("405.00"))
                .andExpect(jsonPath("$.data.finalTotalPrice").value("810.00"))
                .andExpect(jsonPath("$.data.quantity").value(2))
                .andExpect(jsonPath("$.data.unitOfMeasure").value("шт"));
    }
    
    @Test
    @DisplayName("Отримання базової ціни для предмета")
    void getBasePrice() throws Exception {
        // Given
        String categoryCode = "CLOTHING";
        String itemName = "Піджак";
        String color = "black";
        when(priceCalculationService.getBasePrice(categoryCode, itemName, color))
                .thenReturn(new BigDecimal("300.00"));
        
        // When & Then
        mockMvc.perform(get("/price-calculation/base-price")
                .param("categoryCode", categoryCode)
                .param("itemName", itemName)
                .param("color", color))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(300.00));
    }
    
    @Test
    @DisplayName("Отримання доступних модифікаторів для категорії")
    void getAvailableModifiersForCategory() throws Exception {
        // Given
        String categoryCode = "CLOTHING";
        List<String> modifierCodes = Arrays.asList("manual_cleaning", "dirt_level", "kids_items");
        when(priceCalculationService.getAvailableModifiersForCategory(categoryCode))
                .thenReturn(modifierCodes);
        
        // When & Then
        mockMvc.perform(get("/price-calculation/available-modifiers")
                .param("categoryCode", categoryCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data[0]").value("manual_cleaning"))
                .andExpect(jsonPath("$.data[1]").value("dirt_level"))
                .andExpect(jsonPath("$.data[2]").value("kids_items"));
    }
    
    @Test
    @DisplayName("Відповідь з помилкою 404 при ненаявному предметі")
    void itemNotFoundReturns404() throws Exception {
        // Given
        String categoryCode = "UNKNOWN";
        String itemName = "Неіснуючий предмет";
        String color = "red";
        when(priceCalculationService.getBasePrice(categoryCode, itemName, color))
                .thenThrow(new IllegalArgumentException("Предмет не знайдено"));
        
        // When & Then
        mockMvc.perform(get("/price-calculation/base-price")
                .param("categoryCode", categoryCode)
                .param("itemName", itemName)
                .param("color", color))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Предмет не знайдено в прайс-листі"));
    }
    
    @Test
    @DisplayName("Отримання рекомендованих модифікаторів за плямами і дефектами")
    void getRecommendedModifiers() throws Exception {
        // Given
        when(priceCalculationService.getRecommendedModifiersForItem(
                ArgumentMatchers.anySet(),
                ArgumentMatchers.anySet(),
                ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString()))
                .thenReturn(new ArrayList<>());
        
        // When & Then
        mockMvc.perform(get("/price-calculation/recommended-modifiers")
                .param("stains", "oil")
                .param("defects", "tear")
                .param("categoryCode", "CLOTHING")
                .param("materialType", "cotton"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
    
    @Test
    @DisplayName("Отримання попереджень про ризики")
    void getRiskWarnings() throws Exception {
        // Given
        List<String> warnings = Arrays.asList(
                "Можливе вицвітання матеріалу",
                "Ризик усадки"
        );
        
        when(priceCalculationService.getRiskWarningsForItem(
                ArgumentMatchers.anySet(),
                ArgumentMatchers.anySet(),
                ArgumentMatchers.anyString(),
                ArgumentMatchers.anyString()))
                .thenReturn(warnings);
        
        // When & Then
        mockMvc.perform(get("/price-calculation/risk-warnings")
                .param("stains", "oil")
                .param("defects", "tear")
                .param("categoryCode", "CLOTHING")
                .param("materialType", "cotton"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0]").value("Можливе вицвітання матеріалу"))
                .andExpect(jsonPath("$.data[1]").value("Ризик усадки"));
    }
}
