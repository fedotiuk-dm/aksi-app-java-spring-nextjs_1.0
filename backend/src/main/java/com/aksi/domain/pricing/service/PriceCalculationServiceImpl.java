package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.model.NonExpeditableCategory;
import com.aksi.domain.order.service.DiscountService;
import com.aksi.domain.order.service.ModifierRecommendationService;
import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierType;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exception.EntityNotFoundException;

import io.vavr.Tuple;
import io.vavr.Tuple2;
import io.vavr.collection.HashMap;
import io.vavr.collection.List;
import io.vavr.control.Option;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для розрахунку цін з використанням модифікаторів з бази даних.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationServiceImpl implements PriceCalculationService {

    private final PriceListItemRepository priceListItemRepository;
    private final PriceModifierService modifierService;
    private final DiscountService discountService;
    private final ModifierRecommendationService recommendationService;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final UnitOfMeasureService unitOfMeasureService;
    
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
            java.util.List<String> modifierCodes,
            java.util.List<RangeModifierValue> rangeModifierValues,
            java.util.List<FixedModifierQuantity> fixedModifierQuantities,
            boolean isExpedited,
            BigDecimal expediteFactor,
            BigDecimal discountPercent) {
        
        // Перетворення Java колекцій на Vavr колекції
        List<String> modifierCodesList = List.ofAll(modifierCodes != null ? modifierCodes : java.util.Collections.emptyList());
        
        // Створюємо мапи використовуючи Vavr
        HashMap<String, BigDecimal> rangeModifierPercentages = Option.of(rangeModifierValues)
            .map(values -> HashMap.ofAll(values.stream()
                .collect(Collectors.toMap(
                    RangeModifierValue::modifierCode, 
                    RangeModifierValue::value))))
            .getOrElse(HashMap.empty());
        
        HashMap<String, Integer> fixedModifierQuantitiesMap = Option.of(fixedModifierQuantities)
            .map(values -> HashMap.ofAll(values.stream()
                .collect(Collectors.toMap(
                    FixedModifierQuantity::modifierCode, 
                    FixedModifierQuantity::quantity))))
            .getOrElse(HashMap.empty());
        
        // Отримуємо категорію та одиницю виміру
        ServiceCategoryEntity category = Option.ofOptional(serviceCategoryRepository.findByCode(categoryCode))
            .getOrElseThrow(() -> EntityNotFoundException.withMessage("Категорія з кодом " + categoryCode + " не знайдена"));
            
        String recommendedUnitOfMeasure = unitOfMeasureService.getRecommendedUnitOfMeasure(category.getId(), itemName);
        
        // Базова ціна і деталі розрахунку
        BigDecimal basePrice = getBasePrice(categoryCode, itemName, color);
        java.util.List<CalculationDetailsDTO> calculationDetails = new ArrayList<>();
        
        calculationDetails.add(CalculationDetailsDTO.builder()
                .step(1)
                .stepName("Базова ціна")
                .description("Базова ціна з прайс-листа (" + recommendedUnitOfMeasure + ")")
                .priceBefore(BigDecimal.ZERO)
                .priceAfter(basePrice)
                .priceDifference(basePrice)
                .build());
                
        // Застосовуємо всі кроки до базової ціни, якщо є модифікатори
        Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> result = 
            Option.when(!modifierCodesList.isEmpty(), () -> {
                // Отримуємо всі модифікатори з бази даних
                java.util.List<PriceModifierDTO> modifiers = 
                    modifierService.getModifiersByCodes(modifierCodesList.asJava());
                
                // Послідовне застосування модифікаторів за допомогою композиції
                Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> colorResult = 
                    applyColorModifiersWithDetails(basePrice, modifiers, color, calculationDetails);
                
                Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> specialResult = 
                    applySpecialModifiersWithDetails(colorResult._1, modifiers, colorResult._2);
                
                Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> percentageResult = 
                    applyPercentageModifiersWithDetails(specialResult._1, modifiers, 
                                                      rangeModifierPercentages.toJavaMap(), specialResult._2);
                
                Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> fixedResult = 
                    applyFixedServiceModifiersWithDetails(percentageResult._1, modifiers, 
                                                        fixedModifierQuantitiesMap.toJavaMap(), percentageResult._2);
                
                Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> expediteResult = 
                    applyExpediteFactor(fixedResult._1, fixedResult._2, isExpedited, expediteFactor, categoryCode, 
                                       canBeExpedited(categoryCode));
                
                return applyDiscount(expediteResult._1, expediteResult._2, discountPercent);
            })
            .getOrElse(() -> Tuple.of(basePrice, calculationDetails));
        
        // Фінальна ціна після всіх модифікацій
        BigDecimal currentPrice = result._1;
        java.util.List<CalculationDetailsDTO> updatedDetails = result._2;
        
        // Округлення результату
        BigDecimal finalUnitPrice = currentPrice.setScale(PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);
        BigDecimal finalTotalPrice = finalUnitPrice.multiply(new BigDecimal(quantity));
        
        updatedDetails.add(CalculationDetailsDTO.builder()
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
                .calculationDetails(updatedDetails)
                .unitOfMeasure(recommendedUnitOfMeasure)
                .build();
    }
    
    /**
     * Перевіряє, чи категорія підтримує терміновість
     */
    private boolean canBeExpedited(String categoryCode) {
        return !NonExpeditableCategory.isNonExpeditable(categoryCode);
    }
    
    /**
     * Застосовує фактор терміновості
     */
    private Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> applyExpediteFactor(
            BigDecimal currentPrice, 
            java.util.List<CalculationDetailsDTO> details,
            boolean isExpedited,
            BigDecimal expediteFactor,
            String categoryCode,
            boolean canBeExpedited) {
        
        // Перевіряємо умови для застосування термінового тарифу
        if (isExpedited && expediteFactor != null && expediteFactor.compareTo(BigDecimal.ZERO) > 0 && canBeExpedited) {
            BigDecimal priceAfter = PriceCalculationConstants.applyPercentage(currentPrice, expediteFactor);
            
            details.add(CalculationDetailsDTO.builder()
                    .step(6)
                    .stepName("Терміновість")
                    .description("Застосування коефіцієнта терміновості: +" + expediteFactor + "%")
                    .priceBefore(currentPrice)
                    .priceAfter(priceAfter)
                    .priceDifference(priceAfter.subtract(currentPrice))
                    .build());
            
            return Tuple.of(priceAfter, details);
        } else if (isExpedited && !canBeExpedited) {
            details.add(CalculationDetailsDTO.builder()
                    .step(6)
                    .stepName("Терміновість")
                    .description("Категорія " + categoryCode + " не підтримує терміновість")
                    .priceBefore(currentPrice)
                    .priceAfter(currentPrice)
                    .priceDifference(BigDecimal.ZERO)
                    .build());
        }
        
        return Tuple.of(currentPrice, details);
    }
    
    /**
     * Застосовує знижку
     */
    private Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> applyDiscount(
            BigDecimal currentPrice, 
            java.util.List<CalculationDetailsDTO> details,
            BigDecimal discountPercent) {
        
        return Option.of(discountPercent)
            .filter(d -> d.compareTo(BigDecimal.ZERO) > 0)
            .map(discount -> {
                BigDecimal priceAfter = PriceCalculationConstants.applyDiscount(currentPrice, discount);
                
                details.add(CalculationDetailsDTO.builder()
                        .step(7)
                        .stepName("Знижка")
                        .description("Застосування знижки: -" + discount + "%")
                        .priceBefore(currentPrice)
                        .priceAfter(priceAfter)
                        .priceDifference(priceAfter.subtract(currentPrice))
                        .build());
                
                return Tuple.of(priceAfter, details);
            })
            .getOrElse(() -> Tuple.of(currentPrice, details));
    }
    
    /**
     * Метод для застосування кольорових модифікаторів з деталізацією
     */
    private Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> applyColorModifiersWithDetails(
            BigDecimal currentPrice, 
            java.util.List<PriceModifierDTO> modifiers, 
            String color, 
            java.util.List<CalculationDetailsDTO> details) {
        
        return Option.ofOptional(modifiers.stream()
                .filter(m -> "black_light_colors".equals(m.getCode()))
                .findFirst())
            .filter(mod -> color != null && 
                    (color.equalsIgnoreCase(PriceCalculationConstants.COLOR_BLACK) || 
                     color.equalsIgnoreCase(PriceCalculationConstants.COLOR_WHITE)))
            .map(modifier -> {
                BigDecimal priceAfter = applyModifier(currentPrice, modifier, null, null);
                
                details.add(CalculationDetailsDTO.builder()
                        .step(2)
                        .stepName("Перевірка кольору")
                        .description("Застосування модифікатора для кольору: " + color)
                        .modifierName(modifier.getName())
                        .modifierCode(modifier.getCode())
                        .modifierValue(modifier.getChangeDescription())
                        .priceBefore(currentPrice)
                        .priceAfter(priceAfter)
                        .priceDifference(priceAfter.subtract(currentPrice))
                        .build());
                
                return Tuple.of(priceAfter, details);
            })
            .getOrElse(() -> Tuple.of(currentPrice, details));
    }
    
    /**
     * Метод для застосування спеціальних модифікаторів з деталізацією
     */
    private Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> applySpecialModifiersWithDetails(
            BigDecimal currentPrice, 
            java.util.List<PriceModifierDTO> modifiers, 
            java.util.List<CalculationDetailsDTO> details) {
        
        return Option.ofOptional(modifiers.stream()
                .filter(m -> "leather_coloring_after_other_cleaning".equals(m.getCode()))
                .findFirst())
            .map(modifier -> {
                BigDecimal priceAfter = applyModifier(currentPrice, modifier, null, null);
                
                details.add(CalculationDetailsDTO.builder()
                        .step(3)
                        .stepName("Особливі модифікатори")
                        .description("Застосування особливого модифікатора, який заміняє базову ціну")
                        .modifierName(modifier.getName())
                        .modifierCode(modifier.getCode())
                        .modifierValue(modifier.getChangeDescription())
                        .priceBefore(currentPrice)
                        .priceAfter(priceAfter)
                        .priceDifference(priceAfter.subtract(currentPrice))
                        .build());
                
                return Tuple.of(priceAfter, details);
            })
            .getOrElse(() -> Tuple.of(currentPrice, details));
    }
    
    /**
     * Застосовує відсоткові модифікатори
     */
    private Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> applyPercentageModifiersWithDetails(
            BigDecimal currentPrice, 
            java.util.List<PriceModifierDTO> modifiers, 
            java.util.Map<String, BigDecimal> rangeModifierPercentages, 
            java.util.List<CalculationDetailsDTO> details) {
        
        // Перетворюємо Java колекції на Vavr колекції
        List<PriceModifierDTO> percentageModifiers = List.ofAll(modifiers).filter(m -> 
            (ModifierType.PERCENTAGE.equals(m.getModifierType()) || ModifierType.RANGE_PERCENTAGE.equals(m.getModifierType()))
            && !"black_light_colors".equals(m.getCode())  // Вже застосовано на кроці 2
            && !"leather_coloring_after_other_cleaning".equals(m.getCode())  // Вже застосовано на кроці 3
        );

        // Функціональний підхід для обробки модифікаторів
        return percentageModifiers.foldLeft(
            Tuple.of(currentPrice, details),
            (acc, modifier) -> {
                BigDecimal priceBefore = acc._1;
                java.util.List<CalculationDetailsDTO> updatedDetails = acc._2;
                
                BigDecimal rangeValue = Option.of(rangeModifierPercentages.get(modifier.getCode()))
                    .getOrNull();
                
                BigDecimal priceAfter = applyModifier(priceBefore, modifier, rangeValue, null);
                
                updatedDetails.add(CalculationDetailsDTO.builder()
                        .step(4)
                        .stepName("Відсоткові модифікатори")
                        .description("Застосування відсоткового модифікатора")
                        .modifierName(modifier.getName())
                        .modifierCode(modifier.getCode())
                        .modifierValue(rangeValue != null ? "+" + rangeValue + "%" : modifier.getChangeDescription())
                        .priceBefore(priceBefore)
                        .priceAfter(priceAfter)
                        .priceDifference(priceAfter.subtract(priceBefore))
                        .build());
                
                return Tuple.of(priceAfter, updatedDetails);
            }
        );
    }
    
    /**
     * Застосовує модифікатори з фіксованою ціною
     */
    private Tuple2<BigDecimal, java.util.List<CalculationDetailsDTO>> applyFixedServiceModifiersWithDetails(
            BigDecimal currentPrice, 
            java.util.List<PriceModifierDTO> modifiers, 
            java.util.Map<String, Integer> fixedModifierQuantities, 
            java.util.List<CalculationDetailsDTO> details) {
        
        // Перетворюємо Java колекції на Vavr колекції
        List<PriceModifierDTO> fixedModifiers = List.ofAll(modifiers).filter(m -> 
            ModifierType.FIXED.equals(m.getModifierType()) || ModifierType.ADDITION.equals(m.getModifierType())
        );
        
        // Функціональний підхід для обробки модифікаторів
        return fixedModifiers.foldLeft(
            Tuple.of(currentPrice, details),
            (acc, modifier) -> {
                BigDecimal priceBefore = acc._1;
                java.util.List<CalculationDetailsDTO> updatedDetails = acc._2;
                
                Integer quantity = Option.of(fixedModifierQuantities.get(modifier.getCode()))
                    .getOrElse(1); // За замовчуванням 1
                
                BigDecimal priceAfter = applyModifier(priceBefore, modifier, null, quantity);
                
                updatedDetails.add(CalculationDetailsDTO.builder()
                        .step(5)
                        .stepName("Фіксовані послуги")
                        .description("Застосування фіксованого модифікатора, кількість: " + quantity)
                        .modifierName(modifier.getName())
                        .modifierCode(modifier.getCode())
                        .modifierValue(modifier.getChangeDescription() + " x " + quantity)
                        .priceBefore(priceBefore)
                        .priceAfter(priceAfter)
                        .priceDifference(priceAfter.subtract(priceBefore))
                        .build());
                
                return Tuple.of(priceAfter, updatedDetails);
            }
        );
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        PriceListItemEntity priceItem = Option.ofOptional(priceListItemRepository.findByCategoryCodeAndItemName(
                categoryCode, itemName))
            .getOrElseThrow(() -> EntityNotFoundException.withMessage(
                    "Не знайдено предмет у прайс-листі для категорії " + categoryCode + 
                    " та найменування " + itemName));
        
        // Перевіряємо колір (чорний/інший)
        if (color != null && 
            color.equalsIgnoreCase(PriceCalculationConstants.COLOR_BLACK) && 
            priceItem.getPriceBlack() != null) {
            return priceItem.getPriceBlack();
        }
        
        return priceItem.getBasePrice();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public java.util.List<String> getAvailableModifiersForCategory(String categoryCode) {
        // Визначаємо категорію модифікаторів на основі категорії послуг
        ModifierCategory modifierCategory = mapServiceToModifierCategory(categoryCode);
        
        // Отримуємо модифікатори для цієї категорії як Vavr колекцію
        List<PriceModifierDTO> modifiers = List.ofAll(modifierService.getModifiersByCategory(modifierCategory));
        
        // Додаємо загальні модифікатори
        if (modifierCategory != ModifierCategory.GENERAL) {
            modifiers = modifiers.appendAll(modifierService.getModifiersByCategory(ModifierCategory.GENERAL));
        }
        
        // Повертаємо лише коди модифікаторів як Java колекцію
        return modifiers.map(PriceModifierDTO::getCode).asJava();
    }
    
    /**
     * Мапуємо категорію послуг на категорію модифікаторів.
     */
    private ModifierCategory mapServiceToModifierCategory(String categoryCode) {
        if (categoryCode == null) {
            return ModifierCategory.GENERAL;
        }
        
        String upperCaseCode = categoryCode.toUpperCase();
        if (List.of("CLOTHING", "IRONING", "PADDING", "DYEING", "LAUNDRY").contains(upperCaseCode)) {
            return ModifierCategory.TEXTILE;
        } else if (List.of("LEATHER", "FUR").contains(upperCaseCode)) {
            return ModifierCategory.LEATHER;
        } else {
            return ModifierCategory.GENERAL;
        }
    }
    
    /**
     * Застосовує модифікатор до ціни на основі його типу.
     */
    private BigDecimal applyModifier(
            BigDecimal price, 
            PriceModifierDTO modifier, 
            BigDecimal rangeValue, 
            Integer fixedQuantity) {
        
        if (price == null) {
            return PriceCalculationConstants.MIN_PRICE;
        }
        
        if (modifier == null) {
            return price;
        }
        
        BigDecimal result;
        
        // Використовуємо switch замість Match з огляду на проблеми з типами
        switch (modifier.getModifierType()) {
            case PERCENTAGE:
                // Відсотковий модифікатор (наприклад, +20% до вартості)
                BigDecimal percentValue = modifier.getValue();
                result = PriceCalculationConstants.applyPercentage(price, percentValue);
                break;
            case RANGE_PERCENTAGE:
                // Модифікатор з діапазоном (наприклад, від +20% до +100%)
                BigDecimal percentToUse = Option.of(rangeValue).getOrElse(() -> 
                    modifier.getMinValue().add(modifier.getMaxValue())
                        .divide(BigDecimal.valueOf(2), PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE)
                );
                result = PriceCalculationConstants.applyPercentage(price, percentToUse);
                break;
            case FIXED:
                // Фіксований модифікатор замінює базову ціну
                result = modifier.getValue();
                break;
            case ADDITION:
                // Додавання фіксованої суми
                BigDecimal valueToAdd = modifier.getValue();
                if (fixedQuantity != null && fixedQuantity > 1) {
                    valueToAdd = valueToAdd.multiply(BigDecimal.valueOf(fixedQuantity));
                }
                result = price.add(valueToAdd);
                break;
            default:
                result = price;
                break;
        }
        
        // Ціна не може бути менше мінімальної
        return result.compareTo(PriceCalculationConstants.MIN_PRICE) < 0 ? 
               PriceCalculationConstants.MIN_PRICE : result;
    }

    /**
     * Повертає рекомендовані модифікатори на основі забруднень та дефектів.
     * 
     * @param stains список плям
     * @param defects список дефектів
     * @param categoryCode код категорії
     * @param materialType тип матеріалу
     * @return список рекомендованих модифікаторів
     */
    @Override
    public java.util.List<PriceModifierDTO> getRecommendedModifiersForItem(
            Set<String> stains, 
            Set<String> defects, 
            String categoryCode, 
            String materialType) {
        
        java.util.List<PriceModifierDTO> recommendedModifiers = new ArrayList<>();
        
        // Отримуємо рекомендації на основі плям
        if (stains != null && !stains.isEmpty()) {
            List<ModifierRecommendationDTO> stainRecommendations = List.ofAll(
                recommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType)
            );
            
            stainRecommendations.forEach(rec -> {
                PriceModifierDTO modifier = modifierService.getModifierByCode(rec.getCode());
                if (modifier != null) {
                    // Якщо є рекомендоване значення, встановлюємо його
                    if (rec.getRecommendedValue() != null) {
                        modifier.setValue(BigDecimal.valueOf(rec.getRecommendedValue()));
                    }
                    recommendedModifiers.add(modifier);
                }
            });
        }
        
        // Отримуємо рекомендації на основі дефектів
        if (defects != null && !defects.isEmpty()) {
            List<ModifierRecommendationDTO> defectRecommendations = List.ofAll(
                recommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType)
            );
            
            defectRecommendations.forEach(rec -> {
                // Перевіряємо, чи вже додано цей модифікатор від плям
                boolean alreadyAdded = recommendedModifiers.stream()
                        .anyMatch(m -> m.getCode().equals(rec.getCode()));
                
                if (!alreadyAdded) {
                    PriceModifierDTO modifier = modifierService.getModifierByCode(rec.getCode());
                    if (modifier != null) {
                        // Якщо є рекомендоване значення, встановлюємо його
                        if (rec.getRecommendedValue() != null) {
                            modifier.setValue(BigDecimal.valueOf(rec.getRecommendedValue()));
                        }
                        recommendedModifiers.add(modifier);
                    }
                }
            });
        }
        
        return recommendedModifiers;
    }
    
    /**
     * Отримує попередження про ризики для предмета.
     * 
     * @param stains список плям
     * @param defects список дефектів
     * @param categoryCode код категорії
     * @param materialType тип матеріалу
     * @return список попереджень
     */
    @Override
    public java.util.List<String> getRiskWarningsForItem(
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
        ServiceCategoryEntity category = Option.ofOptional(serviceCategoryRepository.findByCode(categoryCode))
            .getOrElseThrow(() -> EntityNotFoundException.withMessage("Категорія з кодом " + categoryCode + " не знайдена"));
        
        // Делегуємо отримання рекомендованої одиниці виміру до профільного сервісу
        return unitOfMeasureService.getRecommendedUnitOfMeasure(category.getId(), itemName);
    }
} 