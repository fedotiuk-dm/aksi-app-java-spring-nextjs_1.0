package com.aksi.api;

import com.aksi.service.order.ReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

/**
 * REST контролер для роботи з квитанціями замовлень.
 */
@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
@Slf4j
public class ReceiptController {

    private final ReceiptService receiptService;

    /**
     * Генерує PDF-квитанцію для замовлення
     *
     * @param orderId ID замовлення
     * @return PDF-документ квитанції
     */
    /**
     * Генерує PDF-квитанцію для замовлення
     * URL: /api/receipts/{orderId}
     *
     * @param orderId ID замовлення
     * @return PDF-документ квитанції
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<byte[]> generateReceipt(@PathVariable UUID orderId) {
        log.info("REST request to generate receipt for order ID: {}", orderId);
        ByteArrayOutputStream outputStream = receiptService.generateReceipt(orderId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "receipt_" + orderId + ".pdf");
        
        return new ResponseEntity<>(
            outputStream.toByteArray(),
            headers,
            HttpStatus.OK
        );
    }

    /**
     * Відправляє квитанцію на email клієнта
     *
     * @param orderId ID замовлення
     * @param email email (якщо не вказаний, використовується email з профілю клієнта)
     * @return статус успішності відправки
     */
    /**
     * Відправляє квитанцію на email клієнта
     * URL: /api/receipts/{orderId}/send
     *
     * @param orderId ID замовлення
     * @param email email (якщо не вказаний, використовується email з профілю клієнта)
     * @return статус успішності відправки
     */
    @PostMapping("/{orderId}/send")
    public ResponseEntity<Boolean> sendReceiptByEmail(
            @PathVariable UUID orderId,
            @RequestParam(required = false) String email) {
        log.info("REST request to send receipt by email for order ID: {}", orderId);
        boolean success = receiptService.sendReceiptByEmail(orderId, email);
        
        return ResponseEntity.ok(success);
    }
}
