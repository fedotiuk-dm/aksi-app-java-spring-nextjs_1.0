package com.aksi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.receipt.ReceiptsApi;
import com.aksi.api.receipt.dto.EmailReceiptRequest;
import com.aksi.api.receipt.dto.EmailReceiptResponse;
import com.aksi.api.receipt.dto.ReceiptPreviewRequest;
import com.aksi.api.receipt.dto.ReceiptTemplate;
import com.aksi.service.receipt.ReceiptService;

import lombok.RequiredArgsConstructor;

/** REST controller for receipt generation operations. Thin layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class ReceiptController implements ReceiptsApi {

  private final ReceiptService receiptService;

  @Override
  public ResponseEntity<Resource> generateOrderReceipt(UUID orderId, String locale) {
    Resource resource = receiptService.generateOrderReceipt(orderId, locale);
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"receipt-" + orderId + ".pdf\"");
    headers.set(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
    headers.set(HttpHeaders.PRAGMA, "no-cache");
    headers.set(HttpHeaders.EXPIRES, "0");
    
    return ResponseEntity.ok()
        .headers(headers)
        .body(resource);
  }

  @Override
  public ResponseEntity<Resource> generateReceiptPreview(ReceiptPreviewRequest request) {
    Resource resource = receiptService.generateReceiptPreview(request);
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"receipt-preview.pdf\"");
    headers.set(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
    headers.set(HttpHeaders.PRAGMA, "no-cache");
    headers.set(HttpHeaders.EXPIRES, "0");
    
    return ResponseEntity.ok()
        .headers(headers)
        .body(resource);
  }

  @Override
  public ResponseEntity<EmailReceiptResponse> emailOrderReceipt(
      UUID orderId, @Nullable EmailReceiptRequest emailReceiptRequest) {
    EmailReceiptResponse response = receiptService.emailOrderReceipt(orderId, emailReceiptRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<ReceiptTemplate>> getReceiptTemplates() {
    List<ReceiptTemplate> templates = receiptService.getAvailableTemplates();
    return ResponseEntity.ok(templates);
  }
}
