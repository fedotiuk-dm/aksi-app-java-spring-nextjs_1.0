package com.aksi.domain.order.statemachine.stage2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.service.Stage2StateService.Stage2Context;
import com.aksi.domain.order.statemachine.stage2.validator.ValidationResult;

/**
 * Координаційний сервіс для Stage2 - головного екрану менеджера предметів.
 * Чистий делегатор між усіма сервісами для роботи з менеджером предметів.
 */
@Service
public class Stage2CoordinationService {

    private final Stage2ValidationService validationService;
    private final Stage2WorkflowService workflowService;
    private final Stage2StateService stateService;
    private final Stage2OperationsService operationsService;
    private final Stage2SynchronizationService synchronizationService;

    public Stage2CoordinationService(
            final Stage2ValidationService validationService,
            final Stage2WorkflowService workflowService,
            final Stage2StateService stateService,
            final Stage2OperationsService operationsService,
            final Stage2SynchronizationService synchronizationService) {
        this.validationService = validationService;
        this.workflowService = workflowService;
        this.stateService = stateService;
        this.operationsService = operationsService;
        this.synchronizationService = synchronizationService;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateReadinessToProceed(final ItemManagerDTO manager) {
        return validationService.validateReadinessToProceed(manager);
    }

    public ValidationResult validateNewWizardStart(final ItemManagerDTO manager) {
        return validationService.validateNewWizardStart(manager);
    }

    public ValidationResult validateEditWizardStart(final ItemManagerDTO manager, final UUID itemId) {
        return validationService.validateEditWizardStart(manager, itemId);
    }

    public ValidationResult validateItemDeletion(final ItemManagerDTO manager, final UUID itemId) {
        return validationService.validateItemDeletion(manager, itemId);
    }

    public ValidationResult validateManagerIntegrity(final ItemManagerDTO manager) {
        return validationService.validateManagerIntegrity(manager);
    }

    public ValidationResult validateManager(final ItemManagerDTO manager) {
        return validationService.validateManager(manager);
    }

    // ========== Делегування до WorkflowService ==========

    public ItemManagerDTO initializeItemManager(final UUID orderId) {
        return workflowService.initializeItemManager(orderId);
    }

    public ItemManagerDTO startNewItemWizard(final UUID sessionId) {
        return workflowService.startNewItemWizard(sessionId);
    }

    public ItemManagerDTO startEditItemWizard(final UUID sessionId, final UUID itemId) {
        return workflowService.startEditItemWizard(sessionId, itemId);
    }

    public ItemManagerDTO addItemToOrder(final UUID sessionId, final OrderItemDTO itemDTO) {
        return workflowService.addItemToOrder(sessionId, itemDTO);
    }

    public ItemManagerDTO updateItemInOrder(final UUID sessionId, final UUID itemId, final OrderItemDTO itemDTO) {
        return workflowService.updateItemInOrder(sessionId, itemId, itemDTO);
    }

    public ItemManagerDTO deleteItemFromOrder(final UUID sessionId, final UUID itemId) {
        return workflowService.deleteItemFromOrder(sessionId, itemId);
    }

    public ItemManagerDTO closeWizard(final UUID sessionId) {
        return workflowService.closeWizard(sessionId);
    }

    public boolean checkReadinessToProceed(final UUID sessionId) {
        return workflowService.checkReadinessToProceed(sessionId);
    }

    public ItemManagerDTO completeStage2(final UUID sessionId) {
        return workflowService.completeStage2(sessionId);
    }

    public ItemManagerDTO getCurrentManager(final UUID sessionId) {
        return workflowService.getCurrentManager(sessionId);
    }

    // ========== Делегування до StateService ==========

    public Stage2Context createContext(final UUID orderId) {
        return stateService.createContext(orderId);
    }

    public Stage2Context getContext(final UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    public void updateState(final UUID sessionId, final Stage2State newState) {
        stateService.updateState(sessionId, newState);
    }

    public void updateManagerData(final UUID sessionId, final ItemManagerDTO managerData) {
        stateService.updateManagerData(sessionId, managerData);
    }

    public void removeContext(final UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    public boolean hasContext(final UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    public int getActiveContextCount() {
        return stateService.getActiveContextCount();
    }

    // ========== Делегування до OperationsService ==========

    public List<OrderItemDTO> getOrderItems(final UUID orderId) {
        return operationsService.getOrderItems(orderId);
    }

    public OrderItemDTO addOrderItem(final UUID orderId, final OrderItemDTO itemDTO) {
        return operationsService.addItemToOrder(orderId, itemDTO);
    }

    public OrderItemDTO updateOrderItem(final UUID orderId, final UUID itemId, final OrderItemDTO itemDTO) {
        return operationsService.updateOrderItem(orderId, itemId, itemDTO);
    }

    public void deleteOrderItem(final UUID orderId, final UUID itemId) {
        operationsService.deleteOrderItem(orderId, itemId);
    }

    public OrderItemDTO getOrderItem(final UUID orderId, final UUID itemId) {
        return operationsService.getOrderItem(orderId, itemId);
    }

    public boolean orderExists(final UUID orderId) {
        return operationsService.orderExists(orderId);
    }

    // ========== Делегування до SynchronizationService ==========

    public ItemManagerDTO synchronizeManager(final UUID sessionId) {
        return synchronizationService.synchronizeManager(sessionId);
    }

    public void resetSession(final UUID sessionId) {
        synchronizationService.resetSession(sessionId);
    }

    public ItemManagerDTO initializeSessionFromOrder(final UUID orderId) {
        return synchronizationService.initializeSessionFromOrder(orderId);
    }

    public ItemManagerDTO restoreManagerState(final UUID sessionId) {
        return synchronizationService.restoreManagerState(sessionId);
    }

    public void terminateSession(final UUID sessionId) {
        synchronizationService.terminateSession(sessionId);
    }

    public boolean validateAndRepairSessionIntegrity(final UUID sessionId) {
        return synchronizationService.validateAndRepairSessionIntegrity(sessionId);
    }

    public void cleanupStaleSessions() {
        synchronizationService.cleanupStaleSessions();
    }

    // ========== Високорівневі методи ==========

    /**
     * Перевіряє валідність менеджера через sessionId для Guards
     */
    public boolean isManagerValid(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        if (manager == null) {
            return false;
        }
        return validateManager(manager).isValid();
    }

    /**
     * Перевіряє готовність до переходу через sessionId для Guards
     */
    public boolean isReadyToProceed(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        if (manager == null) {
            return false;
        }
        return validateReadinessToProceed(manager).isValid();
    }

    /**
     * Отримує поточний стан сесії
     */
    public Stage2State getCurrentState(final UUID sessionId) {
        final Stage2Context context = getContext(sessionId);
        return context != null ? context.getCurrentState() : Stage2State.NOT_STARTED;
    }

    /**
     * Отримує ID замовлення для сесії
     */
    public UUID getOrderIdForSession(final UUID sessionId) {
        final Stage2Context context = getContext(sessionId);
        return context != null ? context.getOrderId() : null;
    }

    /**
     * Перевіряє, чи активний підвізард
     */
    public boolean isWizardActive(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        return manager != null && manager.isWizardActive();
    }

    /**
     * Перевіряє, чи в режимі редагування
     */
    public boolean isEditMode(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        return manager != null && manager.isEditMode();
    }

    /**
     * Отримує ID предмета, що редагується
     */
    public UUID getEditingItemId(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        return manager != null ? manager.getEditingItemId() : null;
    }

    /**
     * Отримує кількість доданих предметів
     */
    public int getItemCount(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        return manager != null ? manager.getItemCount() : 0;
    }

    /**
     * Отримує загальну вартість замовлення
     */
    public BigDecimal getTotalAmount(final UUID sessionId) {
        final ItemManagerDTO manager = getCurrentManager(sessionId);
        return manager != null ? manager.getTotalAmount() : BigDecimal.ZERO;
    }
}
