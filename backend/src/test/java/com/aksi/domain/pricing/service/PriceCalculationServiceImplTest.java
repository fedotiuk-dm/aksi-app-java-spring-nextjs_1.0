package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.domain.pricing.constants.PriceModifierConstants;
import com.aksi.domain.pricing.constants.PriceModifierConstants.PriceModifier;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO.FixedModifierQuantityDTO;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO.RangeModifierValueDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.exceptions.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class PriceCalculationServiceImplTest {

    @Mock
    private PriceListItemRepository priceListItemRepository;

    @InjectMocks
    private PriceCalculationServiceImpl priceCalculationService;

    private PriceListItemEntity textileItem;
    private PriceListItemEntity leatherItem;
    private PriceListItemEntity furItem;
    
    private ServiceCategoryEntity textileCategory;
    private ServiceCategoryEntity leatherCategory;
    private ServiceCategoryEntity furCategory;

    @BeforeEach
    void setUp() {
        // Підготовка категорій
        textileCategory = new ServiceCategoryEntity();
        textileCategory.setId(UUID.randomUUID());
        textileCategory.setCode("CLOTHING");
        textileCategory.setName("Чистка одягу та текстилю");
        
        leatherCategory = new ServiceCategoryEntity();
        leatherCategory.setId(UUID.randomUUID());
        leatherCategory.setCode("PADDING");
        leatherCategory.setName("Дублянки");
        
        furCategory = new ServiceCategoryEntity();
        furCategory.setId(UUID.randomUUID());
        furCategory.setCode("FUR");
        furCategory.setName("Вироби із натурального хутра");
        
        // Підготовка тестових даних для різних категорій
        textileItem = new PriceListItemEntity();
        textileItem.setId(UUID.randomUUID());
        textileItem.setCategory(textileCategory);
        textileItem.setName("Пальто");
        textileItem.setBasePrice(BigDecimal.valueOf(200.00));

        leatherItem = new PriceListItemEntity();
        leatherItem.setId(UUID.randomUUID());
        leatherItem.setCategory(leatherCategory);
        leatherItem.setName("Дублянка");
        leatherItem.setBasePrice(BigDecimal.valueOf(500.00));

        furItem = new PriceListItemEntity();
        furItem.setId(UUID.randomUUID());
        furItem.setCategory(furCategory);
        furItem.setName("Шуба");
        furItem.setBasePrice(BigDecimal.valueOf(1000.00));
    }

    @Test
    @DisplayName("Перевірка застосовності модифікаторів до категорій")
    void testModifierApplicabilityToCategories() {
        // Перевірка модифікаторів для текстильних виробів
        List<PriceModifier> textileModifiers = PriceModifierConstants.TextileModifiers.getAllTextileModifiers();
        for (PriceModifier modifier : textileModifiers) {
            assertTrue(modifier.isApplicableToCategory("CLOTHING"), 
                    "Модифікатор " + modifier.getId() + " має застосовуватись до категорії 'CLOTHING'");
            assertTrue(modifier.isApplicableToCategory("LAUNDRY"), 
                    "Модифікатор " + modifier.getId() + " має застосовуватись до категорії 'LAUNDRY'");
            assertTrue(modifier.isApplicableToCategory("IRONING"), 
                    "Модифікатор " + modifier.getId() + " має застосовуватись до категорії 'IRONING'");
            assertFalse(modifier.isApplicableToCategory("PADDING"), 
                    "Модифікатор " + modifier.getId() + " не має застосовуватись до категорії 'PADDING'");
        }

        // Перевірка модифікаторів для шкіряних виробів
        List<PriceModifier> leatherModifiers = PriceModifierConstants.LeatherModifiers.getAllLeatherModifiers();
        for (PriceModifier modifier : leatherModifiers) {
            assertTrue(modifier.isApplicableToCategory("PADDING"), 
                    "Модифікатор " + modifier.getId() + " має застосовуватись до категорії 'PADDING'");
            assertTrue(modifier.isApplicableToCategory("LEATHER"), 
                    "Модифікатор " + modifier.getId() + " має застосовуватись до категорії 'LEATHER'");
            assertFalse(modifier.isApplicableToCategory("CLOTHING"), 
                    "Модифікатор " + modifier.getId() + " не має застосовуватись до категорії 'CLOTHING'");
        }

        // Перевірка загальних модифікаторів (мають застосовуватись до всіх категорій)
        List<PriceModifier> generalModifiers = PriceModifierConstants.GeneralModifiers.getAllGeneralModifiers();
        for (PriceModifier modifier : generalModifiers) {
            assertTrue(modifier.isApplicableToCategory("CLOTHING"), 
                    "Загальний модифікатор " + modifier.getId() + " має застосовуватись до будь-якої категорії");
            assertTrue(modifier.isApplicableToCategory("PADDING"), 
                    "Загальний модифікатор " + modifier.getId() + " має застосовуватись до будь-якої категорії");
            assertTrue(modifier.isApplicableToCategory("FUR"), 
                    "Загальний модифікатор " + modifier.getId() + " має застосовуватись до будь-якої категорії");
        }
    }

    @Test
    @DisplayName("Тест базової ціни без модифікаторів")
    void testBasePrice() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("PADDING", "Дублянка"))
                .thenReturn(Optional.of(leatherItem));

        // Створюємо запит без модифікаторів
        PriceCalculationRequestDTO request = PriceCalculationRequestDTO.builder()
                .categoryCode("PADDING")
                .itemName("Дублянка")
                .quantity(1)
                .modifierIds(new ArrayList<>())
                .build();

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(request);

        // Перевіряємо результат
        // Використовуємо compareTo для порівняння BigDecimal замість equals
        assertTrue(BigDecimal.valueOf(500.00).compareTo(response.getBaseUnitPrice()) == 0,
                 "Expected 500.00, but got " + response.getBaseUnitPrice());
        assertTrue(BigDecimal.valueOf(500.00).compareTo(response.getFinalUnitPrice()) == 0,
                 "Expected 500.00, but got " + response.getFinalUnitPrice());
        assertEquals(0, response.getCalculationDetails().size());
    }

    @Test
    @DisplayName("Тест базової ціни із застосуванням відсоткового модифікатора")
    void testPercentageModifier() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("PADDING", "Дублянка"))
                .thenReturn(Optional.of(leatherItem));

        // Створюємо запит з відсотковим модифікатором (ручна чистка +20%)
        PriceCalculationRequestDTO request = PriceCalculationRequestDTO.builder()
                .categoryCode("PADDING")
                .itemName("Дублянка")
                .quantity(1)
                .modifierIds(List.of("manual_cleaning"))
                .build();

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(request);

        // Перевіряємо результат
        assertTrue(BigDecimal.valueOf(500.00).compareTo(response.getBaseUnitPrice()) == 0,
                "Expected 500.00, but got " + response.getBaseUnitPrice());
        // Очікувана ціна з +20% = 500 + (500 * 0.2) = 600
        assertTrue(BigDecimal.valueOf(600.00).compareTo(response.getFinalUnitPrice()) == 0,
                "Expected 600.00, but got " + response.getFinalUnitPrice());
        assertEquals(1, response.getCalculationDetails().size());
        assertEquals("manual_cleaning", response.getCalculationDetails().get(0).getModifierId());
        assertTrue(BigDecimal.valueOf(100.00).compareTo(response.getCalculationDetails().get(0).getPriceDifference()) == 0,
                "Expected 100.00, but got " + response.getCalculationDetails().get(0).getPriceDifference());
    }

    @Test
    @DisplayName("Тест із застосуванням діапазонного модифікатора")
    void testRangeModifier() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("PADDING", "Дублянка"))
                .thenReturn(Optional.of(leatherItem));

        // Створюємо запит з діапазонним модифікатором (very_dirty_items від 20% до 100%)
        // Вибираємо значення 50%
        RangeModifierValueDTO rangeValue = new RangeModifierValueDTO();
        rangeValue.setModifierId("very_dirty_items");
        rangeValue.setPercentage(BigDecimal.valueOf(50));

        PriceCalculationRequestDTO request = PriceCalculationRequestDTO.builder()
                .categoryCode("PADDING")
                .itemName("Дублянка")
                .quantity(1)
                .modifierIds(List.of("very_dirty_items"))
                .rangeModifierValues(List.of(rangeValue))
                .build();

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(request);

        // Перевіряємо результат
        assertTrue(BigDecimal.valueOf(500.00).compareTo(response.getBaseUnitPrice()) == 0,
                "Expected 500.00, but got " + response.getBaseUnitPrice());
        // Очікувана ціна з +50% = 500 + (500 * 0.5) = 750
        assertTrue(BigDecimal.valueOf(750.00).compareTo(response.getFinalUnitPrice()) == 0,
                "Expected 750.00, but got " + response.getFinalUnitPrice());
        assertEquals(1, response.getCalculationDetails().size());
        assertEquals("very_dirty_items", response.getCalculationDetails().get(0).getModifierId());
    }

    @Test
    @DisplayName("Тест із застосуванням фіксованого модифікатора")
    void testFixedModifier() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("PADDING", "Дублянка"))
                .thenReturn(Optional.of(leatherItem));

        // Створюємо запит з фіксованим модифікатором (пришивання гудзиків, 3 штуки по 10 грн)
        FixedModifierQuantityDTO fixedQuantity = new FixedModifierQuantityDTO();
        fixedQuantity.setModifierId("sewing_buttons");
        fixedQuantity.setQuantity(3);

        PriceCalculationRequestDTO request = PriceCalculationRequestDTO.builder()
                .categoryCode("PADDING")
                .itemName("Дублянка")
                .quantity(1)
                .modifierIds(List.of("sewing_buttons"))
                .fixedModifierQuantities(List.of(fixedQuantity))
                .build();

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(request);

        // Перевіряємо результат
        assertTrue(BigDecimal.valueOf(500.00).compareTo(response.getBaseUnitPrice()) == 0,
                "Expected 500.00, but got " + response.getBaseUnitPrice());
        // Очікувана ціна з додаванням 3 гудзиків по 10 грн = 500 + (3 * 10) = 530
        assertTrue(BigDecimal.valueOf(530.00).compareTo(response.getFinalUnitPrice()) == 0,
                "Expected 530.00, but got " + response.getFinalUnitPrice());
        assertEquals(1, response.getCalculationDetails().size());
        assertEquals("sewing_buttons", response.getCalculationDetails().get(0).getModifierId());
    }

    @Test
    @DisplayName("Тест з комбінацією модифікаторів")
    void testCombinedModifiers() {
        // Моделюємо поведінку репозиторія
        when(priceListItemRepository.findByCategoryCodeAndItemName("PADDING", "Дублянка"))
                .thenReturn(Optional.of(leatherItem));

        // Створюємо запит з комбінацією модифікаторів:
        // 1. Ручна чистка (+20%)
        // 2. Чистка шкіряних виробів із вставками (+30%)
        // 3. Пришивання гудзиків (2 шт по 10 грн)
        FixedModifierQuantityDTO fixedQuantity = new FixedModifierQuantityDTO();
        fixedQuantity.setModifierId("leather_sewing_buttons");
        fixedQuantity.setQuantity(2);

        PriceCalculationRequestDTO request = PriceCalculationRequestDTO.builder()
                .categoryCode("PADDING")
                .itemName("Дублянка")
                .quantity(1)
                .modifierIds(List.of("manual_cleaning", "leather_with_inserts", "leather_sewing_buttons"))
                .fixedModifierQuantities(List.of(fixedQuantity))
                .build();

        // Викликаємо сервіс
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(request);

        // Перевіряємо результат
        assertTrue(BigDecimal.valueOf(500.00).compareTo(response.getBaseUnitPrice()) == 0,
                "Expected 500.00, but got " + response.getBaseUnitPrice());

        // Розрахунок:
        // 1. Базова ціна: 500
        // 2. Після ручної чистки (+20%): 500 + 100 = 600
        // 3. Після чистки шкіряних виробів із вставками (+30% від 600): 600 + 180 = 780
        // 4. Після пришивання 2 гудзиків: 780 + 20 = 800
        assertTrue(BigDecimal.valueOf(800.00).compareTo(response.getFinalUnitPrice()) == 0,
                "Expected 800.00, but got " + response.getFinalUnitPrice());
        assertEquals(3, response.getCalculationDetails().size());
    }

    @Test
    @DisplayName("Тест з категорійними модифікаторами для різних категорій")
    void testCategorySpecificModifiers() {
        // Для текстильних модифікаторів
        when(priceListItemRepository.findByCategoryCodeAndItemName("CLOTHING", "Пальто"))
                .thenReturn(Optional.of(textileItem));

        // Створюємо запит з текстильним модифікатором
        PriceCalculationRequestDTO textileRequest = PriceCalculationRequestDTO.builder()
                .categoryCode("CLOTHING")
                .itemName("Пальто")
                .quantity(1)
                .modifierIds(List.of("silk_products")) // +50% для шовкових виробів
                .build();

        // Викликаємо сервіс для текстильного предмета
        PriceCalculationResponseDTO textileResponse = priceCalculationService.calculatePrice(textileRequest);
        
        // Очікувана ціна з +50% = 200 + (200 * 0.5) = 300
        assertEquals(BigDecimal.valueOf(300.00).setScale(2, RoundingMode.HALF_UP), textileResponse.getFinalUnitPrice());

        // Для шкіряних модифікаторів
        when(priceListItemRepository.findByCategoryCodeAndItemName("PADDING", "Дублянка"))
                .thenReturn(Optional.of(leatherItem));

        // Створюємо запит з шкіряним модифікатором
        PriceCalculationRequestDTO leatherRequest = PriceCalculationRequestDTO.builder()
                .categoryCode("PADDING")
                .itemName("Дублянка")
                .quantity(1)
                .modifierIds(List.of("leather_ironing")) // 70% від вартості
                .build();

        // Викликаємо сервіс для шкіряного предмета
        PriceCalculationResponseDTO leatherResponse = priceCalculationService.calculatePrice(leatherRequest);
        
        // Очікувана ціна з +70% = 500 + (500 * 0.7) = 850
        assertEquals(BigDecimal.valueOf(850.00).setScale(2, RoundingMode.HALF_UP), leatherResponse.getFinalUnitPrice());
    }

    @Test
    @DisplayName("Тест з некоректною категорією предмета")
    void testInvalidCategory() {
        // Моделюємо відсутність предмета в прайс-листі
        when(priceListItemRepository.findByCategoryCodeAndItemName(anyString(), anyString()))
                .thenReturn(Optional.empty());

        // Створюємо запит з неіснуючою категорією
        PriceCalculationRequestDTO request = PriceCalculationRequestDTO.builder()
                .categoryCode("invalid_category")
                .itemName("Неіснуючий предмет")
                .quantity(1)
                .modifierIds(new ArrayList<>())
                .build();

        // Перевіряємо, що викидається виключення
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, 
                () -> priceCalculationService.calculatePrice(request));
        
        // Перевіряємо, що виключення містить очікуване повідомлення
        assertTrue(exception.getMessage().contains("invalid_category"));
    }
}
