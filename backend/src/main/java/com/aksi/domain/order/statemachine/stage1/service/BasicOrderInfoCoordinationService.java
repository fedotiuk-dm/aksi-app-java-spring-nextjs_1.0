package com.aksi.domain.order.statemachine.stage1.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.mapper.BasicOrderInfoMapper;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoStateService.BasicOrderInfoContext;
import com.aksi.domain.order.statemachine.stage1.validator.BasicOrderInfoValidationResult;

/**
 * Координаційний сервіс для базової інформації замовлення.
 * Головний делегатор між усіма сервісами для роботи з базовою інформацією замовлення.
 */
@Service
public class BasicOrderInfoCoordinationService {

    private final BasicOrderInfoValidationService validationService;
    private final BasicOrderInfoWorkflowService workflowService;
    private final BasicOrderInfoOperationsService operationsService;
    private final BasicOrderInfoStateService stateService;

    public BasicOrderInfoCoordinationService(
            BasicOrderInfoValidationService validationService,
            BasicOrderInfoWorkflowService workflowService,
            BasicOrderInfoOperationsService operationsService,
            BasicOrderInfoStateService stateService) {
        this.validationService = validationService;
        this.workflowService = workflowService;
        this.operationsService = operationsService;
        this.stateService = stateService;
    }

    // ========== Делегування до ValidationService ==========

    public BasicOrderInfoValidationResult validateComplete(BasicOrderInfoDTO basicOrderInfo) {
        return validationService.validateComplete(basicOrderInfo);
    }

    public BasicOrderInfoValidationResult validateCritical(BasicOrderInfoDTO basicOrderInfo) {
        return validationService.validateCritical(basicOrderInfo);
    }

    public BasicOrderInfoValidationResult validateStepReadiness(BasicOrderInfoDTO basicOrderInfo, String stepName) {
        return validationService.validateStepReadiness(basicOrderInfo, stepName);
    }

    public boolean isReceiptNumberValid(String receiptNumber) {
        return validationService.isReceiptNumberValid(receiptNumber);
    }

    public boolean isUniqueTagValid(String uniqueTag) {
        return validationService.isUniqueTagValid(uniqueTag);
    }

    public boolean isReadyForNextStage(BasicOrderInfoDTO basicOrderInfo) {
        return validationService.isReadyForNextStage(basicOrderInfo);
    }

    public String getValidationReport(BasicOrderInfoDTO basicOrderInfo) {
        return validationService.getValidationReport(basicOrderInfo);
    }

    // ========== Делегування до WorkflowService ==========

    public String startWorkflow() {
        return workflowService.startWorkflow();
    }

    public String startWorkflowWithData(BasicOrderInfoDTO basicOrderInfo) {
        return workflowService.startWorkflowWithData(basicOrderInfo);
    }

    public boolean transitionToReceiptGeneration(String sessionId) {
        return workflowService.transitionToReceiptGeneration(sessionId);
    }

    public boolean confirmReceiptGeneration(String sessionId, String receiptNumber) {
        return workflowService.confirmReceiptGeneration(sessionId, receiptNumber);
    }

    public boolean transitionToUniqueTagEntry(String sessionId) {
        return workflowService.transitionToUniqueTagEntry(sessionId);
    }

    public boolean confirmUniqueTag(String sessionId, String uniqueTag) {
        return workflowService.confirmUniqueTag(sessionId, uniqueTag);
    }

    public boolean transitionToBranchSelection(String sessionId) {
        return workflowService.transitionToBranchSelection(sessionId);
    }

    public boolean confirmBranchSelection(String sessionId, UUID branchId) {
        return workflowService.confirmBranchSelection(sessionId, branchId);
    }

    public boolean completeWorkflow(String sessionId) {
        return workflowService.completeWorkflow(sessionId);
    }

    public boolean resetWorkflow(String sessionId) {
        return workflowService.resetWorkflow(sessionId);
    }

