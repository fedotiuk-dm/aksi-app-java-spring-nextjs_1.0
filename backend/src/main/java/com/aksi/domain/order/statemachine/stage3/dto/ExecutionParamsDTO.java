package com.aksi.domain.order.statemachine.stage3.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.model.ExpediteType;

/**
 * DTO для параметрів виконання Stage3 (підетап 3.1)
 * Обгортка навколо доменних DTO для State Machine
 */
public class ExecutionParamsDTO {

    private UUID sessionId;
    private List<UUID> serviceCategoryIds;

    // === ВИКОРИСТАННЯ ДОМЕННИХ DTO ===
    private CompletionDateCalculationRequest completionDateRequest;
    private CompletionDateResponse completionDateResponse;

    // === ДОДАТКОВІ ПОЛЯ ДЛЯ STATE MACHINE ===
    private LocalDate manualExecutionDate;
    private Boolean useManualDate;
    private Boolean isExecutionParamsComplete;
    private Boolean needsRecalculation;
    private LocalDateTime lastUpdated;

    // Конструктори
    public ExecutionParamsDTO() {
        this.useManualDate = false;
        this.isExecutionParamsComplete = false;
        this.needsRecalculation = false;
        this.lastUpdated = LocalDateTime.now();
    }

    public ExecutionParamsDTO(UUID sessionId) {
        this();
        this.sessionId = sessionId;
    }

    public ExecutionParamsDTO(UUID sessionId, List<UUID> serviceCategoryIds) {
        this(sessionId);
        this.serviceCategoryIds = serviceCategoryIds;

        // Створюємо базовий запит на розрахунок дати
        this.completionDateRequest = CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(serviceCategoryIds)
                .expediteType(ExpediteType.STANDARD)
                .build();
    }

    // === ГЕТТЕРИ ТА СЕТТЕРИ ===

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
        updateLastModified();
    }

    public List<UUID> getServiceCategoryIds() {
        return serviceCategoryIds;
    }

    public void setServiceCategoryIds(List<UUID> serviceCategoryIds) {
        this.serviceCategoryIds = serviceCategoryIds;

        // Оновлюємо запит на розрахунок дати
        if (this.completionDateRequest == null) {
            this.completionDateRequest = CompletionDateCalculationRequest.builder()
                    .serviceCategoryIds(serviceCategoryIds)
                    .expediteType(ExpediteType.STANDARD)
                    .build();
        } else {
            this.completionDateRequest.setServiceCategoryIds(serviceCategoryIds);
        }

        this.needsRecalculation = true;
        updateLastModified();
    }

    public CompletionDateCalculationRequest getCompletionDateRequest() {
        return completionDateRequest;
    }

    public void setCompletionDateRequest(CompletionDateCalculationRequest completionDateRequest) {
        this.completionDateRequest = completionDateRequest;

        // Синхронізуємо serviceCategoryIds
        if (completionDateRequest != null) {
            this.serviceCategoryIds = completionDateRequest.getServiceCategoryIds();
        }

        this.needsRecalculation = true;
        updateLastModified();
    }

    public CompletionDateResponse getCompletionDateResponse() {
        return completionDateResponse;
    }

    public void setCompletionDateResponse(CompletionDateResponse completionDateResponse) {
        this.completionDateResponse = completionDateResponse;
        this.needsRecalculation = false;
        updateLastModified();
    }

    public LocalDate getManualExecutionDate() {
        return manualExecutionDate;
    }

    public void setManualExecutionDate(LocalDate manualExecutionDate) {
        this.manualExecutionDate = manualExecutionDate;
        this.useManualDate = (manualExecutionDate != null);
        updateLastModified();
    }

    public Boolean getUseManualDate() {
        return useManualDate;
    }

    public void setUseManualDate(Boolean useManualDate) {
        this.useManualDate = useManualDate;
        updateLastModified();
    }

    public Boolean isExecutionParamsComplete() {
        return isExecutionParamsComplete;
    }

    public void setExecutionParamsComplete(Boolean executionParamsComplete) {
        isExecutionParamsComplete = executionParamsComplete;
        updateLastModified();
    }

    public Boolean needsRecalculation() {
        return needsRecalculation;
    }

    public void setNeedsRecalculation(Boolean needsRecalculation) {
        this.needsRecalculation = needsRecalculation;
        updateLastModified();
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    // === UTILITY МЕТОДИ ===

    /**
     * Отримує поточний тип терміновості з доменного DTO
     */
    public ExpediteType getExpediteType() {
        return completionDateRequest != null ? completionDateRequest.getExpediteType() : ExpediteType.STANDARD;
    }

    /**
     * Встановлює тип терміновості в доменний DTO
     */
    public void setExpediteType(ExpediteType expediteType) {
        if (completionDateRequest == null) {
            completionDateRequest = CompletionDateCalculationRequest.builder()
                    .serviceCategoryIds(serviceCategoryIds)
                    .expediteType(expediteType)
                    .build();
        } else {
            completionDateRequest.setExpediteType(expediteType);
        }

        this.needsRecalculation = true;
        updateLastModified();
    }

    /**
     * Отримує ефективну дату виконання (вручну або розраховану)
     */
    public LocalDateTime getEffectiveExecutionDate() {
        if (useManualDate != null && useManualDate && manualExecutionDate != null) {
            return manualExecutionDate.atTime(14, 0); // стандартний час видачі
        }

        if (completionDateResponse != null) {
            return completionDateResponse.getExpectedCompletionDate();
        }

        return null;
    }

    /**
     * Перевіряє чи всі обов'язкові параметри встановлені
     */
    public boolean hasRequiredParameters() {
        return serviceCategoryIds != null &&
               !serviceCategoryIds.isEmpty() &&
               completionDateRequest != null &&
               completionDateRequest.getExpediteType() != null;
    }

    /**
     * Перевіряє чи параметри готові до завершення
     */
    public boolean isReadyForCompletion() {
        return hasRequiredParameters() &&
               Boolean.TRUE.equals(isExecutionParamsComplete) &&
               !Boolean.TRUE.equals(needsRecalculation) &&
               getEffectiveExecutionDate() != null;
    }

    /**
     * Створює новий запит на розрахунок дати з поточними параметрами
     */
    public CompletionDateCalculationRequest createCalculationRequest() {
        return CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(serviceCategoryIds)
                .expediteType(getExpediteType())
                .build();
    }

    /**
     * Скидає стан до початкового
     */
    public void reset() {
        this.manualExecutionDate = null;
        this.useManualDate = false;
        this.completionDateResponse = null;
        this.isExecutionParamsComplete = false;
        this.needsRecalculation = false;

        if (completionDateRequest != null) {
            completionDateRequest.setExpediteType(ExpediteType.STANDARD);
        }

        updateLastModified();
    }

    /**
     * Оновлює час останньої модифікації
     */
    private void updateLastModified() {
        this.lastUpdated = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "ExecutionParamsDTO{" +
                "sessionId=" + sessionId +
                ", serviceCategoryIds=" + (serviceCategoryIds != null ? serviceCategoryIds.size() + " categories" : "null") +
                ", manualDate=" + manualExecutionDate +
                ", useManual=" + useManualDate +
                ", expediteType=" + getExpediteType() +
                ", complete=" + isExecutionParamsComplete +
                ", needsRecalc=" + needsRecalculation +
                '}';
    }
}
