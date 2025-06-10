package com.aksi.api.exception;

import org.springframework.http.HttpStatus;

/**
 * Базовий клас для всіх API exception в Order Wizard.
 *
 * Забезпечує структуровану обробку помилок з:
 * - HTTP статус кодами
 * - Структурованими повідомленнями
 * - Контекстною інформацією про етап/підетап
 * - Локалізованими повідомленнями
 */
public class OrderWizardApiException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String stage;
    private final String substep;
    private final Object errorDetails;

    public OrderWizardApiException(String message) {
        super(message);
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        this.errorCode = "WIZARD_ERROR";
        this.stage = null;
        this.substep = null;
        this.errorDetails = null;
    }

    public OrderWizardApiException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = "WIZARD_ERROR";
        this.stage = null;
        this.substep = null;
        this.errorDetails = null;
    }

    public OrderWizardApiException(String message, HttpStatus httpStatus, String errorCode) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.stage = null;
        this.substep = null;
        this.errorDetails = null;
    }

    public OrderWizardApiException(String message, HttpStatus httpStatus, String errorCode,
                                   String stage, String substep) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.stage = stage;
        this.substep = substep;
        this.errorDetails = null;
    }

    public OrderWizardApiException(String message, HttpStatus httpStatus, String errorCode,
                                   String stage, String substep, Object errorDetails) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.stage = stage;
        this.substep = substep;
        this.errorDetails = errorDetails;
    }

    public OrderWizardApiException(String message, Throwable cause, HttpStatus httpStatus,
                                   String errorCode, String stage, String substep) {
        super(message, cause);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.stage = stage;
        this.substep = substep;
        this.errorDetails = null;
    }

    // Getters
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getStage() {
        return stage;
    }

    public String getSubstep() {
        return substep;
    }

    public Object getErrorDetails() {
        return errorDetails;
    }

    // Builder pattern для зручного створення
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String message;
        private Throwable cause;
        private HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        private String errorCode = "WIZARD_ERROR";
        private String stage;
        private String substep;
        private Object errorDetails;

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder cause(Throwable cause) {
            this.cause = cause;
            return this;
        }

        public Builder httpStatus(HttpStatus httpStatus) {
            this.httpStatus = httpStatus;
            return this;
        }

        public Builder errorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }

        public Builder stage(String stage) {
            this.stage = stage;
            return this;
        }

        public Builder substep(String substep) {
            this.substep = substep;
            return this;
        }

        public Builder errorDetails(Object errorDetails) {
            this.errorDetails = errorDetails;
            return this;
        }

        public OrderWizardApiException build() {
            if (cause != null) {
                return new OrderWizardApiException(message, cause, httpStatus, errorCode, stage, substep);
            }
            return new OrderWizardApiException(message, httpStatus, errorCode, stage, substep, errorDetails);
        }
    }
}
