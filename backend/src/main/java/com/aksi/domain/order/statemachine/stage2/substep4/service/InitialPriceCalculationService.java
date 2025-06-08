package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PricingDomainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для початкового розрахунку ціни.
 * Відповідальність: створення базових розрахунків без модифікаторів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InitialPriceCalculationService {

    private final PriceCalculationService priceCalculationService;
    private final PricingDomainService pricingDomainService;

    /**
     * Створює початковий розрахунок ціни на основі базової інформації.
     */
    public PricingCalculationDTO calculateInitialPrice(BasicInfoDTO basicInfo, CharacteristicsDTO characteristics) {
        log.debug("Створення початкового розрахунку для {} {}", basicInfo.getCategoryCode(), basicInfo.getItemName());

        try {
            // Отримуємо базову ціну через готовий сервіс
            BigDecimal basePrice = priceCalculationService.getBasePrice(
                    basicInfo.getCategoryCode(),
                    basicInfo.getItemName(),
                    characteristics != null ? characteristics.getColor() : null
            );

            if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) <= 0) {
                return createErrorCalculation(basicInfo, characteristics, "Базова ціна не знайдена");
            }

            // Розраховуємо загальну суму
            Integer quantity = basicInfo.getQuantity() != null ? basicInfo.getQuantity() : 1;
            BigDecimal totalPrice = basePrice.multiply(BigDecimal.valueOf(quantity));

            return PricingCalculationDTO.builder()
                    .categoryCode(basicInfo.getCategoryCode())
                    .itemName(basicInfo.getItemName())
                    .color(characteristics != null ? characteristics.getColor() : null)
                    .baseUnitPrice(basePrice)
                    .quantity(quantity)
                    .unitOfMeasure(pricingDomainService.determineUnitOfMeasure(basicInfo.getCategoryCode(), basicInfo.getItemName()))
                    .baseTotal(totalPrice)
                    .finalUnitPrice(basePrice)
                    .finalTotalPrice(totalPrice)
                    .isExpedited(false)
                    .expediteFactor(BigDecimal.ZERO)
                    .discountPercent(BigDecimal.ZERO)
                    .isValid(true)
                    .build();

        } catch (Exception e) {
            log.error("Помилка створення початкового розрахунку: {}", e.getMessage());
            return createErrorCalculation(basicInfo, characteristics, "Помилка розрахунку: " + e.getMessage());
        }
    }

    /**
     * Перевіряє чи можна розрахувати ціну для даних параметрів.
     */
    public boolean canCalculatePrice(BasicInfoDTO basicInfo, CharacteristicsDTO characteristics) {
        log.debug("Перевірка можливості розрахунку для {} {}", basicInfo.getCategoryCode(), basicInfo.getItemName());

        try {
            BigDecimal basePrice = getBasePrice(
                    basicInfo.getCategoryCode(),
                    basicInfo.getItemName(),
                    characteristics != null ? characteristics.getColor() : null
            );

            return basePrice != null && basePrice.compareTo(BigDecimal.ZERO) > 0;

        } catch (Exception e) {
            log.debug("Неможливо розрахувати ціну: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Отримує базову ціну через готовий сервіс pricing domain.
     */
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Отримання базової ціни для {} {} {}", categoryCode, itemName, color);

        try {
            return priceCalculationService.getBasePrice(categoryCode, itemName, color);
        } catch (Exception e) {
            log.error("Помилка отримання базової ціни: {}", e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    /**
     * Створює розрахунок з помилкою.
     */
    private PricingCalculationDTO createErrorCalculation(BasicInfoDTO basicInfo,
                                                       CharacteristicsDTO characteristics,
                                                       String errorMessage) {
        return PricingCalculationDTO.builder()
                .categoryCode(basicInfo.getCategoryCode())
                .itemName(basicInfo.getItemName())
                .color(characteristics != null ? characteristics.getColor() : null)
                .quantity(basicInfo.getQuantity() != null ? basicInfo.getQuantity() : 1)
                .isValid(false)
                .validationErrors(java.util.List.of(errorMessage))
                .build();
    }
}
