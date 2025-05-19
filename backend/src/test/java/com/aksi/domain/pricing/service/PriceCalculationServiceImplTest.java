package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.domain.order.service.DiscountService;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;

@ExtendWith(MockitoExtension.class)
class PriceCalculationServiceImplTest {

    @Mock
    private PriceListItemRepository priceListItemRepository;
    
    @Mock
    private CatalogPriceModifierService modifierService;
    
    @Mock
    private UnitOfMeasureService unitOfMeasureService;
    
    @Mock
    private DiscountService discountService;
    
    @Mock
    private ServiceCategoryRepository serviceCategoryRepository;
    
    @Mock
    private PriceModifierCalculationService modifierCalculationService;
    
    @Mock
    private ServiceCategoryModifierMapper categoryModifierMapper;
    
    @InjectMocks
    private PriceCalculationServiceImpl priceCalculationService;
    
    private ServiceCategoryEntity sampleCategory;
    private PriceListItemEntity samplePriceItem;
    private List<PriceModifierDTO> sampleModifiers;
    
    @BeforeEach
    void setUp() {
        // Підготуємо тестові дані
        sampleCategory = new ServiceCategoryEntity();
        sampleCategory.setId(UUID.randomUUID());
        sampleCategory.setCode("CLOTHING");
        sampleCategory.setName("Одяг");
        
        samplePriceItem = new PriceListItemEntity();
        samplePriceItem.setId(UUID.randomUUID());
        samplePriceItem.setCategory(sampleCategory);
        samplePriceItem.setName("Костюм");
        samplePriceItem.setBasePrice(new BigDecimal("250.00"));
        samplePriceItem.setPriceBlack(new BigDecimal("300.00"));
        
        sampleModifiers = new ArrayList<>();
        PriceModifierDTO modifier1 = new PriceModifierDTO();
        modifier1.setId(UUID.randomUUID());
        modifier1.setCode("stain_removal");
        modifier1.setName("Виведення плям");
        modifier1.setValue(new BigDecimal("20")); // 20% надбавка
        sampleModifiers.add(modifier1);
    }
    
    @Test
    @DisplayName("Перевірка базової ціни для звичайного кольору")
    void getBasePriceForRegularColor() {
        // Given
        String categoryCode = "CLOTHING";
        String itemName = "Костюм";
        String color = "blue";
        
        when(priceListItemRepository.findByCategoryCodeAndItemName(categoryCode, itemName))
            .thenReturn(Optional.of(samplePriceItem));
        
        // When
        BigDecimal result = priceCalculationService.getBasePrice(categoryCode, itemName, color);
        
        // Then
        assertEquals(new BigDecimal("250.00"), result);
    }
    
    @Test
    @DisplayName("Перевірка базової ціни для чорного кольору")
    void getBasePriceForBlackColor() {
        // Given
        String categoryCode = "CLOTHING";
        String itemName = "Костюм";
        String color = "black";
        
        when(priceListItemRepository.findByCategoryCodeAndItemName(categoryCode, itemName))
            .thenReturn(Optional.of(samplePriceItem));
        
        // When
        BigDecimal result = priceCalculationService.getBasePrice(categoryCode, itemName, color);
        
        // Then
        assertEquals(new BigDecimal("300.00"), result);
    }
    
    @Test
    @DisplayName("Розрахунок ціни з модифікаторами та знижками")
    void calculatePriceWithModifiersAndDiscount() {
        // Given
        String categoryCode = "CLOTHING";
        String itemName = "Костюм";
        int quantity = 2;
        String color = "blue";
        List<String> modifierCodes = List.of("stain_removal");
        List<RangeModifierValue> rangeModifierValues = new ArrayList<>();
        List<FixedModifierQuantity> fixedModifierQuantities = new ArrayList<>();
        boolean isExpedited = false;
        BigDecimal expediteFactor = BigDecimal.ZERO;
        BigDecimal discountPercent = new BigDecimal("10");
        
        when(serviceCategoryRepository.findByCode(categoryCode))
            .thenReturn(Optional.of(sampleCategory));
        
        when(unitOfMeasureService.getRecommendedUnitOfMeasure(sampleCategory.getId(), itemName))
            .thenReturn("шт");
        
        when(priceListItemRepository.findByCategoryCodeAndItemName(categoryCode, itemName))
            .thenReturn(Optional.of(samplePriceItem));
        
        when(modifierService.getModifiersByCodes(modifierCodes))
            .thenReturn(sampleModifiers);
        
        BigDecimal afterModifiers = new BigDecimal("300.00"); // Після модифікаторів
        when(modifierCalculationService.applyAllModifiers(
                any(BigDecimal.class), 
                anyList(), 
                anyString(), 
                anyMap(), 
                anyMap(), 
                eq(isExpedited), 
                eq(expediteFactor), 
                eq(categoryCode), 
                anyList()))
            .thenReturn(afterModifiers);
        
        // Після знижки
        BigDecimal afterDiscount = new BigDecimal("270.00"); // 300 - 10%
        when(discountService.applyDiscountIfApplicable(afterModifiers, discountPercent, categoryCode))
            .thenReturn(afterDiscount);
        
        // When
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(
                categoryCode, 
                itemName, 
                quantity, 
                color, 
                modifierCodes, 
                rangeModifierValues, 
                fixedModifierQuantities, 
                isExpedited, 
                expediteFactor, 
                discountPercent);
        
        // Then
        assertNotNull(response);
        assertEquals(new BigDecimal("250.00"), response.getBaseUnitPrice());
        assertEquals(new BigDecimal("270.00"), response.getFinalUnitPrice());
        assertEquals(new BigDecimal("540.00"), response.getFinalTotalPrice()); // 270 * 2
        assertEquals("шт", response.getUnitOfMeasure());
        
        // Verify that all necessary methods were called
        verify(modifierCalculationService).applyAllModifiers(
                any(BigDecimal.class), 
                eq(sampleModifiers), 
                eq(color), 
                any(), 
                any(), 
                eq(isExpedited), 
                eq(expediteFactor), 
                eq(categoryCode), 
                any());
        
        verify(discountService).applyDiscountIfApplicable(
                eq(afterModifiers), 
                eq(discountPercent), 
                eq(categoryCode));
    }
    
    @Test
    @DisplayName("Отримання доступних модифікаторів для категорії")
    void getAvailableModifiersForCategory() {
        // Given
        String categoryCode = "CLOTHING";
        
        when(categoryModifierMapper.mapServiceToModifierCategory(categoryCode))
            .thenReturn(ModifierCategory.TEXTILE);
        
        List<PriceModifierDTO> textileModifiers = new ArrayList<>();
        PriceModifierDTO textileModifier = new PriceModifierDTO();
        textileModifier.setCode("textile_modifier");
        textileModifiers.add(textileModifier);
        
        List<PriceModifierDTO> generalModifiers = new ArrayList<>();
        PriceModifierDTO generalModifier = new PriceModifierDTO();
        generalModifier.setCode("general_modifier");
        generalModifiers.add(generalModifier);
        
        when(modifierService.getModifiersByCategory(ModifierCategory.TEXTILE))
            .thenReturn(textileModifiers);
        
        when(modifierService.getModifiersByCategory(ModifierCategory.GENERAL))
            .thenReturn(generalModifiers);
        
        // When
        List<String> result = priceCalculationService.getAvailableModifiersForCategory(categoryCode);
        
        // Then
        assertEquals(2, result.size());
        assertEquals("textile_modifier", result.get(0));
        assertEquals("general_modifier", result.get(1));
    }
} 