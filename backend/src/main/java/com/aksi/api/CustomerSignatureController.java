package com.aksi.api;

import java.util.List;
import java.util.UUID;

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
import com.aksi.util.ApiResponseUtils;

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
    public ResponseEntity<?> saveSignature(
            @Parameter(description = "Дані підпису клієнта", required = true)
            @Valid @RequestBody CustomerSignatureRequest request) {
        try {
            CustomerSignatureResponse savedSignature = signatureService.saveSignature(request);
            return ApiResponseUtils.created(savedSignature, "Запит на збереження підпису клієнта для замовлення: {}", 
                request.getOrderId());
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено під час спроби зберегти підпис", request.getOrderId());
        } catch (Exception e) {
            return ApiResponseUtils.badRequest("Помилка збереження підпису", 
                "Не вдалося зберегти підпис для замовлення: {}. Причина: {}", request.getOrderId(), e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати підпис за ID", 
               description = "Повертає підпис клієнта за його ID")
    @ApiResponse(responseCode = "200", description = "Підпис знайдено",
            content = @Content(schema = @Schema(implementation = CustomerSignatureResponse.class)))
    @ApiResponse(responseCode = "404", description = "Підпис не знайдено")
    public ResponseEntity<?> getSignatureById(
            @Parameter(description = "ID підпису", required = true) @PathVariable UUID id) {
        try {
            CustomerSignatureResponse signature = signatureService.getSignatureById(id)
                    .orElseThrow(() -> EntityNotFoundException.withId(id));
            return ApiResponseUtils.ok(signature, "Запит на отримання підпису за ID: {}", id);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound("Підпис не знайдено", 
                "Підпис з ID: {} не знайдено", id);
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка пошуку підпису", 
                "Виникла помилка при пошуку підпису з ID: {}. Причина: {}", id, e.getMessage());
        }
    }
    
    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Отримати всі підписи для замовлення", 
               description = "Повертає всі підписи для конкретного замовлення")
    @ApiResponse(responseCode = "200", description = "Список підписів",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = CustomerSignatureResponse.class))))
    public ResponseEntity<?> getSignaturesByOrderId(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId) {
        try {
            List<CustomerSignatureResponse> signatures = signatureService.getAllSignaturesByOrderId(orderId);
            return ApiResponseUtils.ok(signatures, "Запит на отримання всіх підписів для замовлення з ID: {}", orderId);
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка отримання підписів", 
                "Виникла помилка при отриманні підписів для замовлення з ID: {}. Причина: {}", orderId, e.getMessage());
        }
    }
    
    @GetMapping("/orders/{orderId}/types/{signatureType}")
    @Operation(summary = "Отримати підпис за типом для замовлення", 
               description = "Повертає підпис конкретного типу для замовлення")
    @ApiResponse(responseCode = "200", description = "Підпис знайдено",
            content = @Content(schema = @Schema(implementation = CustomerSignatureResponse.class)))
    @ApiResponse(responseCode = "404", description = "Підпис не знайдено")
    public ResponseEntity<?> getSignatureByOrderIdAndType(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "Тип підпису", required = true) @PathVariable String signatureType) {
        try {
            CustomerSignatureResponse signature = signatureService.getSignatureByOrderIdAndType(orderId, signatureType)
                    .orElseThrow(() -> new EntityNotFoundException("Signature not found for orderId: " + orderId + 
                            " and type: " + signatureType));
            return ApiResponseUtils.ok(signature, "Запит на отримання підпису для замовлення з ID: {} та типу: {}", 
                orderId, signatureType);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound("Підпис не знайдено", 
                "Підпис типу '{}' для замовлення з ID: {} не знайдено", signatureType, orderId);
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка пошуку підпису", 
                "Виникла помилка при пошуку підпису типу '{}' для замовлення з ID: {}. Причина: {}", 
                signatureType, orderId, e.getMessage());
        }
    }
} 
