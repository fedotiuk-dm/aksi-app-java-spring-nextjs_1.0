package com.aksi.domain.order.statemachine.stage1.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.mapper.BasicOrderInfoMapper;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoStateService.BasicOrderInfoContext;

/**
 * Сервіс для управління життєвим циклом базової інформації замовлення.
 * Відповідає за переходи між станами та управління сесіями.
 */
@Service
public class BasicOrderInfoWorkflowService {

    private static final Logger logger = LoggerFactory.getLogger(BasicOrderInfoWorkflowService.class);
    private final BasicOrderInfoStateService stateService;

    public BasicOrderInfoWorkflowService(BasicOrderInfoStateService stateService) {
        this.stateService = stateService;
    }

    /**
     * Ініціалізує новий процес базової інформації замовлення.
     */
    public String startWorkflow() {
        String sessionId = stateService.initializeContext();
        stateService.updateState(sessionId, BasicOrderInfoState.INIT);
        return sessionId;
    }

    /**
     * Ініціалізує процес з існуючою базовою інформацією.
     */
    public String startWorkflowWithData(BasicOrderInfoDTO basicOrderInfo) {
        String sessionId = stateService.initializeContext();
        stateService.updateStateAndData(sessionId, BasicOrderInfoState.INIT, basicOrderInfo);
        return sessionId;
    }

    /**
     * Переводить процес до генерації номера квитанції.
     */
    public boolean transitionToReceiptGeneration(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        // Перевірка що стан дозволяє перехід
        BasicOrderInfoState currentState = context.getCurrentState();
        if (currentState != BasicOrderInfoState.INIT &&
            currentState != BasicOrderInfoState.BRANCH_SELECTED) {
            return false;
        }

        return stateService.updateState(sessionId, BasicOrderInfoState.GENERATING_RECEIPT_NUMBER);
    }

    /**
     * Підтверджує успішну генерацію номера квитанції.
     */
    public boolean confirmReceiptGeneration(String sessionId, String receiptNumber) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        if (context.getCurrentState() != BasicOrderInfoState.GENERATING_RECEIPT_NUMBER) {
            return false;
        }

        // Оновлюємо дані з новим номером квитанції
        BasicOrderInfoDTO updatedInfo = BasicOrderInfoMapper.copyWithReceiptNumber(
                context.getBasicOrderInfo(), receiptNumber);

