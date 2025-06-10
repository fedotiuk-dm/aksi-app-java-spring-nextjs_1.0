package com.aksi.domain.order.statemachine.stage4.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для юридичного прийняття умов Stage4.
 * Обгортає domain CustomerSignatureRequest з додатковими полями State Machine.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class LegalAcceptanceDTO {

    /**
     * ID сесії State Machine.
     */
    private UUID sessionId;

    /**
     * Поточний стан Stage4.
     */
    private Stage4State currentState;

    /**
     * Запит на підпис клієнта з domain шару.
     */
    private CustomerSignatureRequest signatureRequest;

    /**
     * Чи прочитані умови надання послуг.
     */
    @Builder.Default
    private Boolean termsRead = false;

    /**
     * Чи збережено підпис клієнта.
     */
    @Builder.Default
    private Boolean signatureCaptured = false;

    /**
     * Чи підтверджені всі юридичні аспекти.
     */
    @Builder.Default
    private Boolean legalConfirmed = false;

    /**
     * Час прийняття умов.
     */
    private LocalDateTime acceptanceTimestamp;

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
