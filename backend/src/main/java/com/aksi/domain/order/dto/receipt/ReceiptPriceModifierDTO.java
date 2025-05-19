package com.aksi.domain.order.dto.receipt;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представлення модифікаторів ціни у квитанції.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptPriceModifierDTO {
    /**
     * Назва модифікатора.
     */
    private String name;

    /**
     * Опис модифікатора.
     */
    private String description;

    /**
     * Відсоток впливу на ціну.
     */
    private Integer percentageValue;

    /**
     * Фіксоване значення (якщо не відсоток).
     */
    private BigDecimal fixedValue;

    /**
     * Фінальний вплив на ціну.
     */
    private BigDecimal impact;
}
