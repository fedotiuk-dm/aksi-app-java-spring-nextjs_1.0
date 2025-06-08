package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс обробки терміновості доставки.
 *
 * Відповідальність: розрахунок надбавок за термінову доставку.
 * Принцип: один файл = одна відповідальність терміновості.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceExpediteService {

    /**
     * Застосовує надбавку за терміновість.
     */
    public PricingCalculationDTO applyExpedite(
            PricingCalculationDTO currentCalculation,
            boolean isExpedited,
            BigDecimal expediteFactor) {

        log.debug("Applying expedite factor: {} to calculation", expediteFactor);

        if (!isExpedited) {
            return currentCalculation.toBuilder()
                    .isExpedited(false)
                    .build();
        }

        try {
            // Розраховуємо нову ціну з урахуванням терміновості
            BigDecimal expeditedUnitPrice = currentCalculation.getFinalUnitPrice()
                    .multiply(BigDecimal.ONE.add(expediteFactor))
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal expeditedTotal = expeditedUnitPrice
                    .multiply(BigDecimal.valueOf(currentCalculation.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            return currentCalculation.toBuilder()
                    .finalUnitPrice(expeditedUnitPrice)
                    .finalTotalPrice(expeditedTotal)
                    .isExpedited(true)
                    .build();

        } catch (Exception e) {
            log.error("Error applying expedite: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося застосувати термінову доставку", e);
        }
    }

    /**
     * Валідує коефіцієнт терміновості.
     */
    public boolean isValidExpediteFactor(BigDecimal factor) {
        return factor != null &&
               factor.compareTo(BigDecimal.ZERO) >= 0 &&
               factor.compareTo(BigDecimal.valueOf(2.0)) <= 0; // макс 200%
    }
}
