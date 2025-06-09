package com.aksi.domain.order.statemachine.stage1.dto;

import java.time.LocalDateTime;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoStatus;
import com.aksi.domain.order.statemachine.stage1.enums.ReceiptNumberGenerationType;

/**
 * DTO для базової інформації замовлення (етап 1.2).
 * Містить тільки 4 поля: номер квитанції, унікальну мітку, філію, дату створення.
 */
public class BasicOrderInfoDTO {

    /**
     * Номер квитанції (генерується автоматично).
     */
    private String receiptNumber;

    /**
     * Унікальна мітка (вводиться вручну або сканується).
     */
    private String uniqueTag;

    /**
     * Пункт прийому замовлення (філія).
     */
    private BranchLocationDTO branchLocation;

    /**
     * Дата створення замовлення (автоматично).
     */
    private LocalDateTime createdAt;

    /**
     * Статус базової інформації.
     */
    private BasicOrderInfoStatus status;

    /**
     * Тип генерації номера квитанції.
     */
    private ReceiptNumberGenerationType receiptGenerationType;

    // Конструктори
    public BasicOrderInfoDTO() {
        this.createdAt = LocalDateTime.now();
        this.status = BasicOrderInfoStatus.EMPTY;
        this.receiptGenerationType = ReceiptNumberGenerationType.AUTOMATIC;
    }

    public BasicOrderInfoDTO(String receiptNumber, String uniqueTag, BranchLocationDTO branchLocation) {
        this();
        this.receiptNumber = receiptNumber;
        this.uniqueTag = uniqueTag;
        this.branchLocation = branchLocation;
        updateStatus();
    }

    // Методи валідації
    public boolean hasReceiptNumber() {
        return receiptNumber != null && !receiptNumber.trim().isEmpty();
    }

    public boolean hasUniqueTag() {
        return uniqueTag != null && !uniqueTag.trim().isEmpty();
    }

    public boolean hasBranchLocation() {
        return branchLocation != null && branchLocation.getId() != null;
    }

    public boolean hasCreatedAt() {
        return createdAt != null;
    }

    public boolean hasAllRequiredFields() {
        return hasReceiptNumber() && hasUniqueTag() && hasBranchLocation();
    }

    /**
     * Оновлює статус на основі заповнених полів.
     */
    private void updateStatus() {
        if (!hasReceiptNumber() && !hasUniqueTag() && !hasBranchLocation()) {
            this.status = BasicOrderInfoStatus.EMPTY;
        } else if (hasAllRequiredFields()) {
            this.status = BasicOrderInfoStatus.READY_FOR_VALIDATION;
        } else {
            this.status = BasicOrderInfoStatus.PARTIAL;
        }
    }

    // Getters і Setters
    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
        updateStatus();
    }

    public String getUniqueTag() {
        return uniqueTag;
    }

    public void setUniqueTag(String uniqueTag) {
        this.uniqueTag = uniqueTag;
        updateStatus();
    }

    public BranchLocationDTO getBranchLocation() {
        return branchLocation;
    }

    public void setBranchLocation(BranchLocationDTO branchLocation) {
        this.branchLocation = branchLocation;
        updateStatus();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BasicOrderInfoStatus getStatus() {
        return status;
    }

    public void setStatus(BasicOrderInfoStatus status) {
        this.status = status;
    }

    public ReceiptNumberGenerationType getReceiptGenerationType() {
        return receiptGenerationType;
    }

    public void setReceiptGenerationType(ReceiptNumberGenerationType receiptGenerationType) {
        this.receiptGenerationType = receiptGenerationType;
    }

    @Override
    public String toString() {
        return "BasicOrderInfoDTO{" +
                "receiptNumber='" + receiptNumber + '\'' +
                ", uniqueTag='" + uniqueTag + '\'' +
                ", branchLocation=" + (branchLocation != null ? branchLocation.getName() : null) +
                ", createdAt=" + createdAt +
                ", status=" + status +
                ", receiptGenerationType=" + receiptGenerationType +
                '}';
    }
}
