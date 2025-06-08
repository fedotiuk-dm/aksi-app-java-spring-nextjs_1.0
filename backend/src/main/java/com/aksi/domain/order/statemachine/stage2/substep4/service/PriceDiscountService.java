package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс обробки знижок.
 *
 * Відповідальність: застосування знижок до розрахунку ціни.
 * Принцип: один файл = одна відповідальність знижок.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceDiscountService {

    /**
     * Застосовує знижку до розрахунку.
     */
    public PricingCalculationDTO applyDiscount(
            PricingCalculationDTO currentCalculation,
            BigDecimal discountPercentage) {

        log.debug("Applying discount: {}% to calculation", discountPercentage);

        if (!currentCalculation.getDiscountApplicable()) {
            log.debug("Discount not applicable for this calculation");
            return currentCalculation;
        }

        if (discountPercentage == null || discountPercentage.compareTo(BigDecimal.ZERO) <= 0) {
            log.debug("No discount to apply");
            return currentCalculation;
        }

        try {
            // Розраховуємо знижку
            BigDecimal discountFactor = BigDecimal.ONE.subtract(
                    discountPercentage.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
            );

            BigDecimal discountedUnitPrice = currentCalculation.getFinalUnitPrice()
                    .multiply(discountFactor)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal discountedTotal = discountedUnitPrice
                    .multiply(BigDecimal.valueOf(currentCalculation.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            return currentCalculation.toBuilder()
                    .finalUnitPrice(discountedUnitPrice)
                    .finalTotalPrice(discountedTotal)
                    .build();

        } catch (Exception e) {
            log.error("Error applying discount: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося застосувати знижку", e);
        }
    }

    /**
     * Валідує відсоток знижки.
     */
    public boolean isValidDiscountPercentage(BigDecimal percentage) {
        return percentage != null &&
               percentage.compareTo(BigDecimal.ZERO) >= 0 &&
               percentage.compareTo(BigDecimal.valueOf(100)) < 0;
    }
}