        return stateService.updateStateAndData(sessionId,
                BasicOrderInfoState.RECEIPT_NUMBER_GENERATED, updatedInfo);
    }

    /**
     * Обробляє помилку генерації номера квитанції.
     */
    public boolean handleReceiptGenerationError(String sessionId, String error) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null) {
            return false;
        }

        stateService.setError(sessionId, "Помилка генерації номера квитанції: " + error);
        return stateService.updateState(sessionId, BasicOrderInfoState.ERROR);
    }

    /**
     * Переводить процес до введення унікальної мітки.
     */
    public boolean transitionToUniqueTagEntry(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        BasicOrderInfoState currentState = context.getCurrentState();
        if (currentState != BasicOrderInfoState.RECEIPT_NUMBER_GENERATED &&
            currentState != BasicOrderInfoState.UNIQUE_TAG_ENTERED) {
            return false;
        }

        return stateService.updateState(sessionId, BasicOrderInfoState.ENTERING_UNIQUE_TAG);
    }

    /**
     * Підтверджує введення унікальної мітки.
     */
    public boolean confirmUniqueTag(String sessionId, String uniqueTag) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        if (context.getCurrentState() != BasicOrderInfoState.ENTERING_UNIQUE_TAG) {
            return false;
        }

        BasicOrderInfoDTO updatedInfo = BasicOrderInfoMapper.copyWithUniqueTag(
                context.getBasicOrderInfo(), uniqueTag);

        return stateService.updateStateAndData(sessionId,
                BasicOrderInfoState.UNIQUE_TAG_ENTERED, updatedInfo);
    }

    /**
     * Переводить процес до вибору філії.
     */
    public boolean transitionToBranchSelection(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        // Вибір філії може бути на будь-якому етапі
        return stateService.updateState(sessionId, BasicOrderInfoState.SELECTING_BRANCH);
    }

    /**
     * Підтверджує вибір філії.
     */
    public boolean confirmBranchSelection(String sessionId, UUID branchId) {
        logger.info("🏢 [WORKFLOW] Підтвердження вибору філії {} для sessionId: {}", branchId, sessionId);

        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            logger.warn("⚠️ [WORKFLOW] Контекст недоступний або заблокований для sessionId: {}", sessionId);
            return false;
        }

        BasicOrderInfoState currentState = context.getCurrentState();
        logger.info("🔍 [WORKFLOW] Поточний стан: {} для sessionId: {}", currentState, sessionId);

        // Автоматично переходимо до стану вибору філії якщо потрібно
        if (currentState != BasicOrderInfoState.SELECTING_BRANCH) {
            logger.info("🔄 [WORKFLOW] Автоматичний перехід до стану SELECTING_BRANCH для sessionId: {}", sessionId);
            boolean transitioned = stateService.updateState(sessionId, BasicOrderInfoState.SELECTING_BRANCH);
            if (!transitioned) {
                logger.error("❌ [WORKFLOW] Не вдалося перейти до стану SELECTING_BRANCH для sessionId: {}", sessionId);
                return false;
            }
            logger.info("✅ [WORKFLOW] Успішно перейшли до стану SELECTING_BRANCH для sessionId: {}", sessionId);
        }

        BasicOrderInfoDTO updatedInfo = BasicOrderInfoMapper.fromBranchId(branchId, null);
        if (context.getBasicOrderInfo() != null) {
            updatedInfo = BasicOrderInfoMapper.merge(context.getBasicOrderInfo(), updatedInfo);
        }

        boolean success = stateService.updateStateAndData(sessionId,
                BasicOrderInfoState.BRANCH_SELECTED, updatedInfo);

        if (success) {
            logger.info("✅ [WORKFLOW] Успішно підтверджено вибір філії {} для sessionId: {}", branchId, sessionId);
        } else {
            logger.error("❌ [WORKFLOW] Не вдалося підтвердити вибір філії {} для sessionId: {}", branchId, sessionId);
        }

        return success;
    }

    /**
     * Переводить процес до встановлення дати створення.
     */
    public boolean transitionToCreationDateSetting(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        // Дата встановлюється автоматично при завершенні
        return stateService.updateState(sessionId, BasicOrderInfoState.SETTING_CREATION_DATE);
    }

    /**
     * Підтверджує встановлення дати створення.
     */
    public boolean confirmCreationDate(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        if (context.getCurrentState() != BasicOrderInfoState.SETTING_CREATION_DATE) {
            return false;
        }

        BasicOrderInfoDTO updatedInfo = context.getBasicOrderInfo();
        if (updatedInfo.getCreationDate() == null) {
            updatedInfo.setCreationDate(LocalDateTime.now());
        }

        return stateService.updateStateAndData(sessionId,
                BasicOrderInfoState.CREATION_DATE_SET, updatedInfo);
    }

    /**
     * Завершує процес базової інформації замовлення.
     */
    public boolean completeWorkflow(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        // Перевіряємо що всі необхідні кроки завершені
        BasicOrderInfoDTO info = context.getBasicOrderInfo();
        if (!info.isReceiptNumberGenerated() || !info.isUniqueTagEntered() ||
            !info.isBranchSelected() || !info.isCreationDateSet()) {
            return false;
        }

        return stateService.updateState(sessionId, BasicOrderInfoState.COMPLETED);
    }

    /**
     * Скидає процес до початкового стану.
     */
    public boolean resetWorkflow(String sessionId) {
        return stateService.resetContext(sessionId);
    }

    /**
     * Обробляє повернення до попереднього кроку.
     */
    public boolean goBack(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        BasicOrderInfoState currentState = context.getCurrentState();
        BasicOrderInfoState previousState = getPreviousState(currentState);

        if (previousState == null) {
            return false;
        }

        return stateService.updateState(sessionId, previousState);
    }

    /**
     * Скасовує весь процес.
     */
    public boolean cancelWorkflow(String sessionId) {
        return stateService.removeContext(sessionId);
    }

    /**
     * Блокує процес для обробки.
     */
    public boolean lockWorkflow(String sessionId) {
        return stateService.lockContext(sessionId);
    }

    /**
     * Розблоковує процес.
     */
    public boolean unlockWorkflow(String sessionId) {
        return stateService.unlockContext(sessionId);
    }

    /**
     * Перевіряє чи процес готовий до завершення.
     */
    public boolean isReadyForCompletion(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null) {
            return false;
        }

        BasicOrderInfoDTO info = context.getBasicOrderInfo();
        return info.isReceiptNumberGenerated() && info.isUniqueTagEntered() &&
               info.isBranchSelected() && info.isCreationDateSet();
    }

    /**
     * Отримує поточний стан процесу.
     */
    public BasicOrderInfoState getCurrentState(String sessionId) {
        return stateService.getCurrentState(sessionId);
    }

    /**
     * Отримує поточні дані процесу.
     */
    public BasicOrderInfoDTO getCurrentData(String sessionId) {
        return stateService.getBasicOrderInfo(sessionId);
    }

    /**
     * Перевіряє чи процес має помилки.
     */
    public boolean hasErrors(String sessionId) {
        return stateService.hasError(sessionId);
    }

    /**
     * Отримує останню помилку процесу.
     */
    public String getLastError(String sessionId) {
        return stateService.getLastError(sessionId);
    }

    /**
     * Очищає помилки процесу.
     */
    public boolean clearErrors(String sessionId) {
        return stateService.clearError(sessionId);
    }

    /**
     * Автоматично переводить процес до наступного логічного стану.
     */
    public boolean advanceToNextStep(String sessionId) {
        BasicOrderInfoContext context = stateService.getContext(sessionId);
        if (context == null || context.isLocked()) {
            return false;
        }

        BasicOrderInfoState currentState = context.getCurrentState();
        BasicOrderInfoState nextState = getNextLogicalState(currentState, context.getBasicOrderInfo());

        if (nextState == null || nextState == currentState) {
            return false;
        }

        return stateService.updateState(sessionId, nextState);
    }

    // Допоміжні методи

    private BasicOrderInfoState getPreviousState(BasicOrderInfoState currentState) {
        return switch (currentState) {
            case GENERATING_RECEIPT_NUMBER -> BasicOrderInfoState.INIT;
            case RECEIPT_NUMBER_GENERATED -> BasicOrderInfoState.GENERATING_RECEIPT_NUMBER;
            case ENTERING_UNIQUE_TAG -> BasicOrderInfoState.RECEIPT_NUMBER_GENERATED;
            case UNIQUE_TAG_ENTERED -> BasicOrderInfoState.ENTERING_UNIQUE_TAG;
            case SELECTING_BRANCH -> BasicOrderInfoState.INIT; // Може бути на будь-якому етапі
            case BRANCH_SELECTED -> BasicOrderInfoState.SELECTING_BRANCH;
            case SETTING_CREATION_DATE -> BasicOrderInfoState.BRANCH_SELECTED;
            case CREATION_DATE_SET -> BasicOrderInfoState.SETTING_CREATION_DATE;
            case COMPLETED -> BasicOrderInfoState.CREATION_DATE_SET;
            case ERROR -> BasicOrderInfoState.INIT;
            default -> null;
        };
    }

    private BasicOrderInfoState getNextLogicalState(BasicOrderInfoState currentState,
                                                  BasicOrderInfoDTO basicOrderInfo) {
        return switch (currentState) {
            case INIT -> BasicOrderInfoState.GENERATING_RECEIPT_NUMBER;
            case RECEIPT_NUMBER_GENERATED -> BasicOrderInfoState.ENTERING_UNIQUE_TAG;
            case UNIQUE_TAG_ENTERED -> basicOrderInfo.isBranchSelected()
                ? BasicOrderInfoState.SETTING_CREATION_DATE
                : BasicOrderInfoState.SELECTING_BRANCH;
            case BRANCH_SELECTED -> basicOrderInfo.isUniqueTagEntered()
                ? BasicOrderInfoState.SETTING_CREATION_DATE
                : BasicOrderInfoState.ENTERING_UNIQUE_TAG;
            case CREATION_DATE_SET -> BasicOrderInfoState.COMPLETED;
            default -> null;
        };
    }

    /**
     * Отримує філії з контексту (завантажуються автоматично при ініціалізації).
     * Цей метод припускає що філії були завантажені в availableBranches поле DTO.
     */
    public java.util.List<com.aksi.domain.branch.dto.BranchLocationDTO> getAvailableBranches(String sessionId) {
        BasicOrderInfoDTO currentData = getCurrentData(sessionId);
        if (currentData != null && currentData.getAvailableBranches() != null) {
            return currentData.getAvailableBranches();
        }
        return java.util.Collections.emptyList();
    }
}
