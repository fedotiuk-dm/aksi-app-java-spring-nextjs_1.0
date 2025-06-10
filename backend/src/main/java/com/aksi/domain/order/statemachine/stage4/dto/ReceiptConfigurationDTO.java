package com.aksi.domain.order.statemachine.stage4.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для конфігурації генерації квитанції Stage4.
 * Обгортає domain Receipt DTOs з додатковими полями State Machine.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptConfigurationDTO {

    /**
     * ID сесії State Machine.
     */
    private UUID sessionId;

    /**
     * Поточний стан Stage4.
     */
    private Stage4State currentState;

    /**
     * Запит на генерацію квитанції з domain шару.
     */
    private ReceiptGenerationRequest generationRequest;

    /**
     * Згенерована квитанція з domain шару.
     */
    private ReceiptDTO generatedReceipt;

    /**
     * Чи згенеровано PDF квитанцію.
     */
    @Builder.Default
    private Boolean pdfGenerated = false;

    /**
     * Чи відправлено email з квитанцією.
     */
    @Builder.Default
    private Boolean emailSent = false;

    /**
     * Чи готова для друку.
     */
    @Builder.Default
    private Boolean readyForPrint = false;

    /**
     * Шлях до згенерованого PDF файлу.
     */
    private String pdfFilePath;

    /**
     * Час генерації квитанції.
     */
    private LocalDateTime generationTimestamp;

    /**
     * Повідомлення про валідацію (якщо є).
     */
    private String validationMessage;

    /**
     * Чи є помилки валідації.
     */
    @Builder.Default
    private Boolean hasValidationErrors = false;
}
