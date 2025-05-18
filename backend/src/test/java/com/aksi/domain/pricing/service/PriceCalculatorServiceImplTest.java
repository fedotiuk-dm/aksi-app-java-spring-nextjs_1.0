package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyList;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierType;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;
import com.aksi.exception.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class PriceCalculationServiceImplTest {

    @Mock
    private PriceListItemRepository priceListItemRepository;
    
    @Mock
    private PriceModifierService priceModifierService;

    @InjectMocks
    private PriceCalculationServiceImpl calculatorService;

    private PriceListItemEntity textileItem;
    private PriceListItemEntity leatherItem;
    
    private ServiceCategoryEntity textileCategory;
    private ServiceCategoryEntity leatherCategory;
    
    private PriceModifierDTO manualCleaningModifier;
    private PriceModifierDTO veryDirtyItemsModifier;
    private PriceModifierDTO blackColorModifier;
    private PriceModifierDTO sewingButtonsModifier;

    @BeforeEach
    void setUp() {
        // Підготовка категорій
        textileCategory = new ServiceCategoryEntity();
        textileCategory.setId(UUID.randomUUID());
        textileCategory.setCode("CLOTHING");
        textileCategory.setName("Чистка одягу та текстилю");
        
        leatherCategory = new ServiceCategoryEntity();
        leatherCategory.setId(UUID.randomUUID());
        leatherCategory.setCode("LEATHER");
        leatherCategory.setName("Шкіряні вироби");
        
        // Підготовка тестових даних для цін
        textileItem = new PriceListItemEntity();
        textileItem.setId(UUID.randomUUID());
        textileItem.setCategory(textileCategory);
        textileItem.setName("Пальто");
        textileItem.setBasePrice(BigDecimal.valueOf(200.00));
        textileItem.setPriceBlack(BigDecimal.valueOf(240.00)); // Ціна для чорного кольору

        leatherItem = new PriceListItemEntity();
        leatherItem.setId(UUID.randomUUID());
        leatherItem.setCategory(leatherCategory);
        leatherItem.setName("Куртка");
        leatherItem.setBasePrice(BigDecimal.valueOf(500.00));
        
        // Підготовка модифікаторів
        manualCleaningModifier = PriceModifierDTO.builder()
                .id(UUID.randomUUID())
                .code("manual_cleaning")
                .name("Ручна чистка")
                .description("+20% до вартості за ручну чистку")
                .modifierType(ModifierType.PERCENTAGE)
                .category(ModifierCategory.GENERAL)
                .value(new BigDecimal("20.00"))
                .active(true)
                .build();
        
        veryDirtyItemsModifier = PriceModifierDTO.builder()
                .id(UUID.randomUUID())
                .code("very_dirty_items")
                .name("Дуже забруднені речі")
                .description("Від +20% до +100% до вартості за дуже забруднені речі")
                .modifierType(ModifierType.RANGE_PERCENTAGE)
                .category(ModifierCategory.GENERAL)
                .minValue(new BigDecimal("20.00"))
                .maxValue(new BigDecimal("100.00"))
                .active(true)
                .build();
        
        blackColorModifier = PriceModifierDTO.builder()
                .id(UUID.randomUUID())
                .code("black_light_colors")
                .name("Чистка виробів чорного та світлих тонів")
                .description("+20% до вартості")
                .modifierType(ModifierType.PERCENTAGE)
                .category(ModifierCategory.TEXTILE)
                .value(new BigDecimal("20.00"))
                .active(true)
                .build();
        
        sewingButtonsModifier = PriceModifierDTO.builder()
                .id(UUID.randomUUID())
                .code("sewing_buttons")
                .name("Пришивання гудзиків")
                .description("Фіксована вартість за пришивання одного гудзика")
                .modifierType(ModifierType.FIXED)
                .category(ModifierCategory.TEXTILE)
                .value(new BigDecimal("10.00"))
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Отримання базової ціни")
    void testGetBasePrice() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Пальто"))
                .thenReturn(Optional.of(textileItem));

        // Викликаємо сервіс
        BigDecimal basePrice = calculatorService.getBasePrice("CLOTHING", "Пальто", null);

        // Перевіряємо результат
        assertEquals(0, new BigDecimal("200.00").compareTo(basePrice),
                "Базова ціна має бути 200.00");
    }
    
    @Test
    @DisplayName("Отримання ціни для чорного кольору")
    void testGetBasePriceForBlackColor() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Пальто"))
                .thenReturn(Optional.of(textileItem));

        // Викликаємо сервіс
        BigDecimal basePrice = calculatorService.getBasePrice("CLOTHING", "Пальто", "чорний");

        // Перевіряємо результат
        assertEquals(0, new BigDecimal("240.00").compareTo(basePrice),
                "Ціна для чорного кольору має бути 240.00");
    }
    
    @Test
    @DisplayName("Помилка при ненісуючому предметі")
    void testGetBasePriceNonExistingItem() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Неіснуючий"))
                .thenReturn(Optional.empty());

        // Перевіряємо, що викидається виняток
        assertThrows(EntityNotFoundException.class, () -> 
                calculatorService.getBasePrice("CLOTHING", "Неіснуючий", null));
    }
    
    @Test
    @DisplayName("Розрахунок з відсотковим модифікатором")
    void testCalculateWithPercentageModifier() {
        // Моделюємо поведінку репозиторія та сервісу модифікаторів
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Пальто"))
                .thenReturn(Optional.of(textileItem));
        when(priceModifierService.getModifiersByCodes(List.of("manual_cleaning")))
                .thenReturn(List.of(manualCleaningModifier));

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = calculatorService.calculatePrice(
                "CLOTHING", 
                "Пальто", 
                1, 
                null, 
                List.of("manual_cleaning"),
                Collections.emptyList(),
                Collections.emptyList(),
                false,
                null,
                null);

        // Перевіряємо результат
        assertEquals(0, new BigDecimal("200.00").compareTo(response.getBaseUnitPrice()),
                "Базова ціна має бути 200.00");
        assertEquals(0, new BigDecimal("240.00").compareTo(response.getFinalUnitPrice()),
                "Фінальна ціна має бути 240.00 (200 + 20%)");
        
        // Перевіряємо деталі розрахунку
        assertEquals(3, response.getCalculationDetails().size(),
                "Має бути 3 кроки розрахунку (базова ціна, множник і округлення)");
        
        // Перевіряємо деталі кроку з модифікатором
        CalculationDetailsDTO modifierStep = response.getCalculationDetails().get(1);
        assertEquals(4, modifierStep.getStep(), "Крок має бути 4 (відсоткові модифікатори)");
        assertEquals("manual_cleaning", modifierStep.getModifierCode());
        assertEquals(0, new BigDecimal("40.00").compareTo(modifierStep.getPriceDifference()),
                "Різниця має бути 40.00 (20% від 200)");
    }
    
    @Test
    @DisplayName("Розрахунок з модифікатором з діапазоном")
    void testCalculateWithRangeModifier() {
        // Моделюємо поведінку репозиторія та сервісу модифікаторів
        when(priceListItemRepository.findByCategoryCodeAndItemName("LEATHER", "Куртка"))
                .thenReturn(Optional.of(leatherItem));
        when(priceModifierService.getModifiersByCodes(List.of("very_dirty_items")))
                .thenReturn(List.of(veryDirtyItemsModifier));

        // Створюємо значення діапазону (50%)
        RangeModifierValue rangeValue = new RangeModifierValue("very_dirty_items", new BigDecimal("50.00"));

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = calculatorService.calculatePrice(
                "LEATHER", 
                "Куртка", 
                1, 
                null, 
                List.of("very_dirty_items"),
                List.of(rangeValue),
                Collections.emptyList(),
                false,
                null,
                null);

        // Перевіряємо результат
        assertEquals(0, new BigDecimal("500.00").compareTo(response.getBaseUnitPrice()),
                "Базова ціна має бути 500.00");
        assertEquals(0, new BigDecimal("750.00").compareTo(response.getFinalUnitPrice()),
                "Фінальна ціна має бути 750.00 (500 + 50%)");
    }
    
    @Test
    @DisplayName("Розрахунок з фіксованим модифікатором")
    void testCalculateWithFixedModifier() {
        // Моделюємо поведінку репозиторія та сервісу модифікаторів
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Пальто"))
                .thenReturn(Optional.of(textileItem));
        when(priceModifierService.getModifiersByCodes(List.of("sewing_buttons")))
                .thenReturn(List.of(sewingButtonsModifier));

        // Створюємо кількість для фіксованого модифікатора (5 гудзиків)
        FixedModifierQuantity fixedQuantity = new FixedModifierQuantity("sewing_buttons", 5);

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = calculatorService.calculatePrice(
                "CLOTHING", 
                "Пальто", 
                1, 
                null, 
                List.of("sewing_buttons"),
                Collections.emptyList(),
                List.of(fixedQuantity),
                false,
                null,
                null);

        // Перевіряємо результат
        assertEquals(0, new BigDecimal("200.00").compareTo(response.getBaseUnitPrice()),
                "Базова ціна має бути 200.00");
        assertEquals(0, new BigDecimal("250.00").compareTo(response.getFinalUnitPrice()),
                "Фінальна ціна має бути 250.00 (200 + 5*10)");
    }
    
    @Test
    @DisplayName("Розрахунок з терміновістю та знижкою")
    void testCalculateWithExpeditedAndDiscount() {
        // Моделюємо поведінку репозиторія та сервісу модифікаторів
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Пальто"))
                .thenReturn(Optional.of(textileItem));
        when(priceModifierService.getModifiersByCodes(anyList()))
                .thenReturn(Collections.emptyList());

        // Викликаємо сервіс з терміновістю 50% та знижкою 10%
        PriceCalculationResponseDTO response = calculatorService.calculatePrice(
                "CLOTHING", 
                "Пальто", 
                1, 
                null, 
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                true,
                new BigDecimal("50.00"),
                new BigDecimal("10.00"));

        // Перевіряємо результат
        // Базова ціна: 200.00
        // Після терміновості +50%: 300.00
        // Після знижки 10%: 270.00
        assertEquals(0, new BigDecimal("200.00").compareTo(response.getBaseUnitPrice()),
                "Базова ціна має бути 200.00");
        assertEquals(0, new BigDecimal("270.00").compareTo(response.getFinalUnitPrice()),
                "Фінальна ціна має бути 270.00");
        
        // Перевіряємо кількість кроків
        assertEquals(4, response.getCalculationDetails().size(),
                "Має бути 4 кроки розрахунку (базова ціна, терміновість, знижка, округлення)");
    }
    
    @Test
    @DisplayName("Отримання доступних модифікаторів для категорії")
    void testGetAvailableModifiersForCategory() {
        // Моделюємо поведінку сервісу модифікаторів
        when(priceModifierService.getModifiersByCategory(ModifierCategory.TEXTILE))
                .thenReturn(Arrays.asList(blackColorModifier, sewingButtonsModifier));
        when(priceModifierService.getModifiersByCategory(ModifierCategory.GENERAL))
                .thenReturn(Arrays.asList(manualCleaningModifier, veryDirtyItemsModifier));

        // Викликаємо сервіс
        List<String> modifierCodes = calculatorService.getAvailableModifiersForCategory("CLOTHING");

        // Перевіряємо результат
        assertEquals(4, modifierCodes.size(),
                "Має бути 4 доступних модифікатора (2 текстильних + 2 загальних)");
        
        // Перевіряємо, що в списку є всі очікувані коди
        List<String> expectedCodes = Arrays.asList(
                "black_light_colors", "sewing_buttons", "manual_cleaning", "very_dirty_items"
        );
        
        for (String code : expectedCodes) {
            assert modifierCodes.contains(code) : "Список має містити код " + code;
        }
    }
} 