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
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.receipt.EmailReceiptRequest;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.service.ReceiptService;

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
    
    @GetMapping("/{orderId}")
    @Operation(summary = "Отримати дані для квитанції",
               description = "Повертає структуровані дані для формування квитанції за ID замовлення")
    @ApiResponse(responseCode = "200", description = "Дані квитанції успішно отримано",
            content = @Content(schema = @Schema(implementation = ReceiptDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<ReceiptDTO> getReceiptData(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId) {
        
        log.info("REST request to get receipt data for order ID: {}", orderId);
        
        ReceiptGenerationRequest request = new ReceiptGenerationRequest(orderId, "PDF", true);
        ReceiptDTO receiptData = receiptService.generateReceipt(request);
        return ResponseEntity.ok(receiptData);
    }
    
    @PostMapping("/pdf")
    @Operation(summary = "Згенерувати PDF-квитанцію",
               description = "Генерує PDF-квитанцію для замовлення з вказаними параметрами")
    @ApiResponse(responseCode = "200", description = "PDF-квитанція успішно згенерована")
    @ApiResponse(responseCode = "400", description = "Некоректний запит")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<byte[]> generatePdfReceipt(
            @Parameter(description = "Параметри генерації квитанції", required = true)
            @Valid @RequestBody ReceiptGenerationRequest request) {
        
        log.info("REST request to generate PDF receipt for order ID: {}", request.getOrderId());
        
        byte[] pdfContent = receiptService.generatePdfReceipt(request);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "receipt_" + request.getOrderId() + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
    }
    
    @PostMapping("/email")
    @Operation(summary = "Відправити квитанцію на email",
               description = "Відправляє PDF-квитанцію на вказаний email")
    @ApiResponse(responseCode = "200", description = "Квитанція успішно відправлена")
    @ApiResponse(responseCode = "400", description = "Некоректний запит")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<Void> sendReceiptByEmail(
            @Parameter(description = "Параметри відправки квитанції", required = true)
            @Valid @RequestBody EmailReceiptRequest request) {
        
        log.info("REST request to send receipt by email for order ID: {}", request.getOrderId());
        
        receiptService.emailReceipt(request);
        
        return ResponseEntity.ok().build();
    }
} 