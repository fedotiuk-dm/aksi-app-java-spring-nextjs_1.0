package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.validator.BasicOrderInfoValidationResult;
import com.aksi.domain.order.statemachine.stage1.validator.BasicOrderInfoValidator;

/**
 * Сервіс для консолідації всіх валідацій базової інформації замовлення.
 * Об'єднує різні типи валідацій та надає зручний API.
 */
@Service
public class BasicOrderInfoValidationService {

    private final BasicOrderInfoValidator validator;

    public BasicOrderInfoValidationService(BasicOrderInfoValidator validator) {
        this.validator = validator;
    }

    /**
     * Повна валідація базової інформації замовлення.
     */
    public BasicOrderInfoValidationResult validateComplete(BasicOrderInfoDTO basicOrderInfo) {
        if (basicOrderInfo == null) {
            return BasicOrderInfoValidationResult.failure("Базова інформація замовлення не може бути null");
        }

        return validator.validate(basicOrderInfo);
    }

    /**
     * Швидка валідація тільки критичних полів.
     */
    public BasicOrderInfoValidationResult validateCritical(BasicOrderInfoDTO basicOrderInfo) {
        if (basicOrderInfo == null) {
            return BasicOrderInfoValidationResult.failure("Базова інформація замовлення не може бути null");
        }

        BasicOrderInfoValidationResult result = BasicOrderInfoValidationResult.success();

        // Валідація номера квитанції (критично)
        BasicOrderInfoValidationResult receiptResult = validator.validateReceiptNumber(basicOrderInfo.getReceiptNumber());
        if (!receiptResult.isValid()) {
            result = result.combine(receiptResult);
        }

        // Валідація унікальної мітки (критично)
        BasicOrderInfoValidationResult tagResult = validator.validateUniqueTag(basicOrderInfo.getUniqueTag());
        if (!tagResult.isValid()) {
            result = result.combine(tagResult);
        }

        // Валідація вибраної філії (критично)
        BasicOrderInfoValidationResult branchValidation = validator.validateSelectedBranch(basicOrderInfo);
        if (!branchValidation.isValid()) {
            result = result.combine(branchValidation);
        }

        return result;
    }

    /**
     * Валідація готовності до переходу між кроками.
     */
    public BasicOrderInfoValidationResult validateStepReadiness(BasicOrderInfoDTO basicOrderInfo, String stepName) {
        if (basicOrderInfo == null) {
            return BasicOrderInfoValidationResult.failure("Базова інформація замовлення не може бути null");
        }

        return switch (stepName.toLowerCase()) {
            case "receipt_generation" -> validateReceiptGenerationReadiness(basicOrderInfo);
            case "unique_tag_entry" -> validateUniqueTagReadiness(basicOrderInfo);
            case "branch_selection" -> validateBranchSelectionReadiness(basicOrderInfo);
            case "completion" -> validateCompletionReadiness(basicOrderInfo);
            default -> BasicOrderInfoValidationResult.successWithWarnings(
                List.of("Невідомий крок: " + stepName));
        };
    }

    /**
     * Валідація готовності до генерації номера квитанції.
     */
    public BasicOrderInfoValidationResult validateReceiptGenerationReadiness(BasicOrderInfoDTO basicOrderInfo) {
        BasicOrderInfoValidationResult result = BasicOrderInfoValidationResult.success();

        if (basicOrderInfo.getSelectedBranchId() == null) {
            result = result.addWarning("Рекомендується вибрати філію перед генерацією номера квитанції");
        }

        return result;
    }

    /**
     * Валідація готовності до введення унікальної мітки.
     */
    public BasicOrderInfoValidationResult validateUniqueTagReadiness(BasicOrderInfoDTO basicOrderInfo) {
        BasicOrderInfoValidationResult result = BasicOrderInfoValidationResult.success();

        BasicOrderInfoValidationResult receiptCheck = validator.validateReceiptNumber(basicOrderInfo.getReceiptNumber());
        if (!receiptCheck.isValid()) {
            result = result.addError("Номер квитанції повинен бути згенерований перед введенням унікальної мітки");
        }

        return result;
    }

    /**
     * Валідація готовності до вибору філії.
     */
    public BasicOrderInfoValidationResult validateBranchSelectionReadiness(BasicOrderInfoDTO basicOrderInfo) {
        // Вибір філії може бути здійснений на будь-якому етапі
        return BasicOrderInfoValidationResult.success();
    }

    /**
     * Валідація готовності до завершення етапу.
     */
    public BasicOrderInfoValidationResult validateCompletionReadiness(BasicOrderInfoDTO basicOrderInfo) {
        return validateComplete(basicOrderInfo);
    }

    /**
     * Валідація формату номера квитанції.
     */
    public boolean isReceiptNumberValid(String receiptNumber) {
        BasicOrderInfoValidationResult result = validator.validateReceiptNumber(receiptNumber);
        return result.isValid();
    }

    /**
     * Валідація формату унікальної мітки.
     */
    public boolean isUniqueTagValid(String uniqueTag) {
        BasicOrderInfoValidationResult result = validator.validateUniqueTag(uniqueTag);
        return result.isValid();
    }

    /**
     * Перевірка логічної узгодженості прапорців завершення.
     */
    public BasicOrderInfoValidationResult validateCompletionFlags(BasicOrderInfoDTO basicOrderInfo) {
        return validator.validateCompletionFlags(basicOrderInfo);
    }

    /**
     * Валідація дати створення.
     */
    public BasicOrderInfoValidationResult validateCreationDate(BasicOrderInfoDTO basicOrderInfo) {
        return validator.validateCreationDate(basicOrderInfo.getCreationDate());
    }

    /**
     * Швидка перевірка чи готова базова інформація для переходу до наступного етапу.
     */
    public boolean isReadyForNextStage(BasicOrderInfoDTO basicOrderInfo) {
        BasicOrderInfoValidationResult result = validateComplete(basicOrderInfo);
        return result.isValid() && !result.hasErrors();
    }

    /**
     * Отримання детального звіту про валідацію.
     */
    public String getValidationReport(BasicOrderInfoDTO basicOrderInfo) {
        BasicOrderInfoValidationResult result = validateComplete(basicOrderInfo);
        StringBuilder report = new StringBuilder();

        report.append("=== Звіт валідації базової інформації замовлення ===\n");
        report.append("Статус: ").append(result.isValid() ? "ВАЛІДНА" : "НЕВАЛІДНА").append("\n");

        if (result.hasErrors()) {
            report.append("\nПомилки:\n");
            result.getErrors().forEach(error -> report.append("- ").append(error).append("\n"));
        }

        if (result.hasWarnings()) {
            report.append("\nПопередження:\n");
            result.getWarnings().forEach(warning -> report.append("- ").append(warning).append("\n"));
        }

        return report.toString();
    }
}
