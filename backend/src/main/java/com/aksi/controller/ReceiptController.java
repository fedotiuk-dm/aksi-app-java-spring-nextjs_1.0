package com.aksi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.receipt.ReceiptsApi;
import com.aksi.api.receipt.dto.EmailReceiptRequest;
import com.aksi.api.receipt.dto.EmailReceiptResponse;
import com.aksi.api.receipt.dto.ReceiptPreviewRequest;
import com.aksi.api.receipt.dto.ReceiptTemplate;
import com.aksi.service.receipt.ReceiptService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for receipt generation operations. Thin layer between OpenAPI and service with
 * logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class ReceiptController implements ReceiptsApi {

  private final ReceiptService receiptService;

  @Override
  public ResponseEntity<Resource> generateOrderReceipt(UUID orderId, String locale) {
    log.debug("Generating receipt for order: {}, locale: {}", orderId, locale);

    Resource resource = receiptService.generateOrderReceipt(orderId, locale);
    log.debug("Receipt generated successfully for order: {}", orderId);
    return ResponseEntity.ok(resource);
  }

  @Override
  public ResponseEntity<Resource> generateReceiptPreview(ReceiptPreviewRequest request) {
    log.debug("Generating receipt preview");

    Resource resource = receiptService.generateReceiptPreview(request);
    log.debug("Receipt preview generated successfully");
    return ResponseEntity.ok(resource);
  }

  @Override
  public ResponseEntity<EmailReceiptResponse> emailOrderReceipt(
      Long orderId, EmailReceiptRequest request) {
    log.debug("Emailing receipt for order: {}", orderId);

    EmailReceiptResponse response = receiptService.emailOrderReceipt(orderId, request);
    log.debug("Receipt email sent successfully for order: {}", orderId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<ReceiptTemplate>> getReceiptTemplates() {
    log.debug("Getting receipt templates");

    List<ReceiptTemplate> templates = receiptService.getAvailableTemplates();
    log.debug("Retrieved {} receipt templates", templates.size());
    return ResponseEntity.ok(templates);
  }
}
