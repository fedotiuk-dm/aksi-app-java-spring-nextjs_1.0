package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.service.DiscountService;
import com.aksi.domain.order.service.ModifierRecommendationService;
import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Основна імплементація сервісу для розрахунку цін.
 * Делегує специфічні операції спеціалізованим сервісам.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationServiceImpl implements PriceCalculationService {

    private final PriceListItemRepository priceListItemRepository;
    private final CatalogPriceModifierService modifierService;
    private final UnitOfMeasureService unitOfMeasureService;
    private final DiscountService discountService;
    private final ModifierRecommendationService recommendationService;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceModifierCalculationService modifierCalculationService;
    private final PriceRecommendationService recommendationHelperService;
    private final ServiceCategoryModifierMapper categoryModifierMapper;
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public PriceCalculationResponseDTO calculatePrice(
            String categoryCode, 
            String itemName, 
            int quantity, 
            String color, 
            List<String> modifierCodes,
            List<RangeModifierValue> rangeModifierValues,
            List<FixedModifierQuantity> fixedModifierQuantities,
            boolean isExpedited,
            BigDecimal expediteFactor,
            BigDecimal discountPercent) {
        
        // Створюємо мапу для значень діапазонних модифікаторів
        Map<String, BigDecimal> rangeModifierPercentages = new HashMap<>();
        if (rangeModifierValues != null) {
            for (RangeModifierValue rangeValue : rangeModifierValues) {
                rangeModifierPercentages.put(rangeValue.modifierCode(), rangeValue.value());
            }
        }
        
        // Створюємо мапу для кількостей фіксованих модифікаторів
        Map<String, Integer> fixedModifierQuantitiesMap = new HashMap<>();
        if (fixedModifierQuantities != null) {
            for (FixedModifierQuantity fixedQuantity : fixedModifierQuantities) {
                fixedModifierQuantitiesMap.put(fixedQuantity.modifierCode(), fixedQuantity.quantity());
            }
        }
        
        // Отримуємо категорію для роботи з одиницями виміру
        ServiceCategoryEntity category = serviceCategoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Категорія з кодом " + categoryCode + " не знайдена"));
        
        // Отримуємо рекомендовану одиницю виміру
        String recommendedUnitOfMeasure = unitOfMeasureService.getRecommendedUnitOfMeasure(category.getId(), itemName);
        
        // 1. Отримання базової ціни (крок 1)
        BigDecimal basePrice = getBasePrice(categoryCode, itemName, color);
        List<CalculationDetailsDTO> calculationDetails = new ArrayList<>();
        
        // Додаємо деталі для базової ціни та одиниці виміру
        calculationDetails.add(CalculationDetailsDTO.builder()
                .step(1)
                .stepName("Базова ціна")
                .description("Базова ціна з прайс-листа (" + recommendedUnitOfMeasure + ")")
                .priceBefore(BigDecimal.ZERO)
                .priceAfter(basePrice)
                .priceDifference(basePrice)
                .build());
        
        // Поточна ціна після кожного кроку обчислення
        BigDecimal currentPrice = basePrice;
        
        // 2-7. Застосування модифікаторів
        if (modifierCodes != null && !modifierCodes.isEmpty()) {
            // Отримуємо всі обрані модифікатори з БД
            List<PriceModifierDTO> modifiers = modifierService.getModifiersByCodes(modifierCodes);
            
            // Делегуємо обчислення модифікаторів спеціалізованому сервісу
            currentPrice = modifierCalculationService.applyAllModifiers(
                    currentPrice, 
                    modifiers, 
                    color, 
                    rangeModifierPercentages, 
                    fixedModifierQuantitiesMap, 
                    isExpedited, 
                    expediteFactor, 
                    categoryCode, 
                    calculationDetails);
            
            // Крок 7: Застосування знижок
            if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal priceBefore = currentPrice;
                
                // Застосовуємо знижку лише якщо категорія дозволяє знижки
                BigDecimal priceAfter = discountService.applyDiscountIfApplicable(currentPrice, discountPercent, categoryCode);
                
                // Додаємо деталі розрахунку лише якщо знижка була застосована
                if (priceAfter.compareTo(priceBefore) != 0) {
                    calculationDetails.add(CalculationDetailsDTO.builder()
                            .step(7)
                            .stepName("Знижка")
                            .description("Застосування знижки: -" + discountPercent + "%")
                            .priceBefore(priceBefore)
                            .priceAfter(priceAfter)
                            .priceDifference(priceAfter.subtract(priceBefore))
                            .build());
                } else {
                    // Якщо знижка не застосована, пояснюємо причину
                    calculationDetails.add(CalculationDetailsDTO.builder()
                            .step(7)
                            .stepName("Знижка")
                            .description("Знижка не застосовується до цієї категорії послуг")
                            .priceBefore(priceBefore)
                            .priceAfter(priceAfter)
                            .priceDifference(BigDecimal.ZERO)
                            .build());
                }
                
                currentPrice = priceAfter;
            }
        }
        
        // 8. Округлення результату
        BigDecimal finalUnitPrice = currentPrice.setScale(PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);
        BigDecimal finalTotalPrice = finalUnitPrice.multiply(new BigDecimal(quantity));
        
        calculationDetails.add(CalculationDetailsDTO.builder()
                .step(8)
                .stepName("Округлення")
                .description("Округлення до " + PriceCalculationConstants.SCALE + " знаків після коми")
                .priceBefore(currentPrice)
                .priceAfter(finalUnitPrice)
                .priceDifference(finalUnitPrice.subtract(currentPrice))
                .build());
        
        // Результат розрахунку
        return PriceCalculationResponseDTO.builder()
                .baseUnitPrice(basePrice)
                .quantity(quantity)
                .baseTotalPrice(basePrice.multiply(new BigDecimal(quantity)))
                .finalUnitPrice(finalUnitPrice)
                .finalTotalPrice(finalTotalPrice)
                .calculationDetails(calculationDetails)
                .unitOfMeasure(recommendedUnitOfMeasure)
                .build();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        Optional<PriceListItemEntity> priceItemOpt = priceListItemRepository.findByCategoryCodeAndItemName(
                categoryCode, itemName);
        
        if (priceItemOpt.isEmpty()) {
            throw EntityNotFoundException.withMessage(
                    "Не знайдено предмет у прайс-листі для категорії " + categoryCode + 
                    " та найменування " + itemName);
        }
        
        PriceListItemEntity priceItem = priceItemOpt.get();
        
        // Перевіряємо колір (чорний/інший)
        if (color != null && color.equalsIgnoreCase(PriceCalculationConstants.COLOR_BLACK) && priceItem.getPriceBlack() != null) {
            return priceItem.getPriceBlack();
        }
        
        return priceItem.getBasePrice();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<String> getAvailableModifiersForCategory(String categoryCode) {
        // Визначаємо категорію модифікаторів на основі категорії послуг
        ModifierCategory modifierCategory = categoryModifierMapper.mapServiceToModifierCategory(categoryCode);
        
        // Отримуємо модифікатори для цієї категорії
        List<PriceModifierDTO> modifiers = modifierService.getModifiersByCategory(modifierCategory);
        
        // Додаємо загальні модифікатори
        if (modifierCategory != ModifierCategory.GENERAL) {
            modifiers.addAll(modifierService.getModifiersByCategory(ModifierCategory.GENERAL));
        }
        
        // Повертаємо лише коди модифікаторів
        return modifiers.stream()
                .map(PriceModifierDTO::getCode)
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<PriceModifierDTO> getRecommendedModifiersForItem(
            Set<String> stains, 
            Set<String> defects, 
            String categoryCode, 
            String materialType) {
        
        return recommendationHelperService.getRecommendedModifiersForItem(stains, defects, categoryCode, materialType);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getRiskWarningsForItem(
            Set<String> stains, 
            Set<String> defects, 
            String categoryCode, 
            String materialType) {
        
        return recommendationService.getRiskWarnings(stains, defects, materialType, categoryCode);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public String getRecommendedUnitOfMeasure(String categoryCode, String itemName) {
        log.debug("Отримання рекомендованої одиниці виміру для категорії {} та товару {}", categoryCode, itemName);
        
        // Отримуємо категорію
        ServiceCategoryEntity category = serviceCategoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Категорія з кодом " + categoryCode + " не знайдена"));
        
        // Делегуємо отримання рекомендованої одиниці виміру до профільного сервісу
        return unitOfMeasureService.getRecommendedUnitOfMeasure(category.getId(), itemName);
    }
} 
