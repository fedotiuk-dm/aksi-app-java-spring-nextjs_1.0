package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchValidator;
import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для вибору філії в Stage1.
 *
 * ЕТАП 2: VALIDATORS - залежить тільки від DTO + ValidationResult + доменні сервіси валідації
 * Дозволені імпорти: Stage1 DTO, ValidationResult, BranchValidator (доменний)
 * Заборонені імпорти: Services, Actions, Guards, Config
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BranchSelectionValidator {

    private final BranchValidator branchValidator;

    /**
     * Валідує вибір філії в базовій інформації замовлення.
     */
    public ValidationResult validateBranchSelection(BasicOrderInfoDTO orderInfo) {
        log.debug("Валідація вибору філії: {}", orderInfo);

        if (orderInfo == null) {
            return ValidationResult.failure(List.of("Базова інформація замовлення відсутня"));
        }

        List<String> errors = new ArrayList<>();

        // Перевірка наявності branchLocation
        if (orderInfo.getBranchLocation() == null) {
            errors.add("Філія не вибрана");
        } else if (orderInfo.getBranchLocation().getId() == null) {
            errors.add("ID філії відсутній");
        } else {
            // Валідація через доменний BranchValidator
            try {
                BranchValidator.ValidationResult result = branchValidator.validateSafely(orderInfo.getBranchLocation().getId());
                if (!result.isValid()) {
                    errors.add("Помилка валідації філії: " + result.getErrorMessage());
                }
            } catch (Exception e) {
                log.warn("Помилка валідації філії {}: {}", orderInfo.getBranchLocation().getId(), e.getMessage());
                errors.add("Некоректна філія: " + e.getMessage());
            }
        }

        boolean isValid = errors.isEmpty();
        log.debug("Результат валідації філії: {}, помилки: {}", isValid, errors);

        return isValid ? ValidationResult.success() : ValidationResult.failure(errors);
    }

    /**
     * Валідує філію за ID.
     */
    public ValidationResult validateBranchId(UUID branchId) {
        log.debug("Валідація філії за ID: {}", branchId);

        if (branchId == null) {
            return ValidationResult.failure(List.of("ID філії не може бути порожнім"));
        }

        try {
            BranchValidator.ValidationResult result = branchValidator.validateSafely(branchId);
            if (result.isValid()) {
                log.debug("Філія {} успішно валідована", branchId);
                return ValidationResult.success();
            } else {
                log.debug("Валідація філії {} не пройшла: {}", branchId, result.getErrorMessage());
                return ValidationResult.failure(List.of(result.getErrorMessage()));
            }
        } catch (Exception e) {
            log.warn("Помилка валідації філії {}: {}", branchId, e.getMessage());
            return ValidationResult.failure(List.of("Помилка валідації філії: " + e.getMessage()));
        }
    }

    /**
     * Перевіряє чи активна філія.
     */
    public boolean isBranchActive(UUID branchId) {
        if (branchId == null) {
            return false;
        }

        return branchValidator.isActive(branchId);
    }

    /**
     * Отримує валідовані дані філії.
     */
    public BranchLocationDTO getValidatedBranch(UUID branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("ID філії не може бути порожнім");
        }

        try {
            return branchValidator.validateAndGet(branchId);
        } catch (Exception e) {
            log.warn("Не вдалося отримати валідовані дані філії {}: {}", branchId, e.getMessage());
            throw e;
        }
    }
}
