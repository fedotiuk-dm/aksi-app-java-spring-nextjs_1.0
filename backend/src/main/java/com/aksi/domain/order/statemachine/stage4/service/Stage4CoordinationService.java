package com.aksi.domain.order.statemachine.stage4.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;
import com.aksi.domain.order.statemachine.stage4.validator.ValidationResult;

/**
 * Координуючий сервіс Stage4 - головний делегатор.
 * Забезпечує єдину точку входу для всіх операцій Stage4.
 */
@Service
public class Stage4CoordinationService {

    private final Stage4ValidationService validationService;
    private final Stage4SessionService sessionService;
    private final Stage4WorkflowService workflowService;
    private final Stage4OrderOperationsService orderOperationsService;
    private final Stage4ReceiptOperationsService receiptOperationsService;
    private final Stage4SignatureOperationsService signatureOperationsService;
    private final Stage4FinalizationOperationsService finalizationOperationsService;
    private final Stage4StateService stateService;

    public Stage4CoordinationService(
            Stage4ValidationService validationService,
            Stage4SessionService sessionService,
            Stage4WorkflowService workflowService,
            Stage4OrderOperationsService orderOperationsService,
            Stage4ReceiptOperationsService receiptOperationsService,
            Stage4SignatureOperationsService signatureOperationsService,
            Stage4FinalizationOperationsService finalizationOperationsService,
            Stage4StateService stateService
    ) {
        this.validationService = validationService;
        this.sessionService = sessionService;
        this.workflowService = workflowService;
        this.orderOperationsService = orderOperationsService;
        this.receiptOperationsService = receiptOperationsService;
        this.signatureOperationsService = signatureOperationsService;
        this.finalizationOperationsService = finalizationOperationsService;
        this.stateService = stateService;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateOrderConfirmation(OrderConfirmationDTO orderConfirmation) {
        return validationService.validateOrderConfirmation(orderConfirmation);
    }

    public ValidationResult validateLegalAcceptance(LegalAcceptanceDTO legalAcceptance) {
        return validationService.validateLegalAcceptance(legalAcceptance);
    }

    public ValidationResult validateReceiptConfiguration(ReceiptConfigurationDTO receiptConfiguration) {
        return validationService.validateReceiptConfiguration(receiptConfiguration);
    }

    public ValidationResult validateOrderCompletion(OrderCompletionDTO orderCompletion) {
        return validationService.validateOrderCompletion(orderCompletion);
    }

    public ValidationResult validateCompleteStage4(OrderConfirmationDTO orderConfirmation,
                                                   LegalAcceptanceDTO legalAcceptance,
                                                   ReceiptConfigurationDTO receiptConfiguration,
                                                   OrderCompletionDTO orderCompletion) {
        return validationService.validateCompleteStage4(orderConfirmation, legalAcceptance, receiptConfiguration, orderCompletion);
    }

    // ========== Делегування до SessionService ==========

    public UUID createSession(UUID orderId) {
        return sessionService.createSession(orderId);
    }

    public Optional<Stage4Context> getSessionContext(UUID sessionId) {
        return sessionService.getSessionContext(sessionId);
    }

    public boolean sessionExists(UUID sessionId) {
        return sessionService.sessionExists(sessionId);
    }

    public void updateOrderConfirmation(UUID sessionId, OrderConfirmationDTO orderConfirmation) {
        sessionService.updateOrderConfirmation(sessionId, orderConfirmation);
    }

    public void updateLegalAcceptance(UUID sessionId, LegalAcceptanceDTO legalAcceptance) {
        sessionService.updateLegalAcceptance(sessionId, legalAcceptance);
    }

    public void updateReceiptConfiguration(UUID sessionId, ReceiptConfigurationDTO receiptConfiguration) {
        sessionService.updateReceiptConfiguration(sessionId, receiptConfiguration);
    }

    public void updateOrderCompletion(UUID sessionId, OrderCompletionDTO orderCompletion) {
        sessionService.updateOrderCompletion(sessionId, orderCompletion);
    }

    public void closeSession(UUID sessionId) {
        sessionService.closeSession(sessionId);
    }

    public Stage4State getCurrentState(UUID sessionId) {
        return sessionService.getCurrentState(sessionId);
    }

    public UUID getOrderId(UUID sessionId) {
        return sessionService.getOrderId(sessionId);
    }

    // ========== Делегування до WorkflowService ==========

    public Stage4Context initializeStage4(UUID sessionId, UUID orderId) {
        return workflowService.initializeStage4(sessionId, orderId);
    }

    public Stage4Context processLegalAcceptance(UUID sessionId, UUID orderId, String signatureData, boolean termsAccepted) {
        return workflowService.processLegalAcceptance(sessionId, orderId, signatureData, termsAccepted);
    }

    public Stage4Context generateReceipt(UUID sessionId, UUID orderId, boolean sendByEmail, boolean generatePrintable) {
        return workflowService.generateReceipt(sessionId, orderId, sendByEmail, generatePrintable);
    }

    public Stage4Context completeOrder(UUID sessionId, UUID orderId, String signatureData, boolean sendByEmail, boolean generatePrintable, String comments) {
        return workflowService.completeOrder(sessionId, orderId, signatureData, sendByEmail, generatePrintable, comments);
    }

    public Stage4Context getWorkflowContext(UUID sessionId) {
        return workflowService.getSessionContext(sessionId);
    }

    // ========== Делегування до StateService ==========

    public Stage4Context createStageContext(UUID sessionId) {
        return stateService.createSession(sessionId);
    }

    public Stage4Context getStageContext(UUID sessionId) {
        return stateService.getSession(sessionId);
    }

    public boolean hasStageContext(UUID sessionId) {
        return stateService.sessionExists(sessionId);
    }

    public void updateSessionState(UUID sessionId, Stage4State newState) {
        stateService.updateSessionState(sessionId, newState);
    }

    public void saveOrderConfirmation(UUID sessionId, OrderConfirmationDTO orderConfirmation) {
        stateService.saveOrderConfirmation(sessionId, orderConfirmation);
    }

    public void saveLegalAcceptance(UUID sessionId, LegalAcceptanceDTO legalAcceptance) {
        stateService.saveLegalAcceptance(sessionId, legalAcceptance);
    }

    public void saveReceiptConfiguration(UUID sessionId, ReceiptConfigurationDTO receiptConfiguration) {
        stateService.saveReceiptConfiguration(sessionId, receiptConfiguration);
    }

    public void saveOrderCompletion(UUID sessionId, OrderCompletionDTO orderCompletion) {
        stateService.saveOrderCompletion(sessionId, orderCompletion);
    }

    public void removeStageContext(UUID sessionId) {
        stateService.removeSession(sessionId);
    }

    // ========== Делегування до OrderOperationsService ==========

    public boolean orderExists(UUID orderId) {
        return orderOperationsService.orderExists(orderId);
    }

    public OrderDetailedSummaryResponse getOrderDetailedSummary(UUID orderId) {
        return orderOperationsService.getOrderDetailedSummary(orderId);
    }

    // ========== Делегування до ReceiptOperationsService ==========

    public ReceiptDTO generateReceipt(ReceiptGenerationRequest request) {
        return receiptOperationsService.generateReceipt(request);
    }

    public byte[] generatePdfReceiptBytes(ReceiptGenerationRequest request) {
        return receiptOperationsService.generatePdfReceiptBytes(request);
    }

    // ========== Делегування до SignatureOperationsService ==========

    public void saveSignature(CustomerSignatureRequest request) {
        signatureOperationsService.saveSignature(request);
    }

    // ========== Делегування до FinalizationOperationsService ==========

    public void finalizeOrder(OrderFinalizationRequest request) {
        finalizationOperationsService.finalizeOrder(request);
    }

    // ========== Високорівневі методи ==========

    /**
     * Повний процес ініціалізації Stage4 з валідацією.
     */
    public UUID initializeStage4WithValidation(UUID orderId) {
        if (!orderExists(orderId)) {
            throw new IllegalArgumentException("Замовлення не існує: " + orderId);
        }

        UUID sessionId = createSession(orderId);
        initializeStage4(sessionId, orderId);

        return sessionId;
    }

    // ========== Делегування ValidationService для Guards ==========

    /**
     * Перевіряє чи Stage4 валідний через sessionId для Guards
     */
    public boolean isStage4Valid(UUID sessionId) {
        Optional<Stage4Context> contextOpt = getSessionContext(sessionId);
        if (contextOpt.isEmpty()) {
            return false;
        }

        Stage4Context context = contextOpt.get();
        ValidationResult validation = validateCompleteStage4(
                context.getOrderConfirmation(),
                context.getLegalAcceptance(),
                context.getReceiptConfiguration(),
                context.getOrderCompletion()
        );
        return validation.isValid();
    }

    /**
     * Перевіряє чи Stage4 завершений через sessionId для Guards
     */
    public boolean isStage4Complete(UUID sessionId) {
        Stage4State currentState = getCurrentState(sessionId);
        return currentState == Stage4State.STAGE4_COMPLETED;
    }

    // ========== Методи для адаптера з ValidationResult ==========

    /**
     * Повна валідація Stage4 з поверненням структурованого результату.
     */
    public ValidationResult validateComplete(UUID sessionId) {
        Optional<Stage4Context> contextOpt = getSessionContext(sessionId);
        if (contextOpt.isEmpty()) {
            return ValidationResult.withError("Сесія не знайдена");
        }

        Stage4Context context = contextOpt.get();
        return validateCompleteStage4(
                context.getOrderConfirmation(),
                context.getLegalAcceptance(),
                context.getReceiptConfiguration(),
                context.getOrderCompletion()
        );
    }

    /**
     * Критична валідація для Guards.
     */
    public ValidationResult validateCritical(UUID sessionId) {
        Optional<Stage4Context> contextOpt = getSessionContext(sessionId);
        if (contextOpt.isEmpty()) {
            return ValidationResult.withError("Сесія не знайдена");
        }

        Stage4Context context = contextOpt.get();
        if (context.getOrderConfirmation() == null) {
            return ValidationResult.withError("Підтвердження замовлення відсутнє");
        }
        if (context.getLegalAcceptance() == null) {
            return ValidationResult.withError("Юридичне прийняття відсутнє");
        }

        return ValidationResult.success();
    }



    /**
     * Генерує звіт валідації для адаптера.
     */
    public String getValidationReport(UUID sessionId) {
        ValidationResult result = validateComplete(sessionId);
        if (result.isValid()) {
            return "Stage4 готовий до завершення";
        } else {
            return "Помилки Stage4: " + String.join("; ", result.getErrorMessages());
        }
    }
}
