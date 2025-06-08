package com.aksi.domain.order.statemachine.stage4.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 4.2 "Юридичні аспекти".
 *
 * Містить інформацію про прийняття умов послуг та цифровий підпис клієнта.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalAspectsDTO {

    /**
     * ID замовлення для якого відбувається підписання.
     */
    private UUID orderId;

    /**
     * Номер квитанції для відображення.
     */
    private String receiptNumber;

    /**
     * Прапорець згоди з умовами надання послуг.
     */
    @Builder.Default
    private Boolean termsAccepted = false;

    /**
     * Дані цифрового підпису клієнта у форматі base64.
     */
    private String signatureData;

    /**
     * Чи було завершено підписання.
     */
    @Builder.Default
    private Boolean signatureCompleted = false;

    /**
     * Існуючий підпис клієнта (якщо вже збережений).
     */
    private CustomerSignatureResponse existingSignature;

    /**
     * Чи є помилки у даних.
     */
    @Builder.Default
    private Boolean hasErrors = false;

    /**
     * Чи відбувається завантаження/збереження.
     */
    @Builder.Default
    private Boolean isLoading = false;

    /**
     * Повідомлення про помилку.
     */
    private String errorMessage;

    /**
     * Список помилок валідації.
     */
    @Builder.Default
    private List<String> errorMessages = new ArrayList<>();

    /**
     * Час останнього оновлення.
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    // === Утиліти ===

    /**
     * Перевіряє чи виконані всі умови для завершення етапу.
     */
    public boolean isReadyForCompletion() {
        return Boolean.TRUE.equals(termsAccepted) &&
               Boolean.TRUE.equals(signatureCompleted) &&
               !Boolean.TRUE.equals(hasErrors) &&
               signatureData != null && !signatureData.trim().isEmpty();
    }

    /**
     * Перевіряє чи є збережений підпис.
     */
    public boolean hasExistingSignature() {
        return existingSignature != null && existingSignature.getId() != null;
    }

    /**
     * Перевіряє чи потрібно зберегти новий підпис.
     */
    public boolean needsSignatureSave() {
        return Boolean.TRUE.equals(termsAccepted) &&
               signatureData != null && !signatureData.trim().isEmpty() &&
               (!hasExistingSignature() || hasSignatureChanged());
    }

    /**
     * Перевіряє чи змінився підпис порівняно з існуючим.
     */
    public boolean hasSignatureChanged() {
        if (!hasExistingSignature()) {
            return true;
        }
        return signatureData != null &&
               !signatureData.equals(existingSignature.getSignatureData());
    }

    /**
     * Отримує ID існуючого підпису або null.
     */
    public UUID getExistingSignatureId() {
        return hasExistingSignature() ? existingSignature.getId() : null;
    }

    /**
     * Створює запит для збереження підпису.
     */
    public CustomerSignatureRequest toSignatureRequest() {
        return CustomerSignatureRequest.builder()
                .orderId(orderId)
                .signatureData(signatureData)
                .termsAccepted(termsAccepted)
                .signatureType("CUSTOMER_ACCEPTANCE")
                .build();
    }

    /**
     * Очищує помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
        if (this.errorMessages != null) {
            this.errorMessages.clear();
        }
    }

    /**
     * Додає помилку до списку.
     */
    public void addError(String error) {
        this.hasErrors = true;
        if (this.errorMessages == null) {
            this.errorMessages = new ArrayList<>();
        }
        this.errorMessages.add(error);
    }

    /**
     * Встановлює загальну помилку.
     */
    public void setError(String error) {
        this.hasErrors = true;
        this.errorMessage = error;
    }

    /**
     * Оновлює timestamp.
     */
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Перевіряє валідність даних.
     */
    public boolean isValid() {
        return !Boolean.TRUE.equals(hasErrors) &&
               orderId != null &&
               Boolean.TRUE.equals(termsAccepted);
    }

    /**
     * Скидає дані підпису.
     */
    public void clearSignature() {
        this.signatureData = null;
        this.signatureCompleted = false;
        updateTimestamp();
    }

    /**
     * Встановлює підпис як завершений.
     */
    public void completeSignature(String signatureData) {
        this.signatureData = signatureData;
        this.signatureCompleted = true;
        updateTimestamp();
    }

    /**
     * Оновлює з існуючого підпису.
     */
    public void updateFromExistingSignature(CustomerSignatureResponse signature) {
        this.existingSignature = signature;
        if (signature != null) {
            this.termsAccepted = signature.isTermsAccepted();
            this.signatureData = signature.getSignatureData();
            this.signatureCompleted = true;
        }
        updateTimestamp();
    }
}

// TODO: Інтегрувати з реальним CustomerSignatureService
// TODO: Додати валідацію формату підпису (base64, розмір, тощо)
// TODO: Додати збереження статусу в OrderWizardPersistenceService
// TODO: Додати інтеграцію з Guards для перевірки переходів
// TODO: Розглянути додавання метаданих підпису (розмір canvas, тощо)
