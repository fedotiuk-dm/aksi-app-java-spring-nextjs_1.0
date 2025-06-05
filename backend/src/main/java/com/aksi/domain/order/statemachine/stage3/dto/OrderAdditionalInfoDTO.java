package com.aksi.domain.order.statemachine.stage3.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 3.4 "Додаткова інформація".
 *
 * Містить загальні примітки до замовлення та додаткові вимоги клієнта.
 * Це фінальний підетап 3-го етапу перед підтвердженням та формуванням квитанції.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderAdditionalInfoDTO {

    /**
     * ID замовлення
     */
    private UUID orderId;

    /**
     * Загальні примітки до замовлення.
     * Можуть містити будь-яку додаткову інформацію від оператора.
     */
    private String orderNotes;

    /**
     * Додаткові вимоги клієнта.
     * Спеціальні побажання або інструкції від клієнта.
     */
    private String customerRequirements;

    /**
     * Чи є критична інформація що потребує особливої уваги.
     */
    @Builder.Default
    private Boolean hasCriticalInfo = false;

    /**
     * Текст критичної інформації (якщо є).
     */
    private String criticalInfoText;

    /**
     * Чи потрібно додаткове підтвердження від клієнта.
     */
    @Builder.Default
    private Boolean requiresAdditionalConfirmation = false;

    /**
     * Причина необхідності додаткового підтвердження.
     */
    private String confirmationReason;

    // Службові поля для wizard

    /**
     * Чи є помилки валідації
     */
    @Builder.Default
    private Boolean hasErrors = false;

    /**
     * Список помилок валідації
     */
    private List<String> errors;

    /**
     * Чи готові дані для переходу до наступного етапу
     */
    @Builder.Default
    private Boolean isComplete = false;

    /**
     * Час останнього оновлення
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    // Допоміжні методи

    /**
     * Перевіряє чи є будь-яка додаткова інформація.
     */
    public Boolean hasAnyAdditionalInfo() {
        return hasOrderNotes() || hasCustomerRequirements() || hasCriticalInfo || requiresAdditionalConfirmation;
    }

    /**
     * Перевіряє чи є примітки до замовлення.
     */
    public Boolean hasOrderNotes() {
        return orderNotes != null && !orderNotes.trim().isEmpty();
    }

    /**
     * Перевіряє чи є вимоги клієнта.
     */
    public Boolean hasCustomerRequirements() {
        return customerRequirements != null && !customerRequirements.trim().isEmpty();
    }

    /**
     * Отримує загальну кількість символів у всіх текстових полях.
     */
    public Integer getTotalCharacterCount() {
        int count = 0;
        if (orderNotes != null) count += orderNotes.length();
        if (customerRequirements != null) count += customerRequirements.length();
        if (criticalInfoText != null) count += criticalInfoText.length();
        if (confirmationReason != null) count += confirmationReason.length();
        return count;
    }

    /**
     * Отримує короткий опис додаткової інформації для підсумку.
     */
    public String getAdditionalInfoSummary() {
        if (!hasAnyAdditionalInfo()) {
            return "Додаткова інформація відсутня";
        }

        StringBuilder summary = new StringBuilder();

        if (hasOrderNotes()) {
            summary.append("Примітки оператора");
        }

        if (hasCustomerRequirements()) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("Вимоги клієнта");
        }

        if (hasCriticalInfo) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("КРИТИЧНА ІНФОРМАЦІЯ");
        }

        if (requiresAdditionalConfirmation) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("Потребує підтвердження");
        }

        return summary.toString();
    }

    /**
     * Очищає всі помилки валідації.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errors = null;
    }

    /**
     * Встановлює помилки валідації.
     */
    public void setValidationErrors(List<String> errors) {
        this.errors = errors;
        this.hasErrors = errors != null && !errors.isEmpty();
    }

    /**
     * Оновлює час останньої модифікації.
     */
    public void updateLastModified() {
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Перевіряє чи можна перейти до наступного етапу.
     * Для цього підетапу немає обов'язкових полів, тому завжди можна перейти.
     */
    public Boolean canProceedToNext() {
        return !hasErrors;
    }
}
