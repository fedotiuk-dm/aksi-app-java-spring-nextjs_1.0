package com.aksi.domain.pricing.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для мапування категорій послуг на категорії модифікаторів.
 * Виключає дублювання кода та хардкодовані значення.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ServiceCategoryModifierMapper {
    
    private final ServiceCategoryRepository serviceCategoryRepository;
    
    // Кеш мапування для зменшення запитів до БД
    private final Map<String, ModifierCategory> categoryMappingCache = new ConcurrentHashMap<>();
    
    // Визначення статичних правил для маппінгу
    private static final Map<String, ModifierCategory> STATIC_CATEGORY_MAPPING = Map.of(
        // Текстильні категорії
        "CLOTHING", ModifierCategory.TEXTILE,
        "IRONING", ModifierCategory.TEXTILE,
        "PADDING", ModifierCategory.TEXTILE,
        "DYEING", ModifierCategory.TEXTILE,
        "LAUNDRY", ModifierCategory.TEXTILE,
        "WASHING", ModifierCategory.TEXTILE,
        
        // Шкіряні категорії
        "LEATHER", ModifierCategory.LEATHER,
        "FUR", ModifierCategory.LEATHER,
        
        // Додаткові послуги
        "ADDITIONAL_SERVICES", ModifierCategory.GENERAL
    );
    
    /**
     * Ініціалізує кеш при запуску компонента
     */
    @PostConstruct
    public void initializeCache() {
        log.info("Ініціалізація кешу мапування категорій");
        // Копіюємо статичне мапування в кеш
        categoryMappingCache.putAll(STATIC_CATEGORY_MAPPING);
    }
    
    /**
     * Мапує категорію послуг на категорію модифікаторів
     * 
     * @param categoryCode код категорії послуг
     * @return відповідна категорія модифікаторів
     */
    public ModifierCategory mapServiceToModifierCategory(String categoryCode) {
        if (categoryCode == null) {
            return ModifierCategory.GENERAL;
        }
        
        // Перевіряємо спочатку кеш
        return categoryMappingCache.computeIfAbsent(categoryCode, this::lookupCategoryMapping);
    }
    
    /**
     * Шукає відповідність між кодом категорії та категорією модифікаторів у БД
     * 
     * @param categoryCode код категорії
     * @return категорія модифікаторів
     */
    private ModifierCategory lookupCategoryMapping(String categoryCode) {
        log.debug("Пошук категорії модифікаторів для коду: {}", categoryCode);
        
        // Перевіряємо статичні правила
        ModifierCategory staticMapping = STATIC_CATEGORY_MAPPING.get(categoryCode.toUpperCase());
        if (staticMapping != null) {
            return staticMapping;
        }
        
        // Якщо статичного правила немає, шукаємо в БД
        return serviceCategoryRepository.findByCode(categoryCode)
                .map(category -> {
                    // Визначаємо за типом категорії
                    return determineCategoryByType(category);
                })
                .orElse(ModifierCategory.GENERAL);
    }
    
    /**
     * Визначає категорію модифікаторів за типом категорії послуг
     * 
     * @param category сутність категорії послуг
     * @return категорія модифікаторів
     */
    private ModifierCategory determineCategoryByType(ServiceCategoryEntity category) {
        // Тут можна реалізувати будь-яку логіку визначення категорії на основі атрибутів
        // Поки що використовуємо просте порівняння кодів
        
        String code = category.getCode().toUpperCase();
        
        // Текстильні категорії
        if (code.equals("CLOTHING") || code.equals("IRONING") || 
            code.equals("PADDING") || code.equals("DYEING") || 
            code.equals("LAUNDRY") || code.equals("WASHING")) {
            return ModifierCategory.TEXTILE;
        }
        
        // Шкіряні та хутряні категорії
        if (code.equals("LEATHER") || code.equals("FUR")) {
            return ModifierCategory.LEATHER;
        }
        
        // За замовчуванням - загальна категорія
        return ModifierCategory.GENERAL;
    }
} 