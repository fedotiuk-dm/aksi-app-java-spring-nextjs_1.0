package com.aksi.domain.order.statemachine.stage3.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;

/**
 * DTO для конфігурації оплати Stage3 (підетап 3.3)
 * Обгортка навколо доменних DTO для State Machine
 */
public class PaymentConfigurationDTO {

    private UUID sessionId;
    private UUID orderId;

    // === ВИКОРИСТАННЯ ДОМЕННИХ DTO ===
    private PaymentCalculationRequest paymentRequest;
    private PaymentCalculationResponse paymentResponse;

    // === ДОДАТКОВІ ПОЛЯ ДЛЯ STATE MACHINE ===
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private Boolean isValid;
    private Boolean isPaymentConfigComplete;
    private String validationMessage;
    private LocalDateTime lastUpdated;

    // Конструктори
    public PaymentConfigurationDTO() {
        this.isValid = false;
        this.isPaymentConfigComplete = false;
        this.paidAmount = BigDecimal.ZERO;
        this.lastUpdated = LocalDateTime.now();
    }

    public PaymentConfigurationDTO(UUID sessionId) {
        this();
        this.sessionId = sessionId;
    }

    public PaymentConfigurationDTO(UUID sessionId, UUID orderId) {
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
        if (paymentRequest == null) {
            paymentRequest = PaymentCalculationRequest.builder()
                    .orderId(orderId)
                    .prepaymentAmount(BigDecimal.ZERO)
                    .build();
        } else {
            paymentRequest.setOrderId(orderId);
        }

        updateLastModified();
    }

    public PaymentCalculationRequest getPaymentRequest() {
        return paymentRequest;
    }

    public void setPaymentRequest(PaymentCalculationRequest paymentRequest) {
        this.paymentRequest = paymentRequest;

        // Синхронізуємо orderId та prepaymentAmount
        if (paymentRequest != null) {
            this.orderId = paymentRequest.getOrderId();
            this.paidAmount = paymentRequest.getPrepaymentAmount();
        }

        updateLastModified();
    }

    public PaymentCalculationResponse getPaymentResponse() {
        return paymentResponse;
    }

    public void setPaymentResponse(PaymentCalculationResponse paymentResponse) {
        this.paymentResponse = paymentResponse;

        // Оновлюємо розраховані суми
        if (paymentResponse != null) {
            this.totalAmount = paymentResponse.getTotalAmount();
            this.remainingAmount = paymentResponse.getBalanceAmount();
        }

        updateLastModified();
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
        calculateRemainingAmount();
        updateLastModified();
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;

        // Оновлюємо prepaymentAmount в доменному DTO
        if (paymentRequest == null) {
            paymentRequest = PaymentCalculationRequest.builder()
                    .orderId(orderId)
                    .prepaymentAmount(paidAmount)
                    .build();
        } else {
            paymentRequest.setPrepaymentAmount(paidAmount);
        }

        calculateRemainingAmount();
        updateLastModified();
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
        updateLastModified();
    }

    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
        updateLastModified();
    }

    public Boolean isPaymentConfigComplete() {
        return isPaymentConfigComplete;
    }

    public void setPaymentConfigComplete(Boolean paymentConfigComplete) {
        isPaymentConfigComplete = paymentConfigComplete;
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
     * Отримує спосіб оплати з доменного DTO
     */
    public com.aksi.domain.order.model.PaymentMethod getPaymentMethod() {
        return paymentRequest != null ? paymentRequest.getPaymentMethod() : null;
    }

    /**
     * Встановлює спосіб оплати в доменний DTO
     */
    public void setPaymentMethod(com.aksi.domain.order.model.PaymentMethod paymentMethod) {
        if (paymentRequest == null) {
            paymentRequest = PaymentCalculationRequest.builder()
                    .orderId(orderId)
                    .paymentMethod(paymentMethod)
                    .prepaymentAmount(paidAmount != null ? paidAmount : BigDecimal.ZERO)
                    .build();
        } else {
            paymentRequest.setPaymentMethod(paymentMethod);
        }

        updateLastModified();
    }

    /**
     * Отримує суму передоплати з доменного DTO
     */
    public BigDecimal getPrepaymentAmount() {
        return paymentRequest != null ? paymentRequest.getPrepaymentAmount() : BigDecimal.ZERO;
    }

    /**
     * Встановлює суму передоплати в доменний DTO
     */
    public void setPrepaymentAmount(BigDecimal prepaymentAmount) {
        this.paidAmount = prepaymentAmount;

        if (paymentRequest == null) {
            paymentRequest = PaymentCalculationRequest.builder()
                    .orderId(orderId)
                    .prepaymentAmount(prepaymentAmount)
                    .build();
        } else {
            paymentRequest.setPrepaymentAmount(prepaymentAmount);
        }

        calculateRemainingAmount();
        updateLastModified();
    }

    /**
     * Перевіряє чи вся сума сплачена
     */
    public boolean isFullyPaid() {
        return totalAmount != null &&
               paidAmount != null &&
               paidAmount.compareTo(totalAmount) >= 0;
    }

    /**
     * Перевіряє чи є передоплата
     */
    public boolean hasPrepayment() {
        return paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє чи всі обов'язкові параметри встановлені
     */
    public boolean hasRequiredParameters() {
        return orderId != null &&
               paymentRequest != null &&
               paymentRequest.getPaymentMethod() != null &&
               paidAmount != null;
    }

    /**
     * Перевіряє чи готова до завершення
     */
    public boolean isReadyForCompletion() {
        return hasRequiredParameters() &&
               Boolean.TRUE.equals(isValid) &&
               Boolean.TRUE.equals(isPaymentConfigComplete) &&
               totalAmount != null;
    }

    /**
     * Створює новий запит на розрахунок оплати з поточними параметрами
     */
    public PaymentCalculationRequest createPaymentRequest() {
        return PaymentCalculationRequest.builder()
                .orderId(orderId)
                .paymentMethod(getPaymentMethod())
                .prepaymentAmount(paidAmount != null ? paidAmount : BigDecimal.ZERO)
                .build();
    }

    /**
     * Розраховує суму, що залишилася до сплати
     */
    private void calculateRemainingAmount() {
        if (totalAmount != null && paidAmount != null) {
            this.remainingAmount = totalAmount.subtract(paidAmount);

            // Не може бути від'ємної суми до доплати
            if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
                remainingAmount = BigDecimal.ZERO;
            }
        }
    }

    /**
     * Скидає стан до початкового
     */
    public void reset() {
        this.paymentRequest = null;
        this.paymentResponse = null;
        this.totalAmount = null;
        this.paidAmount = BigDecimal.ZERO;
        this.remainingAmount = null;
        this.isValid = false;
        this.isPaymentConfigComplete = false;
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
        return "PaymentConfigurationDTO{" +
                "sessionId=" + sessionId +
                ", orderId=" + orderId +
                ", paymentMethod=" + getPaymentMethod() +
                ", totalAmount=" + totalAmount +
                ", paidAmount=" + paidAmount +
                ", remainingAmount=" + remainingAmount +
                ", valid=" + isValid +
                ", complete=" + isPaymentConfigComplete +
                '}';
    }
}
