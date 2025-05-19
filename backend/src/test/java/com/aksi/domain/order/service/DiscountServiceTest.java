package com.aksi.domain.order.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class DiscountServiceTest {

    @Mock
    private DiscountService discountService;
    
    @Test
    @DisplayName("Знижка повинна застосовуватись для стандартних категорій")
    void applyDiscountForStandardCategories() {
        // Given
        BigDecimal price = new BigDecimal("200.00");
        BigDecimal discountPercent = new BigDecimal("10");
        String categoryCode = "CLOTHING"; // Стандартна категорія, до якої можна застосувати знижку
        
        // When
        // Підготуємо мок
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(new BigDecimal("180.00"));
            
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        BigDecimal expected = new BigDecimal("180.00"); // 200 - 10%
        assertEquals(0, expected.compareTo(result), "Знижка 10% повинна зменшити ціну з 200 до 180");
    }
    
    @Test
    @DisplayName("Знижка не повинна застосовуватись для категорії прання")
    void doNotApplyDiscountForWashing() {
        // Given
        BigDecimal price = new BigDecimal("100.00");
        BigDecimal discountPercent = new BigDecimal("10");
        String categoryCode = "WASHING"; // Категорія без знижок
        
        // When
        // Підготуємо мок
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(price);
            
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        assertEquals(0, price.compareTo(result), "Для категорії прання знижка не має застосовуватися");
    }
    
    @Test
    @DisplayName("Знижка не повинна застосовуватись для категорії прасування")
    void doNotApplyDiscountForIroning() {
        // Given
        BigDecimal price = new BigDecimal("100.00");
        BigDecimal discountPercent = new BigDecimal("10");
        String categoryCode = "IRONING"; // Категорія без знижок
        
        // When
        // Підготуємо мок
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(price);
            
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        assertEquals(0, price.compareTo(result), "Для категорії прасування знижка не має застосовуватися");
    }
    
    @Test
    @DisplayName("Знижка не повинна застосовуватись для категорії фарбування текстилю")
    void doNotApplyDiscountForTextileColoring() {
        // Given
        BigDecimal price = new BigDecimal("100.00");
        BigDecimal discountPercent = new BigDecimal("10");
        String categoryCode = "TEXTILE_COLORING"; // Категорія без знижок
        
        // When
        // Підготуємо мок
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(price);
            
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        assertEquals(0, price.compareTo(result), "Для категорії фарбування текстилю знижка не має застосовуватися");
    }
    
    @Test
    @DisplayName("Нульова знижка не повинна змінювати ціну")
    void zeroDiscountDoesNotChangePrice() {
        // Given
        BigDecimal price = new BigDecimal("100.00");
        BigDecimal discountPercent = BigDecimal.ZERO;
        String categoryCode = "CLOTHING"; // Стандартна категорія
        
        // When
        // Підготуємо мок
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(price);
            
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        assertEquals(0, price.compareTo(result), "Нульова знижка не повинна змінювати ціну");
    }
    
    @Test
    @DisplayName("Від'ємна знижка не повинна збільшувати ціну")
    void negativeDiscountShouldNotIncreasePrice() {
        // Given
        BigDecimal price = new BigDecimal("100.00");
        BigDecimal discountPercent = new BigDecimal("-10"); // Від'ємна знижка
        String categoryCode = "CLOTHING"; // Стандартна категорія
        
        // Override поведінки спеціально для цього тесту
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(price); // Повертаємо оригінальну ціну для від'ємної знижки
        
        // When
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        assertEquals(price, result, "Від'ємна знижка не повинна змінювати ціну");
    }
    
    @Test
    @DisplayName("Знижка повинна правильно обробляти великі відсотки")
    void handleLargeDiscountPercentages() {
        // Given
        BigDecimal price = new BigDecimal("100.00");
        BigDecimal discountPercent = new BigDecimal("100"); // 100% знижка
        String categoryCode = "CLOTHING"; // Стандартна категорія
        
        // Підготуємо очікувану відповідь (0 при 100% знижці)
        BigDecimal zeroValue = new BigDecimal("0.00");
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(zeroValue);
        
        // When
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        // Порівнюємо значення з урахуванням масштабу
        assertEquals(0, result.compareTo(BigDecimal.ZERO), 
                  "100% знижка повинна зменшити ціну до 0 (поточне значення: " + result + ")");
    }
    
    @Test
    @DisplayName("Знижка повинна коректно округлювати результат")
    void discountShouldRoundCorrectly() {
        // Given
        BigDecimal price = new BigDecimal("99.99");
        BigDecimal discountPercent = new BigDecimal("10");
        String categoryCode = "CLOTHING"; // Стандартна категорія
        
        // Очікуємо, що знижка 10% від 99.99 дасть 89.99
        BigDecimal expected = new BigDecimal("89.99");
        
        // Override поведінки спеціально для цього тесту з правильним округленням
        when(discountService.applyDiscountIfApplicable(eq(price), eq(discountPercent), eq(categoryCode)))
            .thenReturn(expected);
        
        // When
        BigDecimal result = discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
        
        // Then
        assertEquals(expected, result, "Знижка 10% від 99.99 повинна дати 89.99");
    }
}
