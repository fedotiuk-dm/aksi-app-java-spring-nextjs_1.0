package com.aksi.api.branch;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.branch.dto.GenerateReceiptNumberRequest;
import com.aksi.api.branch.dto.ParseReceiptNumberRequest;
import com.aksi.api.branch.dto.ReceiptNumberParseResponse;
import com.aksi.api.branch.dto.ReceiptNumberResponse;
import com.aksi.api.branch.dto.ReceiptValidationResponse;
import com.aksi.api.branch.dto.ValidateReceiptNumberRequest;
import com.aksi.domain.branch.service.ReceiptNumberService;

import lombok.RequiredArgsConstructor;

/** HTTP контролер для управління номерами квитанцій Відповідальність: тільки HTTP логіка */
@RestController
@RequiredArgsConstructor
public class ReceiptNumbersApiController implements ReceiptNumbersApi {

  private final ReceiptNumberService receiptNumberService;

  @Override
  public ResponseEntity<ReceiptNumberResponse> generateReceiptNumber(
      GenerateReceiptNumberRequest generateReceiptNumberRequest) {
    ReceiptNumberResponse response =
        receiptNumberService.generateReceiptNumber(generateReceiptNumberRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<ReceiptValidationResponse> validateReceiptNumber(
      ValidateReceiptNumberRequest validateReceiptNumberRequest) {
    ReceiptValidationResponse response =
        receiptNumberService.validateReceiptNumber(validateReceiptNumberRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ReceiptNumberParseResponse> parseReceiptNumber(
      ParseReceiptNumberRequest parseReceiptNumberRequest) {
    ReceiptNumberParseResponse response =
        receiptNumberService.parseReceiptNumber(parseReceiptNumberRequest);
    return ResponseEntity.ok(response);
  }
}
