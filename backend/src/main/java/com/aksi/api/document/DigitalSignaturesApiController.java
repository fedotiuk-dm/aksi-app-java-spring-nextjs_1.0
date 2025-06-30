package com.aksi.api.document;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.document.dto.CreateDigitalSignatureRequest;
import com.aksi.api.document.dto.DigitalSignatureResponse;
import com.aksi.domain.document.service.DocumentService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP Controller для DigitalSignaturesApi Відповідальність: тільки HTTP делегація до
 * DocumentService
 */
@Controller
@RequiredArgsConstructor
public class DigitalSignaturesApiController implements DigitalSignaturesApi {

  private final DocumentService documentService;

  @Override
  public ResponseEntity<DigitalSignatureResponse> createDigitalSignature(
      CreateDigitalSignatureRequest createDigitalSignatureRequest) {
    DigitalSignatureResponse response =
        documentService.createDigitalSignature(createDigitalSignatureRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<DigitalSignatureResponse> getDigitalSignatureById(UUID id) {
    DigitalSignatureResponse response = documentService.getDigitalSignatureById(id);
    return ResponseEntity.ok(response);
  }
}
