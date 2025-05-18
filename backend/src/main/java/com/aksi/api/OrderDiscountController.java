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
    public ResponseEntity<OrderDiscountResponse> applyDiscount(
            @RequestBody @Validated OrderDiscountRequest request) {
        
        log.info("Received request to apply discount: {}", request);
        OrderDiscountResponse response = discountService.applyDiscount(request);
        log.info("Applied discount: {}", response);
        
        return ResponseEntity.ok(response);
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
    public ResponseEntity<OrderDiscountResponse> getOrderDiscount(
            @PathVariable String orderId) {
        
        log.info("Received request to get discount for order: {}", orderId);
        OrderDiscountResponse response = discountService.getOrderDiscount(orderId);
        log.info("Retrieved discount: {}", response);
        
        return ResponseEntity.ok(response);
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
    public ResponseEntity<OrderDiscountResponse> removeDiscount(
            @PathVariable String orderId) {
        
        log.info("Received request to remove discount from order: {}", orderId);
        OrderDiscountResponse response = discountService.removeDiscount(orderId);
        log.info("Removed discount: {}", response);
        
        return ResponseEntity.ok(response);
    }
} 