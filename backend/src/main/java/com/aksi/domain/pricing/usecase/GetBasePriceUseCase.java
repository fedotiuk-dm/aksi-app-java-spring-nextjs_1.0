package com.aksi.domain.pricing.usecase;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.aksi.domain.pricing.service.PriceCalculationService;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use Case для отримання базової ціни предмету з прайс-листа.
 * Реалізує бізнес-логіку пошуку та валідації базової ціни.
 */
@Component
@RequiredArgsConstructor
@Validated
@Slf4j
public class GetBasePriceUseCase {

    private final PriceCalculationService priceCalculationService;

    /**
     * Виконати отримання базової ціни для предмету.
     *
     * @param categoryCode Код категорії
     * @param itemName Назва предмету
     * @param color Колір предмету (може бути null)
     * @return Базова ціна
     * @throws IllegalArgumentException якщо предмет не знайдено у прайс-листі
     */
    public BigDecimal execute(
            @NotBlank(message = "Код категорії не може бути порожнім") String categoryCode,
            @NotBlank(message = "Назва предмету не може бути порожньою") String itemName,
            String color) {

        log.debug("Отримуємо базову ціну для категорії {}, предмету {} з кольором {}",
                categoryCode, itemName, color);

        try {
            BigDecimal basePrice = priceCalculationService.getBasePrice(categoryCode, itemName, color);

            if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException(
                        String.format("Некоректна базова ціна для предмету %s в категорії %s",
                                itemName, categoryCode));
            }

            log.debug("Знайдено базову ціну {} для предмету {} в категорії {}",
                    basePrice, itemName, categoryCode);

            return basePrice;
        } catch (RuntimeException e) {
            log.error("Помилка при отриманні базової ціни для предмету {} в категорії {}: {}",
                    itemName, categoryCode, e.getMessage());
            throw new IllegalArgumentException(
                    String.format("Не вдалося знайти предмет '%s' в категорії '%s' з кольором '%s'",
                            itemName, categoryCode, color), e);
        }
    }
}
