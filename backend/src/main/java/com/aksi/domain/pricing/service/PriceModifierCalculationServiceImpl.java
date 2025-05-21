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
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;
import com.aksi.domain.pricing.exception.InvalidPriceCalculationParameterException;
import com.aksi.domain.pricing.exception.PriceCalculationException;
import com.aksi.domain.pricing.model.PriceCalculationParams;
import com.aksi.domain.pricing.strategy.PriceModifierManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для обчислень, пов'язаних з модифікаторами цін.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceModifierCalculationServiceImpl implements PriceModifierCalculationService {

    private final PriceModifierManager priceModifierManager;

    /**
     * {@inheritDoc}.
     */
    /**
     * Застосовує всі модифікатори до ціни у правильному порядку з використанням доменного об'єкта параметрів.
     * 
     * @param params Доменний об'єкт з усіма параметрами для обчислення ціни
     * @return Фінальна ціна після застосування всіх модифікаторів
     */
    @Override
    public BigDecimal calculatePrice(PriceCalculationParams params) {
        // Валідація параметрів
        validateCalculationParams(params);
        
        try {
            // Послідовне застосування модифікаторів
            BigDecimal currentPrice = params.getBasePrice();
            
            // Модифікатори кольору
            currentPrice = applyColorModifiers(
                    currentPrice, 
                    params.getModifiers(), 
                    params.getColor(), 
                    params.getCalculationDetails());
            
            // Особливі модифікатори
            currentPrice = applySpecialModifiers(
                    currentPrice, 
                    params.getModifiers(), 
                    params.getCalculationDetails());
            
            // Відсоткові модифікатори
            currentPrice = applyPercentageModifiers(
                    currentPrice, 
                    params.getModifiers(), 
                    params.getRangeModifierValues(), 
                    params.getCalculationDetails());
            
            // Фіксовані модифікатори
            currentPrice = applyFixedServiceModifiers(
                    currentPrice, 
                    params.getModifiers(), 
                    params.getFixedModifierQuantities(), 
                    params.getCalculationDetails());
            
            // Модифікатор терміновості
            currentPrice = applyExpediteModifier(
                    currentPrice, 
                    params.isExpedited(), 
                    params.getExpediteFactor(), 
                    params.getCategoryCode(), 
                    params.getCalculationDetails());
            
            return currentPrice;
        } catch (Exception e) {
            // Перехоплення та обробка помилок
            return handleCalculationError(e);
        }
    }
    
    /**
     * Валідує параметри для розрахунку ціни
     * 
     * @param params параметри для валідації
     * @throws InvalidPriceCalculationParameterException якщо параметри недійсні
     */
    private void validateCalculationParams(PriceCalculationParams params) {
        if (params == null) {
            throw new InvalidPriceCalculationParameterException("Calculation parameters cannot be null");
        }
        
        if (params.getBasePrice() == null) {
            throw new InvalidPriceCalculationParameterException("Base price cannot be null");
        }
        
        if (params.getModifiers() == null) {
            throw new InvalidPriceCalculationParameterException("Modifiers list cannot be null");
        }
        
        if (params.getCalculationDetails() == null) {
            throw new InvalidPriceCalculationParameterException("Calculation details list cannot be null");
        }
        
        if (params.getRangeModifierValues() == null) {
            throw new InvalidPriceCalculationParameterException("Range modifier values map cannot be null");
        }
        
        if (params.getFixedModifierQuantities() == null) {
            throw new InvalidPriceCalculationParameterException("Fixed modifier quantities map cannot be null");
        }
    }
    
    /**
     * Обробляє помилки, що виникають під час розрахунку ціни
     * 
     * @param e виняток, що виник
     * @return ніколи не повертає значення, завжди кидає виняток
     * @throws PriceCalculationException перетворений виняток
     */
    private BigDecimal handleCalculationError(Exception e) {
        if (e == null) {
            log.error("Unexpected null exception during price calculation");
            throw new PriceCalculationException("Error during price calculation: null exception");
        }
        
        if (!(e instanceof PriceCalculationException)) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error";
            log.error("Unexpected error during price calculation: {}", errorMessage, e);
            throw new PriceCalculationException("Error during price calculation: " + errorMessage, e);
        }
        throw (PriceCalculationException) e;
    }

    /**
     * {@inheritDoc}
     * 
     * @deprecated Використовуйте метод calculatePrice(PriceCalculationParams) замість цього
     */
    @Override
    @Deprecated
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
            
        // Створюємо об'єкт параметрів і використовуємо новий метод
        PriceCalculationParams params = PriceCalculationParams.builder()
                .basePrice(basePrice)
                .modifiers(modifiers)
                .color(color)
                .rangeModifierValues(rangeModifierValues)
                .fixedModifierQuantities(fixedModifierQuantities)
                .expedited(isExpedited)
                .expediteFactor(expediteFactor)
                .categoryCode(categoryCode)
                .calculationDetails(calculationDetails)
                .build();
        
        return calculatePrice(params);
    }

    /**
     * {@inheritDoc}.
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

            addCalculationDetail(
                calculationDetails,
                2,
                "Перевірка кольору",
                "Застосування модифікатора для кольору: " + color,
                modifier,
                modifier.getChangeDescription(),
                priceBefore,
                priceAfter
            );

            return priceAfter;
        }

        return currentPrice;
    }

    /**
     * {@inheritDoc}.
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

            addCalculationDetail(
                calculationDetails,
                3,
                "Особливі модифікатори",
                "Застосування особливого модифікатора, який заміняє базову ціну",
                modifier,
                modifier.getChangeDescription(),
                priceBefore,
                priceAfter
            );

            return priceAfter;
        }

        return currentPrice;
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public BigDecimal applyPercentageModifiers(
            BigDecimal currentPrice,
            List<PriceModifierDTO> modifiers,
            Map<String, BigDecimal> rangeModifierPercentages,
            List<CalculationDetailsDTO> calculationDetails) {

        BigDecimal result = currentPrice;

        // Фільтруємо лише відсоткові модифікатори
        List<PriceModifierDTO> percentageModifiers = filterPercentageModifiers(modifiers);

        for (PriceModifierDTO modifier : percentageModifiers) {
            BigDecimal rangeValue = rangeModifierPercentages.get(modifier.getCode());
            BigDecimal priceBefore = result;
            BigDecimal priceAfter = applyModifier(result, modifier, rangeValue, null);

            String modifierValue = rangeValue != null ? "+" + rangeValue + "%" : modifier.getChangeDescription();

            addCalculationDetail(
                calculationDetails,
                4,
                "Відсоткові модифікатори",
                "Застосування відсоткового модифікатора",
                modifier,
                modifierValue,
                priceBefore,
                priceAfter
            );

            result = priceAfter;
        }

        return result;
    }

    /**
     * Фільтрує список модифікаторів, залишаючи тільки відсоткові.
     * @param modifiers список всіх модифікаторів
     * @return відфільтрований список відсоткових модифікаторів
     */
    private List<PriceModifierDTO> filterPercentageModifiers(List<PriceModifierDTO> modifiers) {
        return modifiers.stream()
                .filter(m -> ModifierType.PERCENTAGE.equals(m.getModifierType())
                    || ModifierType.RANGE_PERCENTAGE.equals(m.getModifierType()))
                .filter(m -> !"black_light_colors".equals(m.getCode()))  // Вже застосовано на кроці 2
                .filter(m -> !"leather_coloring_after_other_cleaning".equals(m.getCode()))  // Вже застосовано на кроці 3
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public BigDecimal applyFixedServiceModifiers(
            BigDecimal currentPrice,
            List<PriceModifierDTO> modifiers,
            Map<String, Integer> fixedModifierQuantities,
            List<CalculationDetailsDTO> calculationDetails) {

        BigDecimal result = currentPrice;

        // Фільтруємо лише фіксовані модифікатори
        List<PriceModifierDTO> fixedModifiers = filterFixedModifiers(modifiers);

        for (PriceModifierDTO modifier : fixedModifiers) {
            Integer quantity = fixedModifierQuantities.getOrDefault(modifier.getCode(), 1);

            BigDecimal priceBefore = result;
            BigDecimal priceAfter = applyModifier(result, modifier, null, quantity);

            String modifierValue = modifier.getChangeDescription() + " x " + quantity;

            addCalculationDetail(
                calculationDetails,
                5,
                "Фіксовані послуги",
                "Застосування фіксованого модифікатора, кількість: " + quantity,
                modifier,
                modifierValue,
                priceBefore,
                priceAfter
            );

            result = priceAfter;
        }

        return result;
    }

    /**
     * Фільтрує список модифікаторів, залишаючи тільки фіксовані.
     * @param modifiers список всіх модифікаторів
     * @return відфільтрований список фіксованих модифікаторів
     */
    private List<PriceModifierDTO> filterFixedModifiers(List<PriceModifierDTO> modifiers) {
        return modifiers.stream()
                .filter(m -> ModifierType.FIXED.equals(m.getModifierType()) || ModifierType.ADDITION.equals(m.getModifierType()))
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}.
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

            // Використовуємо спрощену версію методу addCalculationDetail
            addCalculationDetail(
                    calculationDetails,
                    6,
                    "Терміновість",
                    "Застосування коефіцієнта терміновості: +" + expediteFactor + "%",
                    priceBefore,
                    priceAfter,
                    expediteFactor + "%");

            return priceAfter;
        } else if (isExpedited && !canBeExpedited) {
            // Додаємо інформацію, що категорія не підтримує терміновість
            addCalculationDetail(
                    calculationDetails,
                    6,
                    "Терміновість",
                    "Категорія " + categoryCode + " не підтримує терміновість",
                    currentPrice,
                    currentPrice,
                    null);
        }

        return currentPrice;
    }

    /**
     * Додає деталі обчислення у список деталей обчислення з усіма необхідними параметрами.
     * @param calculationDetails список деталей обчислення для доповнення
     * @param step крок обчислення
     * @param stepName назва кроку
     * @param description опис операції
     * @param modifier модифікатор ціни
     * @param modifierValue значення модифікатора
     * @param priceBefore ціна до застосування модифікатора
     * @param priceAfter ціна після застосування модифікатора
     */
    private void addCalculationDetail(
            List<CalculationDetailsDTO> calculationDetails,
            int step,
            String stepName,
            String description,
            PriceModifierDTO modifier,
            String modifierValue,
            BigDecimal priceBefore,
            BigDecimal priceAfter) {

        CalculationDetailsDTO.CalculationDetailsDTOBuilder builder = CalculationDetailsDTO.builder()
                .step(step)
                .stepName(stepName)
                .description(description)
                .priceBefore(priceBefore)
                .priceAfter(priceAfter)
                .priceDifference(priceAfter.subtract(priceBefore));
        
        // Додаємо інформацію про модифікатор, якщо він існує
        if (modifier != null) {
            builder.modifierName(modifier.getName())
                   .modifierCode(modifier.getCode())
                   .modifierValue(modifierValue);
        } else if (modifierValue != null) {
            builder.modifierValue(modifierValue);
        }
        
        calculationDetails.add(builder.build());
    }

    /**
     * Спрощена версія методу addCalculationDetail без модифікатора.
     * @param calculationDetails список деталей обчислення для доповнення
     * @param step крок обчислення
     * @param stepName назва кроку
     * @param description опис операції
     * @param priceBefore ціна до застосування модифікатора
     * @param priceAfter ціна після застосування модифікатора
     * @param modifierValue опціональне значення модифікатора
     */
    private void addCalculationDetail(
            List<CalculationDetailsDTO> calculationDetails,
            int step,
            String stepName,
            String description,
            BigDecimal priceBefore,
            BigDecimal priceAfter,
            String modifierValue) {

        addCalculationDetail(calculationDetails, step, stepName, description, 
                         null, modifierValue, priceBefore, priceAfter);
    }

    /**
     * {@inheritDoc}.
     *
     * Використовує патерн "Стратегія" для вибору та застосування відповідного модифікатора ціни.
     */
    @Override
    public BigDecimal applyModifier(
            BigDecimal price,
            PriceModifierDTO modifier,
            BigDecimal rangeValue,
            Integer fixedQuantity) {

        // Використовуємо стратегію для вибору та застосування відповідного модифікатора
        return priceModifierManager.applyModifier(price, modifier, rangeValue, fixedQuantity);
    }
}
