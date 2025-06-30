package com.aksi.domain.document.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.document.dto.CreateDigitalSignatureRequest;
import com.aksi.api.document.dto.DigitalSignatureResponse;
import com.aksi.api.document.dto.DocumentPageResponse;
import com.aksi.api.document.dto.DocumentResponse;
import com.aksi.api.document.dto.GenerateReceiptRequest;
import com.aksi.api.document.dto.PageableInfo;
import com.aksi.api.document.dto.ReceiptResponse;
import com.aksi.api.document.dto.UpdateDocumentStatusRequest;
import com.aksi.domain.document.entity.DigitalSignatureEntity;
import com.aksi.domain.document.entity.DocumentEntity;
import com.aksi.domain.document.entity.ReceiptEntity;
import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;
import com.aksi.domain.document.exception.DigitalSignatureNotFoundException;
import com.aksi.domain.document.exception.DocumentNotFoundException;
import com.aksi.domain.document.exception.DocumentValidationException;
import com.aksi.domain.document.exception.ReceiptNotFoundException;
import com.aksi.domain.document.mapper.DocumentMapper;
import com.aksi.domain.document.repository.DigitalSignatureRepository;
import com.aksi.domain.document.repository.DocumentRepository;
import com.aksi.domain.document.repository.ReceiptRepository;
import com.aksi.domain.document.validation.DigitalSignatureValidator;
import com.aksi.domain.document.validation.DocumentValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service для Document Domain з API методами (DTO↔DTO) та Entity методами Базова версія за
 * еталонним принципом з AuthService.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

  private final DocumentRepository documentRepository;
  private final ReceiptRepository receiptRepository;
  private final DigitalSignatureRepository digitalSignatureRepository;
  private final DocumentValidator documentValidator;
  private final DigitalSignatureValidator digitalSignatureValidator;
  private final DocumentMapper documentMapper;

  // ===== API МЕТОДИ (для контролерів) - працюють з DTO =====

  /** Отримати документ за ID. */
  @Transactional(readOnly = true)
  public DocumentResponse getDocumentById(UUID documentId) {
    DocumentEntity entity = findEntityByIdOrThrow(documentMapper.uuidToLong(documentId));
    return documentMapper.toDocumentResponse(entity);
  }

  /** Отримати всі документи з пагінацією. */
  @Transactional(readOnly = true)
  public DocumentPageResponse getDocuments(Integer page, Integer size, String sort) {
    Pageable pageable = createPageable(page, size, sort);
    Page<DocumentEntity> documentsPage = documentRepository.findAll(pageable);
    List<DocumentResponse> documents =
        documentMapper.toDocumentResponseList(documentsPage.getContent());

    // Створити PageableInfo
    PageableInfo pageableInfo =
        new PageableInfo(
            documentsPage.getNumber(), // page
            documentsPage.getSize(), // size
            documentsPage.getTotalElements(), // totalElements
            documentsPage.getTotalPages(), // totalPages
            documentsPage.isLast(), // last
            documentsPage.isFirst(), // first
            documentsPage.getNumberOfElements() // numberOfElements
            );

    DocumentPageResponse response = new DocumentPageResponse();
    response.setContent(documents);
    response.setPageable(pageableInfo);
    response.setTotalElements(documentsPage.getTotalElements());
    response.setTotalPages(documentsPage.getTotalPages());
    response.setFirst(documentsPage.isFirst());
    response.setLast(documentsPage.isLast());
    response.setNumberOfElements(documentsPage.getNumberOfElements());
    return response;
  }

  /** Пошук документів за типом та статусом. */
  @Transactional(readOnly = true)
  public List<DocumentResponse> searchDocuments(DocumentType type, DocumentStatus status) {
    List<DocumentEntity> entities = documentRepository.findByTypeAndStatus(type, status);
    return documentMapper.toDocumentResponseList(entities);
  }

  /** Оновити статус документа. */
  public DocumentResponse updateDocumentStatus(
      UUID documentId, UpdateDocumentStatusRequest request) {
    DocumentEntity entity = findEntityByIdOrThrow(documentMapper.uuidToLong(documentId));

    DocumentStatus newStatus = documentMapper.apiToDomainDocumentStatus(request.getStatus());

    // Валідація переходу статусу
    documentValidator.validateStatusTransition(entity.getStatus(), newStatus);

    entity.setStatus(newStatus);
    DocumentEntity updatedEntity = documentRepository.save(entity);

    return documentMapper.toDocumentResponse(updatedEntity);
  }

  /** Видалити документ. */
  public void deleteDocument(UUID documentId) {
    DocumentEntity entity = findEntityByIdOrThrow(documentMapper.uuidToLong(documentId));

    // Валідація можливості видалення (тільки DRAFT документи можна видаляти)
    if (entity.getStatus() != DocumentStatus.DRAFT) {
      throw new DocumentValidationException(
          "Тільки документи зі статусом DRAFT можуть бути видалені. Поточний статус: "
              + entity.getStatus());
    }

    documentRepository.delete(entity);
  }

  // ===== RECEIPT API МЕТОДИ =====

  /** Отримати квитанцію за ID. */
  @Transactional(readOnly = true)
  public ReceiptResponse getReceiptById(UUID receiptId) {
    ReceiptEntity entity = findReceiptEntityByIdOrThrow(documentMapper.uuidToLong(receiptId));
    return documentMapper.toReceiptResponse(entity);
  }

  /** Отримати квитанцію за номером замовлення. */
  @Transactional(readOnly = true)
  public ReceiptResponse getReceiptByOrderId(UUID orderId) {
    ReceiptEntity entity =
        receiptRepository
            .findByOrderId(orderId)
            .orElseThrow(
                () -> new ReceiptNotFoundException("Receipt not found for orderId: " + orderId));
    return documentMapper.toReceiptResponse(entity);
  }

  /** Створити квитанцію - базова версія. */
  public ReceiptResponse createReceipt(UUID orderId, String receiptNumber) {
    ReceiptEntity entity =
        ReceiptEntity.builder()
            .orderId(orderId)
            .receiptNumber(receiptNumber)
            .generatedAt(LocalDateTime.now())
            .generatedBy(getCurrentUser())
            .isPrinted(false)
            .build();

    ReceiptEntity savedEntity = receiptRepository.save(entity);
    return documentMapper.toReceiptResponse(savedEntity);
  }

  /** Згенерувати квитанцію за запитом. */
  public ReceiptResponse generateReceipt(GenerateReceiptRequest request) {
    // TODO: Повна реалізація з обробкою всіх параметрів запиту
    String receiptNumber = "AKSI-" + System.currentTimeMillis();
    return createReceipt(request.getOrderId(), receiptNumber);
  }

  /** Позначити квитанцію як роздруковану. */
  public ReceiptResponse markReceiptAsPrinted(UUID receiptId) {
    ReceiptEntity entity = findReceiptEntityByIdOrThrow(documentMapper.uuidToLong(receiptId));

    if (!entity.canBePrinted()) {
      throw new DocumentValidationException(
          "Квитанція не може бути роздрукована без PDF документа");
    }

    entity.markAsPrinted();
    ReceiptEntity updatedEntity = receiptRepository.save(entity);

    return documentMapper.toReceiptResponse(updatedEntity);
  }

  // ===== DIGITAL SIGNATURE API МЕТОДИ =====

  /** Створити цифровий підпис - базова версія. */
  public DigitalSignatureResponse createDigitalSignature(CreateDigitalSignatureRequest request) {
    DigitalSignatureEntity entity = documentMapper.fromCreateDigitalSignatureRequest(request);
    entity.setSignedAt(LocalDateTime.now());

    // Валідація entity
    digitalSignatureValidator.validateForCreate(entity);

    // Обробка даних підпису та встановлення URL зображення
    String imageUrl = processSignatureData(request.getSignatureData());
    entity.setImageUrl(imageUrl);

    DigitalSignatureEntity savedEntity = digitalSignatureRepository.save(entity);
    return documentMapper.toDigitalSignatureResponse(savedEntity);
  }

  /** Отримати підпис за ID. */
  @Transactional(readOnly = true)
  public DigitalSignatureResponse getDigitalSignatureById(UUID signatureId) {
    DigitalSignatureEntity entity =
        findDigitalSignatureEntityByIdOrThrow(documentMapper.uuidToLong(signatureId));
    return documentMapper.toDigitalSignatureResponse(entity);
  }

  // ===== ENTITY МЕТОДИ (для внутрішньої логіки) =====

  /** Знайти DocumentEntity за ID. */
  @Transactional(readOnly = true)
  public Optional<DocumentEntity> findEntityById(Long id) {
    return documentRepository.findById(id);
  }

  /** Знайти DocumentEntity за ID або викинути exception. */
  @Transactional(readOnly = true)
  public DocumentEntity findEntityByIdOrThrow(Long id) {
    return findEntityById(id)
        .orElseThrow(() -> new DocumentNotFoundException("Document not found with id: " + id));
  }

  /** Знайти ReceiptEntity за ID. */
  @Transactional(readOnly = true)
  public Optional<ReceiptEntity> findReceiptEntityById(Long id) {
    return receiptRepository.findById(id);
  }

  /** Знайти ReceiptEntity за ID або викинути exception. */
  @Transactional(readOnly = true)
  public ReceiptEntity findReceiptEntityByIdOrThrow(Long id) {
    return findReceiptEntityById(id)
        .orElseThrow(() -> new ReceiptNotFoundException("Receipt not found with id: " + id));
  }

  /** Знайти DigitalSignatureEntity за ID. */
  @Transactional(readOnly = true)
  public Optional<DigitalSignatureEntity> findDigitalSignatureEntityById(Long id) {
    return digitalSignatureRepository.findById(id);
  }

  /** Знайти DigitalSignatureEntity за ID або викинути exception. */
  @Transactional(readOnly = true)
  public DigitalSignatureEntity findDigitalSignatureEntityByIdOrThrow(Long id) {
    return findDigitalSignatureEntityById(id)
        .orElseThrow(
            () ->
                new DigitalSignatureNotFoundException(
                    "Digital signature not found with id: " + id));
  }

  /** Створити DocumentEntity. */
  public DocumentEntity createEntity(DocumentEntity entity) {
    documentValidator.validateForCreate(entity);
    return documentRepository.save(entity);
  }

  /** Оновити DocumentEntity. */
  public DocumentEntity updateEntity(DocumentEntity entity) {
    DocumentEntity existing = findEntityByIdOrThrow(entity.getId());
    documentValidator.validateForUpdate(existing, entity);
    return documentRepository.save(entity);
  }

  /** Видалити DocumentEntity за ID. */
  public void deleteEntity(Long id) {
    DocumentEntity entity = findEntityByIdOrThrow(id);

    // Валідація можливості видалення (тільки DRAFT документи можна видаляти)
    if (entity.getStatus() != DocumentStatus.DRAFT) {
      throw new DocumentValidationException(
          "Тільки документи зі статусом DRAFT можуть бути видалені. Поточний статус: "
              + entity.getStatus());
    }

    documentRepository.delete(entity);
  }

  // ===== BUSINESS LOGIC METHODS =====

  /** Перевірити чи документ готовий для завантаження. */
  @Transactional(readOnly = true)
  public boolean isDocumentReadyForDownload(UUID documentId) {
    return findEntityById(documentMapper.uuidToLong(documentId))
        .map(DocumentEntity::canBeDownloaded)
        .orElse(false);
  }

  /** Отримати кількість документів за статусом. */
  @Transactional(readOnly = true)
  public long countDocumentsByStatus(DocumentStatus status) {
    return documentRepository.countByStatus(status);
  }

  /** Перевірити чи квитанція готова для друку. */
  @Transactional(readOnly = true)
  public boolean isReceiptReadyForPrint(UUID receiptId) {
    return findReceiptEntityById(documentMapper.uuidToLong(receiptId))
        .map(ReceiptEntity::canBePrinted)
        .orElse(false);
  }

  // ===== HELPER МЕТОДИ =====

  /** Отримати поточного користувача з Security Context. */
  private String getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null
        && authentication.isAuthenticated()
        && !"anonymousUser".equals(authentication.getPrincipal())) {
      return authentication.getName();
    }
    return "System"; // Fallback для системних операцій
  }

  /**
   * Обробити дані підпису та створити URL зображення TODO: Реалізувати збереження зображення
   * підпису у файловій системі або хмарному сховищі.
   */
  private String processSignatureData(String signatureData) {
    if (signatureData == null || signatureData.trim().isEmpty()) {
      return null;
    }

    // Базова реалізація - генерація placeholder URL
    // В production версії тут буде збереження зображення та повернення реального URL
    String timestamp = String.valueOf(System.currentTimeMillis());
    return "/api/signatures/images/" + timestamp + ".png";
  }

  /** Створити Pageable з параметрів запиту. */
  private Pageable createPageable(Integer page, Integer size, String sort) {
    if (sort != null && !sort.trim().isEmpty()) {
      String[] sortParts = sort.split(",");
      String property = sortParts[0];
      Sort.Direction direction =
          sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])
              ? Sort.Direction.DESC
              : Sort.Direction.ASC;
      return PageRequest.of(page, size, Sort.by(direction, property));
    }
    return PageRequest.of(page, size);
  }
}
