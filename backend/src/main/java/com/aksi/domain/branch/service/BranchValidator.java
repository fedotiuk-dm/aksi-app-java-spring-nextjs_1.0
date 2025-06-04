package com.aksi.domain.branch.service;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Єдиний сервіс для валідації філій у всьому проекті.
 *
 * Забезпечує консистентну валідацію філій з централізованою логікою.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BranchValidator {

    private final BranchLocationService branchLocationService;

    /**
     * Валідує та отримує дані філії за ID.
     *
     * @param branchId ID філії
     * @return валідовані дані філії
     * @throws IllegalArgumentException якщо філія не знайдена або неактивна
     */
    public BranchLocationDTO validateAndGet(UUID branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("ID філії не може бути null");
        }

        log.debug("Валідація філії з ID: {}", branchId);

        // Отримуємо дані філії
        BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);

        // Валідуємо активність
        validateBranchIsActive(branch);

        log.debug("Філія {} успішно валідована", branchId);
        return branch;
    }

    /**
     * Валідує та отримує дані філії за ID у вигляді String.
     *
     * @param branchIdStr ID філії як String
     * @return валідовані дані філії
     * @throws IllegalArgumentException якщо формат ID некоректний або філія неактивна
     */
    public BranchLocationDTO validateAndGet(String branchIdStr) {
        if (branchIdStr == null || branchIdStr.trim().isEmpty()) {
            throw new IllegalArgumentException("ID філії не може бути порожнім");
        }

        try {
            UUID branchId = UUID.fromString(branchIdStr.trim());
            return validateAndGet(branchId);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Некоректний формат ID філії: " + branchIdStr, e);
        }
    }

    /**
     * Перевіряє, чи є філія активною.
     *
     * @param branch дані філії
     * @throws IllegalArgumentException якщо філія неактивна
     */
    public void validateBranchIsActive(BranchLocationDTO branch) {
        if (branch == null) {
            throw new IllegalArgumentException("Дані філії не можуть бути null");
        }

        if (Boolean.FALSE.equals(branch.getActive())) {
            throw new IllegalArgumentException(
                String.format("Філія '%s' (ID: %s) не активна",
                    branch.getName(), branch.getId()));
        }
    }

    /**
     * Перевіряє, чи є філія активною за ID.
     *
     * @param branchId ID філії
     * @return true якщо філія активна
     */
    public boolean isActive(UUID branchId) {
        try {
            BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);
            return Boolean.TRUE.equals(branch.getActive());
        } catch (Exception e) {
            log.warn("Помилка перевірки активності філії {}: {}", branchId, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує код філії або повертає дефолтний.
     *
     * @param branch дані філії
     * @param defaultCode дефолтний код
     * @return код філії або дефолтний код
     */
    public String getBranchCodeOrDefault(BranchLocationDTO branch, String defaultCode) {
        if (branch == null || branch.getCode() == null || branch.getCode().trim().isEmpty()) {
            return defaultCode;
        }
        return branch.getCode().trim();
    }

    /**
     * Результат валідації філії.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String errorMessage;
        private final BranchLocationDTO branch;

        private ValidationResult(boolean valid, String errorMessage, BranchLocationDTO branch) {
            this.valid = valid;
            this.errorMessage = errorMessage;
            this.branch = branch;
        }

        public static ValidationResult success(BranchLocationDTO branch) {
            return new ValidationResult(true, null, branch);
        }

        public static ValidationResult failure(String errorMessage) {
            return new ValidationResult(false, errorMessage, null);
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public BranchLocationDTO getBranch() {
            return branch;
        }
    }

    /**
     * Валідує філію без викидання виключень.
     *
     * @param branchId ID філії
     * @return результат валідації
     */
    public ValidationResult validateSafely(UUID branchId) {
        try {
            BranchLocationDTO branch = validateAndGet(branchId);
            return ValidationResult.success(branch);
        } catch (Exception e) {
            return ValidationResult.failure(e.getMessage());
        }
    }
}
