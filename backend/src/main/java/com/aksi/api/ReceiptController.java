package com.aksi.api;

import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.dto.receipt.EmailReceiptResponse;
import com.aksi.domain.order.dto.receipt.PdfReceiptResponse;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.service.ReceiptNumberGenerator;
import com.aksi.domain.order.service.ReceiptService;
import com.aksi.domain.order.service.order.OrderManagementService;
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
 * REST контролер для роботи з квитанціями
 */
@RestController
@RequestMapping("/receipts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Receipt", description = "API для роботи з квитанціями замовлень")
public class ReceiptController {

    private final ReceiptService receiptService;
    private final OrderManagementService orderManagementService;
    private final ReceiptNumberGenerator receiptNumberGenerator;

    @GetMapping("/{orderId}")
    @Operation(summary = "Отримати дані для квитанції",
               description = "Повертає структуровані дані для формування квитанції за ID замовлення")
    @ApiResponse(responseCode = "200", description = "Дані квитанції успішно отримано",
            content = @Content(schema = @Schema(implementation = ReceiptDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> getReceiptData(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId) {

        log.info("Запит на отримання даних квитанції для замовлення з ID: {}", orderId);

        try {
            ReceiptGenerationRequest request = new ReceiptGenerationRequest(orderId, "PDF", true);
            ReceiptDTO receiptData = receiptService.generateReceipt(request);
            return ApiResponseUtils.ok(receiptData, "Отримано дані квитанції для замовлення з ID: {}", orderId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Замовлення з ID: {} не знайдено. Причина: {}", orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні даних квитанції",
                    "Виникла помилка при отриманні даних квитанції для замовлення з ID: {}. Причина: {}",
                    orderId, e.getMessage());
        }
    }

    @PostMapping("/pdf")
    @Operation(summary = "Згенерувати PDF-квитанцію",
               description = "Генерує PDF-квитанцію для замовлення з вказаними параметрами")
    @ApiResponse(responseCode = "200", description = "PDF-квитанція успішно згенерована",
            content = @Content(schema = @Schema(implementation = PdfReceiptResponse.class)))
    @ApiResponse(responseCode = "400", description = "Некоректний запит")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> generatePdfReceipt(
            @Parameter(description = "Параметри генерації квитанції", required = true)
            @Valid @RequestBody ReceiptGenerationRequest request) {

        log.info("Запит на генерацію PDF-квитанції для замовлення з ID: {}", request.getOrderId());

        try {
            PdfReceiptResponse response = receiptService.generatePdfReceipt(request);
            return ApiResponseUtils.ok(response, "PDF-квитанцію успішно згенеровано для замовлення з ID: {}",
                    request.getOrderId());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Замовлення з ID: {} не знайдено. Причина: {}", request.getOrderId(), e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при генерації PDF-квитанції",
                    "Виникла помилка при генерації PDF-квитанції для замовлення з ID: {}. Причина: {}",
                    request.getOrderId(), e.getMessage());
        }
    }

    @GetMapping("/pdf/download/{orderId}")
    @Operation(summary = "Завантажити PDF-квитанцію",
               description = "Завантажує PDF-квитанцію для замовлення як файл")
    @ApiResponse(responseCode = "200", description = "PDF-квитанція успішно завантажена")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> downloadPdfReceipt(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId) {

        log.info("Запит на завантаження PDF-квитанції для замовлення з ID: {}", orderId);

        try {
            ReceiptGenerationRequest request = new ReceiptGenerationRequest(orderId, "PDF", true);
            byte[] pdfContent = receiptService.generatePdfReceiptBytes(request);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "receipt_" + orderId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Замовлення з ID: {} не знайдено. Причина: {}", orderId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при завантаженні PDF-квитанції",
                    "Виникла помилка при завантаженні PDF-квитанції для замовлення з ID: {}. Причина: {}",
                    orderId, e.getMessage());
        }
    }

    @PostMapping("/email")
    @Operation(summary = "Відправити квитанцію на email",
               description = "Відправляє PDF-квитанцію на вказаний email")
    @ApiResponse(responseCode = "200", description = "Квитанція успішно відправлена",
            content = @Content(schema = @Schema(implementation = EmailReceiptResponse.class)))
    @ApiResponse(responseCode = "400", description = "Некоректний запит")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> sendReceiptByEmail(
            @Parameter(description = "Параметри відправки квитанції", required = true)
            @Valid @RequestBody EmailReceiptRequest request) {

        log.info("Запит на відправку квитанції на email для замовлення з ID: {}", request.getOrderId());

        try {
            EmailReceiptResponse response = receiptService.emailReceipt(request);
            return ApiResponseUtils.ok(response, "Квитанцію успішно відправлено на email: {}",
                    response.getRecipientEmail());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Замовлення не знайдено",
                    "Замовлення з ID: {} не знайдено. Причина: {}", request.getOrderId(), e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при відправці квитанції на email",
                    "Виникла помилка при відправці квитанції на email для замовлення з ID: {}. Причина: {}",
                    request.getOrderId(), e.getMessage());
        }
    }

    @GetMapping("/generate-number")
    @Operation(summary = "Генерувати номер квитанції",
               description = "Генерує унікальний номер квитанції для нового замовлення")
    @ApiResponse(responseCode = "200", description = "Номер квитанції успішно згенеровано")
    @ApiResponse(responseCode = "400", description = "Невірні параметри запиту")
    @ApiResponse(responseCode = "500", description = "Помилка сервера при генерації номера")
    public ResponseEntity<?> generateReceiptNumber(
            @Parameter(description = "ID філії/пункту прийому", required = false)
            @RequestParam(required = false) UUID branchLocationId) {

        log.debug("Запит на генерацію номера квитанції для філії: {}", branchLocationId);

        try {
            String receiptNumber;

            if (branchLocationId != null) {
                receiptNumber = orderManagementService.generateReceiptNumber(branchLocationId);
            } else {
                // Якщо філія не вказана, використовуємо дефолтний код філії
                receiptNumber = receiptNumberGenerator.generate("DEF");
                log.debug("Використано дефолтний код філії для генерації номера квитанції");
            }

            log.info("Успішно згенеровано номер квитанції: {} для філії: {}", receiptNumber, branchLocationId);

            return ApiResponseUtils.ok(
                receiptNumber,
                "Успішно згенеровано номер квитанції: {}",
                receiptNumber
            );

        } catch (IllegalArgumentException e) {
            log.warn("Невірні параметри для генерації номера квитанції: {}", e.getMessage());
            return ApiResponseUtils.badRequest(
                "Невірні параметри запиту",
                "Не вдалося згенерувати номер квитанції. Причина: {}",
                e.getMessage()
            );
        } catch (Exception e) {
            log.error("Помилка при генерації номера квитанції для філії {}: {}", branchLocationId, e.getMessage(), e);
            return ApiResponseUtils.internalServerError(
                "Помилка сервера при генерації номера",
                "Не вдалося згенерувати номер квитанції. Причина: {}",
                e.getMessage()
            );
        }
    }
}
