package com.aksi.domain.pricing.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.constants.UnitOfMeasureConstants;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exceptions.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з одиницями виміру предметів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UnitOfMeasureServiceImpl implements UnitOfMeasureService {
    
    private final PriceListItemRepository priceListItemRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    // Коди категорій послуг відповідно до реального прайс-листу
    public static final String CATEGORY_CODE_ODIAH = "CLOTHING";                // Чистка одягу та текстилю
    public static final String CATEGORY_CODE_PRANIA = "LAUNDRY";     // Прання білизни
    public static final String CATEGORY_CODE_PRASUVANYA = "IRONING";     // Прасування
    public static final String CATEGORY_CODE_SHKIRA = "LEATHER";  // Чистка та відновлення шкіряних виробів
    public static final String CATEGORY_CODE_DUBLYANKY = "PADDING";      // Дублянки
    public static final String CATEGORY_CODE_HUTRO = "FUR";   // Вироби із натурального хутра
    public static final String CATEGORY_CODE_FARBUVANNIA = "DYEING"; // Фарбування текстильних виробів
    public static final String CATEGORY_CODE_DODATKOVI = "ADDITIONAL_SERVICES"; // Додаткові послуги
    
    // Дефолтна одиниця виміру для кожної категорії згідно з реальним прайс-листом
    private static final Map<String, String> CATEGORY_DEFAULT_UNITS = new HashMap<>();
    static {
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_ODIAH, UnitOfMeasureConstants.PIECES);        // Чистка одягу та текстилю
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_PRANIA, UnitOfMeasureConstants.PIECES);        // Прання білизни
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_PRASUVANYA, UnitOfMeasureConstants.PIECES);    // Прасування
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_SHKIRA, UnitOfMeasureConstants.PIECES);        // Чистка та відновлення шкіряних виробів
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_DUBLYANKY, UnitOfMeasureConstants.PIECES);     // Дублянки
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_HUTRO, UnitOfMeasureConstants.PIECES);         // Вироби із натурального хутра
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_FARBUVANNIA, UnitOfMeasureConstants.PIECES);   // Фарбування текстильних виробів
        CATEGORY_DEFAULT_UNITS.put(CATEGORY_CODE_DODATKOVI, UnitOfMeasureConstants.PIECES);     // Додаткові послуги
    }
    
    // Предмети, які використовують кг як одиницю виміру згідно з реальним прайс-листом
    private static final List<String> KG_ITEMS = Arrays.asList(
        "Білизна", "Постільна білизна"
    );
    
    // Взуття, яке використовує пару як одиницю виміру
    private static final List<String> PAIR_ITEMS = Arrays.asList(
        "Босоніжки", "Туфлі", "Мокасини", "Чоботи", "Півчоботи"
    );
    
    // Предмети, які використовують кв.м як одиницю виміру
    private static final List<String> SQUARE_METER_ITEMS = Arrays.asList(
        "Шкіра з натур.хутра", "Килим"
    );
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public String getRecommendedUnitOfMeasure(UUID categoryId, String itemName) {
        log.debug("Визначення рекомендованої одиниці виміру для категорії з ID: {} та предмета: {}", categoryId, itemName);
        
        // Перевіряємо, чи існує категорія
        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> EntityNotFoundException.withId(categoryId));
        
        // Якщо для предмета вже є запис в базі, використовуємо його одиницю виміру
        List<PriceListItemEntity> matchingItems = priceListItemRepository.findAllByCategory(category).stream()
                .filter(item -> item.getName().equalsIgnoreCase(itemName))
                .collect(Collectors.toList());
        
        if (!matchingItems.isEmpty()) {
            return matchingItems.get(0).getUnitOfMeasure();
        }
        
        // Перевіряємо одиницю виміру за назвою предмета згідно з прайс-листом
        
        // Якщо предмет належить до списку "кілограмових" предметів, повертаємо кг
        for (String kgItem : KG_ITEMS) {
            if (itemName.toLowerCase().contains(kgItem.toLowerCase())) {
                return UnitOfMeasureConstants.KILOGRAMS;
            }
        }
        
        // Якщо предмет є взуттям, повертаємо пару
        for (String pairItem : PAIR_ITEMS) {
            if (itemName.toLowerCase().contains(pairItem.toLowerCase())) {
                return UnitOfMeasureConstants.PAIR;
            }
        }
        
        // Якщо предмет вимірюється в кв.м, повертаємо кв.м
        for (String sqmItem : SQUARE_METER_ITEMS) {
            if (itemName.toLowerCase().contains(sqmItem.toLowerCase())) {
                return UnitOfMeasureConstants.SQUARE_METERS;
            }
        }
        
        // Визначаємо за кодом категорії
        String categoryCode = category.getCode();
        if (CATEGORY_DEFAULT_UNITS.containsKey(categoryCode)) {
            return CATEGORY_DEFAULT_UNITS.get(categoryCode);
        }
        
        // За замовчуванням - штуки
        return UnitOfMeasureConstants.PIECES;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<String> getAvailableUnitsForCategory(UUID categoryId) {
        log.debug("Отримання доступних одиниць виміру для категорії з ID: {}", categoryId);
        
        // Перевіряємо, чи існує категорія
        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> EntityNotFoundException.withId(categoryId));
        
        // Отримуємо всі унікальні одиниці виміру, які використовуються в цій категорії
        List<String> existingUnits = priceListItemRepository.findAllByCategory(category).stream()
                .map(PriceListItemEntity::getUnitOfMeasure)
                .distinct()
                .collect(Collectors.toList());
        
        // Якщо нічого не знайдено, повертаємо список базових одиниць
        if (existingUnits.isEmpty()) {
            String categoryCode = category.getCode();
            
            // Використовуємо switch expression для визначення одиниць виміру за категорією
            // Відповідно до реального прайс-листу
            return switch (categoryCode) {
                // Для прання білизни доступні штуки та кг
                case CATEGORY_CODE_PRANIA -> 
                    Arrays.asList(UnitOfMeasureConstants.PIECES, UnitOfMeasureConstants.KILOGRAMS);
                // Для шкіряних виробів - штуки, пара і кв.м
                case CATEGORY_CODE_SHKIRA -> 
                    Arrays.asList(UnitOfMeasureConstants.PIECES, UnitOfMeasureConstants.PAIR, UnitOfMeasureConstants.SQUARE_METERS);
                // Для хутряних виробів - штуки і кв.м
                case CATEGORY_CODE_HUTRO -> 
                    Arrays.asList(UnitOfMeasureConstants.PIECES, UnitOfMeasureConstants.SQUARE_METERS);
                // Для всіх інших категорій - штуки
                default -> 
                    Arrays.asList(UnitOfMeasureConstants.PIECES);
            };
        }
        
        return existingUnits;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isUnitSupportedForItem(UUID categoryId, String itemName, String unitOfMeasure) {
        log.debug("Перевірка підтримки одиниці виміру {} для категорії з ID: {} та предмета: {}", 
                unitOfMeasure, categoryId, itemName);
        
        // Перевіряємо, чи є рекомендована одиниця виміру для предмета
        String recommendedUnit = getRecommendedUnitOfMeasure(categoryId, itemName);
        
        // Якщо одиниця виміру співпадає з рекомендованою, вона підтримується
        if (recommendedUnit.equals(unitOfMeasure)) {
            return true;
        }
        
        // Отримуємо доступні одиниці виміру для категорії
        List<String> availableUnits = getAvailableUnitsForCategory(categoryId);
        
        // Перевіряємо, чи одиниця виміру є в списку доступних
        return availableUnits.contains(unitOfMeasure);
    }
}
