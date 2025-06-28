package com.aksi.domain.client.exception;

/**
 * Базовий бізнес-виняток для Client домену.
 * Використовується для помилок бізнес-логіки.
 */
public class ClientBusinessException extends RuntimeException {

    private final String errorCode;

    public ClientBusinessException(String message) {
        super(message);
        this.errorCode = "CLIENT_BUSINESS_ERROR";
    }

    public ClientBusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public ClientBusinessException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "CLIENT_BUSINESS_ERROR";
    }

    public ClientBusinessException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
