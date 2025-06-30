package com.aksi.domain.document.mapper;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Named;

import com.aksi.api.document.dto.CreateDigitalSignatureRequest;
import com.aksi.api.document.dto.DigitalSignatureResponse;
import com.aksi.api.document.dto.DocumentResponse;
import com.aksi.api.document.dto.ReceiptResponse;
import com.aksi.domain.document.entity.DigitalSignatureEntity;
import com.aksi.domain.document.entity.DocumentEntity;
import com.aksi.domain.document.entity.ReceiptEntity;
import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;
import com.aksi.domain.document.enums.SignatureType;

/**
 * MapStruct Mapper для Document Domain Entity↔DTO конвертації Спрощена версія за еталоном
 * AuthMapper
 */
@Mapper(componentModel = "spring")
public interface DocumentMapper {

  // ===== BASIC UTILITY MAPPINGS =====

  /** Long (Entity) → UUID (DTO) Аналог з AuthMapper */
  @Named("longToUuid")
  default UUID longToUuid(Long id) {
    return id != null ? UUID.nameUUIDFromBytes(id.toString().getBytes()) : null;
  }

  /** UUID (DTO) → Long (Entity) */
  @Named("uuidToLong")
  default Long uuidToLong(UUID uuid) {
    return uuid != null ? (long) Math.abs(uuid.hashCode()) : null;
  }

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) Аналог з AuthMapper */
  @Named("localDateTimeToOffsetDateTime")
  default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity) */
  @Named("offsetDateTimeToLocalDateTime")
  default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }

  /** String → URI conversion */
  @Named("stringToUri")
  default URI stringToUri(String url) {
    if (url == null || url.trim().isEmpty()) return null;
    try {
      return URI.create(url);
    } catch (Exception e) {
      return null;
    }
  }

  /** URI → String conversion */
  @Named("uriToString")
  default String uriToString(URI uri) {
    return uri != null ? uri.toString() : null;
  }

  // ===== ENUM MAPPINGS =====

  /** Domain DocumentType → API DocumentType */
  @Named("domainToApiDocumentType")
  default com.aksi.api.document.dto.DocumentType domainToApiDocumentType(DocumentType domainType) {
    return domainType != null
        ? com.aksi.api.document.dto.DocumentType.fromValue(domainType.name())
        : null;
  }

  /** API DocumentType → Domain DocumentType */
  @Named("apiToDomainDocumentType")
  default DocumentType apiToDomainDocumentType(com.aksi.api.document.dto.DocumentType apiType) {
    return apiType != null ? DocumentType.valueOf(apiType.getValue()) : null;
  }

  /** Domain DocumentStatus → API DocumentStatus */
  @Named("domainToApiDocumentStatus")
  default com.aksi.api.document.dto.DocumentStatus domainToApiDocumentStatus(
      DocumentStatus domainStatus) {
    return domainStatus != null
        ? com.aksi.api.document.dto.DocumentStatus.fromValue(domainStatus.name())
        : null;
  }

  /** API DocumentStatus → Domain DocumentStatus */
  @Named("apiToDomainDocumentStatus")
  default DocumentStatus apiToDomainDocumentStatus(
      com.aksi.api.document.dto.DocumentStatus apiStatus) {
    return apiStatus != null ? DocumentStatus.valueOf(apiStatus.getValue()) : null;
  }

  /** Domain SignatureType → API SignatureType */
  @Named("domainToApiSignatureType")
  default com.aksi.api.document.dto.SignatureType domainToApiSignatureType(
      SignatureType domainType) {
    return domainType != null
        ? com.aksi.api.document.dto.SignatureType.fromValue(domainType.name())
        : null;
  }

  /** API SignatureType → Domain SignatureType */
  @Named("apiToDomainSignatureType")
  default SignatureType apiToDomainSignatureType(com.aksi.api.document.dto.SignatureType apiType) {
    return apiType != null ? SignatureType.valueOf(apiType.getValue()) : null;
  }

  // ===== SIMPLE ENTITY MAPPINGS =====

  /** DocumentEntity → DocumentResponse (базові поля) */
  default DocumentResponse toDocumentResponse(DocumentEntity entity) {
    if (entity == null) return null;

    DocumentResponse response = new DocumentResponse();
    response.setId(longToUuid(entity.getId()));
    response.setDocumentNumber(entity.getDocumentNumber());
    response.setType(domainToApiDocumentType(entity.getType()));
    response.setStatus(domainToApiDocumentStatus(entity.getStatus()));
    response.setRelatedEntityId(entity.getRelatedEntityId());
    response.setFileName(entity.getFileName());
    response.setFilePath(entity.getFilePath());
    response.setFileSize(entity.getFileSize());
    response.setMimeType(entity.getMimeType());
    response.setDownloadUrl(stringToUri(entity.getDownloadUrl()));
    response.setCreatedAt(localDateTimeToOffsetDateTime(entity.getCreatedAt()));
    response.setUpdatedAt(localDateTimeToOffsetDateTime(entity.getUpdatedAt()));
    response.setCreatedBy(entity.getCreatedBy());
    // metadata - складний об'єкт, обробляється в Service
    return response;
  }

  /** ReceiptEntity → ReceiptResponse (базові поля) */
  default ReceiptResponse toReceiptResponse(ReceiptEntity entity) {
    if (entity == null) return null;

    ReceiptResponse response = new ReceiptResponse();
    response.setId(longToUuid(entity.getId()));
    response.setOrderId(entity.getOrderId());
    response.setReceiptNumber(entity.getReceiptNumber());
    response.setIsPrinted(entity.getIsPrinted());
    response.setPrintedAt(localDateTimeToOffsetDateTime(entity.getPrintedAt()));
    response.setGeneratedAt(localDateTimeToOffsetDateTime(entity.getGeneratedAt()));
    response.setGeneratedBy(entity.getGeneratedBy());
    // data, pdfDocument, qrCode, signatures - складні об'єкти, обробляються в Service
    return response;
  }

  /** DigitalSignatureEntity → DigitalSignatureResponse (базові поля) */
  default DigitalSignatureResponse toDigitalSignatureResponse(DigitalSignatureEntity entity) {
    if (entity == null) return null;

    DigitalSignatureResponse response = new DigitalSignatureResponse();
    response.setId(longToUuid(entity.getId()));
    response.setDocumentId(entity.getDocumentId());
    response.setType(domainToApiSignatureType(entity.getType()));
    response.setSignerName(entity.getSignerName());
    response.setSignerRole(entity.getSignerRole());
    response.setSignedAt(localDateTimeToOffsetDateTime(entity.getSignedAt()));
    response.setIsValid(entity.getIsValid());
    response.setImageUrl(stringToUri(entity.getImageUrl()));
    response.setIpAddress(entity.getIpAddress());
    // metadata - складний об'єкт, обробляється в Service
    return response;
  }

  /** CreateDigitalSignatureRequest → DigitalSignatureEntity (базові поля) */
  default DigitalSignatureEntity fromCreateDigitalSignatureRequest(
      CreateDigitalSignatureRequest request) {
    if (request == null) return null;

    return DigitalSignatureEntity.builder()
        .documentId(request.getDocumentId())
        .type(apiToDomainSignatureType(request.getType()))
        .signerName(request.getSignerName())
        .signerRole(request.getSignerRole())
        .isValid(true)
        // signedAt, imageUrl, metadata, ipAddress - встановлюються в Service
        .build();
  }

  /** List mappings */
  List<DocumentResponse> toDocumentResponseList(List<DocumentEntity> entities);

  List<ReceiptResponse> toReceiptResponseList(List<ReceiptEntity> entities);

  List<DigitalSignatureResponse> toDigitalSignatureResponseList(
      List<DigitalSignatureEntity> entities);
}
