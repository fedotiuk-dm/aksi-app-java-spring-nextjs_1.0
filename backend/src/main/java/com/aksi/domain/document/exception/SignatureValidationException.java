package com.aksi.domain.document.exception;

import com.aksi.domain.document.enums.SignatureType;

/**
 * Exception що викидається при помилках валідації підписів
 */
public class SignatureValidationException extends RuntimeException {

    public SignatureValidationException(String message) {
        super(message);
    }

    public SignatureValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    public static SignatureValidationException invalidSignature(String reason) {
        return new SignatureValidationException("Підпис недійсний: " + reason);
    }

    public static SignatureValidationException expiredSignature() {
        return new SignatureValidationException("Термін дії підпису закінчився");
    }

    public static SignatureValidationException duplicateSignature(SignatureType type) {
        return new SignatureValidationException("Підпис типу " + type + " вже існує");
    }

    public static SignatureValidationException missingSignerInfo() {
        return new SignatureValidationException("Відсутня інформація про підписувача");
    }

    public static SignatureValidationException unauthorizedSigner(String signerName) {
        return new SignatureValidationException("Користувач " + signerName + " не має права підписувати документи");
    }
}
