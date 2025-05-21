package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.model.PriceCalculationParams;

/**
 * Інтерфейс сервісу для обчислень, пов'язаних з модифікаторами цін.
 */
public interface PriceModifierCalculationService {

    /**
     * Застосовує всі модифікатори до ціни у правильному порядку з використанням доменного об'єкта параметрів.
     * 
     * @param params Доменний об'єкт з усіма параметрами для обчислення ціни
     * @return Фінальна ціна після застосування всіх модифікаторів
     */
    BigDecimal calculatePrice(PriceCalculationParams params);
    
    /**
     * Застосовує всі модифікатори до ціни у правильному порядку.
     * 
     * @deprecated Використовуйте метод calculatePrice(PriceCalculationParams) замість цього
     * @param basePrice Початкова ціна
     * @param modifiers Список модифікаторів
     * @param color Колір предмета
     * @param rangeModifierValues Мапа значень для діапазонних модифікаторів
     * @param fixedModifierQuantities Мапа кількостей для фіксованих модифікаторів
     * @param isExpedited Чи термінове замовлення
     * @param expediteFactor Коефіцієнт терміновості
     * @param categoryCode Код категорії послуг
     * @param calculationDetails Список для деталей розрахунку
     * @return Фінальна ціна після застосування модифікаторів
     */
    @Deprecated
    BigDecimal applyAllModifiers(
            BigDecimal basePrice,
            List<PriceModifierDTO> modifiers,
            String color,
            Map<String, BigDecimal> rangeModifierValues,
            Map<String, Integer> fixedModifierQuantities,
            boolean isExpedited,
            BigDecimal expediteFactor,
            String categoryCode,
            List<CalculationDetailsDTO> calculationDetails);

    /**
     * Застосовує модифікатори кольору, якщо потрібно.
     *
     * @param currentPrice Поточна ціна
     * @param modifiers Список модифікаторів
     * @param color Колір предмета
     * @param calculationDetails Список для деталей розрахунку
     * @return Ціна після застосування модифікаторів кольору
     */
    BigDecimal applyColorModifiers(
            BigDecimal currentPrice,
            List<PriceModifierDTO> modifiers,
            String color,
            List<CalculationDetailsDTO> calculationDetails);

    /**
     * Застосовує особливі модифікатори, які можуть замінити базову ціну.
     *
     * @param currentPrice Поточна ціна
     * @param modifiers Список модифікаторів
     * @param calculationDetails Список для деталей розрахунку
     * @return Ціна після застосування особливих модифікаторів
     */
    BigDecimal applySpecialModifiers(
            BigDecimal currentPrice,
            List<PriceModifierDTO> modifiers,
            List<CalculationDetailsDTO> calculationDetails);

    /**
     * Застосовує відсоткові модифікатори.
     *
     * @param currentPrice Поточна ціна
     * @param modifiers Список модифікаторів
     * @param rangeModifierPercentages Мапа значень для діапазонних модифікаторів
     * @param calculationDetails Список для деталей розрахунку
     * @return Ціна після застосування відсоткових модифікаторів
     */
    BigDecimal applyPercentageModifiers(
            BigDecimal currentPrice,
            List<PriceModifierDTO> modifiers,
            Map<String, BigDecimal> rangeModifierPercentages,
            List<CalculationDetailsDTO> calculationDetails);

    /**
     * Застосовує модифікатори з фіксованою ціною.
     *
     * @param currentPrice Поточна ціна
     * @param modifiers Список модифікаторів
     * @param fixedModifierQuantities Мапа кількостей для фіксованих модифікаторів
     * @param calculationDetails Список для деталей розрахунку
     * @return Ціна після застосування фіксованих модифікаторів
     */
    BigDecimal applyFixedServiceModifiers(
            BigDecimal currentPrice,
            List<PriceModifierDTO> modifiers,
            Map<String, Integer> fixedModifierQuantities,
            List<CalculationDetailsDTO> calculationDetails);

    /**
     * Застосовує модифікатор терміновості, якщо потрібно.
     *
     * @param currentPrice Поточна ціна
     * @param isExpedited Чи термінове замовлення
     * @param expediteFactor Коефіцієнт терміновості
     * @param categoryCode Код категорії послуг
     * @param calculationDetails Список для деталей розрахунку
     * @return Ціна після застосування модифікатора терміновості
     */
    BigDecimal applyExpediteModifier(
            BigDecimal currentPrice,
            boolean isExpedited,
            BigDecimal expediteFactor,
            String categoryCode,
            List<CalculationDetailsDTO> calculationDetails);

    /**
     * Застосовує модифікатор до ціни на основі його типу.
     *
     * @param price Поточна ціна
     * @param modifier Модифікатор
     * @param rangeValue Значення для діапазонного модифікатора
     * @param fixedQuantity Кількість для фіксованого модифікатора
     * @return Ціна після застосування модифікатора
     */
    BigDecimal applyModifier(
            BigDecimal price,
            PriceModifierDTO modifier,
            BigDecimal rangeValue,
            Integer fixedQuantity);
}
