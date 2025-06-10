package com.aksi.domain.order.statemachine.stage3.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.enums.AdditionalInfoState;
import com.aksi.domain.order.statemachine.stage3.enums.DiscountState;
import com.aksi.domain.order.statemachine.stage3.enums.ExecutionParamsState;
import com.aksi.domain.order.statemachine.stage3.enums.PaymentState;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;

/**
 * Сервіс управління робочими процесами Stage3.
 * Керує бізнес-логікою та переходами між підетапами.
 *
 * ЕТАП 4.2: Workflow Service (управляє бізнес-процесами)
 * Дозволені імпорти: DTO + Mappers + Enums + Spring аннотації + Java стандартні
 * Заборонено: Operations Services, Validators, StateService, CoordinationService
 */
@Service
public class Stage3WorkflowService {

    /**
     * Визначає наступний підетап для виконання
     */
    public Stage3State determineNextSubstep(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {

        // Перевіряємо кожен підетап у порядку
        if (!isExecutionParamsComplete(executionParams)) {
            return Stage3State.EXECUTION_PARAMS_INIT;
        }

        if (!isDiscountConfigurationComplete(discountConfig)) {
            return Stage3State.DISCOUNT_CONFIG_INIT;
        }

        if (!isPaymentConfigurationComplete(paymentConfig)) {
            return Stage3State.PAYMENT_CONFIG_INIT;
        }

        if (!isAdditionalInfoComplete(additionalInfo)) {
            return Stage3State.ADDITIONAL_INFO_INIT;
        }

        // Всі підетапи завершені
        return Stage3State.STAGE3_COMPLETED;
    }

    /**
     * Перевіряє готовність підетапу 3.1
     */
    public boolean isExecutionParamsComplete(ExecutionParamsDTO dto) {
        if (dto == null) {
            return false;
        }

        return dto.getExpediteType() != null &&
               dto.getCompletionDateRequest() != null &&
               Boolean.TRUE.equals(dto.isExecutionParamsComplete());
    }

    /**
     * Перевіряє готовність підетапу 3.2
     */
    public boolean isDiscountConfigurationComplete(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return false;
        }

        return dto.getDiscountType() != null &&
               Boolean.TRUE.equals(dto.getIsValid()) &&
               Boolean.TRUE.equals(dto.isDiscountConfigComplete());
    }

    /**
     * Перевіряє готовність підетапу 3.3
     */
    public boolean isPaymentConfigurationComplete(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return false;
        }

        return dto.getPaymentMethod() != null &&
               dto.getTotalAmount() != null &&
               Boolean.TRUE.equals(dto.getIsValid()) &&
               Boolean.TRUE.equals(dto.isPaymentConfigComplete());
    }

    /**
     * Перевіряє готовність підетапу 3.4
     */
    public boolean isAdditionalInfoComplete(AdditionalInfoDTO dto) {
        if (dto == null) {
            // Додаткова інформація може бути порожньою
            return true;
        }

        return Boolean.TRUE.equals(dto.getIsValid()) &&
               Boolean.TRUE.equals(dto.isAdditionalInfoComplete());
    }

    /**
     * Розраховує прогрес виконання Stage3
     */
    public int calculateProgress(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {

        int completedSteps = 0;
        int totalSteps = 4;

        if (isExecutionParamsComplete(executionParams)) completedSteps++;
        if (isDiscountConfigurationComplete(discountConfig)) completedSteps++;
        if (isPaymentConfigurationComplete(paymentConfig)) completedSteps++;
        if (isAdditionalInfoComplete(additionalInfo)) completedSteps++;

        return (completedSteps * 100) / totalSteps;
    }

    /**
     * Перевіряє чи всі підетапи завершені
     */
    public boolean isStage3Complete(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {

        return isExecutionParamsComplete(executionParams) &&
               isDiscountConfigurationComplete(discountConfig) &&
               isPaymentConfigurationComplete(paymentConfig) &&
               isAdditionalInfoComplete(additionalInfo);
    }

    /**
     * Визначає стан підетапу 3.1
     */
    public ExecutionParamsState determineExecutionParamsState(ExecutionParamsDTO dto) {
        if (dto == null) {
            return ExecutionParamsState.PARAMS_INIT;
        }

        if (!dto.hasRequiredParameters()) {
            return ExecutionParamsState.VALIDATION;
        }

        if (isExecutionParamsComplete(dto)) {
            return ExecutionParamsState.PARAMS_COMPLETED;
        }

        if (dto.getExpediteType() != null || dto.getCompletionDateRequest() != null) {
            return ExecutionParamsState.URGENCY_SELECTION;
        }

        return ExecutionParamsState.PARAMS_INIT;
    }

    /**
     * Визначає стан підетапу 3.2
     */
    public DiscountState determineDiscountState(DiscountConfigurationDTO dto) {
        if (dto == null) {
            return DiscountState.DISCOUNT_INIT;
        }

        if (isDiscountConfigurationComplete(dto)) {
            return DiscountState.DISCOUNT_COMPLETED;
        }

        if (dto.getDiscountType() != null) {
            return DiscountState.TYPE_SELECTION;
        }

        return DiscountState.DISCOUNT_INIT;
    }

    /**
     * Визначає стан підетапу 3.3
     */
    public PaymentState determinePaymentState(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return PaymentState.PAYMENT_INIT;
        }

        if (isPaymentConfigurationComplete(dto)) {
            return PaymentState.PAYMENT_COMPLETED;
        }

        if (dto.getPaymentMethod() != null || dto.getTotalAmount() != null) {
            return PaymentState.METHOD_SELECTION;
        }

        return PaymentState.PAYMENT_INIT;
    }

    /**
     * Визначає стан підетапу 3.4
     */
    public AdditionalInfoState determineAdditionalInfoState(AdditionalInfoDTO dto) {
        if (dto == null) {
            return AdditionalInfoState.INFO_INIT; // Може бути порожнім
        }

        if (dto.hasAnyInformation()) {
            return AdditionalInfoState.NOTES_INPUT;
        }

        return AdditionalInfoState.INFO_INIT;
    }

    /**
     * Створює порожній ExecutionParamsDTO
     */
    public ExecutionParamsDTO createEmptyExecutionParams(UUID sessionId, UUID orderId) {
        return new ExecutionParamsDTO(sessionId);
    }

    /**
     * Створює порожній DiscountConfigurationDTO
     */
    public DiscountConfigurationDTO createEmptyDiscountConfiguration(UUID sessionId, UUID orderId) {
        return new DiscountConfigurationDTO(sessionId, orderId);
    }

    /**
     * Створює порожній PaymentConfigurationDTO
     */
    public PaymentConfigurationDTO createEmptyPaymentConfiguration(UUID sessionId, UUID orderId) {
        return new PaymentConfigurationDTO(sessionId, orderId);
    }

    /**
     * Створює порожній AdditionalInfoDTO
     */
    public AdditionalInfoDTO createEmptyAdditionalInfo(UUID sessionId, UUID orderId) {
        return new AdditionalInfoDTO(sessionId, orderId);
    }
}
