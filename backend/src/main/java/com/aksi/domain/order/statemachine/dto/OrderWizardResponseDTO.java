package com.aksi.domain.order.statemachine.dto;

import java.time.LocalDateTime;

import com.aksi.domain.order.statemachine.OrderState;

/**
 * DTO для структурованих відповідей Order Wizard API.
 */
public class OrderWizardResponseDTO {
    private String sessionId;
    private OrderState currentState;
    private LocalDateTime timestamp;
    private boolean success;
    private String message;

    public OrderWizardResponseDTO(String sessionId, OrderState currentState, boolean success, String message) {
        this.sessionId = sessionId;
        this.currentState = currentState;
        this.success = success;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // Getters
    public String getSessionId() {
        return sessionId;
    }

    public OrderState getCurrentState() {
        return currentState;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    // Setters (якщо потрібні для серіалізації)
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public void setCurrentState(OrderState currentState) {
        this.currentState = currentState;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
