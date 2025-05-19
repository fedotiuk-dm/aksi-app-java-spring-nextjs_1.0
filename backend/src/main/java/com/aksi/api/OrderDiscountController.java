package com.aksi.api;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.service.DiscountService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для управління знижками до замовлень
 */
@RestController
@RequestMapping("/orders/discounts")
@RequiredArgsConstructor
@Tag(name = "Order Discounts", description = "API для управління знижками до замовлень")
@Slf4j
public class OrderDiscountController {

    private final DiscountService discountService;

    /**
     * Застосувати знижку до замовлення
     *
     * @param request дані про знижку
     * @return інформація про застосовану знижку
     */
    @PostMapping("/apply")
    @Operation(summary = "Застосувати знижку до замовлення",
               description = "Застосовує знижку до замовлення з урахуванням обмежень на категорії")
    public ResponseEntity<?> applyDiscount(
            @RequestBody @Validated OrderDiscountRequest request) {
        try {
            OrderDiscountResponse response = discountService.applyDiscount(request);
            return ApiResponseUtils.ok(response, "Знижку застосовано до замовлення: {}", request.getOrderId());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Неможливо застосувати знижку",
                "Неможливо застосувати знижку до замовлення: {}. Причина: {}",
                request.getOrderId(), e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при застосуванні знижки",
                "Виникла помилка при застосуванні знижки до замовлення: {}. Причина: {}",
                request.getOrderId(), e.getMessage());
        }
    }

    /**
     * Отримати інформацію про поточну знижку для замовлення
     *
     * @param orderId ідентифікатор замовлення
     * @return інформація про поточну знижку
     */
    @GetMapping("/{orderId}")
    @Operation(summary = "Отримати інформацію про знижку",
               description = "Повертає детальну інформацію про знижку до замовлення")
    public ResponseEntity<?> getOrderDiscount(
            @PathVariable String orderId) {
        try {
            OrderDiscountResponse response = discountService.getOrderDiscount(orderId);
            return ApiResponseUtils.ok(response, "Отримано інформацію про знижку для замовлення: {}", orderId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Знижку не знайдено",
                "Для замовлення: {} не знайдено знижки. Причина: {}", orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні інформації про знижку",
                "Виникла помилка при отриманні інформації про знижку для замовлення: {}. Причина: {}",
                orderId, e.getMessage());
        }
    }

    /**
     * Скасувати знижку для замовлення
     *
     * @param orderId ідентифікатор замовлення
     * @return оновлена інформація про замовлення без знижки
     */
    @DeleteMapping("/{orderId}")
    @Operation(summary = "Скасувати знижку",
               description = "Видаляє знижку з замовлення")
    public ResponseEntity<?> removeDiscount(
            @PathVariable String orderId) {
        try {
            OrderDiscountResponse response = discountService.removeDiscount(orderId);
            return ApiResponseUtils.ok(response, "Знижку скасовано для замовлення: {}", orderId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Знижку не знайдено для скасування",
                "Для замовлення: {} не знайдено знижки для скасування. Причина: {}", orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при скасуванні знижки",
                "Виникла помилка при скасуванні знижки для замовлення: {}. Причина: {}",
                orderId, e.getMessage());
        }
    }
}
