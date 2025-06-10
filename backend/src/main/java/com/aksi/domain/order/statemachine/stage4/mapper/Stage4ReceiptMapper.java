package com.aksi.domain.order.statemachine.stage4.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

/**
 * Mapper для перетворення даних генерації квитанції Stage4.
 * Обробляє конверсію між State Machine DTO та domain DTO для квитанцій.
 */
@Component
public class Stage4ReceiptMapper {

    /**
     * Створює ReceiptConfigurationDTO з domain ReceiptGenerationRequest.
     *
     * @param sessionId ID сесії State Machine
     * @param generationRequest запит на генерацію з domain шару
     * @return ReceiptConfigurationDTO для State Machine
     */
    public ReceiptConfigurationDTO createFromGenerationRequest(UUID sessionId, ReceiptGenerationRequest generationRequest) {
        return ReceiptConfigurationDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.RECEIPT_GENERATION)
                .generationRequest(generationRequest)
                .pdfGenerated(false)
                .emailSent(false)
                .readyForPrint(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Позначає квитанцію як згенеровану.
     *
     * @param receiptDTO поточний DTO конфігурації квитанції
     * @return оновлений DTO з позначкою про завершення генерації
     */
    public ReceiptConfigurationDTO markReceiptGenerated(ReceiptConfigurationDTO receiptDTO) {
        if (receiptDTO == null) {
            return null;
        }

        return receiptDTO.toBuilder()
                .currentState(Stage4State.RECEIPT_GENERATED)
                .generationTimestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Створює ReceiptConfigurationDTO з domain ReceiptGenerationRequest.
     *
     * @param sessionId ID сесії State Machine
     * @param orderId ID замовлення
     * @param sendByEmail чи відправляти квитанцію на email
     * @param generatePrintable чи генерувати друковану версію
     * @return ReceiptConfigurationDTO для State Machine
     */
    public ReceiptConfigurationDTO createForOrder(UUID sessionId, UUID orderId,
                                                 boolean sendByEmail, boolean generatePrintable) {
        ReceiptGenerationRequest generationRequest = ReceiptGenerationRequest.builder()
                .orderId(orderId)
                .build();

        return ReceiptConfigurationDTO.builder()
                .sessionId(sessionId)
                .currentState(Stage4State.RECEIPT_GENERATION)
                .generationRequest(generationRequest)
                .pdfGenerated(false)
                .emailSent(false)
                .readyForPrint(false)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Оновлює стан після генерації PDF.
     *
     * @param receiptDTO поточний DTO конфігурації квитанції
     * @param generatedReceipt згенерована квитанція
     * @param pdfFilePath шлях до PDF файлу
     * @return оновлений DTO з даними згенерованої квитанції
     */
    public ReceiptConfigurationDTO markPdfGenerated(ReceiptConfigurationDTO receiptDTO,
                                                   ReceiptDTO generatedReceipt, String pdfFilePath) {
        if (receiptDTO == null || generatedReceipt == null) {
            return receiptDTO != null ?
                receiptDTO.toBuilder()
                    .hasValidationErrors(true)
                    .validationMessage("Помилка генерації PDF квитанції")
                    .build() : null;
        }

        return receiptDTO.toBuilder()
                .generatedReceipt(generatedReceipt)
                .pdfGenerated(true)
                .pdfFilePath(pdfFilePath)
                .generationTimestamp(LocalDateTime.now())
                .readyForPrint(true)
                .hasValidationErrors(false)
                .build();
    }

    /**
     * Оновлює стан після відправки email.
     *
     * @param receiptDTO поточний DTO конфігурації квитанції
     * @return оновлений DTO з позначкою про відправку email
     */
    public ReceiptConfigurationDTO markEmailSent(ReceiptConfigurationDTO receiptDTO) {
        if (receiptDTO == null) {
            return null;
        }

        return receiptDTO.toBuilder()
                .emailSent(true)
                .build();
    }

    /**
     * Переводить до стану готовності для завершення замовлення.
     *
     * @param receiptDTO поточний DTO конфігурації квитанції
     * @return оновлений DTO готовий для переходу до завершення замовлення
     */
    public ReceiptConfigurationDTO prepareForOrderCompletion(ReceiptConfigurationDTO receiptDTO) {
        if (receiptDTO == null || !isReceiptProcessComplete(receiptDTO)) {
            return receiptDTO != null ?
                receiptDTO.toBuilder()
                    .hasValidationErrors(true)
                    .validationMessage("Спочатку потрібно завершити генерацію квитанції")
                    .build() : null;
        }

        return receiptDTO.toBuilder()
                .currentState(Stage4State.ORDER_COMPLETION)
                .build();
    }

    /**
     * Перевіряє чи завершено процес генерації квитанції.
     *
     * @param receiptDTO DTO конфігурації квитанції
     * @return true якщо генерація квитанції завершена
     */
    private boolean isReceiptProcessComplete(ReceiptConfigurationDTO receiptDTO) {
        return receiptDTO != null
                && receiptDTO.getPdfGenerated()
                && receiptDTO.getGeneratedReceipt() != null
                && receiptDTO.getPdfFilePath() != null
                && !receiptDTO.getPdfFilePath().trim().isEmpty();
    }
}
