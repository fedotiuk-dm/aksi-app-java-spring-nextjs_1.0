package com.aksi.domain.branch.mapper;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.aksi.api.branch.dto.ReceiptNumberParseResponse;
import com.aksi.api.branch.dto.ReceiptNumberResponse;
import com.aksi.api.branch.dto.ReceiptValidationResponse;
import com.aksi.domain.branch.entity.BranchEntity;

/** MapStruct маппер для конвертації Receipt Number типів */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReceiptNumberMapper {

  /** Створити ReceiptNumberResponse з даних філії та згенерованого номера */
  @Mapping(target = "receiptNumber", source = "receiptNumber")
  @Mapping(target = "branchId", source = "branch.uuid")
  @Mapping(target = "branchCode", source = "branch.code")
  @Mapping(target = "year", expression = "java(java.time.Year.now().getValue())")
  @Mapping(target = "sequenceNumber", source = "branch.receiptCounter")
  @Mapping(
      target = "generatedAt",
      expression = "java(convertToOffsetDateTime(java.time.LocalDateTime.now()))")
  ReceiptNumberResponse toReceiptNumberResponse(BranchEntity branch, String receiptNumber);

  /** Створити ReceiptValidationResponse для валідації */
  @Mapping(target = "receiptNumber", source = "receiptNumber")
  @Mapping(target = "isValid", source = "isValid")
  @Mapping(target = "errors", source = "errors")
  @Mapping(target = "branchCode", source = "branchCode")
  ReceiptValidationResponse toReceiptValidationResponse(
      String receiptNumber, boolean isValid, java.util.List<String> errors, String branchCode);

  /** Створити ReceiptNumberParseResponse з розбором номера */
  @Mapping(target = "receiptNumber", source = "receiptNumber")
  @Mapping(target = "branchCode", source = "branchCode")
  @Mapping(target = "year", source = "year")
  @Mapping(target = "sequenceNumber", source = "sequenceNumber")
  @Mapping(target = "branchInfo", source = "branch")
  ReceiptNumberParseResponse toReceiptNumberParseResponse(
      String receiptNumber,
      String branchCode,
      Integer year,
      Integer sequenceNumber,
      BranchEntity branch);

  /** Конвертація BranchEntity → BranchSummaryResponse для ParseResponse */
  @Mapping(target = "id", source = "uuid")
  @Mapping(target = "code", source = "code")
  @Mapping(target = "name", source = "name")
  @Mapping(target = "city", source = "city")
  com.aksi.api.branch.dto.BranchSummaryResponse toBranchSummaryResponse(BranchEntity entity);

  // Utility методи

  /** Конвертація LocalDateTime → OffsetDateTime */
  default OffsetDateTime convertToOffsetDateTime(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** Витягти код філії з номера квитанції (формат: BRANCH_CODE-YEAR-SEQUENCE) */
  default String extractBranchCodeFromReceiptNumber(String receiptNumber) {
    if (receiptNumber == null || !receiptNumber.contains("-")) return null;
    return receiptNumber.split("-")[0];
  }

  /** Витягти рік з номера квитанції */
  default Integer extractYearFromReceiptNumber(String receiptNumber) {
    if (receiptNumber == null) return null;

    String[] parts = receiptNumber.split("-");
    if (parts.length < 2) return null;

    try {
      return Integer.valueOf(parts[1]);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  /** Витягти порядковий номер з номера квитанції */
  default Integer extractSequenceFromReceiptNumber(String receiptNumber) {
    if (receiptNumber == null) return null;

    String[] parts = receiptNumber.split("-");
    if (parts.length < 3) return null;

    try {
      return Integer.valueOf(parts[2]);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  /** Валідувати формат номера квитанції */
  default boolean isValidReceiptNumberFormat(String receiptNumber) {
    if (receiptNumber == null || receiptNumber.trim().isEmpty()) return false;

    String[] parts = receiptNumber.split("-");
    return parts.length == 3
        && parts[0].matches("^[A-Z0-9]+$")
        && // Код філії
        parts[1].matches("^\\d{4}$")
        && // Рік (4 цифри)
        parts[2].matches("^\\d{6}$"); // Порядковий номер (6 цифр)
  }
}
