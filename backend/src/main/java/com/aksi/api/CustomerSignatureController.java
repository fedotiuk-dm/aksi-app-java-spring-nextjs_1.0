package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.service.CustomerSignatureService;
import com.aksi.exception.EntityNotFoundException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для операцій з підписами клієнтів
 */
@RestController
@RequestMapping("/signatures")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "CustomerSignature", description = "API для управління підписами клієнтів")
public class CustomerSignatureController {
    
    private final CustomerSignatureService signatureService;
    
    @PostMapping
    @Operation(summary = "Зберегти підпис клієнта", 
               description = "Зберігає новий або оновлює існуючий підпис клієнта")
    @ApiResponse(responseCode = "201", description = "Підпис успішно збережено",
            content = @Content(schema = @Schema(implementation = CustomerSignatureResponse.class)))
    @ApiResponse(responseCode = "400", description = "Некоректний запит")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<CustomerSignatureResponse> saveSignature(
            @Parameter(description = "Дані підпису клієнта", required = true)
            @Valid @RequestBody CustomerSignatureRequest request) {
        
        log.info("REST request to save customer signature for order ID: {}", request.getOrderId());
        
        CustomerSignatureResponse savedSignature = signatureService.saveSignature(request);
        return new ResponseEntity<>(savedSignature, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати підпис за ID", 
               description = "Повертає підпис клієнта за його ID")
    @ApiResponse(responseCode = "200", description = "Підпис знайдено",
            content = @Content(schema = @Schema(implementation = CustomerSignatureResponse.class)))
    @ApiResponse(responseCode = "404", description = "Підпис не знайдено")
    public ResponseEntity<CustomerSignatureResponse> getSignatureById(
            @Parameter(description = "ID підпису", required = true) @PathVariable UUID id) {
        
        log.info("REST request to get signature by ID: {}", id);
        
        return signatureService.getSignatureById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> EntityNotFoundException.withId(id));
    }
    
    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Отримати всі підписи для замовлення", 
               description = "Повертає всі підписи для конкретного замовлення")
    @ApiResponse(responseCode = "200", description = "Список підписів",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = CustomerSignatureResponse.class))))
    public ResponseEntity<List<CustomerSignatureResponse>> getSignaturesByOrderId(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId) {
        
        log.info("REST request to get all signatures for order ID: {}", orderId);
        
        List<CustomerSignatureResponse> signatures = signatureService.getAllSignaturesByOrderId(orderId);
        return ResponseEntity.ok(signatures);
    }
    
    @GetMapping("/orders/{orderId}/types/{signatureType}")
    @Operation(summary = "Отримати підпис за типом для замовлення", 
               description = "Повертає підпис конкретного типу для замовлення")
    @ApiResponse(responseCode = "200", description = "Підпис знайдено",
            content = @Content(schema = @Schema(implementation = CustomerSignatureResponse.class)))
    @ApiResponse(responseCode = "404", description = "Підпис не знайдено")
    public ResponseEntity<CustomerSignatureResponse> getSignatureByOrderIdAndType(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "Тип підпису", required = true) @PathVariable String signatureType) {
        
        log.info("REST request to get signature for order ID: {} and type: {}", orderId, signatureType);
        
        return signatureService.getSignatureByOrderIdAndType(orderId, signatureType)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Signature not found for orderId: " + orderId + 
                        " and type: " + signatureType));
    }
} 