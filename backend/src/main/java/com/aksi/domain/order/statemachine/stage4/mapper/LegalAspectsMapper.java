package com.aksi.domain.order.statemachine.stage4.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для підетапу 4.2 "Юридічні аспекти".
 *
 * Відповідає за конвертацію між:
 * - LegalAspectsDTO та CustomerSignature DTOs
 * - Оновлення даних підпису з існуючих даних
 */
@Component
@Slf4j
public class LegalAspectsMapper {

    /**
     * Створює CustomerSignatureRequest з LegalAspectsDTO.
     */
    public CustomerSignatureRequest toSignatureRequest(LegalAspectsDTO legalAspects) {
        if (legalAspects == null) {
            return null;
        }

        log.debug("Конвертація LegalAspectsDTO в CustomerSignatureRequest для замовлення: {}",
                 legalAspects.getOrderId());

        // TODO: Додати валідацію необхідних полів перед конвертацією
        // TODO: Перевірити формат signatureData

        return CustomerSignatureRequest.builder()
                .orderId(legalAspects.getOrderId())
                .signatureData(legalAspects.getSignatureData())
                .termsAccepted(Boolean.TRUE.equals(legalAspects.getTermsAccepted()))
                .signatureType("CUSTOMER_ACCEPTANCE")
                .build();
    }

    /**
     * Оновлює LegalAspectsDTO з даних CustomerSignatureResponse.
     */
    public void updateFromSignatureResponse(LegalAspectsDTO legalAspects, CustomerSignatureResponse signature) {
        if (legalAspects == null || signature == null) {
            return;
        }

        log.debug("Оновлення LegalAspectsDTO з CustomerSignatureResponse");

        // TODO: Додати валідацію відповідності orderId
        // TODO: Додати логування змін критичних полів

        // Оновлюємо дані з збереженого підпису
        legalAspects.setExistingSignature(signature);
        legalAspects.setTermsAccepted(signature.isTermsAccepted());
        legalAspects.setSignatureData(signature.getSignatureData());
        legalAspects.setSignatureCompleted(true);

        // Оновлюємо timestamp
        legalAspects.setLastUpdated(LocalDateTime.now());

        // Очищаємо помилки після успішного оновлення
        legalAspects.clearErrors();
    }

    /**
     * Створює порожній LegalAspectsDTO для нового замовлення.
     */
    public LegalAspectsDTO createEmpty() {
        return LegalAspectsDTO.builder()
                .termsAccepted(false)
                .signatureCompleted(false)
                .hasErrors(false)
                .isLoading(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Перевіряє відповідність orderId між DTO та signature.
     */
    public boolean isOrderIdMatching(LegalAspectsDTO legalAspects, CustomerSignatureResponse signature) {
        if (legalAspects == null || signature == null) {
            return false;
        }

        return legalAspects.getOrderId() != null &&
               legalAspects.getOrderId().equals(signature.getOrderId());
    }

    /**
     * Клонує LegalAspectsDTO для безпечного використання.
     */
    public LegalAspectsDTO cloneDTO(LegalAspectsDTO original) {
        if (original == null) {
            return null;
        }

        // TODO: Розглянути використання бібліотеки для глибокого клонування
        return LegalAspectsDTO.builder()
                .orderId(original.getOrderId())
                .receiptNumber(original.getReceiptNumber())
                .termsAccepted(original.getTermsAccepted())
                .signatureData(original.getSignatureData())
                .signatureCompleted(original.getSignatureCompleted())
                .existingSignature(original.getExistingSignature())
                .hasErrors(original.getHasErrors())
                .isLoading(original.getIsLoading())
                .errorMessage(original.getErrorMessage())
                .errorMessages(original.getErrorMessages() != null ?
                              new ArrayList<>(original.getErrorMessages()) : null)
                .lastUpdated(original.getLastUpdated())
                .build();
    }

    /**
     * Перевіряє чи потрібно оновити існуючий підпис.
     */
    public boolean needsSignatureUpdate(LegalAspectsDTO legalAspects) {
        if (legalAspects == null) {
            return false;
        }

        return legalAspects.needsSignatureSave() ||
               (legalAspects.hasExistingSignature() && legalAspects.hasSignatureChanged());
    }

    /**
     * Створює тестовий CustomerSignatureResponse для розробки.
     */
    public CustomerSignatureResponse createMockSignatureResponse(LegalAspectsDTO legalAspects) {
        if (legalAspects == null || legalAspects.getOrderId() == null) {
            return null;
        }

        // TODO: Видалити після інтеграції з реальним CustomerSignatureService
        return CustomerSignatureResponse.builder()
                .id(java.util.UUID.randomUUID())
                .orderId(legalAspects.getOrderId())
                .signatureData(legalAspects.getSignatureData())
                .termsAccepted(Boolean.TRUE.equals(legalAspects.getTermsAccepted()))
                .signatureType("CUSTOMER_ACCEPTANCE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}

// TODO: Додати валідацію при конвертації між типами
// TODO: Інтегрувати з реальним маппінгом entity/DTO
// TODO: Додати обробку різних типів підписів
// TODO: Розглянути використання MapStruct для автоматичного маппінгу
