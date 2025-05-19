package com.aksi.domain.order.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Типи знижок для замовлень.
 */
@Getter
@RequiredArgsConstructor
public enum DiscountType {
    /**
     * Без знижки.
     */
    NO_DISCOUNT(0),

    /**
     * Еверкард (10%).
     */
    EVERCARD(10),

    /**
     * Знижка для соціальних мереж (5%).
     */
    SOCIAL_MEDIA(5),

    /**
     * Знижка для ЗСУ (10%).
     */
    MILITARY(10),

    /**
     * Інший тип знижки з довільним відсотком.
     */
    CUSTOM(0);

    private final int defaultPercentage;
}
