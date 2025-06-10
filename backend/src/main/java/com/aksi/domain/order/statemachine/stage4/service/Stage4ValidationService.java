package com.aksi.domain.order.statemachine.stage4.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.validator.LegalAcceptanceValidator;
import com.aksi.domain.order.statemachine.stage4.validator.OrderCompletionValidator;
import com.aksi.domain.order.statemachine.stage4.validator.OrderConfirmationValidator;
import com.aksi.domain.order.statemachine.stage4.validator.ReceiptConfigurationValidator;
import com.aksi.domain.order.statemachine.stage4.validator.ValidationResult;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс валідації для Stage4.
 * Консолідує всі валідатори та надає єдину точку входу для валідації.
 */
@Service
@RequiredArgsConstructor
public class Stage4ValidationService {

    private final OrderConfirmationValidator orderConfirmationValidator;
    private final LegalAcceptanceValidator legalAcceptanceValidator;
    private final ReceiptConfigurationValidator receiptConfigurationValidator;
    private final OrderCompletionValidator orderCompletionValidator;

    /**
     * Валідує дані підтвердження замовлення.
     *
     * @param confirmationDTO дані підтвердження замовлення
     * @return результат валідації
     */
    public ValidationResult validateOrderConfirmation(OrderConfirmationDTO confirmationDTO) {
        return orderConfirmationValidator.validate(confirmationDTO);
    }

    /**
     * Валідує дані юридичного прийняття.
     *
     * @param legalDTO дані юридичного прийняття
     * @return результат валідації
     */
    public ValidationResult validateLegalAcceptance(LegalAcceptanceDTO legalDTO) {
        return legalAcceptanceValidator.validate(legalDTO);
    }

    /**
     * Валідує конфігурацію генерації квитанції.
     *
     * @param receiptDTO конфігурація квитанції
     * @return результат валідації
     */
    public ValidationResult validateReceiptConfiguration(ReceiptConfigurationDTO receiptDTO) {
        return receiptConfigurationValidator.validate(receiptDTO);
    }

    /**
     * Валідує дані завершення замовлення.
     *
     * @param completionDTO дані завершення замовлення
     * @return результат валідації
     */
    public ValidationResult validateOrderCompletion(OrderCompletionDTO completionDTO) {
        return orderCompletionValidator.validate(completionDTO);
    }

    /**
     * Комплексна валідація всіх даних Stage4.
     *
     * @param confirmationDTO дані підтвердження замовлення
     * @param legalDTO дані юридичного прийняття
     * @param receiptDTO конфігурація квитанції
     * @param completionDTO дані завершення замовлення
     * @return загальний результат валідації
     */
    public ValidationResult validateCompleteStage4(OrderConfirmationDTO confirmationDTO,
                                                   LegalAcceptanceDTO legalDTO,
                                                   ReceiptConfigurationDTO receiptDTO,
                                                   OrderCompletionDTO completionDTO) {
        ValidationResult result = new ValidationResult();

        // Валідація підтвердження замовлення
        if (confirmationDTO != null) {
            ValidationResult confirmationResult = validateOrderConfirmation(confirmationDTO);
            if (!confirmationResult.isValid()) {
                confirmationResult.getErrorMessages().forEach(result::addError);
                confirmationResult.getWarningMessages().forEach(result::addWarning);
            }
        }

        // Валідація юридичного прийняття
        if (legalDTO != null) {
            ValidationResult legalResult = validateLegalAcceptance(legalDTO);
            if (!legalResult.isValid()) {
                legalResult.getErrorMessages().forEach(result::addError);
                legalResult.getWarningMessages().forEach(result::addWarning);
            }
        }

        // Валідація конфігурації квитанції
        if (receiptDTO != null) {
            ValidationResult receiptResult = validateReceiptConfiguration(receiptDTO);
            if (!receiptResult.isValid()) {
                receiptResult.getErrorMessages().forEach(result::addError);
                receiptResult.getWarningMessages().forEach(result::addWarning);
            }
        }

        // Валідація завершення замовлення
        if (completionDTO != null) {
            ValidationResult completionResult = validateOrderCompletion(completionDTO);
            if (!completionResult.isValid()) {
                completionResult.getErrorMessages().forEach(result::addError);
                completionResult.getWarningMessages().forEach(result::addWarning);
            }
        }

        return result;
    }
}
