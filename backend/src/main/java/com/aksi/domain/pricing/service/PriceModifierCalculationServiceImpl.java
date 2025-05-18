package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.model.NonExpeditableCategory;
import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для обчислень, пов'язаних з модифікаторами цін.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceModifierCalculationServiceImpl implements PriceModifierCalculationService {

    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applyAllModifiers(
            BigDecimal basePrice,
            List<PriceModifierDTO> modifiers,
            String color,
            Map<String, BigDecimal> rangeModifierValues,
            Map<String, Integer> fixedModifierQuantities,
            boolean isExpedited,
            BigDecimal expediteFactor,
            String categoryCode,
            List<CalculationDetailsDTO> calculationDetails) {
        
        BigDecimal currentPrice = basePrice;
        
        // Крок 2: Перевірка кольорових виробів
        currentPrice = applyColorModifiers(currentPrice, modifiers, color, calculationDetails);
        
        // Крок 3: Застосування особливих модифікаторів
        currentPrice = applySpecialModifiers(currentPrice, modifiers, calculationDetails);
        
        // Крок 4: Застосування множників (відсоткових модифікаторів)
        currentPrice = applyPercentageModifiers(currentPrice, modifiers, rangeModifierValues, calculationDetails);
        
        // Крок 5: Додавання фіксованих послуг
        currentPrice = applyFixedServiceModifiers(currentPrice, modifiers, fixedModifierQuantities, calculationDetails);
        
        // Крок 6: Застосування терміновості
        currentPrice = applyExpediteModifier(currentPrice, isExpedited, expediteFactor, categoryCode, calculationDetails);
        
        return currentPrice;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applyColorModifiers(
            BigDecimal currentPrice, 
            List<PriceModifierDTO> modifiers, 
            String color, 
            List<CalculationDetailsDTO> calculationDetails) {
        
        // Перевіряємо чи є модифікатор для кольору
        Optional<PriceModifierDTO> blackLightColorModifier = modifiers.stream()
                .filter(m -> "black_light_colors".equals(m.getCode()))
                .findFirst();
        
        if (blackLightColorModifier.isPresent() && color != null && 
                (color.equalsIgnoreCase(PriceCalculationConstants.COLOR_BLACK) || 
                 color.equalsIgnoreCase(PriceCalculationConstants.COLOR_WHITE))) {
            
            PriceModifierDTO modifier = blackLightColorModifier.get();
            BigDecimal priceBefore = currentPrice;
            BigDecimal priceAfter = applyModifier(currentPrice, modifier, null, null);
            
            calculationDetails.add(CalculationDetailsDTO.builder()
                    .step(2)
                    .stepName("Перевірка кольору")
                    .description("Застосування модифікатора для кольору: " + color)
                    .modifierName(modifier.getName())
                    .modifierCode(modifier.getCode())
                    .modifierValue(modifier.getChangeDescription())
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .priceDifference(priceAfter.subtract(priceBefore))
                    .build());
            
            return priceAfter;
        }
        
        return currentPrice;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applySpecialModifiers(
            BigDecimal currentPrice, 
            List<PriceModifierDTO> modifiers, 
            List<CalculationDetailsDTO> calculationDetails) {
        
        // Особливі модифікатори, які змінюють базову ціну повністю (наприклад, "Фарбування після чистки деінде")
        Optional<PriceModifierDTO> specialModifier = modifiers.stream()
                .filter(m -> "leather_coloring_after_other_cleaning".equals(m.getCode()))
                .findFirst();
        
        if (specialModifier.isPresent()) {
            PriceModifierDTO modifier = specialModifier.get();
            BigDecimal priceBefore = currentPrice;
            BigDecimal priceAfter = applyModifier(currentPrice, modifier, null, null);
            
            calculationDetails.add(CalculationDetailsDTO.builder()
                    .step(3)
                    .stepName("Особливі модифікатори")
                    .description("Застосування особливого модифікатора, який заміняє базову ціну")
                    .modifierName(modifier.getName())
                    .modifierCode(modifier.getCode())
                    .modifierValue(modifier.getChangeDescription())
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .priceDifference(priceAfter.subtract(priceBefore))
                    .build());
            
            return priceAfter;
        }
        
        return currentPrice;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applyPercentageModifiers(
            BigDecimal currentPrice, 
            List<PriceModifierDTO> modifiers, 
            Map<String, BigDecimal> rangeModifierPercentages, 
            List<CalculationDetailsDTO> calculationDetails) {
        
        BigDecimal result = currentPrice;
        
        // Фільтруємо лише відсоткові модифікатори
        List<PriceModifierDTO> percentageModifiers = modifiers.stream()
                .filter(m -> ModifierType.PERCENTAGE.equals(m.getModifierType()) 
                    || ModifierType.RANGE_PERCENTAGE.equals(m.getModifierType()))
                .filter(m -> !"black_light_colors".equals(m.getCode()))  // Вже застосовано на кроці 2
                .filter(m -> !"leather_coloring_after_other_cleaning".equals(m.getCode()))  // Вже застосовано на кроці 3
                .collect(Collectors.toList());
        
        for (PriceModifierDTO modifier : percentageModifiers) {
            BigDecimal rangeValue = rangeModifierPercentages.get(modifier.getCode());
            BigDecimal priceBefore = result;
            BigDecimal priceAfter = applyModifier(result, modifier, rangeValue, null);
            
            calculationDetails.add(CalculationDetailsDTO.builder()
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
            
            result = priceAfter;
        }
        
        return result;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applyFixedServiceModifiers(
            BigDecimal currentPrice, 
            List<PriceModifierDTO> modifiers, 
            Map<String, Integer> fixedModifierQuantities, 
            List<CalculationDetailsDTO> calculationDetails) {
        
        BigDecimal result = currentPrice;
        
        // Фільтруємо лише фіксовані модифікатори
        List<PriceModifierDTO> fixedModifiers = modifiers.stream()
                .filter(m -> ModifierType.FIXED.equals(m.getModifierType()) || ModifierType.ADDITION.equals(m.getModifierType()))
                .collect(Collectors.toList());
        
        for (PriceModifierDTO modifier : fixedModifiers) {
            Integer quantity = fixedModifierQuantities.get(modifier.getCode());
            if (quantity == null) {
                quantity = 1; // За замовчуванням
            }
            
            BigDecimal priceBefore = result;
            BigDecimal priceAfter = applyModifier(result, modifier, null, quantity);
            
            calculationDetails.add(CalculationDetailsDTO.builder()
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
            
            result = priceAfter;
        }
        
        return result;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applyExpediteModifier(
            BigDecimal currentPrice,
            boolean isExpedited,
            BigDecimal expediteFactor,
            String categoryCode,
            List<CalculationDetailsDTO> calculationDetails) {
        
        // Перевіряємо, чи категорія може мати терміновість
        boolean canBeExpedited = !NonExpeditableCategory.isNonExpeditable(categoryCode);
        
        if (isExpedited && expediteFactor != null && expediteFactor.compareTo(BigDecimal.ZERO) > 0 && canBeExpedited) {
            BigDecimal priceBefore = currentPrice;
            BigDecimal priceAfter = PriceCalculationConstants.applyPercentage(currentPrice, expediteFactor);
            
            calculationDetails.add(CalculationDetailsDTO.builder()
                    .step(6)
                    .stepName("Терміновість")
                    .description("Застосування коефіцієнта терміновості: +" + expediteFactor + "%")
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .priceDifference(priceAfter.subtract(priceBefore))
                    .build());
            
            return priceAfter;
        } else if (isExpedited && !canBeExpedited) {
            // Додаємо інформацію, що категорія не підтримує терміновість
            calculationDetails.add(CalculationDetailsDTO.builder()
                    .step(6)
                    .stepName("Терміновість")
                    .description("Категорія " + categoryCode + " не підтримує терміновість")
                    .priceBefore(currentPrice)
                    .priceAfter(currentPrice)
                    .priceDifference(BigDecimal.ZERO)
                    .build());
        }
        
        return currentPrice;
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public BigDecimal applyModifier(
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
        
        BigDecimal result = switch (modifier.getModifierType()) {
            case PERCENTAGE -> {
                // Відсотковий модифікатор (наприклад, +20% до вартості)
                BigDecimal percentValue = modifier.getValue();
                yield PriceCalculationConstants.applyPercentage(price, percentValue);
            }
            case RANGE_PERCENTAGE -> {
                // Модифікатор з діапазоном (наприклад, від +20% до +100%)
                BigDecimal percentToUse;
                if (rangeValue != null) {
                    // Використовуємо вказане значення
                    percentToUse = rangeValue;
                } else {
                    // За замовчуванням беремо середнє значення діапазону
                    percentToUse = modifier.getMinValue().add(modifier.getMaxValue())
                            .divide(BigDecimal.valueOf(2), PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);
                }
                yield PriceCalculationConstants.applyPercentage(price, percentToUse);
            }
            case FIXED -> modifier.getValue(); // Фіксований модифікатор замінює базову ціну
            case ADDITION -> {
                // Додавання фіксованої суми
                BigDecimal valueToAdd = modifier.getValue();
                if (fixedQuantity != null && fixedQuantity > 1) {
                    valueToAdd = valueToAdd.multiply(new BigDecimal(fixedQuantity));
                }
                yield price.add(valueToAdd);
            }
            default -> price;
        };
        
        // Ціна не може бути менше мінімальної
        return result.compareTo(PriceCalculationConstants.MIN_PRICE) < 0 ? PriceCalculationConstants.MIN_PRICE : result;
    }
} 