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

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;
import com.aksi.domain.order.service.OrderRequirementsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з додатковими вимогами замовлення
 */
@RestController
@RequestMapping("/orders/{orderId}/requirements")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Додаткові вимоги замовлення", description = "API для роботи з додатковими вимогами та примітками до замовлення")
public class OrderRequirementsController {
    
    private final OrderRequirementsService orderRequirementsService;
    
    /**
     * Оновити додаткові вимоги та примітки до замовлення
     * 
     * @param orderId ID замовлення
     * @param request запит з додатковими вимогами
     * @return відповідь з оновленими даними
     */
    @PostMapping
    @Operation(summary = "Оновити додаткові вимоги та примітки до замовлення",
            description = "Зберігає додаткові вимоги та примітки клієнта до замовлення")
    public ResponseEntity<AdditionalRequirementsResponse> updateRequirements(
            @PathVariable UUID orderId,
            @Valid @RequestBody AdditionalRequirementsRequest request) {
        log.info("Оновлення додаткових вимог для замовлення: {}", orderId);
        
        // Переконуємося, що ID замовлення в URL та в запиті співпадають
        request.setOrderId(orderId);
        
        AdditionalRequirementsResponse response = orderRequirementsService.updateRequirements(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Отримати додаткові вимоги та примітки до замовлення
     * 
     * @param orderId ID замовлення
     * @return відповідь з даними
     */
    @GetMapping
    @Operation(summary = "Отримати додаткові вимоги та примітки до замовлення",
            description = "Повертає поточні додаткові вимоги та примітки клієнта до замовлення")
    public ResponseEntity<AdditionalRequirementsResponse> getRequirements(@PathVariable UUID orderId) {
        log.info("Отримання додаткових вимог для замовлення: {}", orderId);
        
        AdditionalRequirementsResponse response = orderRequirementsService.getRequirements(orderId);
        return ResponseEntity.ok(response);
    }
} 