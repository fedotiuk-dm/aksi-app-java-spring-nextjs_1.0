package com.aksi.domain.pricing.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.Builder;
import lombok.Value;

/**
 * Доменна подія, яка відбувається при розрахунку ціни.
 * Дозволяє іншим доменам реагувати на розрахунок ціни без прямих залежностей.
 */
@Value
@Builder
public class PriceCalculatedEvent {

    /**
     * Унікальний ідентифікатор події.
     */
    String eventId;

    /**
     * Час виникнення події.
     */
    Instant timestamp;

    /**
     * Код категорії послуги.
     */
    String categoryCode;

    /**
     * Назва предмету.
     */
    String itemName;

    /**
     * Колір предмету.
     */
    String color;

    /**
     * Кількість предметів.
     */
    int quantity;

    /**
     * Базова ціна за одиницю.
     */
    BigDecimal baseUnitPrice;

    /**
     * Фінальна ціна за одиницю (з модифікаторами).
     */
    BigDecimal finalUnitPrice;

    /**
     * Загальна фінальна ціна.
     */
    BigDecimal finalTotalPrice;

    /**
     * Список застосованих модифікаторів.
     */
    List<String> appliedModifierCodes;

    /**
     * Чи було замовлення терміновим.
     */
    boolean isExpedited;

    /**
     * Відсоток знижки.
     */
    BigDecimal discountPercent;

    /**
     * Одиниця виміру.
     */
    String unitOfMeasure;

    /**
     * Додаткові дані для розширення.
     */
    String metadata;

    /**
     * Створити подію з мінімальними даними.
     */
    public static PriceCalculatedEvent create(
            String categoryCode,
            String itemName,
            int quantity,
            BigDecimal finalTotalPrice) {
        return PriceCalculatedEvent.builder()
                .eventId(java.util.UUID.randomUUID().toString())
                .timestamp(Instant.now())
                .categoryCode(categoryCode)
                .itemName(itemName)
                .quantity(quantity)
                .finalTotalPrice(finalTotalPrice)
                .build();
    }
}
