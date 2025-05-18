package com.aksi.api;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з оплатою замовлень
 */
@RestController
@RequestMapping("/orders/{orderId}/payment")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Оплата замовлень", description = "API для роботи з оплатою замовлень")
public class OrderPaymentController {
    
    private final PaymentService paymentService;
    
    /**
     * Розрахувати деталі оплати замовлення
     * 
     * @param orderId ID замовлення
     * @param request запит з інформацією про оплату
     * @return відповідь з розрахунком оплати
     */
    @PostMapping("/calculate")
    @Operation(summary = "Розрахувати деталі оплати замовлення",
            description = "Розраховує суми оплати на основі вказаних параметрів без збереження у базі даних")
    public ResponseEntity<PaymentCalculationResponse> calculatePayment(
            @PathVariable UUID orderId,
            @Valid @RequestBody PaymentCalculationRequest request) {
        log.info("Розрахунок оплати для замовлення: {}", orderId);
        
        // Переконуємося, що ID замовлення в URL та в запиті співпадають
        request.setOrderId(orderId);
        
        PaymentCalculationResponse response = paymentService.calculatePayment(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Застосувати інформацію про оплату до замовлення
     * 
     * @param orderId ID замовлення
     * @param request запит з інформацією про оплату
     * @return відповідь з оновленими даними про оплату
     */
    @PostMapping
    @Operation(summary = "Застосувати інформацію про оплату до замовлення",
            description = "Зберігає інформацію про оплату та розраховує фінальні суми")
    public ResponseEntity<PaymentCalculationResponse> applyPayment(
            @PathVariable UUID orderId,
            @Valid @RequestBody PaymentCalculationRequest request) {
        log.info("Застосування інформації про оплату для замовлення: {}", orderId);
        
        // Переконуємося, що ID замовлення в URL та в запиті співпадають
        request.setOrderId(orderId);
        
        PaymentCalculationResponse response = paymentService.applyPayment(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Отримати інформацію про оплату замовлення
     * 
     * @param orderId ID замовлення
     * @return відповідь з даними про оплату
     */
    @GetMapping
    @Operation(summary = "Отримати інформацію про оплату замовлення",
            description = "Повертає поточні дані про оплату замовлення")
    public ResponseEntity<PaymentCalculationResponse> getOrderPayment(@PathVariable UUID orderId) {
        log.info("Отримання інформації про оплату для замовлення: {}", orderId);
        
        PaymentCalculationResponse response = paymentService.getOrderPayment(orderId);
        return ResponseEntity.ok(response);
    }
} 