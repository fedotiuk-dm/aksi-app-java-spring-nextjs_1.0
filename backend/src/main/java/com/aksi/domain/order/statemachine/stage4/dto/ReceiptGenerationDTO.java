package com.aksi.domain.order.statemachine.stage4.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.model.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 4.3 "Формування та друк квитанції".
 *
 * Управляє процесом генерації PDF-квитанції та опціями друку.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptGenerationDTO {

    // Базові дані
    private UUID orderId;
    private String receiptNumber;
    private boolean isGenerated;
    private boolean isPrinted;
    private boolean isEmailSent;

    // Дані для генерації PDF
    private ReceiptDTO receiptData;
    private byte[] pdfContent;
    private String pdfFileName;

    // Опції генерації та друку
    @Builder.Default
    private boolean includeSignature = true;

    @Builder.Default
    private boolean printTwoCopies = true;

    @Builder.Default
    private boolean sendEmailCopy = false;

    private String clientEmail;

    // Стан процесу
    @Builder.Default
    private boolean isLoading = false;

    @Builder.Default
    private boolean hasErrors = false;

    private String errorMessage;

    @Builder.Default
    private List<String> errors = new ArrayList<>();

    // Метадані
    private LocalDateTime generatedAt;
    private LocalDateTime printedAt;
    private LocalDateTime emailSentAt;
    private LocalDateTime lastUpdated;

    // Способи оплати та фінансові деталі для PDF
    private PaymentMethod paymentMethod;

    /**
     * Перевіряє чи готові всі дані для генерації PDF.
     */
    public boolean isReadyForGeneration() {
        return receiptData != null &&
               !hasErrors &&
               receiptData.getReceiptNumber() != null &&
               receiptData.getClientInfo() != null &&
               receiptData.getBranchInfo() != null;
    }

    /**
     * Перевіряє чи PDF вже згенерований.
     */
    public boolean isPdfGenerated() {
        return isGenerated && pdfContent != null && pdfContent.length > 0;
    }

    /**
     * Перевіряє чи можна надіслати email.
     */
    public boolean canSendEmail() {
        return isPdfGenerated() &&
               sendEmailCopy &&
               clientEmail != null &&
               !clientEmail.trim().isEmpty() &&
               !isEmailSent;
    }

    /**
     * Перевіряє чи процес завершено.
     */
    public boolean isCompleted() {
        boolean basicRequirements = isPdfGenerated() && (!printTwoCopies || isPrinted);
        boolean emailRequirement = !sendEmailCopy || isEmailSent;

        return basicRequirements && emailRequirement && !hasErrors;
    }

    /**
     * Отримує назву файлу для PDF.
     */
    public String getGeneratedFileName() {
        if (pdfFileName != null && !pdfFileName.trim().isEmpty()) {
            return pdfFileName;
        }

        if (receiptNumber != null) {
            return String.format("Квитанція_%s.pdf", receiptNumber);
        }

        return String.format("Квитанція_%s.pdf", System.currentTimeMillis());
    }

    /**
     * Отримує розмір PDF в KB.
     */
    @JsonIgnore
    public double getPdfSizeKB() {
        if (pdfContent == null) return 0.0;
        return pdfContent.length / 1024.0;
    }

    /**
     * Позначає PDF як згенерований.
     */
    public void markAsGenerated(byte[] content, String fileName) {
        this.pdfContent = content;
        this.pdfFileName = fileName;
        this.isGenerated = true;
        this.generatedAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
        clearErrors();
    }

    /**
     * Позначає як надруковано.
     */
    public void markAsPrinted() {
        this.isPrinted = true;
        this.printedAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Позначає email як надісланий.
     */
    public void markEmailSent() {
        this.isEmailSent = true;
        this.emailSentAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Додає помилку.
     */
    public void addError(String error) {
        if (errors == null) {
            errors = new ArrayList<>();
        }
        errors.add(error);
        this.hasErrors = true;
        this.errorMessage = error;
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Встановлює основну помилку.
     */
    public void setError(String error) {
        clearErrors();
        addError(error);
    }

    /**
     * Очищує помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
        if (errors != null) {
            errors.clear();
        }
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Оновлює timestamp.
     */
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Встановлює стан завантаження.
     */
    public void setLoading(boolean loading) {
        this.isLoading = loading;
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Скидає стан для повторної генерації.
     */
    public void resetForRegeneration() {
        this.isGenerated = false;
        this.isPrinted = false;
        this.isEmailSent = false;
        this.pdfContent = null;
        this.pdfFileName = null;
        this.generatedAt = null;
        this.printedAt = null;
        this.emailSentAt = null;
        clearErrors();
    }

    /**
     * Підготовка email адреси клієнта.
     */
    public void prepareClientEmail() {
        if (receiptData != null &&
            receiptData.getClientInfo() != null &&
            receiptData.getClientInfo().getEmail() != null &&
            !receiptData.getClientInfo().getEmail().trim().isEmpty()) {
            this.clientEmail = receiptData.getClientInfo().getEmail().trim();
        }
    }

    /**
     * Встановлює дані для генерації PDF.
     */
    public void setReceiptDataAndPrepare(ReceiptDTO receiptData) {
        this.receiptData = receiptData;
        if (receiptData != null) {
            this.orderId = receiptData.getOrderId();
            this.receiptNumber = receiptData.getReceiptNumber();
            if (receiptData.getPaymentMethod() != null) {
                this.paymentMethod = receiptData.getPaymentMethod();
            }
            prepareClientEmail();
        }
        updateTimestamp();
    }
}
