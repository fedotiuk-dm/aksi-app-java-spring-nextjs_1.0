package com.aksi.api;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.dto.OrderCompletionUpdateRequest;
import com.aksi.domain.order.service.CompletionDateService;
import com.aksi.domain.order.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для управління датами завершення замовлень
 */
@RestController
@RequestMapping("/orders/completion")
@RequiredArgsConstructor
@Tag(name = "Order Completion", description = "API для управління датами завершення замовлень")
@Slf4j
public class OrderCompletionController {

    private final CompletionDateService completionDateService;
    private final OrderService orderService;
    
    /**
     * Розрахувати очікувану дату завершення замовлення
     * 
     * @param request запит з категоріями послуг та типом терміновості
     * @return відповідь з розрахованою датою завершення
     */
    @PostMapping("/calculate")
    @Operation(summary = "Розрахувати очікувану дату завершення замовлення",
               description = "Розраховує дату завершення на основі категорій послуг та типу терміновості")
    public ResponseEntity<CompletionDateResponse> calculateCompletionDate(
            @RequestBody @Validated CompletionDateCalculationRequest request) {
        
        log.info("Received request to calculate completion date: {}", request);
        CompletionDateResponse response = completionDateService.calculateExpectedCompletionDate(request);
        log.info("Calculated completion date: {}", response);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Оновити параметри виконання замовлення
     * 
     * @param request запит з параметрами виконання
     * @return статус операції
     */
    @PutMapping("/update")
    @Operation(summary = "Оновити параметри виконання замовлення",
               description = "Оновлює тип терміновості та очікувану дату завершення замовлення")
    public ResponseEntity<Void> updateOrderCompletion(
            @RequestBody @Validated OrderCompletionUpdateRequest request) {
        
        log.info("Received request to update order completion parameters: {}", request);
        
        orderService.updateOrderCompletionParameters(
                request.getOrderId(), 
                request.getExpediteType(), 
                request.getExpectedCompletionDate());
        
        log.info("Order completion parameters updated successfully for orderId: {}", request.getOrderId());
        
        return ResponseEntity.ok().build();
    }
} 