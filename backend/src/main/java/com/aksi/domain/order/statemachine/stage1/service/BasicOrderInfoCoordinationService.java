package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(BasicOrderInfoCoordinationService.class);

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
        logger.info("🚀 BasicOrderInfoCoordinationService ініціалізовано з validationService: {}, workflowService: {}, operationsService: {}, stateService: {}",
                   validationService != null, workflowService != null, operationsService != null, stateService != null);
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
        logger.info("🔍 [BASIC-ORDER-COORDINATION] Запит на отримання стану для sessionId: {}", sessionId);

        try {
            BasicOrderInfoState state = workflowService.getCurrentState(sessionId);
            logger.info("✅ [BASIC-ORDER-COORDINATION] Успішно отримано стан: {} для sessionId: {}", state, sessionId);
            return state;
        } catch (Exception e) {
            logger.error("❌ [BASIC-ORDER-COORDINATION] Помилка при отриманні стану для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            throw e;
        }
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

    /**
     * Ініціалізує базову інформацію замовлення з існуючим sessionId від головного wizard.
     */
    public void initializeBasicOrderInfo(String sessionId) {
        logger.info("🔥🔥🔥 BASIC_ORDER: initializeBasicOrderInfo() ВИКЛИКАНО з sessionId: {} 🔥🔥🔥", sessionId);

        try {
            if (sessionId == null || sessionId.trim().isEmpty()) {
                logger.error("❌ BASIC_ORDER: sessionId є null або порожнім!");
                return;
            }

            logger.info("🔧 BASIC_ORDER: Створення або отримання контексту для sessionId: {}", sessionId);
            stateService.getOrCreateContext(sessionId);

            logger.info("✅ BASIC_ORDER: Контекст успішно створено/отримано для sessionId: {}", sessionId);

            // Перевіряємо що контекст справді існує
            boolean exists = stateService.getContext(sessionId) != null;
            logger.info("🔍 BASIC_ORDER: Перевірка існування контексту після створення: exists={}", exists);

        } catch (Exception e) {
            logger.error("💥 BASIC_ORDER: Помилка при ініціалізації для sessionId: {}, error: {}", sessionId, e.getMessage(), e);
            throw e;
        }
    }

    public BasicOrderInfoContext getContext(String sessionId) {
        return stateService.getContext(sessionId);
    }

    public boolean updateBasicOrderInfo(String sessionId, BasicOrderInfoDTO basicOrderInfo) {
        return stateService.updateBasicOrderInfo(sessionId, basicOrderInfo);
    }

    public boolean sessionExists(String sessionId) {
        logger.info("🔍 [BASIC-ORDER-COORDINATION] Перевірка існування сесії для sessionId: {}", sessionId);

        try {
            boolean exists = stateService.sessionExists(sessionId);
            logger.info("📋 [BASIC-ORDER-COORDINATION] Результат перевірки сесії для sessionId: {} -> exists: {}",
                       sessionId, exists);
            return exists;
        } catch (Exception e) {
            logger.error("❌ [BASIC-ORDER-COORDINATION] Помилка при перевірці сесії для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            return false;
        }
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

    // ========== Делегування до OperationsService для роботи з філіями ==========

    public List<com.aksi.domain.branch.dto.BranchLocationDTO> getAllBranches() {
        logger.info("🔍 [COORDINATION] Запит на отримання всіх філій через operationsService");

        try {
            List<com.aksi.domain.branch.dto.BranchLocationDTO> branches = operationsService.getAllBranches();
            logger.info("✅ [COORDINATION] Отримано {} філій від operationsService",
                       branches != null ? branches.size() : 0);
            return branches;
        } catch (Exception e) {
            logger.error("❌ [COORDINATION] Помилка при отриманні філій: {}", e.getMessage(), e);
            throw e;
        }
    }

    public com.aksi.domain.branch.dto.BranchLocationDTO getBranchById(UUID branchId) {
        return operationsService.getBranchById(branchId);
    }

    /**
     * Отримує філії для sessionId (завантажуються автоматично при ініціалізації).
     */
    public java.util.List<com.aksi.domain.branch.dto.BranchLocationDTO> getAvailableBranchesForSession(String sessionId) {
        return workflowService.getAvailableBranches(sessionId);
    }
}
