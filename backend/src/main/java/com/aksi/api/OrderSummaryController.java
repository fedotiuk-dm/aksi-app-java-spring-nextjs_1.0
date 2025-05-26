package com.aksi.api;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.service.OrderSummaryService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для отримання детального підсумку замовлення.
 * Використовується для етапу перегляду замовлення з детальним розрахунком.
 */
@RestController
@RequestMapping("/orders")
@Tag(name = "Order Summary", description = "API для отримання детального підсумку замовлення")
@RequiredArgsConstructor
@Slf4j
public class OrderSummaryController {

    private final OrderSummaryService orderSummaryService;

    /**
     * Отримати детальний підсумок замовлення за його ID.
     *
     * @param orderId ID замовлення
     * @return детальний підсумок замовлення
     */
    @GetMapping("/{orderId}/detailed-summary")
    @Operation(
        summary = "Отримати детальний підсумок замовлення",
        description = "Повертає детальний підсумок замовлення з розрахунком вартості для перегляду та підтвердження. " +
                "Включає інформацію про клієнта, список предметів з деталізацією вартості, загальні суми та дати."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Успішне отримання детального підсумку замовлення",
            content = @Content(mediaType = "application/json",
                     schema = @Schema(implementation = OrderDetailedSummaryResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Замовлення не знайдено",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Внутрішня помилка сервера",
            content = @Content
        )
    })
    public ResponseEntity<?> getOrderDetailedSummary(
            @Parameter(description = "ID замовлення", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
            @PathVariable UUID orderId) {
        log.info("Запит на отримання детального підсумку замовлення з ID: {}", orderId);

        try {
            OrderDetailedSummaryResponse summary = orderSummaryService.getOrderDetailedSummary(orderId);
            return ApiResponseUtils.ok(summary, "Отримано детальний підсумок замовлення з ID: {}", orderId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Замовлення з ID: {} не знайдено. Причина: {}", orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні підсумку замовлення",
                    "Виникла помилка при отриманні детального підсумку замовлення з ID: {}. Причина: {}",
                    orderId, e.getMessage());
        }
    }
}
