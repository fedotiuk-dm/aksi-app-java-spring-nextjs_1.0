package com.aksi.domain.pricing.event;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Публікатор доменних подій.
 * Використовує Spring Application Events для loose coupling між доменами.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DomainEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    /**
     * Опублікувати доменну подію.
     *
     * @param event Доменна подія
     */
    public void publishEvent(Object event) {
        log.debug("Публікуємо доменну подію: {}", event.getClass().getSimpleName());
        applicationEventPublisher.publishEvent(event);
    }

    /**
     * Опублікувати подію розрахунку ціни.
     *
     * @param event Подія розрахунку ціни
     */
    public void publishPriceCalculatedEvent(PriceCalculatedEvent event) {
        log.info("Публікуємо подію розрахунку ціни для предмету '{}' в категорії '{}' на суму {}",
                event.getItemName(), event.getCategoryCode(), event.getFinalTotalPrice());
        publishEvent(event);
    }
}