    public boolean goBack(String sessionId) {
        return workflowService.goBack(sessionId);
    }

    public boolean cancelWorkflow(String sessionId) {
        return workflowService.cancelWorkflow(sessionId);
    }

    public boolean lockWorkflow(String sessionId) {
        return workflowService.lockWorkflow(sessionId);
    }

    public boolean unlockWorkflow(String sessionId) {
        return workflowService.unlockWorkflow(sessionId);
    }

    public boolean isReadyForCompletion(String sessionId) {
        return workflowService.isReadyForCompletion(sessionId);
    }

    public BasicOrderInfoState getCurrentState(String sessionId) {
        return workflowService.getCurrentState(sessionId);
    }

    public BasicOrderInfoDTO getCurrentData(String sessionId) {
        return workflowService.getCurrentData(sessionId);
    }

    public boolean hasErrors(String sessionId) {
        return workflowService.hasErrors(sessionId);
    }

    public String getLastError(String sessionId) {
        return workflowService.getLastError(sessionId);
    }

    public boolean clearErrors(String sessionId) {
        return workflowService.clearErrors(sessionId);
    }

    // ========== Делегування до OperationsService ==========

    public String generateReceiptNumber(String branchCode) {
        return operationsService.generateReceiptNumber(branchCode);
    }

    public String generateUniqueTag() {
        return operationsService.generateUniqueTag();
    }

    public boolean isReceiptNumberUnique(String receiptNumber) {
        return operationsService.isReceiptNumberUnique(receiptNumber);
    }

    public boolean isUniqueTagUnique(String uniqueTag) {
        return operationsService.isUniqueTagUnique(uniqueTag);
    }

    public boolean isBranchAvailable(UUID branchId) {
        return operationsService.isBranchAvailable(branchId);
    }

    // ========== Делегування до StateService ==========

    public String initializeContext() {
        return stateService.initializeContext();
    }

    public BasicOrderInfoContext getContext(String sessionId) {
        return stateService.getContext(sessionId);
    }

    public boolean updateBasicOrderInfo(String sessionId, BasicOrderInfoDTO basicOrderInfo) {
        return stateService.updateBasicOrderInfo(sessionId, basicOrderInfo);
    }

    public boolean sessionExists(String sessionId) {
        return stateService.sessionExists(sessionId);
    }

    public void removeContext(String sessionId) {
        stateService.removeContext(sessionId);
    }

    // ========== Інтеграційні методи з Mapper ==========

    public BasicOrderInfoDTO createEmpty() {
        return BasicOrderInfoMapper.createEmpty();
    }

    public BasicOrderInfoDTO createWithReceiptNumber(String receiptNumber) {
        return BasicOrderInfoMapper.createWithReceiptNumber(receiptNumber);
    }

    public BasicOrderInfoDTO copyWithReceiptNumber(BasicOrderInfoDTO original, String receiptNumber) {
        return BasicOrderInfoMapper.copyWithReceiptNumber(original, receiptNumber);
    }

    public BasicOrderInfoDTO copyWithUniqueTag(BasicOrderInfoDTO original, String uniqueTag) {
        return BasicOrderInfoMapper.copyWithUniqueTag(original, uniqueTag);
    }

    public BasicOrderInfoDTO sanitize(BasicOrderInfoDTO dto) {
        return BasicOrderInfoMapper.sanitize(dto);
    }

    // ========== Делегування ValidationService для Guards ==========

    /**
     * Перевіряє чи базова інформація валідна через sessionId для Guards
     */
    public boolean isBasicOrderInfoValid(String sessionId) {
        BasicOrderInfoDTO data = getCurrentData(sessionId);
        return validationService.isBasicOrderInfoValid(data);
    }

    /**
     * Перевіряє чи базова інформація готова через sessionId для Guards
     */
    public boolean isBasicOrderInfoReady(String sessionId) {
        BasicOrderInfoDTO data = getCurrentData(sessionId);
        return validationService.isBasicOrderInfoReady(data);
    }
}
