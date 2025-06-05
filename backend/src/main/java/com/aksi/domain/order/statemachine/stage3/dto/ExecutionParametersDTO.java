package com.aksi.domain.order.statemachine.stage3.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.dto.OrderCompletionUpdateRequest;
import com.aksi.domain.order.model.ExpediteType;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 3.1 "Параметри виконання".
 *
 * Містить інформацію про дату виконання та терміновість замовлення.
 * Інтегрується з існуючими сервісами: CompletionDateService та ExpediteType.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionParametersDTO {

    // === Основні параметри виконання ===

    /**
     * Дата виконання замовлення.
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate completionDate;

    /**
     * Час виконання (за замовчуванням 14:00).
     */
    @Builder.Default
    private String completionTime = "14:00";

    /**
     * Тип терміновості виконання (використовує існуючий enum).
     */
    @Builder.Default
    private ExpediteType expediteType = ExpediteType.STANDARD;

    // === Розрахункові поля ===

    /**
     * Базова вартість замовлення (без терміновості).
     */
    private BigDecimal baseOrderTotal;

    /**
     * Додаткова вартість за терміновість.
     */
    private BigDecimal expediteChargeAmount;

    /**
     * Загальна вартість з урахуванням терміновості.
     */
    private BigDecimal finalOrderTotal;

        // === Автоматичні розрахунки дат (використовуємо готові DTO) ===

    /**
     * Запит для розрахунку дати виконання (містить категорії та тип терміновості).
     */
    private CompletionDateCalculationRequest calculationRequest;

    /**
     * Відповідь з розрахованими датами від CompletionDateService.
     */
    private CompletionDateResponse calculationResponse;

    /**
     * Запит для оновлення параметрів виконання замовлення.
     */
    private OrderCompletionUpdateRequest completionUpdateRequest;

    /**
     * Чи містить замовлення шкіряні вироби (14 днів замість 2).
     */
    @Builder.Default
    private Boolean hasLeatherItems = false;

    /**
     * Чи містить замовлення категорії що не можуть мати терміновість.
     */
    @Builder.Default
    private Boolean hasNonExpeditableItems = false;

    // === UI конфігурація ===

    /**
     * Показувати календар для вибору дати.
     */
    @Builder.Default
    private Boolean showDatePicker = true;

    /**
     * Показувати опції терміновості.
     */
    @Builder.Default
    private Boolean showExpediteOptions = true;

    /**
     * Показувати розрахунки вартості терміновості.
     */
    @Builder.Default
    private Boolean showExpediteCharges = true;

    /**
     * Дозволити вибір дати раніше стандартної.
     */
    @Builder.Default
    private Boolean allowEarlierDate = true;

    // === Валідація та стан ===

    /**
     * Чи завершено налаштування параметрів.
     */
    @Builder.Default
    private Boolean isCompleted = false;

    /**
     * Чи є помилки у даних.
     */
    @Builder.Default
    private Boolean hasErrors = false;

    /**
     * Чи відбувається завантаження.
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

    // === Допоміжна інформація ===

    /**
     * Інформаційні повідомлення для користувача.
     */
    @Builder.Default
    private List<String> infoMessages = new ArrayList<>();

    /**
     * Попередження про терміновість.
     */
    @Builder.Default
    private List<String> expediteWarnings = new ArrayList<>();

    /**
     * Час останнього оновлення.
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    // === Утиліти ===

    /**
     * Чи вибрана терміновість.
     */
    public boolean isExpedited() {
        return expediteType != null && expediteType != ExpediteType.STANDARD;
    }

    /**
     * Чи потрібна додаткова оплата за терміновість.
     */
    public boolean hasExpediteCharge() {
        return isExpedited() && expediteChargeAmount != null && expediteChargeAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Отримати відсоток надбавки за терміновість.
     */
    public BigDecimal getExpeditePercentage() {
        return expediteType != null ? expediteType.getSurchargePercentage() : BigDecimal.ZERO;
    }

    /**
     * Чи можна застосувати терміновість до всіх предметів замовлення.
     */
    public boolean canApplyExpediteToAllItems() {
        if (expediteType == ExpediteType.STANDARD) {
            return true;
        }
        return !hasNonExpeditableItems;
    }

    /**
     * Отримати категорії з calculationRequest.
     */
    public List<String> getOrderItemCategories() {
        if (calculationRequest != null && calculationRequest.getServiceCategoryIds() != null) {
            return calculationRequest.getServiceCategoryIds().stream()
                    .map(Object::toString)
                    .toList();
        }
        return new ArrayList<>();
    }

    /**
     * Отримати кількість робочих годин з calculationResponse.
     */
    public Integer getWorkingHoursRequired() {
        return calculationResponse != null ? calculationResponse.getStandardProcessingHours() : null;
    }

    /**
     * Отримати розраховану дату виконання.
     */
    public LocalDate getCalculatedCompletionDate() {
        if (calculationResponse != null && calculationResponse.getExpectedCompletionDate() != null) {
            return calculationResponse.getExpectedCompletionDate().toLocalDate();
        }
        return null;
    }

    /**
     * Очистити помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
        if (this.errorMessages != null) {
            this.errorMessages.clear();
        }
    }

    /**
     * Додати помилку.
     */
    public void addError(String error) {
        this.hasErrors = true;
        if (this.errorMessages == null) {
            this.errorMessages = new ArrayList<>();
        }
        this.errorMessages.add(error);
    }

    /**
     * Встановити помилку.
     */
    public void setError(String error) {
        this.hasErrors = true;
        this.errorMessage = error;
    }

    /**
     * Додати інформаційне повідомлення.
     */
    public void addInfoMessage(String message) {
        if (this.infoMessages == null) {
            this.infoMessages = new ArrayList<>();
        }
        this.infoMessages.add(message);
    }

    /**
     * Додати попередження про терміновість.
     */
    public void addExpediteWarning(String warning) {
        if (this.expediteWarnings == null) {
            this.expediteWarnings = new ArrayList<>();
        }
        this.expediteWarnings.add(warning);
    }

    /**
     * Чи валідні дані.
     */
    public boolean isValid() {
        return !hasErrors && completionDate != null && expediteType != null;
    }

    /**
     * Оновити час останньої зміни.
     */
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }
}
