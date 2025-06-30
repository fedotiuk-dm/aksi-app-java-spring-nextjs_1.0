package com.aksi.api.document;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.document.dto.GenerateReceiptRequest;
import com.aksi.api.document.dto.ReceiptPageResponse;
import com.aksi.api.document.dto.ReceiptResponse;
import com.aksi.api.document.dto.UpdateReceiptRequest;
import com.aksi.domain.document.service.DocumentService;

import lombok.RequiredArgsConstructor;

/** HTTP Controller для ReceiptsApi Відповідальність: тільки HTTP делегація до DocumentService */
@Controller
@RequiredArgsConstructor
public class ReceiptsApiController implements ReceiptsApi {

  private final DocumentService documentService;

  @Override
  public ResponseEntity<ReceiptResponse> createReceipt(
      GenerateReceiptRequest generateReceiptRequest) {
    ReceiptResponse response = documentService.generateReceipt(generateReceiptRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<ReceiptResponse> getReceiptById(UUID id) {
    ReceiptResponse response = documentService.getReceiptById(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ReceiptResponse> getReceiptByNumber(String receiptNumber) {
    return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
  }

  @Override
  public ResponseEntity<ReceiptPageResponse> getReceipts(
      UUID orderId,
      UUID branchId,
      UUID clientId,
      LocalDate startDate,
      LocalDate endDate,
      Integer page,
      Integer size) {

    return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
  }

  @Override
  public ResponseEntity<ReceiptResponse> printReceipt(UUID id) {
    ReceiptResponse response = documentService.markReceiptAsPrinted(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ReceiptResponse> updateReceipt(
      UUID id, UpdateReceiptRequest updateReceiptRequest) {
    return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
  }
}
