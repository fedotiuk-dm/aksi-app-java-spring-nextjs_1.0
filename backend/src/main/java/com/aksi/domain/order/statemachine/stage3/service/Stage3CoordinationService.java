package com.aksi.domain.order.statemachine.stage3.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;
import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.service.Stage3StateService.Stage3Context;
import com.aksi.domain.order.statemachine.stage3.validator.ValidationResult;

/**
 * Координаційний сервіс для Stage3.
 * Головний делегатор між усіма сервісами для етапу конфігурації замовлення.
 *
 * ЕТАП 4.4: Coordination Service (простий делегатор)
 * Принцип: НЕ РЕАЛІЗУЄ логіку, тільки ДЕЛЕГУЄ до інших сервісів
 */
@Service
public class Stage3CoordinationService {

    private final Stage3ValidationService validationService;
    private final Stage3SessionService sessionService;
    private final Stage3WorkflowService workflowService;
    private final Stage3StateService stateService;
    private final Stage3ExecutionParamsOperationsService executionParamsOperations;
    private final Stage3DiscountOperationsService discountOperations;
    private final Stage3PaymentOperationsService paymentOperations;
    private final Stage3AdditionalInfoOperationsService additionalInfoOperations;

    public Stage3CoordinationService(
            Stage3ValidationService validationService,
            Stage3SessionService sessionService,
            Stage3WorkflowService workflowService,
            Stage3StateService stateService,
            Stage3ExecutionParamsOperationsService executionParamsOperations,
            Stage3DiscountOperationsService discountOperations,
            Stage3PaymentOperationsService paymentOperations,
            Stage3AdditionalInfoOperationsService additionalInfoOperations) {
        this.validationService = validationService;
        this.sessionService = sessionService;
        this.workflowService = workflowService;
        this.stateService = stateService;
        this.executionParamsOperations = executionParamsOperations;
        this.discountOperations = discountOperations;
        this.paymentOperations = paymentOperations;
        this.additionalInfoOperations = additionalInfoOperations;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateExecutionParams(ExecutionParamsDTO executionParams) {
        return validationService.validateExecutionParams(executionParams);
    }

    public ValidationResult validateDiscountConfiguration(DiscountConfigurationDTO discountConfig) {
        return validationService.validateDiscountConfiguration(discountConfig);
    }

    public ValidationResult validatePaymentConfiguration(PaymentConfigurationDTO paymentConfig) {
        return validationService.validatePaymentConfiguration(paymentConfig);
    }

    public ValidationResult validateAdditionalInfo(AdditionalInfoDTO additionalInfo) {
        return validationService.validateAdditionalInfo(additionalInfo);
    }

    public ValidationResult validateAllSubsteps(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {
        return validationService.validateAllSubsteps(executionParams, discountConfig, paymentConfig, additionalInfo);
    }

    // ========== Делегування до SessionService ==========

    public UUID createSession(UUID orderId) {
        return sessionService.createSession(orderId);
    }

    public void initializeStage3(UUID sessionId) {
        sessionService.initializeStage3(sessionId);
    }

    public Stage3Context getSessionContext(UUID sessionId) {
        return sessionService.getSessionContext(sessionId);
    }

    public boolean sessionExists(UUID sessionId) {
        return sessionService.sessionExists(sessionId);
    }

    public void updateExecutionParams(UUID sessionId, ExecutionParamsDTO executionParams) {
        sessionService.updateExecutionParams(sessionId, executionParams);
    }

    public void updateDiscountConfig(UUID sessionId, DiscountConfigurationDTO discountConfig) {
        sessionService.updateDiscountConfig(sessionId, discountConfig);
    }

    public void updatePaymentConfig(UUID sessionId, PaymentConfigurationDTO paymentConfig) {
        sessionService.updatePaymentConfig(sessionId, paymentConfig);
    }

    public void updateAdditionalInfo(UUID sessionId, AdditionalInfoDTO additionalInfo) {
        sessionService.updateAdditionalInfo(sessionId, additionalInfo);
    }

    public void closeSession(UUID sessionId) {
        sessionService.closeSession(sessionId);
    }

    public void resetSession(UUID sessionId) {
        sessionService.resetSession(sessionId);
    }

    public boolean isReadyToComplete(UUID sessionId) {
        return sessionService.isReadyToComplete(sessionId);
    }

    public Stage3State getSessionState(UUID sessionId) {
        return sessionService.getSessionState(sessionId);
    }

    public void setSessionState(UUID sessionId, Stage3State state) {
        sessionService.setSessionState(sessionId, state);
    }

    // ========== Делегування до WorkflowService ==========

    public Stage3State determineNextSubstep(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {
        return workflowService.determineNextSubstep(executionParams, discountConfig, paymentConfig, additionalInfo);
    }

    public int calculateProgress(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {
        return workflowService.calculateProgress(executionParams, discountConfig, paymentConfig, additionalInfo);
    }

    public boolean isStage3Complete(
            ExecutionParamsDTO executionParams,
            DiscountConfigurationDTO discountConfig,
            PaymentConfigurationDTO paymentConfig,
            AdditionalInfoDTO additionalInfo) {
        return workflowService.isStage3Complete(executionParams, discountConfig, paymentConfig, additionalInfo);
    }

    public ExecutionParamsDTO createEmptyExecutionParams(UUID sessionId, UUID orderId) {
        return workflowService.createEmptyExecutionParams(sessionId, orderId);
    }

    public DiscountConfigurationDTO createEmptyDiscountConfiguration(UUID sessionId, UUID orderId) {
        return workflowService.createEmptyDiscountConfiguration(sessionId, orderId);
    }

    public PaymentConfigurationDTO createEmptyPaymentConfiguration(UUID sessionId, UUID orderId) {
        return workflowService.createEmptyPaymentConfiguration(sessionId, orderId);
    }

    public AdditionalInfoDTO createEmptyAdditionalInfo(UUID sessionId, UUID orderId) {
        return workflowService.createEmptyAdditionalInfo(sessionId, orderId);
    }

    // ========== Делегування до Operations Services ==========

    public CompletionDateResponse calculateCompletionDate(CompletionDateCalculationRequest request) {
        return executionParamsOperations.calculateExpectedCompletionDate(request);
    }

    public OrderDiscountResponse applyDiscount(OrderDiscountRequest request) {
        return discountOperations.applyDiscount(request);
    }

    public PaymentCalculationResponse calculatePayment(PaymentCalculationRequest request) {
        return paymentOperations.calculatePayment(request);
    }

    public AdditionalRequirementsResponse updateRequirements(AdditionalRequirementsRequest request) {
        return additionalInfoOperations.updateRequirements(request);
    }

    // ========== Високорівневі методи для Guards ==========

    /**
     * Перевіряє чи готовий підетап 3.1 через sessionId для Guards
     */
    public boolean isExecutionParamsReady(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return false;
        return workflowService.isExecutionParamsComplete(context.getExecutionParams());
    }

    /**
     * Перевіряє чи готовий підетап 3.2 через sessionId для Guards
     */
    public boolean isDiscountConfigReady(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return false;
        return workflowService.isDiscountConfigurationComplete(context.getDiscountConfiguration());
    }

    /**
     * Перевіряє чи готовий підетап 3.3 через sessionId для Guards
     */
    public boolean isPaymentConfigReady(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return false;
        return workflowService.isPaymentConfigurationComplete(context.getPaymentConfiguration());
    }

    /**
     * Перевіряє чи готовий підетап 3.4 через sessionId для Guards
     */
    public boolean isAdditionalInfoReady(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return false;
        return workflowService.isAdditionalInfoComplete(context.getAdditionalInfo());
    }

    /**
     * Перевіряє чи весь Stage3 готовий до завершення через sessionId для Guards
     */
    public boolean isStage3Ready(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return false;

        return workflowService.isStage3Complete(
                context.getExecutionParams(),
                context.getDiscountConfiguration(),
                context.getPaymentConfiguration(),
                context.getAdditionalInfo()
        );
    }

    // ========== Методи для адаптера ==========

    /**
     * Отримує поточний прогрес через sessionId
     */
    public int getCurrentProgress(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return 0;

        return workflowService.calculateProgress(
                context.getExecutionParams(),
                context.getDiscountConfiguration(),
                context.getPaymentConfiguration(),
                context.getAdditionalInfo()
        );
    }

    /**
     * Отримує наступний підетап через sessionId
     */
    public Stage3State getNextSubstep(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) return Stage3State.STAGE3_INIT;

        return workflowService.determineNextSubstep(
                context.getExecutionParams(),
                context.getDiscountConfiguration(),
                context.getPaymentConfiguration(),
                context.getAdditionalInfo()
        );
    }

    /**
     * Валідує всі підетапи через sessionId
     */
    public ValidationResult validateAllSubstepsBySession(UUID sessionId) {
        Stage3Context context = getSessionContext(sessionId);
        if (context == null) {
            ValidationResult result = new ValidationResult();
            result.addError("Сесія не існує");
            return result;
        }

        return validationService.validateAllSubsteps(
                context.getExecutionParams(),
                context.getDiscountConfiguration(),
                context.getPaymentConfiguration(),
                context.getAdditionalInfo()
        );
    }

    // ========== Делегування до StateService ==========

    /**
     * Створює новий контекст через StateService
     */
    public Stage3Context createContextDirect(UUID sessionId) {
        return stateService.createContext(sessionId);
    }

    /**
     * Отримує контекст через StateService (альтернатива для SessionService)
     */
    public Stage3Context getContextDirect(UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    /**
     * Отримує або створює контекст
     */
    public Stage3Context getOrCreateContext(UUID sessionId) {
        return stateService.getOrCreateContext(sessionId);
    }

    /**
     * Оновлює стан з указанням дії
     */
    public void updateStateWithAction(UUID sessionId, Stage3State newState, String action) {
        stateService.updateStateWithAction(sessionId, newState, action);
    }

    /**
     * Встановлює помилку в контексті
     */
    public void setError(UUID sessionId, String error) {
        stateService.setError(sessionId, error);
    }

    /**
     * Очищає помилку з контексту
     */
    public void clearError(UUID sessionId) {
        stateService.clearError(sessionId);
    }

    /**
     * Перевіряє чи контекст існує (альтернатива для SessionService)
     */
    public boolean hasContextDirect(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    /**
     * Отримує поточний стан через StateService (альтернатива для SessionService)
     */
    public Stage3State getCurrentStateDirect(UUID sessionId) {
        return stateService.getCurrentState(sessionId);
    }

    /**
     * Перевіряє чи контекст в заданому стані
     */
    public boolean isInState(UUID sessionId, Stage3State state) {
        return stateService.isInState(sessionId, state);
    }

    /**
     * Очищає застарілі контексти
     */
    public int cleanupStaleContexts(int maxAgeMinutes) {
        return stateService.cleanupStaleContexts(maxAgeMinutes);
    }

    /**
     * Отримує кількість активних контекстів
     */
    public int getActiveContextsCount() {
        return stateService.getActiveContextsCount();
    }

    /**
     * Отримує статистику контекстів за станами
     */
    public Map<Stage3State, Long> getContextStatsByState() {
        return stateService.getContextStatsByState();
    }

    /**
     * Перевіряє готовність до завершення через StateService
     */
    public boolean isReadyForCompletionDirect(UUID sessionId) {
        return stateService.isReadyForCompletion(sessionId);
    }

    /**
     * Отримує відсоток прогресу через StateService
     */
    public int getProgressPercentageDirect(UUID sessionId) {
        return stateService.getProgressPercentage(sessionId);
    }
}
