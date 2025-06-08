package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.math.BigDecimal;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PricingCalculationDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс ініціалізації початкових розрахунків ціни.
 *
 * Відповідальність: створення початкового PricingCalculationDTO з базовою ціною.
 * Принцип: один файл = одна відповідальність ініціалізації.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceInitializationService {

    private final PriceCalculationService priceCalculationService;

    /**
     * Створює початковий розрахунок ціни.
     */
    public PricingCalculationDTO createInitialCalculation(
            BasicInfoDTO basicInfo,
            CharacteristicsDTO characteristics) {

        log.debug("Creating initial calculation for item: {}", basicInfo.getItemName());

        try {
            // Отримуємо базову ціну з готового domain сервісу
            BigDecimal basePrice = priceCalculationService.getBasePrice(
                    basicInfo.getCategoryCode(),
                    basicInfo.getItemName(),
                    characteristics != null ? characteristics.getColor() : null
            );

            // Розраховуємо базову загальну суму
            BigDecimal baseTotal = basePrice.multiply(BigDecimal.valueOf(basicInfo.getQuantity()));

            // Створюємо початковий розрахунок
            return PricingCalculationDTO.builder()
                    .categoryCode(basicInfo.getCategoryCode())
                    .itemName(basicInfo.getItemName())
                    .color(characteristics != null ? characteristics.getColor() : "")
                    .baseUnitPrice(basePrice)
                    .quantity(basicInfo.getQuantity())
                    .unitOfMeasure(basicInfo.getUnitOfMeasure())
                    .baseTotal(baseTotal)
                    .finalUnitPrice(basePrice)
                    .finalTotalPrice(baseTotal)
                    .selectedModifiers(new ArrayList<>())
                    .isExpedited(false)
                    .discountApplicable(true)
                    .isValid(true)
                    .validationErrors(new ArrayList<>())
                    .build();

        } catch (Exception e) {
            log.error("Error creating initial calculation: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося створити початковий розрахунок", e);
        }
    }
}
