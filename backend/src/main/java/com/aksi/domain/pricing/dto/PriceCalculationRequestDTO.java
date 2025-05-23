package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.domain.pricing.constants.PricingConstants;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
@Schema(description = "Запит на розрахунок ціни предмету з модифікаторами")
public class PriceCalculationRequestDTO {

    /**
     * Код категорії послуги.
     */
    @Schema(
        description = "Код категорії послуги",
        example = "CLOTHING",
        pattern = "^[A-Z_]+$"
    )
    @NotBlank(message = "Код категорії обов'язковий")
    @Pattern(regexp = "^[A-Z_]+$", message = "Код категорії повинен містити тільки великі латинські літери та підкреслення")
    private String categoryCode;

    /**
     * Найменування предмету з прайс-листа.
     */
    @Schema(
        description = "Найменування предмету з прайс-листа",
        example = "Прання сорочки чоловічої",
        maxLength = 255
    )
    @NotBlank(message = "Найменування предмету обов'язкове")
    @Size(max = 255, message = "Найменування предмету не може перевищувати 255 символів")
    private String itemName;

    /**
     * Колір предмету.
     */
    @Schema(
        description = "Колір предмету",
        example = "чорний",
        maxLength = 100
    )
    private String color;

    /**
     * Кількість предметів.
     */
    @Schema(
        description = "Кількість предметів",
        example = "2",
        minimum = "1",
        maximum = "1000"
    )
    @NotNull(message = "Кількість предметів обов'язкова")
    @Min(value = PricingConstants.MIN_QUANTITY, message = PricingConstants.MSG_QUANTITY_MIN)
    @Max(value = PricingConstants.MAX_QUANTITY, message = PricingConstants.MSG_QUANTITY_MAX)
    private Integer quantity;

    /**
     * Список кодів модифікаторів для застосування.
     */
    @Schema(
        description = "Список кодів модифікаторів для застосування",
        example = "[\"manual_cleaning\", \"kids_items\"]"
    )
    private List<String> modifierCodes;

    /**
     * Список ID модифікаторів, які потрібно застосувати до ціни.
     * Можуть бути загальними або специфічними для категорії.
     */
    @Schema(
        description = "Список ID модифікаторів для застосування",
        example = "[\"MOD_DISCOUNT_10\", \"MOD_EXPEDITE_SAME_DAY\"]"
    )
    @Size(max = 20, message = "Не можна застосувати більше 20 модифікаторів одночасно")
    @Valid
    private List<String> modifierIds;

    /**
     * Значення відсотка для модифікаторів з діапазоном значень.
     * Ключ - ID модифікатора, значення - вибраний відсоток.
     */
    @Schema(description = "Значення відсотків для модифікаторів діапазону")
    @Size(max = 10, message = "Не можна мати більше 10 модифікаторів діапазону")
    @Valid
    private List<RangeModifierValueDTO> rangeModifierValues;

    /**
     * Кількість для модифікаторів з фіксованою ціною.
     * Наприклад, кількість гудзиків для пришивання.
     * Ключ - ID модифікатора, значення - кількість.
     */
    @Schema(description = "Кількості для модифікаторів з фіксованою ціною")
    @Size(max = 10, message = "Не можна мати більше 10 модифікаторів з фіксованою ціною")
    @Valid
    private List<FixedModifierQuantityDTO> fixedModifierQuantities;

    /**
     * Чи термінове замовлення.
     */
    @Schema(description = "Чи термінове замовлення", example = "false")
    private boolean expedited;

    /**
     * Відсоток надбавки за терміновість.
     */
    @Schema(
        description = "Відсоток надбавки за терміновість",
        example = "50.0",
        minimum = "0",
        maximum = "200"
    )
    private BigDecimal expeditePercent;

    /**
     * Відсоток знижки.
     */
    @Schema(
        description = "Відсоток знижки",
        example = "10.0",
        minimum = "0",
        maximum = "50"
    )
    private BigDecimal discountPercent;

    /**
     * DTO для значення відсотка в діапазоні.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Значення відсотка для модифікатора діапазону")
    public static class RangeModifierValueDTO {
        /**
         * ID модифікатора.
         */
        @Schema(
            description = "ID модифікатора",
            example = "MOD_DISCOUNT_RANGE",
            pattern = "^MOD_[A-Z_]+$"
        )
        @NotBlank(message = "ID модифікатора обов'язковий")
        @Pattern(regexp = "^MOD_[A-Z_]+$", message = "ID модифікатора повинен мати формат MOD_XXXXX")
        private String modifierId;

        /**
         * Вибраний відсоток.
         */
        @Schema(
            description = "Вибраний відсоток для модифікатора",
            example = "15.5",
            minimum = "0",
            maximum = "200"
        )
        @NotNull(message = "Відсоток обов'язковий")
        @Min(value = 0, message = "Відсоток не може бути від'ємним")
        @Max(value = 200, message = "Відсоток не може перевищувати 200%")
        private BigDecimal percentage;
    }

    /**
     * DTO для кількості для модифікаторів з фіксованою ціною.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Кількість для модифікатора з фіксованою ціною")
    public static class FixedModifierQuantityDTO {
        /**
         * ID модифікатора.
         */
        @Schema(
            description = "ID модифікатора",
            example = "MOD_BUTTON_SEWING",
            pattern = "^MOD_[A-Z_]+$"
        )
        @NotBlank(message = "ID модифікатора обов'язковий")
        @Pattern(regexp = "^MOD_[A-Z_]+$", message = "ID модифікатора повинен мати формат MOD_XXXXX")
        private String modifierId;

        /**
         * Кількість.
         */
        @Schema(
            description = "Кількість одиниць для модифікатора",
            example = "5",
            minimum = "1",
            maximum = "100"
        )
        @NotNull(message = "Кількість обов'язкова")
        @Min(value = 1, message = "Кількість має бути більше нуля")
        @Max(value = 100, message = "Кількість не може перевищувати 100 одиниць")
        private Integer quantity;
    }
}
