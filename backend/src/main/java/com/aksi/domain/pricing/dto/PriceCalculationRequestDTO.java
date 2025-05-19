package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на розрахунок ціни з урахуванням модифікаторів.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceCalculationRequestDTO {

    /**
     * Код категорії послуги.
     */
    @NotBlank(message = "Код категорії обов'язковий")
    private String categoryCode;

    /**
     * Найменування предмету з прайс-листа.
     */
    @NotBlank(message = "Найменування предмету обов'язкове")
    private String itemName;

    /**
     * Кількість предметів.
     */
    @NotNull(message = "Кількість предметів обов'язкова")
    @Positive(message = "Кількість має бути більше нуля")
    private Integer quantity;

    /**
     * Список ID модифікаторів, які потрібно застосувати до ціни.
     * Можуть бути загальними або специфічними для категорії.
     */
    private List<String> modifierIds;

    /**
     * Значення відсотка для модифікаторів з діапазоном значень.
     * Ключ - ID модифікатора, значення - вибраний відсоток.
     */
    private List<RangeModifierValueDTO> rangeModifierValues;

    /**
     * Кількість для модифікаторів з фіксованою ціною.
     * Наприклад, кількість гудзиків для пришивання.
     * Ключ - ID модифікатора, значення - кількість.
     */
    private List<FixedModifierQuantityDTO> fixedModifierQuantities;

    /**
     * DTO для значення відсотка в діапазоні.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RangeModifierValueDTO {
        /**
         * ID модифікатора.
         */
        @NotBlank(message = "ID модифікатора обов'язковий")
        private String modifierId;

        /**
         * Вибраний відсоток.
         */
        @NotNull(message = "Відсоток обов'язковий")
        private BigDecimal percentage;
    }

    /**
     * DTO для кількості для модифікаторів з фіксованою ціною.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FixedModifierQuantityDTO {
        /**
         * ID модифікатора.
         */
        @NotBlank(message = "ID модифікатора обов'язковий")
        private String modifierId;

        /**
         * Кількість.
         */
        @NotNull(message = "Кількість обов'язкова")
        @Positive(message = "Кількість має бути більше нуля")
        private Integer quantity;
    }
}
