package com.aksi.domain.document.enums;

/**
 * Domain enum для типів документів з business логікою.
 * Синхронізовано з API enum: com.aksi.api.document.dto.DocumentType
 */
public enum DocumentType {

    RECEIPT("RECEIPT", "Квитанція", true, true),
    CONTRACT("CONTRACT", "Договір", true, false),
    INVOICE("INVOICE", "Рахунок", true, false),
    PHOTO("PHOTO", "Фото", false, false),
    QR_CODE("QR_CODE", "QR-код", false, false),
    SIGNATURE("SIGNATURE", "Підпис", false, false);

    private final String code;
    private final String displayName;
    private final boolean requiresSignature;
    private final boolean isBillable;

    DocumentType(String code, String displayName, boolean requiresSignature, boolean isBillable) {
        this.code = code;
        this.displayName = displayName;
        this.requiresSignature = requiresSignature;
        this.isBillable = isBillable;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    // Business methods
    public boolean isReceiptType() {
        return this == RECEIPT;
    }

    public boolean isSignatureType() {
        return this == SIGNATURE;
    }

    public boolean isPhotoType() {
        return this == PHOTO;
    }

    public boolean isQrCodeType() {
        return this == QR_CODE;
    }

    public boolean requiresSignature() {
        return requiresSignature;
    }

    public boolean isBillableDocument() {
        return isBillable;
    }

    public boolean isFinancialDocument() {
        return this == RECEIPT || this == INVOICE;
    }

    public boolean isLegalDocument() {
        return this == CONTRACT || this == RECEIPT;
    }

    public boolean requiresStorage() {
        return this != QR_CODE; // QR коди можуть генеруватися на льоту
    }

    public boolean canBeDownloaded() {
        return this == RECEIPT || this == CONTRACT || this == INVOICE;
    }
}
