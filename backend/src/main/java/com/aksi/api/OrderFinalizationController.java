package com.aksi.api;

import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.service.OrderFinalizationService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для операцій завершення замовлення
 */
@RestController
@RequestMapping("/orders/finalization")
@Tag(name = "OrderFinalization", description = "API для завершення процесу оформлення замовлення")
@RequiredArgsConstructor
@Slf4j
public class OrderFinalizationController {

    private final OrderFinalizationService orderFinalizationService;

    /**
     * Завершення оформлення замовлення
     *
     * @param request запит з даними для завершення замовлення
     * @return дані оновленого замовлення
     */
    @PostMapping("/complete")
    @Operation(summary = "Завершити оформлення замовлення",
               description = "Фіналізує замовлення, зберігає підпис клієнта та змінює статус замовлення")
    @ApiResponse(responseCode = "200", description = "Замовлення успішно завершено",
                content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> finalizeOrder(@Valid @RequestBody OrderFinalizationRequest request) {
        log.debug("REST запит на завершення замовлення: {}", request.getOrderId());

        try {
            OrderDTO completedOrder = orderFinalizationService.finalizeOrder(request);
            return ApiResponseUtils.ok(completedOrder,
                    "Замовлення успішно завершено: {}", request.getOrderId());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Не вдалося завершити замовлення: {}. Причина: {}",
                    request.getOrderId(), e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при завершенні замовлення",
                    "Виникла несподівана помилка при завершенні замовлення: {}. Причина: {}",
                    request.getOrderId(), e.getMessage());
        }
    }

    /**
     * Отримання PDF-чеку замовлення
     *
     * @param orderId ID замовлення
     * @param includeSignature включати підпис клієнта в чек
     * @return PDF-файл чеку для завантаження
     */
    @GetMapping("/{orderId}/receipt")
    @Operation(summary = "Отримати PDF-чек замовлення",
               description = "Повертає PDF-файл з чеком для завантаження")
    @ApiResponse(responseCode = "200", description = "PDF-чек успішно згенеровано")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> getOrderReceipt(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "Включати підпис клієнта")
            @RequestParam(required = false, defaultValue = "true") boolean includeSignature) {

        log.debug("REST запит на отримання PDF-чеку для замовлення: {}", orderId);

        try {
            byte[] pdfContent = orderFinalizationService.getOrderReceipt(orderId, includeSignature);

            ByteArrayResource resource = new ByteArrayResource(pdfContent);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt_" + orderId + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfContent.length)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Не вдалося отримати PDF-чек для замовлення: {}. Причина: {}",
                    orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при генерації PDF-чеку",
                    "Виникла несподівана помилка при генерації PDF-чеку для замовлення: {}. Причина: {}",
                    orderId, e.getMessage());
        }
    }

    /**
     * Відправка чеку замовлення електронною поштою
     *
     * @param request запит з даними для відправки
     * @return статус відправки
     */
    @PostMapping("/{orderId}/email-receipt")
    @Operation(summary = "Відправити чек на email",
               description = "Відправляє PDF-чек замовлення на email клієнта")
    @ApiResponse(responseCode = "200", description = "Чек успішно відправлено")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> emailReceipt(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Valid @RequestBody EmailReceiptRequest request) {

        log.debug("REST запит на відправку чеку електронною поштою для замовлення: {}", orderId);

        try {
            // Переконуємося, що ID замовлення в URL та в запиті співпадають
            request.setOrderId(orderId);

            orderFinalizationService.sendReceiptByEmail(request);

            return ApiResponseUtils.ok(null, "Чек успішно відправлено на email для замовлення: {}", orderId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Не вдалося надіслати чек для замовлення: {}. Причина: {}",
                    orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при відправці чеку на email",
                    "Виникла несподівана помилка при відправці чеку на email для замовлення: {}. Причина: {}",
                    orderId, e.getMessage());
        }
    }
}
