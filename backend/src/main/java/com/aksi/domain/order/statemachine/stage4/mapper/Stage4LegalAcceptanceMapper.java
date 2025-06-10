package com.aksi.domain.order.statemachine.stage4.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

/**
 * Mapper для перетворення даних юридичного прийняття Stage4.
 * Обробляє конверсію між State Machine DTO та domain DTO для підписів та умов.
 */
@Component
public class Stage4LegalAcceptanceMapper {

    /**
     * Створює LegalAcceptanceDTO з domain CustomerSignatureRequest.
     *
     * @param sessionId ID сесії State Machine
     * @param signatureRequest запит на підпис з domain шару
     * @return LegalAcceptanceDTO для State Machine
     */
    public LegalAcceptanceDTO createFromSignatureRequest(UUID sessionId, CustomerSignatureRequest signatureRequest) {
        return LegalAcceptanceDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.LEGAL_ACCEPTANCE)
                .signatureRequest(signatureRequest)
                .termsRead(true) // Автоматично позначаємо як прочитано при створенні запиту
                .signatureCaptured(false)
                .legalConfirmed(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Позначає підпис як збережений.
     *
     * @param legalDTO поточний DTO юридичного прийняття
     * @return оновлений DTO з позначкою про збереження підпису
     */
    public LegalAcceptanceDTO markSignatureCaptured(LegalAcceptanceDTO legalDTO) {
        if (legalDTO == null) {
            return null;
        }

        return legalDTO.toBuilder()
                .signatureCaptured(true)
                .acceptanceTimestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Позначає юридичне оформлення як завершене.
     *
     * @param legalDTO поточний DTO юридичного прийняття
     * @return оновлений DTO з позначкою про завершення юридичного оформлення
     */
    public LegalAcceptanceDTO markLegalConfirmed(LegalAcceptanceDTO legalDTO) {
        if (legalDTO == null) {
            return null;
        }

        return legalDTO.toBuilder()
                .legalConfirmed(true)
                .currentState(Stage4State.LEGAL_ACCEPTANCE_COMPLETED)
                .build();
    }

    /**
     * Створює LegalAcceptanceDTO з domain CustomerSignatureRequest.
     *
     * @param sessionId ID сесії State Machine
     * @param orderId ID замовлення
     * @return LegalAcceptanceDTO для State Machine
     */
    public LegalAcceptanceDTO createForOrder(UUID sessionId, UUID orderId) {
        CustomerSignatureRequest signatureRequest = CustomerSignatureRequest.builder()
                .orderId(orderId)
                .termsAccepted(false)
                .signatureType("CUSTOMER_ACCEPTANCE")
                .build();

        return LegalAcceptanceDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.LEGAL_ACCEPTANCE)
                .signatureRequest(signatureRequest)
                .termsRead(false)
                .signatureCaptured(false)
                .legalConfirmed(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Оновлює стан після прочитання умов.
     *
     * @param legalDTO поточний DTO юридичного прийняття
     * @return оновлений DTO з позначкою про прочитання умов
     */
    public LegalAcceptanceDTO markTermsAsRead(LegalAcceptanceDTO legalDTO) {
        if (legalDTO == null) {
            return null;
        }

        return legalDTO.toBuilder()
                .termsRead(true)
                .build();
    }

    /**
     * Оновлює стан після збереження підпису.
     *
     * @param legalDTO поточний DTO юридичного прийняття
     * @param signatureData дані підпису у форматі base64
     * @return оновлений DTO з даними підпису
     */
    public LegalAcceptanceDTO captureSignature(LegalAcceptanceDTO legalDTO, String signatureData) {
        if (legalDTO == null || signatureData == null || signatureData.trim().isEmpty()) {
            return legalDTO != null ?
                legalDTO.toBuilder()
                    .hasValidationErrors(true)
                    .validationMessage("Дані підпису не можуть бути порожніми")
                    .build() : null;
        }

        CustomerSignatureRequest updatedRequest = legalDTO.getSignatureRequest().toBuilder()
                .signatureData(signatureData)
                .termsAccepted(true)
                .build();

        return legalDTO.toBuilder()
                .signatureRequest(updatedRequest)
                .signatureCaptured(true)
                .acceptanceTimestamp(LocalDateTime.now())
                .legalConfirmed(legalDTO.getTermsRead() && true)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Переводить до стану готовності для генерації квитанції.
     *
     * @param legalDTO поточний DTO юридичного прийняття
     * @return оновлений DTO готовий для переходу до генерації квитанції
     */
    public LegalAcceptanceDTO prepareForReceiptGeneration(LegalAcceptanceDTO legalDTO) {
        if (legalDTO == null || !isLegalProcessComplete(legalDTO)) {
            return legalDTO != null ?
                legalDTO.toBuilder()
                    .hasValidationErrors(true)
                    .validationMessage("Спочатку потрібно завершити юридичне оформлення")
                    .build() : null;
        }

        return legalDTO.toBuilder()
                .currentState(Stage4State.RECEIPT_GENERATION)
                .legalConfirmed(true)
                .build();
    }

    /**
     * Перевіряє чи завершено юридичне оформлення.
     *
     * @param legalDTO DTO юридичного прийняття
     * @return true якщо юридичне оформлення завершено
     */
    private boolean isLegalProcessComplete(LegalAcceptanceDTO legalDTO) {
        return legalDTO != null
                && legalDTO.getTermsRead()
                && legalDTO.getSignatureCaptured()
                && legalDTO.getSignatureRequest() != null
                && legalDTO.getSignatureRequest().getTermsAccepted()
                && legalDTO.getSignatureRequest().getSignatureData() != null
                && !legalDTO.getSignatureRequest().getSignatureData().trim().isEmpty();
    }
}
