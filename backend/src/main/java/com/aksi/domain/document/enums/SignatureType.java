package com.aksi.domain.document.enums;

/**
 * Domain enum для типів підписів з business логікою.
 * Синхронізовано з API enum: com.aksi.api.document.dto.SignatureType
 */
public enum SignatureType {

    CLIENT_HANDOVER("CLIENT_HANDOVER", "Підпис клієнта при здачі", true, true),
    CLIENT_PICKUP("CLIENT_PICKUP", "Підпис клієнта при отриманні", true, true),
    OPERATOR("OPERATOR", "Підпис оператора", false, true),
    DIGITAL("DIGITAL", "Цифровий підпис", false, false);

    private final String code;
    private final String displayName;
    private final boolean isClientSignature;
    private final boolean requiresPhysicalPresence;

    SignatureType(String code, String displayName, boolean isClientSignature, boolean requiresPhysicalPresence) {
        this.code = code;
        this.displayName = displayName;
        this.isClientSignature = isClientSignature;
        this.requiresPhysicalPresence = requiresPhysicalPresence;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    // Business methods
    public boolean isClientHandover() {
        return this == CLIENT_HANDOVER;
    }

    public boolean isClientPickup() {
        return this == CLIENT_PICKUP;
    }

    public boolean isOperator() {
        return this == OPERATOR;
    }

    public boolean isDigital() {
        return this == DIGITAL;
    }

    public boolean isClientSignature() {
        return isClientSignature;
    }

    public boolean isOperatorSignature() {
        return this == OPERATOR;
    }

    public boolean requiresPhysicalPresence() {
        return requiresPhysicalPresence;
    }

    public boolean isDigitalOnly() {
        return !requiresPhysicalPresence;
    }

    public boolean isHandwrittenSignature() {
        return this != DIGITAL;
    }

    public boolean requiresDevice() {
        return this != DIGITAL; // Для рукописних підписів потрібен пристрій вводу
    }

    public boolean canBeStoredAsImage() {
        return this != DIGITAL; // Цифрові підписи мають інший формат зберігання
    }

    public boolean isTransactionRelated() {
        return this == CLIENT_HANDOVER || this == CLIENT_PICKUP;
    }
}
