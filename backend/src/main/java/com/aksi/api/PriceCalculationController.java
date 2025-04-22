package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.dto.order.OrderItemPriceCalculationDto;
import com.aksi.service.order.DetailedPriceCalculationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для доступу до детальної інформації про розрахунок цін.
 * Дозволяє отримати покрокову деталізацію розрахунку вартості для замовлень та окремих предметів.
 */
@RestController
@RequestMapping("/price-calculations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Price Calculations API", description = "API для детальних розрахунків вартості")
public class PriceCalculationController {

    private final DetailedPriceCalculationService detailedPriceCalculationService;

    /**
     * Отримати детальний розрахунок ціни для конкретного предмета замовлення.
     *
     * @param itemId ID предмета замовлення
     * @return Детальна інформація про розрахунок ціни
     */
    @GetMapping("/items/{itemId}")
    @Operation(summary = "Отримати деталі розрахунку ціни для предмета", 
               description = "Повертає детальну інформацію про кроки розрахунку ціни для конкретного предмета замовлення")
    public ResponseEntity<OrderItemPriceCalculationDto> getItemPriceCalculation(
            @Parameter(description = "ID предмета замовлення") 
            @PathVariable UUID itemId) {
        
        log.debug("REST request to get price calculation details for item ID: {}", itemId);
        OrderItemPriceCalculationDto calculation = detailedPriceCalculationService.getDetailedPriceCalculation(itemId);
        return ResponseEntity.ok(calculation);
    }

    /**
     * Отримати детальні розрахунки цін для всіх предметів у замовленні.
     *
     * @param orderId ID замовлення
     * @return Список детальних розрахунків для кожного предмета в замовленні
     */
    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Отримати деталі розрахунків цін для замовлення", 
               description = "Повертає детальну інформацію про кроки розрахунку цін для всіх предметів у замовленні")
    public ResponseEntity<List<OrderItemPriceCalculationDto>> getOrderPriceCalculations(
            @Parameter(description = "ID замовлення") 
            @PathVariable UUID orderId) {
        
        log.debug("REST request to get price calculation details for order ID: {}", orderId);
        List<OrderItemPriceCalculationDto> calculations = detailedPriceCalculationService.getDetailedPriceCalculationsForOrder(orderId);
        return ResponseEntity.ok(calculations);
    }
}
