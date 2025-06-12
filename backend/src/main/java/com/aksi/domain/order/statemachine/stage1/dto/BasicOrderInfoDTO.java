package com.aksi.domain.order.statemachine.stage1.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.branch.dto.BranchLocationDTO;

/**
 * DTO для базової інформації замовлення в етапі 1.3.
 * Містить всі необхідні поля для створення базової інформації про замовлення.
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
     * Обрана філія для прийому замовлення.
     */
    private BranchLocationDTO selectedBranch;

    /**
     * Список доступних філій для вибору (завантажується через State Machine).
     */
    private List<BranchLocationDTO> availableBranches;

    /**
     * ID обраної філії (для простішого маппінгу).
     */
    private UUID selectedBranchId;

    /**
     * Дата створення замовлення (встановлюється автоматично).
     */
    private LocalDateTime creationDate;

    /**
     * Прапорець, чи номер квитанції згенеровано.
     */
    private boolean receiptNumberGenerated;

    /**
     * Прапорець, чи унікальна мітка введена.
     */
    private boolean uniqueTagEntered;

    /**
     * Прапорець, чи філію обрано.
     */
    private boolean branchSelected;

    /**
     * Прапорець, чи дату створення встановлено.
     */
    private boolean creationDateSet;

    // Конструктори
    public BasicOrderInfoDTO() {
        this.receiptNumberGenerated = false;
        this.uniqueTagEntered = false;
        this.branchSelected = false;
        this.creationDateSet = false;
    }

    public BasicOrderInfoDTO(String receiptNumber, String uniqueTag,
                           BranchLocationDTO selectedBranch, LocalDateTime creationDate) {
        this();
        this.receiptNumber = receiptNumber;
        this.uniqueTag = uniqueTag;
        this.selectedBranch = selectedBranch;
        this.selectedBranchId = selectedBranch != null ? selectedBranch.getId() : null;
        this.creationDate = creationDate;

        this.receiptNumberGenerated = receiptNumber != null && !receiptNumber.trim().isEmpty();
        this.uniqueTagEntered = uniqueTag != null && !uniqueTag.trim().isEmpty();
        this.branchSelected = selectedBranch != null;
        this.creationDateSet = creationDate != null;
    }

    // Допоміжні методи для валідації

    /**
     * Перевіряє, чи всі обов'язкові поля заповнені.
     */
    public boolean isComplete() {
        return receiptNumberGenerated && uniqueTagEntered &&
               branchSelected && creationDateSet;
    }

    /**
     * Перевіряє, чи є мінімальні дані для збереження як чернетка.
     */
    public boolean hasMinimumData() {
        return receiptNumberGenerated || uniqueTagEntered || branchSelected;
    }

    /**
     * Перевіряє, чи номер квитанції валідний.
     */
    public boolean isReceiptNumberValid() {
        return receiptNumber != null &&
               receiptNumber.trim().length() >= 5 &&
               receiptNumber.matches("^[A-Z0-9\\-]+$");
    }

    /**
     * Перевіряє, чи унікальна мітка валідна.
     */
    public boolean isUniqueTagValid() {
        return uniqueTag != null &&
               uniqueTag.trim().length() >= 3 &&
               uniqueTag.trim().length() <= 50;
    }

    // Геттери та сеттери

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
        this.receiptNumberGenerated = receiptNumber != null && !receiptNumber.trim().isEmpty();
    }

    public String getUniqueTag() {
        return uniqueTag;
    }

    public void setUniqueTag(String uniqueTag) {
        this.uniqueTag = uniqueTag;
        this.uniqueTagEntered = uniqueTag != null && !uniqueTag.trim().isEmpty();
    }

    public BranchLocationDTO getSelectedBranch() {
        return selectedBranch;
    }

    public void setSelectedBranch(BranchLocationDTO selectedBranch) {
        this.selectedBranch = selectedBranch;
        this.selectedBranchId = selectedBranch != null ? selectedBranch.getId() : null;
        this.branchSelected = selectedBranch != null;
    }

    public UUID getSelectedBranchId() {
        return selectedBranchId;
    }

    public void setSelectedBranchId(UUID selectedBranchId) {
        this.selectedBranchId = selectedBranchId;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
        this.creationDateSet = creationDate != null;
    }

    public boolean isReceiptNumberGenerated() {
        return receiptNumberGenerated;
    }

    public boolean isUniqueTagEntered() {
        return uniqueTagEntered;
    }

    public boolean isBranchSelected() {
        return branchSelected;
    }

    public boolean isCreationDateSet() {
        return creationDateSet;
    }

    public List<BranchLocationDTO> getAvailableBranches() {
        return availableBranches;
    }

    public void setAvailableBranches(List<BranchLocationDTO> availableBranches) {
        this.availableBranches = availableBranches;
    }

    // ========== МЕТОДИ ДЛЯ РОБОТИ З ФІЛІЯМИ ==========

    /**
     * Повертає всі доступні філії (завантажуються автоматично при ініціалізації).
     */
    public List<BranchLocationDTO> getAllBranches() {
        return availableBranches != null ? availableBranches : java.util.Collections.emptyList();
    }

    /**
     * Знаходить філію за ID серед доступних філій.
     */
    public BranchLocationDTO getBranchById(UUID branchId) {
        if (branchId == null || availableBranches == null) {
            return null;
        }

        return availableBranches.stream()
                .filter(branch -> branchId.equals(branch.getId()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Перевіряє чи філія доступна для вибору.
     */
    public boolean isBranchAvailable(UUID branchId) {
        return getBranchById(branchId) != null;
    }

    /**
     * Вибирає філію за ID якщо вона доступна.
     */
    public boolean selectBranchById(UUID branchId) {
        BranchLocationDTO branch = getBranchById(branchId);
        if (branch != null) {
            setSelectedBranch(branch);
            return true;
        }
        return false;
    }

    /**
     * Перевіряє чи філії завантажені.
     */
    public boolean hasBranchesLoaded() {
        return availableBranches != null && !availableBranches.isEmpty();
    }

    /**
     * Отримує кількість доступних філій.
     */
    public int getBranchesCount() {
        return availableBranches != null ? availableBranches.size() : 0;
    }

    @Override
    public String toString() {
        return "BasicOrderInfoDTO{" +
                "receiptNumber='" + receiptNumber + '\'' +
                ", uniqueTag='" + uniqueTag + '\'' +
                ", selectedBranchId=" + selectedBranchId +
                ", creationDate=" + creationDate +
                ", receiptNumberGenerated=" + receiptNumberGenerated +
                ", uniqueTagEntered=" + uniqueTagEntered +
                ", branchSelected=" + branchSelected +
                ", creationDateSet=" + creationDateSet +
                '}';
    }
}
