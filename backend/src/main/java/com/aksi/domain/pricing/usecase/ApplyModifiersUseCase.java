package com.aksi.domain.pricing.usecase;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.model.PriceCalculationParams;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;
import com.aksi.domain.pricing.service.PriceModifierCalculationService;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use Case для застосування модифікаторів до базової ціни.
 * Реалізує бізнес-логіку розрахунку впливу модифікаторів на ціну.
 */
@Component
@RequiredArgsConstructor
@Validated
@Slf4j
public class ApplyModifiersUseCase {

    private final PriceModifierCalculationService modifierCalculationService;
    private final CatalogPriceModifierService catalogModifierService;

    /**
     * Виконати застосування модифікаторів до базової ціни.
     *
     * @param request Запит на застосування модифікаторів
     * @return Результат застосування модифікаторів
     */
    public ModifiersResult execute(@NotNull ModifiersRequest request) {
        log.debug("Застосовуємо модифікатори до базової ціни {} для категорії {}",
                request.basePrice(), request.categoryCode());

        if (request.modifierCodes() == null || request.modifierCodes().isEmpty()) {
            log.debug("Модифікатори відсутні, повертаємо базову ціну");
            return new ModifiersResult(
                    request.basePrice(),
                    BigDecimal.ZERO,
                    List.of()
            );
        }

        try {
            // Отримуємо модифікатори з каталогу
            List<PriceModifierDTO> modifiers = catalogModifierService.getModifiersByCodes(request.modifierCodes());

            // Перетворюємо параметри для розрахунку
            Map<String, BigDecimal> rangeModifierValues = convertRangeModifierValues(request.rangeModifierValues());
            Map<String, Integer> fixedModifierQuantities = convertFixedModifierQuantities(request.fixedModifierQuantities());

            // Створюємо список деталей розрахунку
            List<CalculationDetailsDTO> calculationDetails = new ArrayList<>();

            // Створюємо параметри для розрахунку модифікаторів
            PriceCalculationParams params = PriceCalculationParams.builder()
                    .basePrice(request.basePrice())
                    .modifiers(modifiers)
                    .categoryCode(request.categoryCode())
                    .rangeModifierValues(rangeModifierValues)
                    .fixedModifierQuantities(fixedModifierQuantities)
                    .expedited(false) // В цьому Use Case не обробляємо терміновість
                    .expediteFactor(BigDecimal.ZERO)
                    .calculationDetails(calculationDetails)
                    .build();

            // Розраховуємо модифікатори
            BigDecimal finalPrice = modifierCalculationService.calculatePrice(params);
            BigDecimal modifiersTotal = finalPrice.subtract(request.basePrice());

            log.debug("Застосовано {} модифікаторів, загальна надбавка: {}",
                    modifiers.size(), modifiersTotal);

            return new ModifiersResult(
                    finalPrice,
                    modifiersTotal,
                    calculationDetails
            );

        } catch (Exception e) {
            log.error("Помилка при застосуванні модифікаторів: {}", e.getMessage());
            throw new IllegalArgumentException("Не вдалося застосувати модифікатори", e);
        }
    }

    /**
     * Перетворює список RangeModifierValue в Map.
     */
    private Map<String, BigDecimal> convertRangeModifierValues(List<RangeModifierValue> rangeModifierValues) {
        if (rangeModifierValues == null) {
            return Collections.emptyMap();
        }

        Map<String, BigDecimal> result = new HashMap<>();
        for (RangeModifierValue value : rangeModifierValues) {
            result.put(value.modifierCode(), value.value());
        }
        return result;
    }

    /**
     * Перетворює список FixedModifierQuantity в Map.
     */
    private Map<String, Integer> convertFixedModifierQuantities(List<FixedModifierQuantity> fixedModifierQuantities) {
        if (fixedModifierQuantities == null) {
            return Collections.emptyMap();
        }

        Map<String, Integer> result = new HashMap<>();
        for (FixedModifierQuantity quantity : fixedModifierQuantities) {
            result.put(quantity.modifierCode(), quantity.quantity());
        }
        return result;
    }

    /**
     * Запит на застосування модифікаторів.
     */
    public record ModifiersRequest(
            @NotNull BigDecimal basePrice,
            String categoryCode,
            List<String> modifierCodes,
            List<RangeModifierValue> rangeModifierValues,
            List<FixedModifierQuantity> fixedModifierQuantities
    ) {}

    /**
     * Результат застосування модифікаторів.
     */
    public record ModifiersResult(
            BigDecimal finalPrice,
            BigDecimal modifiersTotal,
            List<CalculationDetailsDTO> appliedModifiers
    ) {}
}
