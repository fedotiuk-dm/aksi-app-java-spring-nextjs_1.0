package com.aksi.domain.document.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.document.entity.DigitalSignatureEntity;
import com.aksi.domain.document.entity.ReceiptEntity;
import com.aksi.domain.document.enums.SignatureType;
import com.aksi.domain.document.exception.SignatureValidationException;
import com.aksi.domain.document.repository.DigitalSignatureRepository;

import lombok.RequiredArgsConstructor;

/** Validator для business rules цифрових підписів */
@Component
@RequiredArgsConstructor
public class DigitalSignatureValidator {

  private final DigitalSignatureRepository signatureRepository;

  /** Валідація для створення підпису */
  public void validateForCreate(DigitalSignatureEntity signature) {
    validateType(signature.getType());
    validateSignerInfo(signature);
    validateDuplicateSignature(signature);
    validatePhysicalPresenceRequirement(signature);
  }

  /** Валідація для оновлення підпису */
  public void validateForUpdate(DigitalSignatureEntity existing, DigitalSignatureEntity updated) {
    validateCanBeModified(existing);

    // Тип підпису не може змінюватися
    if (!existing.getType().equals(updated.getType())) {
      throw new SignatureValidationException("Тип підпису не може бути змінений");
    }

    // Документ не може змінюватися
    if (!existing.getDocumentId().equals(updated.getDocumentId())) {
      throw new SignatureValidationException("Документ підпису не може бути змінений");
    }

    validateSignerInfo(updated);
  }

  /** Валідація типу підпису */
  private void validateType(SignatureType type) {
    if (type == null) {
      throw new SignatureValidationException("Тип підпису є обов'язковим");
    }
  }

  /** Валідація інформації про підписувача */
  private void validateSignerInfo(DigitalSignatureEntity signature) {
    if (signature.getSignerName() == null || signature.getSignerName().trim().isEmpty()) {
      throw SignatureValidationException.missingSignerInfo();
    }

    if (signature.getSignerRole() == null || signature.getSignerRole().trim().isEmpty()) {
      throw SignatureValidationException.missingSignerInfo();
    }
  }

  /** Валідація дублікатів підписів */
  private void validateDuplicateSignature(DigitalSignatureEntity signature) {
    if (signature.getDocumentId() != null && signature.getType() != null) {
      boolean exists =
          signatureRepository
              .findByDocumentIdAndType(signature.getDocumentId(), signature.getType())
              .isPresent();

      if (exists) {
        throw SignatureValidationException.duplicateSignature(signature.getType());
      }
    }

    if (signature.getReceipt() != null && signature.getType() != null) {
      boolean exists =
          signatureRepository
              .findByReceiptAndType(signature.getReceipt(), signature.getType())
              .isPresent();

      if (exists) {
        throw SignatureValidationException.duplicateSignature(signature.getType());
      }
    }
  }

  /** Валідація вимоги фізичної присутності */
  private void validatePhysicalPresenceRequirement(DigitalSignatureEntity signature) {
    if (signature.getType().requiresPhysicalPresence()) {
      if (signature.getIpAddress() == null || signature.getIpAddress().trim().isEmpty()) {
        throw new SignatureValidationException(
            "Підпис типу " + signature.getType() + " потребує IP адреси");
      }
    }
  }

  /** Валідація можливості модифікації */
  private void validateCanBeModified(DigitalSignatureEntity signature) {
    if (signature.isSigned()) {
      throw new SignatureValidationException("Підписаний документ не може бути модифікований");
    }

    if (!signature.isValid()) {
      throw new SignatureValidationException("Недійсний підпис не може бути модифікований");
    }
  }

  /** Валідація зображення підпису */
  public void validateSignatureImage(DigitalSignatureEntity signature) {
    if (!signature.getType().canBeStoredAsImage()) {
      throw new SignatureValidationException(
          "Підпис типу " + signature.getType() + " не може зберігатися як зображення");
    }

    if (!signature.hasImage()) {
      throw new SignatureValidationException("Відсутнє зображення підпису");
    }
  }

  /** Валідація можливості підпису документа */
  public void validateCanSignDocument(
      UUID documentId, SignatureType signatureType, String signerName) {
    // Перевірка існування підпису
    if (signatureRepository.findByDocumentIdAndType(documentId, signatureType).isPresent()) {
      throw SignatureValidationException.duplicateSignature(signatureType);
    }

    // Перевірка авторизації підписувача
    validateSignerAuthorization(signerName, signatureType);
  }

  /** Валідація можливості підпису квитанції */
  public void validateCanSignReceipt(
      ReceiptEntity receipt, SignatureType signatureType, String signerName) {
    // Перевірка існування підпису
    if (signatureRepository.findByReceiptAndType(receipt, signatureType).isPresent()) {
      throw SignatureValidationException.duplicateSignature(signatureType);
    }

    // Перевірка авторизації підписувача
    validateSignerAuthorization(signerName, signatureType);

    // Перевірка готовності квитанції до підпису
    if (!receipt.hasPdfDocument()) {
      throw new SignatureValidationException(
          "Квитанція не готова до підпису - відсутній PDF документ");
    }
  }

  /** Валідація авторизації підписувача */
  private void validateSignerAuthorization(String signerName, SignatureType signatureType) {
    // Базова перевірка - можна розширити бізнес-правилами
    if (signerName == null || signerName.trim().isEmpty()) {
      throw SignatureValidationException.missingSignerInfo();
    }

    // Перевірка прав для операторських підписів
    if (signatureType.isOperatorSignature()) {
      validateOperatorPermissions(signerName);
    }
  }

  /** Валідація прав оператора */
  private void validateOperatorPermissions(String operatorName) {
    // Тут можна додати перевірку ролей користувача
    // Наразі базова перевірка
    if (operatorName.trim().isEmpty()) {
      throw SignatureValidationException.unauthorizedSigner(operatorName);
    }
  }

  /** Валідація дійсності підпису */
  public void validateSignatureValidity(DigitalSignatureEntity signature) {
    if (!signature.isValid()) {
      throw SignatureValidationException.invalidSignature("Підпис позначений як недійсний");
    }

    if (signature.isExpired()) {
      throw SignatureValidationException.expiredSignature();
    }

    if (!signature.isSigned()) {
      throw SignatureValidationException.invalidSignature("Підпис не завершений");
    }
  }

  /** Валідація можливості інвалідації підпису */
  public void validateCanInvalidate(DigitalSignatureEntity signature, String reason) {
    if (!signature.isValid()) {
      throw new SignatureValidationException("Підпис вже інвалідований");
    }

    if (reason == null || reason.trim().isEmpty()) {
      throw new SignatureValidationException("Причина інвалідації є обов'язковою");
    }
  }
}
