package com.aksi.api.document;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.document.dto.DocumentPageResponse;
import com.aksi.api.document.dto.DocumentResponse;
import com.aksi.api.document.dto.DocumentStatus;
import com.aksi.api.document.dto.DocumentType;
import com.aksi.api.document.dto.UpdateDocumentStatusRequest;
import com.aksi.domain.document.service.DocumentService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP Controller для DocumentsApi
 * Відповідальність: тільки HTTP делегація до DocumentService
 */
@Controller
@RequiredArgsConstructor
public class DocumentsApiController implements DocumentsApi {

    private final DocumentService documentService;

    @Override
    public ResponseEntity<DocumentResponse> getDocumentById(UUID id) {
        DocumentResponse response = documentService.getDocumentById(id);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<DocumentPageResponse> getDocuments(
            DocumentType type,
            DocumentStatus status,
            UUID relatedEntityId,
            LocalDate startDate,
            LocalDate endDate,
            Integer page,
            Integer size,
            String sort) {

        DocumentPageResponse response = documentService.getDocuments(page, size, sort);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<DocumentResponse> updateDocumentStatus(
            UUID id,
            UpdateDocumentStatusRequest updateDocumentStatusRequest) {

        DocumentResponse response = documentService.updateDocumentStatus(id, updateDocumentStatusRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteDocument(UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(UUID id) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
}
