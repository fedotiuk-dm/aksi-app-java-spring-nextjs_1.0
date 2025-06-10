package com.aksi.domain.order.statemachine.stage3.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;

/**
 * DTO для додаткової інформації Stage3 (підетап 3.4)
 * Обгортка навколо доменних DTO для State Machine
 */
public class AdditionalInfoDTO {

    private UUID sessionId;
    private UUID orderId;

    // === ВИКОРИСТАННЯ ДОМЕННИХ DTO ===
    private AdditionalRequirementsRequest additionalInfoRequest;
    private AdditionalRequirementsResponse additionalInfoResponse;

    // === ДОДАТКОВІ ПОЛЯ ДЛЯ STATE MACHINE ===
    private Boolean hasAdditionalRequirements;
    private Boolean hasCustomerNotes;
    private Boolean isValid;
    private Boolean isAdditionalInfoComplete;
    private String validationMessage;
    private LocalDateTime lastUpdated;

    // Конструктори
    public AdditionalInfoDTO() {
        this.hasAdditionalRequirements = false;
        this.hasCustomerNotes = false;
        this.isValid = true; // За замовчуванням валідно, бо може бути порожнім
        this.isAdditionalInfoComplete = false;
        this.lastUpdated = LocalDateTime.now();
    }

    public AdditionalInfoDTO(UUID sessionId) {
        this();
        this.sessionId = sessionId;
    }

    public AdditionalInfoDTO(UUID sessionId, UUID orderId) {
        this(sessionId);
        this.orderId = orderId;
    }

    // === ГЕТТЕРИ ТА СЕТТЕРИ ===

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
        updateLastModified();
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;

        // Оновлюємо orderId в доменному DTO
        if (additionalInfoRequest == null) {
            additionalInfoRequest = AdditionalRequirementsRequest.builder()
                    .orderId(orderId)
                    .build();
        } else {
            additionalInfoRequest.setOrderId(orderId);
        }

        updateLastModified();
    }

    public AdditionalRequirementsRequest getAdditionalInfoRequest() {
        return additionalInfoRequest;
    }

    public void setAdditionalInfoRequest(AdditionalRequirementsRequest additionalInfoRequest) {
        this.additionalInfoRequest = additionalInfoRequest;

        // Синхронізуємо orderId та флаги
        if (additionalInfoRequest != null) {
            this.orderId = additionalInfoRequest.getOrderId();
            this.hasAdditionalRequirements = isNotEmpty(additionalInfoRequest.getAdditionalRequirements());
            this.hasCustomerNotes = isNotEmpty(additionalInfoRequest.getCustomerNotes());
        }

        updateLastModified();
    }

    public AdditionalRequirementsResponse getAdditionalInfoResponse() {
        return additionalInfoResponse;
    }

    public void setAdditionalInfoResponse(AdditionalRequirementsResponse additionalInfoResponse) {
        this.additionalInfoResponse = additionalInfoResponse;
        updateLastModified();
    }

    public Boolean getHasAdditionalRequirements() {
        return hasAdditionalRequirements;
    }

    public void setHasAdditionalRequirements(Boolean hasAdditionalRequirements) {
        this.hasAdditionalRequirements = hasAdditionalRequirements;
        updateLastModified();
    }

    public Boolean getHasCustomerNotes() {
        return hasCustomerNotes;
    }

    public void setHasCustomerNotes(Boolean hasCustomerNotes) {
        this.hasCustomerNotes = hasCustomerNotes;
        updateLastModified();
    }

    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
        updateLastModified();
    }

    public Boolean isAdditionalInfoComplete() {
        return isAdditionalInfoComplete;
    }

    public void setAdditionalInfoComplete(Boolean additionalInfoComplete) {
        isAdditionalInfoComplete = additionalInfoComplete;
        updateLastModified();
    }

    public String getValidationMessage() {
        return validationMessage;
    }

    public void setValidationMessage(String validationMessage) {
        this.validationMessage = validationMessage;
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
     * Отримує додаткові вимоги з доменного DTO
     */
    public String getAdditionalRequirements() {
        return additionalInfoRequest != null ? additionalInfoRequest.getAdditionalRequirements() : null;
    }

    /**
     * Встановлює додаткові вимоги в доменний DTO
     */
    public void setAdditionalRequirements(String additionalRequirements) {
        if (additionalInfoRequest == null) {
            additionalInfoRequest = AdditionalRequirementsRequest.builder()
                    .orderId(orderId)
                    .additionalRequirements(additionalRequirements)
                    .build();
        } else {
            additionalInfoRequest.setAdditionalRequirements(additionalRequirements);
        }

        this.hasAdditionalRequirements = isNotEmpty(additionalRequirements);
        updateLastModified();
    }

    /**
     * Отримує примітки клієнта з доменного DTO
     */
    public String getCustomerNotes() {
        return additionalInfoRequest != null ? additionalInfoRequest.getCustomerNotes() : null;
    }

    /**
     * Встановлює примітки клієнта в доменний DTO
     */
    public void setCustomerNotes(String customerNotes) {
        if (additionalInfoRequest == null) {
            additionalInfoRequest = AdditionalRequirementsRequest.builder()
                    .orderId(orderId)
                    .customerNotes(customerNotes)
                    .build();
        } else {
            additionalInfoRequest.setCustomerNotes(customerNotes);
        }

        this.hasCustomerNotes = isNotEmpty(customerNotes);
        updateLastModified();
    }

    /**
     * Перевіряє чи є будь-яка додаткова інформація
     */
    public boolean hasAnyInformation() {
        return Boolean.TRUE.equals(hasAdditionalRequirements) ||
               Boolean.TRUE.equals(hasCustomerNotes);
    }

    /**
     * Перевіряє чи всі обов'язкові параметри встановлені
     */
    public boolean hasRequiredParameters() {
        return orderId != null;
    }

    /**
     * Перевіряє чи готова до завершення
     */
    public boolean isReadyForCompletion() {
        return hasRequiredParameters() &&
               Boolean.TRUE.equals(isValid) &&
               Boolean.TRUE.equals(isAdditionalInfoComplete);
    }

    /**
     * Створює новий запит на додаткову інформацію з поточними параметрами
     */
    public AdditionalRequirementsRequest createAdditionalInfoRequest() {
        return AdditionalRequirementsRequest.builder()
                .orderId(orderId)
                .additionalRequirements(getAdditionalRequirements())
                .customerNotes(getCustomerNotes())
                .build();
    }

    /**
     * Скидає стан до початкового
     */
    public void reset() {
        this.additionalInfoRequest = null;
        this.additionalInfoResponse = null;
        this.hasAdditionalRequirements = false;
        this.hasCustomerNotes = false;
        this.isValid = true;
        this.isAdditionalInfoComplete = false;
        this.validationMessage = null;
        updateLastModified();
    }

    /**
     * Перевіряє чи рядок не порожній
     */
    private boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /**
     * Оновлює час останньої модифікації
     */
    private void updateLastModified() {
        this.lastUpdated = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "AdditionalInfoDTO{" +
                "sessionId=" + sessionId +
                ", orderId=" + orderId +
                ", hasAdditionalRequirements=" + hasAdditionalRequirements +
                ", hasCustomerNotes=" + hasCustomerNotes +
                ", hasAnyInfo=" + hasAnyInformation() +
                ", valid=" + isValid +
                ", complete=" + isAdditionalInfoComplete +
                '}';
    }
}
