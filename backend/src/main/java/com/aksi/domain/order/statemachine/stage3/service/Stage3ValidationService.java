package com.aksi.domain.order.statemachine.stage3.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.validator.AdditionalInfoValidator;
import com.aksi.domain.order.statemachine.stage3.validator.DiscountConfigurationValidator;
import com.aksi.domain.order.statemachine.stage3.validator.ExecutionParamsValidator;
import com.aksi.domain.order.statemachine.stage3.validator.PaymentConfigurationValidator;
import com.aksi.domain.order.statemachine.stage3.validator.ValidationResult;

/**
 * Консолідований сервіс валідації для Stage3.
 * Об'єднує всі validators з ЕТАП 2.
 *
 * ЕТАП 4.1: Validation Service (консолідує validators)
 * Дозволені імпорти: Validators + ValidationResult + DTO + Spring аннотації
 * Заборонено: Operations Services, Actions, Guards, Config
 */
@Service
public class Stage3ValidationService {

    private final ExecutionParamsValidator executionParamsValidator;
    private final DiscountConfigurationValidator discountConfigurationValidator;
    private final PaymentConfigurationValidator paymentConfigurationValidator;
    private final AdditionalInfoValidator additionalInfoValidator;

    public Stage3ValidationService(
            ExecutionParamsValidator executionParamsValidator,
            DiscountConfigurationValidator discountConfigurationValidator,
            PaymentConfigurationValidator paymentConfigurationValidator,
            AdditionalInfoValidator additionalInfoValidator) {
        this.executionParamsValidator = executionParamsValidator;
        this.discountConfigurationValidator = discountConfigurationValidator;
        this.paymentConfigurationValidator = paymentConfigurationValidator;
        this.additionalInfoValidator = additionalInfoValidator;
    }

    /**
     * Валідує параметри виконання (підетап 3.1)
     */
    public ValidationResult validateExecutionParams(ExecutionParamsDTO dto) {
        return executionParamsValidator.validateAll(dto);
    }

    /**
     * Валідує конфігурацію знижок (підетап 3.2)
     */
    public ValidationResult validateDiscountConfiguration(DiscountConfigurationDTO dto) {
        return discountConfigurationValidator.validateAll(dto);
    }

    /**
     * Валідує конфігурацію оплати (підетап 3.3)
     */
    public ValidationResult validatePaymentConfiguration(PaymentConfigurationDTO dto) {
        return paymentConfigurationValidator.validateAll(dto);
    }

    /**
     * Валідує додаткову інформацію (підетап 3.4)
     */
    public ValidationResult validateAdditionalInfo(AdditionalInfoDTO dto) {
        return additionalInfoValidator.validateAll(dto);
    }

    /**
     * Валідує всі підетапи Stage3
     */
    public ValidationResult validateAllSubsteps(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {

        ValidationResult result = new ValidationResult();

        // Валідація кожного підетапу
        ValidationResult executionResult = validateExecutionParams(executionParams);
        ValidationResult discountResult = validateDiscountConfiguration(discountConfig);
        ValidationResult paymentResult = validatePaymentConfiguration(paymentConfig);
        ValidationResult additionalResult = validateAdditionalInfo(additionalInfo);

        // Об'єднання результатів
        result.addErrors(executionResult.getErrors());
        result.addErrors(discountResult.getErrors());
        result.addErrors(paymentResult.getErrors());
        result.addErrors(additionalResult.getErrors());

        // Валідація міжетапних залежностей
        validateCrossStepDependencies(executionParams, discountConfig, paymentConfig, additionalInfo, result);

        return result;
    }

    /**
     * Перевіряє міжетапні залежності
     */
    private void validateCrossStepDependencies(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo,
            ValidationResult result) {

        // Перевірка узгодженості терміновості та знижок
        if (executionParams != null && discountConfig != null) {
            if (executionParams.getExpediteType() != null &&
                discountConfig.getDiscountType() != null &&
                discountConfig.getDiscountType() != DiscountType.NO_DISCOUNT) {

                // Деякі знижки можуть не поєднуватися з терміновістю
                validateExpediteDiscountCompatibility(executionParams, discountConfig, result);
            }
        }

        // Перевірка узгодженості знижки та загальної суми оплати
        if (discountConfig != null && paymentConfig != null) {
            validateDiscountPaymentConsistency(discountConfig, paymentConfig, result);
        }

        // Перевірка обов'язковості додаткової інформації за певних умов
        if (paymentConfig != null && additionalInfo != null) {
            validatePaymentAdditionalInfoRequirements(paymentConfig, additionalInfo, result);
        }
    }

    /**
     * Перевіряє сумісність терміновості та знижок
     */
    private void validateExpediteDiscountCompatibility(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            ValidationResult result) {

                 if (executionParams.getExpediteType() != null) {
             String expediteType = executionParams.getExpediteType().toString();
             String discountType = discountConfig.getDiscountType() != null ?
                     discountConfig.getDiscountType().toString() : "";

             // Спеціальні правила сумісності (приклад)
             if (expediteType.contains("EXPRESS") && "MILITARY".equals(discountType)) {
                 result.addError("Військова знижка не може поєднуватися з експрес-обслуговуванням");
             }
         }
    }

    /**
     * Перевіряє узгодженість знижки та оплати
     */
    private void validateDiscountPaymentConsistency(
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            ValidationResult result) {

        if (discountConfig.getDiscountAmount() != null &&
            paymentConfig.getTotalAmount() != null) {

            java.math.BigDecimal totalAmount = paymentConfig.getTotalAmount();
            java.math.BigDecimal discountAmount = discountConfig.getDiscountAmount();

            if (discountAmount.compareTo(totalAmount) > 0) {
                result.addError("Сума знижки не може перевищувати загальну вартість");
            }
        }
    }

    /**
     * Перевіряє обов'язковість додаткової інформації
     */
    private void validatePaymentAdditionalInfoRequirements(
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo,
            ValidationResult result) {

                 // Якщо оплата частково на рахунок, потрібні додаткові деталі
         if (paymentConfig.getPaymentMethod() != null &&
             "ACCOUNT".equals(paymentConfig.getPaymentMethod().toString())) {

             if (additionalInfo.getCustomerNotes() == null ||
                 additionalInfo.getCustomerNotes().trim().isEmpty()) {
                 result.addError("При оплаті на рахунок необхідно вказати додаткові примітки");
             }
         }
    }

    /**
     * Швидка перевірка валідності всіх підетапів
     */
    public boolean isAllValid(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {

        return validateAllSubsteps(executionParams, discountConfig, paymentConfig, additionalInfo).isValid();
    }

    /**
     * Отримує кількість помилок для всіх підетапів
     */
    public int getTotalErrorCount(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {

        return validateAllSubsteps(executionParams, discountConfig, paymentConfig, additionalInfo)
                .getErrors().size();
    }
}
