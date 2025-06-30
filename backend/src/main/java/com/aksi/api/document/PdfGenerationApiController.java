package com.aksi.api.document;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.document.dto.DocumentResponse;
import com.aksi.api.document.dto.GeneratePdfRequest;
import com.aksi.api.document.dto.ReceiptTemplate;
import com.aksi.domain.document.service.PdfService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP Controller для PdfGenerationApi
 * Відповідальність: тільки HTTP делегація до PdfService
 */
@Controller
@RequiredArgsConstructor
public class PdfGenerationApiController implements PdfGenerationApi {

    private final PdfService pdfService;

    @Override
    public ResponseEntity<DocumentResponse> generateReceiptPdf(UUID id, GeneratePdfRequest generatePdfRequest) {
        DocumentResponse response = pdfService.generateReceiptPdf(id, generatePdfRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> getReceiptPdf(UUID id, ReceiptTemplate template) {
        // TODO: Реалізувати отримання PDF як Resource
        byte[] pdfBytes = pdfService.getReceiptPdf(id, template);
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
}
