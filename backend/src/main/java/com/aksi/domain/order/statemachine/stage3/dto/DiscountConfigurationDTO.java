package com.aksi.domain.order.statemachine.stage3.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;

/**
 * DTO для конфігурації знижок Stage3 (підетап 3.2)
 * Обгортка навколо доменних DTO для State Machine
 */
public class DiscountConfigurationDTO {

    private UUID sessionId;
    private UUID orderId;

    // === ВИКОРИСТАННЯ ДОМЕННИХ DTO ===
    private OrderDiscountRequest discountRequest;
    private OrderDiscountResponse discountResponse;

    // === ДОДАТКОВІ ПОЛЯ ДЛЯ STATE MACHINE ===
    private List<UUID> excludedCategoryIds;
    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private Boolean isValid;
    private Boolean isDiscountConfigComplete;
    private String validationMessage;
    private LocalDateTime lastUpdated;

    // Конструктори
    public DiscountConfigurationDTO() {
        this.isValid = false;
        this.isDiscountConfigComplete = false;
        this.lastUpdated = LocalDateTime.now();
    }

    public DiscountConfigurationDTO(UUID sessionId) {
        this();
        this.sessionId = sessionId;
    }

    public DiscountConfigurationDTO(UUID sessionId, UUID orderId) {
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
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder()
                    .orderId(orderId)
                    .build();
        } else {
            discountRequest.setOrderId(orderId);
        }

        updateLastModified();
    }

    public OrderDiscountRequest getDiscountRequest() {
        return discountRequest;
    }

    public void setDiscountRequest(OrderDiscountRequest discountRequest) {
        this.discountRequest = discountRequest;

        // Синхронізуємо orderId
        if (discountRequest != null) {
            this.orderId = discountRequest.getOrderId();
        }

        updateLastModified();
    }

    public OrderDiscountResponse getDiscountResponse() {
        return discountResponse;
    }

    public void setDiscountResponse(OrderDiscountResponse discountResponse) {
        this.discountResponse = discountResponse;

        // Оновлюємо розраховані суми
        if (discountResponse != null) {
            this.originalAmount = discountResponse.getTotalAmount();
            this.discountAmount = discountResponse.getDiscountAmount();
            this.finalAmount = discountResponse.getFinalAmount();
        }

        updateLastModified();
    }

    public List<UUID> getExcludedCategoryIds() {
        return excludedCategoryIds;
    }

    public void setExcludedCategoryIds(List<UUID> excludedCategoryIds) {
        this.excludedCategoryIds = excludedCategoryIds;
        updateLastModified();
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
        updateLastModified();
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
        updateLastModified();
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
        updateLastModified();
    }

    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
        updateLastModified();
    }

    public Boolean isDiscountConfigComplete() {
        return isDiscountConfigComplete;
    }

    public void setDiscountConfigComplete(Boolean discountConfigComplete) {
        isDiscountConfigComplete = discountConfigComplete;
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
     * Отримує тип знижки з доменного DTO
     */
    public com.aksi.domain.order.model.DiscountType getDiscountType() {
        return discountRequest != null ? discountRequest.getDiscountType() : null;
    }

    /**
     * Встановлює тип знижки в доменний DTO
     */
    public void setDiscountType(com.aksi.domain.order.model.DiscountType discountType) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder()
                    .orderId(orderId)
                    .discountType(discountType)
                    .build();
        } else {
            discountRequest.setDiscountType(discountType);
        }

        updateLastModified();
    }

    /**
     * Отримує відсоток знижки з доменного DTO
     */
    public Integer getDiscountPercentage() {
        return discountRequest != null ? discountRequest.getDiscountPercentage() : null;
    }

    /**
     * Встановлює відсоток знижки в доменний DTO
     */
    public void setDiscountPercentage(Integer discountPercentage) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder()
                    .orderId(orderId)
                    .discountPercentage(discountPercentage)
                    .build();
        } else {
            discountRequest.setDiscountPercentage(discountPercentage);
        }

        updateLastModified();
    }

    /**
     * Отримує опис знижки з доменного DTO
     */
    public String getDiscountDescription() {
        return discountRequest != null ? discountRequest.getDiscountDescription() : null;
    }

    /**
     * Встановлює опис знижки в доменний DTO
     */
    public void setDiscountDescription(String discountDescription) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder()
                    .orderId(orderId)
                    .discountDescription(discountDescription)
                    .build();
        } else {
            discountRequest.setDiscountDescription(discountDescription);
        }

        updateLastModified();
    }

    /**
     * Перевіряє чи застосована знижка
     */
    public boolean hasDiscount() {
        return discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє чи всі обов'язкові параметри встановлені
     */
    public boolean hasRequiredParameters() {
        return orderId != null &&
               discountRequest != null &&
               discountRequest.getDiscountType() != null;
    }

    /**
     * Перевіряє чи готова до завершення
     */
    public boolean isReadyForCompletion() {
        return hasRequiredParameters() &&
               Boolean.TRUE.equals(isValid) &&
               Boolean.TRUE.equals(isDiscountConfigComplete);
    }

    /**
     * Створює новий запит на знижку з поточними параметрами
     */
    public OrderDiscountRequest createDiscountRequest() {
        return OrderDiscountRequest.builder()
                .orderId(orderId)
                .discountType(getDiscountType())
                .discountPercentage(getDiscountPercentage())
                .discountDescription(getDiscountDescription())
                .build();
    }

    /**
     * Скидає стан до початкового
     */
    public void reset() {
        this.discountRequest = null;
        this.discountResponse = null;
        this.excludedCategoryIds = null;
        this.originalAmount = null;
        this.discountAmount = null;
        this.finalAmount = null;
        this.isValid = false;
        this.isDiscountConfigComplete = false;
        this.validationMessage = null;
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
        return "DiscountConfigurationDTO{" +
                "sessionId=" + sessionId +
                ", orderId=" + orderId +
                ", discountType=" + getDiscountType() +
                ", percentage=" + getDiscountPercentage() +
                ", originalAmount=" + originalAmount +
                ", discountAmount=" + discountAmount +
                ", finalAmount=" + finalAmount +
                ", valid=" + isValid +
                ", complete=" + isDiscountConfigComplete +
                '}';
    }
}
