package com.aksi.ui.wizard.step2.substeps.pricing_calculator.domain;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану розрахунку ціни предмета.
 * Відповідає за бізнес-логіку розрахунку та валідацію.
 */
@Data
@Builder
@Slf4j
public class PriceCalculationState {

    private final String itemCategory;
    private final String itemName;
    private final BigDecimal basePrice;
    private final Set<PriceModifierDTO> selectedModifiers;
    private final BigDecimal finalPrice;
    private final List<CalculationDetailsDTO> calculationDetails;
    private final boolean isValid;

    /**
     * Створює новий стан розрахунку з базовою ціною.
     */
    public static PriceCalculationState createInitial(String itemCategory, String itemName, BigDecimal basePrice) {
        log.debug("Створюється початковий стан розрахунку для {} - {}, базова ціна: {}",
                 itemCategory, itemName, basePrice);

        return PriceCalculationState.builder()
                .itemCategory(itemCategory)
                .itemName(itemName)
                .basePrice(basePrice != null ? basePrice : BigDecimal.ZERO)
                .selectedModifiers(Set.of())
                .finalPrice(basePrice != null ? basePrice : BigDecimal.ZERO)
                .calculationDetails(List.of())
                .isValid(basePrice != null && basePrice.compareTo(BigDecimal.ZERO) > 0)
                .build();
    }

    /**
     * Створює новий стан з оновленими модифікаторами.
     */
    public PriceCalculationState withModifiers(Set<PriceModifierDTO> modifiers,
                                              BigDecimal calculatedPrice,
                                              List<CalculationDetailsDTO> details) {
        log.debug("Оновлюється стан з {} модифікаторами, нова ціна: {}",
                 modifiers.size(), calculatedPrice);

        return PriceCalculationState.builder()
                .itemCategory(this.itemCategory)
                .itemName(this.itemName)
                .basePrice(this.basePrice)
                .selectedModifiers(Set.copyOf(modifiers))
                .finalPrice(calculatedPrice)
                .calculationDetails(List.copyOf(details))
                .isValid(isValidCalculation(calculatedPrice))
                .build();
    }

    /**
     * Перевіряє валідність розрахунку.
     */
    private boolean isValidCalculation(BigDecimal price) {
        return price != null &&
               price.compareTo(BigDecimal.ZERO) >= 0 &&
               basePrice != null &&
               basePrice.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Повертає кількість вибраних модифікаторів.
     */
    public int getModifiersCount() {
        return selectedModifiers.size();
    }

    /**
     * Перевіряє чи є вибрані модифікатори.
     */
    public boolean hasModifiers() {
        return !selectedModifiers.isEmpty();
    }

    /**
     * Обчислює різницю між фінальною та базовою ціною.
     */
    public BigDecimal getPriceDifference() {
        return finalPrice.subtract(basePrice);
    }

    /**
     * Обчислює відсоток зміни ціни.
     */
    public BigDecimal getPriceChangePercentage() {
        if (basePrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return getPriceDifference()
                .divide(basePrice, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}
