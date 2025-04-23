package com.aksi.service.order.impl;

import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.dto.order.PriceModifierDto;
import com.aksi.service.order.PriceModifierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Імплементація сервісу для модифікаторів цін
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceModifierServiceImpl implements PriceModifierService {

    private final ServiceCategoryRepository serviceCategoryRepository;
    
    // Константи для категорій модифікаторів
    private static final String GENERAL_CATEGORY = "GENERAL";
    private static final String TEXTILE_CATEGORY = "TEXTILE";
    private static final String LEATHER_CATEGORY = "LEATHER";

    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDto> getAllPriceModifiers() {
        List<PriceModifierDto> allModifiers = new ArrayList<>();
        allModifiers.addAll(getGeneralPriceModifiers());
        allModifiers.addAll(getTextilePriceModifiers());
        allModifiers.addAll(getLeatherPriceModifiers());
        return allModifiers;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDto> getPriceModifiersForCategory(UUID categoryId) {
        Optional<ServiceCategory> categoryOpt = serviceCategoryRepository.findById(categoryId);
        
        if (categoryOpt.isEmpty()) {
            log.warn("Запитана категорія з ID {} не знайдена", categoryId);
            return Collections.emptyList();
        }
        
        ServiceCategory category = categoryOpt.get();
        String categoryCode = category.getCode() != null ? category.getCode().toUpperCase() : "";
        
        List<PriceModifierDto> applicableModifiers = new ArrayList<>(getGeneralPriceModifiers());
        
        // Логіка для визначення, які додаткові модифікатори застосовуються для цієї категорії
        if (categoryCode.contains("TEXTILE") || categoryCode.contains("CLOTH") || 
            categoryCode.contains("FABRIC") || categoryCode.contains("DRESS")) {
            applicableModifiers.addAll(getTextilePriceModifiers());
        }
        
        if (categoryCode.contains("LEATHER") || categoryCode.contains("SUEDE") || 
            categoryCode.contains("NUBUCK")) {
            applicableModifiers.addAll(getLeatherPriceModifiers());
        }
        
        return applicableModifiers;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDto> getGeneralPriceModifiers() {
        log.debug("Отримання загальних модифікаторів цін");
        
        List<PriceModifierDto> generalModifiers = new ArrayList<>();
        
        // Загальні коефіцієнти для всіх категорій
        generalModifiers.add(createPriceModifier(
            "child_size", "Дитячі речі (до 30 розміру)",
            "Знижка для дитячих речей", "PERCENTAGE", 
            new BigDecimal("-30"), GENERAL_CATEGORY, null, 10, false));
            
        generalModifiers.add(createPriceModifier(
            "manual_cleaning", "Ручна чистка",
            "Додаткова плата за ручну чистку", "PERCENTAGE", 
            new BigDecimal("20"), GENERAL_CATEGORY, null, 20, false));
            
        generalModifiers.add(createPriceModifier(
            "heavily_soiled", "Дуже забруднені речі",
            "Додаткова плата за чистку сильно забруднених речей", "PERCENTAGE", 
            new BigDecimal("50"), GENERAL_CATEGORY, null, 30, false));
            
        generalModifiers.add(createPriceModifier(
            "express", "Термінова чистка",
            "Додаткова плата за термінову обробку", "PERCENTAGE", 
            new BigDecimal("70"), GENERAL_CATEGORY, null, 40, false));
            
        return generalModifiers;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDto> getTextilePriceModifiers() {
        log.debug("Отримання модифікаторів цін для текстильних виробів");
        
        List<UUID> textileCategories = getTextileCategoryIds();
        List<PriceModifierDto> textileModifiers = new ArrayList<>();
        
        // Модифікатори для текстильних виробів
        textileModifiers.add(createPriceModifier(
            "fur_collar", "Чистка виробів з хутряними комірами та манжетами",
            "Додаткова плата за чистку виробів з хутром", "PERCENTAGE", 
            new BigDecimal("30"), TEXTILE_CATEGORY, textileCategories, 10, false));
            
        textileModifiers.add(createPriceModifier(
            "water_repellent", "Нанесення водовідштовхуючого покриття",
            "Додаткова послуга для захисту від вологи", "PERCENTAGE", 
            new BigDecimal("30"), TEXTILE_CATEGORY, textileCategories, 20, false));
            
        textileModifiers.add(createPriceModifier(
            "silk_fabric", "Чистка виробів із натурального шовку, атласу, шифону",
            "Додаткова плата за делікатні тканини", "PERCENTAGE", 
            new BigDecimal("50"), TEXTILE_CATEGORY, textileCategories, 30, false));
            
        textileModifiers.add(createPriceModifier(
            "combined_materials", "Чистка комбінованих виробів (шкіра+текстиль)",
            "Додаткова плата за комбіновані матеріали", "PERCENTAGE", 
            new BigDecimal("100"), TEXTILE_CATEGORY, textileCategories, 40, false));
            
        textileModifiers.add(createPriceModifier(
            "toys_cleaning", "Ручна чистка великих м'яких іграшок",
            "Додаткова плата за ручну чистку іграшок", "PERCENTAGE", 
            new BigDecimal("100"), TEXTILE_CATEGORY, textileCategories, 50, false));
            
        textileModifiers.add(createPriceModifier(
            "button_sewing", "Пришивання гудзиків",
            "Фіксована вартість за одиницю", "FIXED", 
            new BigDecimal("50"), TEXTILE_CATEGORY, textileCategories, 60, false));
            
        textileModifiers.add(createPriceModifier(
            "dark_light_colors", "Чистка виробів чорного та світлих тонів",
            "Додаткова плата за складну колористику", "PERCENTAGE", 
            new BigDecimal("20"), TEXTILE_CATEGORY, textileCategories, 70, false));
            
        textileModifiers.add(createPriceModifier(
            "wedding_dress", "Чистка весільної сукні зі шлейфом",
            "Додаткова плата за делікатну чистку весільного вбрання", "PERCENTAGE", 
            new BigDecimal("30"), TEXTILE_CATEGORY, textileCategories, 80, false));
            
        return textileModifiers;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDto> getLeatherPriceModifiers() {
        log.debug("Отримання модифікаторів цін для шкіряних виробів");
        
        List<UUID> leatherCategories = getLeatherCategoryIds();
        List<PriceModifierDto> leatherModifiers = new ArrayList<>();
        
        // Модифікатори для шкіряних виробів
        leatherModifiers.add(createPriceModifier(
            "leather_ironing", "Прасування шкіряних виробів",
            "Додаткова плата за прасування", "PERCENTAGE", 
            new BigDecimal("70"), LEATHER_CATEGORY, leatherCategories, 10, false));
            
        leatherModifiers.add(createPriceModifier(
            "water_repellent_leather", "Нанесення водовідштовхуючого покриття",
            "Додаткова послуга для захисту від вологи", "PERCENTAGE", 
            new BigDecimal("30"), LEATHER_CATEGORY, leatherCategories, 20, false));
            
        leatherModifiers.add(createPriceModifier(
            "dyeing_after", "Фарбування (після нашої чистки)",
            "Додаткова послуга фарбування", "PERCENTAGE", 
            new BigDecimal("50"), LEATHER_CATEGORY, leatherCategories, 30, false));
            
        leatherModifiers.add(createPriceModifier(
            "dyeing_external", "Фарбування (після чистки деінде)",
            "Послуга фарбування", "PERCENTAGE", 
            new BigDecimal("100"), LEATHER_CATEGORY, leatherCategories, 40, true));
            
        leatherModifiers.add(createPriceModifier(
            "leather_inserts", "Чистка шкіряних виробів із вставками",
            "Додаткова плата за комбіновані матеріали", "PERCENTAGE", 
            new BigDecimal("30"), LEATHER_CATEGORY, leatherCategories, 50, false));
            
        leatherModifiers.add(createPriceModifier(
            "pearl_coating", "Нанесення перламутрового покриття",
            "Додаткова послуга декоративної обробки", "PERCENTAGE", 
            new BigDecimal("30"), LEATHER_CATEGORY, leatherCategories, 60, false));
            
        leatherModifiers.add(createPriceModifier(
            "natural_fur", "Чистка натуральних дублянок на штучному хутрі",
            "Знижка для певних типів виробів", "PERCENTAGE", 
            new BigDecimal("-20"), LEATHER_CATEGORY, leatherCategories, 70, false));
            
        leatherModifiers.add(createPriceModifier(
            "leather_button_sewing", "Пришивання гудзиків",
            "Фіксована вартість за одиницю", "FIXED", 
            new BigDecimal("70"), LEATHER_CATEGORY, leatherCategories, 80, false));
            
        leatherModifiers.add(createPriceModifier(
            "manual_leather_cleaning", "Ручна чистка виробів зі шкіри",
            "Додаткова плата за ручну чистку", "PERCENTAGE", 
            new BigDecimal("30"), LEATHER_CATEGORY, leatherCategories, 90, false));
            
        return leatherModifiers;
    }
    
    /**
     * Створює модифікатор ціни з вказаними параметрами
     */
    private PriceModifierDto createPriceModifier(
            String id, String name, String description, String type, 
            BigDecimal value, String modifierCategory, 
            List<UUID> applicableCategories, Integer applicationOrder,
            boolean replacesBasePrice) {
        
        return PriceModifierDto.builder()
                .id(id)
                .name(name)
                .description(description)
                .type(type)
                .value(value)
                .modifierCategory(modifierCategory)
                .applicableCategories(applicableCategories)
                .applicationOrder(applicationOrder)
                .replacesBasePrice(replacesBasePrice)
                .build();
    }
    
    /**
     * Отримати ID категорій текстильних виробів
     */
    private List<UUID> getTextileCategoryIds() {
        return serviceCategoryRepository.findAll().stream()
                .filter(category -> {
                    String code = category.getCode() != null ? category.getCode().toUpperCase() : "";
                    return code.contains("TEXTILE") || code.contains("CLOTH") || 
                           code.contains("FABRIC") || code.contains("DRESS");
                })
                .map(ServiceCategory::getId)
                .collect(Collectors.toList());
    }
    
    /**
     * Отримати ID категорій шкіряних виробів
     */
    private List<UUID> getLeatherCategoryIds() {
        return serviceCategoryRepository.findAll().stream()
                .filter(category -> {
                    String code = category.getCode() != null ? category.getCode().toUpperCase() : "";
                    return code.contains("LEATHER") || code.contains("SUEDE") || 
                           code.contains("NUBUCK");
                })
                .map(ServiceCategory::getId)
                .collect(Collectors.toList());
    }
}
