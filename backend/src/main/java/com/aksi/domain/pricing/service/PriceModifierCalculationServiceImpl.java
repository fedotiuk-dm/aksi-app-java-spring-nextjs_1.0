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
     * Фільтрує список модифікаторів, залишаючи тільки відсоткові
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
     * Фільтрує список модифікаторів, залишаючи тільки фіксовані
     * @param modifiers список всіх модифікаторів
     * @return відфільтрований список фіксованих модифікаторів
     */
    private List<PriceModifierDTO> filterFixedModifiers(List<PriceModifierDTO> modifiers) {
        return modifiers.stream()
                .filter(m -> ModifierType.FIXED.equals(m.getModifierType()) || ModifierType.ADDITION.equals(m.getModifierType()))
                .collect(Collectors.toList());
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

            // Створюємо запис для деталей обчислення
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
     * Додає деталі обчислення у список деталей обчислення з усіма необхідними параметрами
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

        calculationDetails.add(CalculationDetailsDTO.builder()
                .step(step)
                .stepName(stepName)
                .description(description)
                .modifierName(modifier.getName())
                .modifierCode(modifier.getCode())
                .modifierValue(modifierValue)
                .priceBefore(priceBefore)
                .priceAfter(priceAfter)
                .priceDifference(priceAfter.subtract(priceBefore))
                .build());
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
