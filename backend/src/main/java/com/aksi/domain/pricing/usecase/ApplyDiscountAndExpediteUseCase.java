package com.aksi.domain.pricing.usecase;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use Case для застосування знижок та надбавок за терміновість.
 * Реалізує бізнес-логіку розрахунку фінальної ціни з урахуванням знижок та терміновості.
 */
@Component
@RequiredArgsConstructor
@Validated
@Slf4j
public class ApplyDiscountAndExpediteUseCase {

    // Константи для розрахунків
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int DECIMAL_PLACES = 2;

    /**
     * Виконати застосування знижок та надбавок за терміновість.
     *
     * @param request Запит на застосування знижок та терміновості
     * @return Результат застосування знижок та терміновості
     */
    public DiscountExpediteResult execute(@NotNull DiscountExpediteRequest request) {
        log.debug("Застосовуємо знижки та терміновість до ціни {}. Знижка: {}%, Терміновість: {}, Фактор: {}%",
                request.subtotal(), request.discountPercent(), request.isExpedited(), request.expediteFactor());

        BigDecimal currentPrice = request.subtotal();
        BigDecimal expediteAmount = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        // 1. Спочатку застосовуємо надбавку за терміновість
        if (request.isExpedited() && request.expediteFactor() != null && request.expediteFactor().compareTo(BigDecimal.ZERO) > 0) {
            expediteAmount = calculateExpediteAmount(currentPrice, request.expediteFactor());
            currentPrice = currentPrice.add(expediteAmount);

            log.debug("Застосовано надбавку за терміновість: {} ({}%)", expediteAmount, request.expediteFactor());
        }

        // 2. Потім застосовуємо знижку
        if (request.discountPercent() != null && request.discountPercent().compareTo(BigDecimal.ZERO) > 0) {
            discountAmount = calculateDiscountAmount(currentPrice, request.discountPercent());
            currentPrice = currentPrice.subtract(discountAmount);

            log.debug("Застосовано знижку: {} ({}%)", discountAmount, request.discountPercent());
        }

        // 3. Округляємо до 2 знаків після коми
        BigDecimal finalPrice = currentPrice.setScale(DECIMAL_PLACES, RoundingMode.HALF_UP);

        log.debug("Фінальна ціна після всіх розрахунків: {}", finalPrice);

        return new DiscountExpediteResult(
                finalPrice,
                expediteAmount,
                discountAmount
        );
    }

    /**
     * Розрахувати суму надбавки за терміновість.
     */
    private BigDecimal calculateExpediteAmount(BigDecimal price, BigDecimal expediteFactor) {
        if (price == null || expediteFactor == null || expediteFactor.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        return price.multiply(expediteFactor).divide(HUNDRED, DECIMAL_PLACES, RoundingMode.HALF_UP);
    }

    /**
     * Розрахувати суму знижки.
     */
    private BigDecimal calculateDiscountAmount(BigDecimal price, BigDecimal discountPercent) {
        if (price == null || discountPercent == null || discountPercent.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        return price.multiply(discountPercent).divide(HUNDRED, DECIMAL_PLACES, RoundingMode.HALF_UP);
    }

    /**
     * Запит на застосування знижок та терміновості.
     */
    public record DiscountExpediteRequest(
            @NotNull BigDecimal subtotal,

            boolean isExpedited,

            @DecimalMin(value = "0.0", message = "Фактор терміновості не може бути від'ємним")
            @DecimalMax(value = "1000.0", message = "Фактор терміновості не може перевищувати 1000%")
            BigDecimal expediteFactor,

            @DecimalMin(value = "0.0", message = "Відсоток знижки не може бути від'ємним")
            @DecimalMax(value = "100.0", message = "Відсоток знижки не може перевищувати 100%")
            BigDecimal discountPercent
    ) {}

    /**
     * Результат застосування знижок та терміновості.
     */
    public record DiscountExpediteResult(
            BigDecimal finalPrice,
            BigDecimal expediteAmount,
            BigDecimal discountAmount
    ) {}
}
