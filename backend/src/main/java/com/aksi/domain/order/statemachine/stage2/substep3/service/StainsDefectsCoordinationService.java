package com.aksi.domain.order.statemachine.stage2.substep3.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsStateService.StainsDefectsContext;
import com.aksi.domain.order.statemachine.stage2.substep3.validator.ValidationResult;

/**
 * Coordination Service для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Головний делегатор - єдина точка доступу для Guards та Actions.
 * Координує роботу всіх сервісів підетапу (згідно архітектурних правил).
 */
@Service
public class StainsDefectsCoordinationService {

    private final StainsDefectsValidationService validationService;
    private final StainsDefectsWorkflowService workflowService;
    private final StainsDefectsStateService stateService;
    private final StainsDefectsOperationsService operationsService;

    public StainsDefectsCoordinationService(final StainsDefectsValidationService validationService,
                                          final StainsDefectsWorkflowService workflowService,
                                          final StainsDefectsStateService stateService,
                                          final StainsDefectsOperationsService operationsService) {
        this.validationService = validationService;
        this.workflowService = workflowService;
        this.stateService = stateService;
        this.operationsService = operationsService;
    }

    // ===== ДЕЛЕГАЦІЯ ДО WORKFLOW SERVICE =====

    /**
     * Ініціалізує підетап для сесії.
     */
    public StainsDefectsContext initializeSubstep(final UUID sessionId, final OrderItemAddRequest currentItem) {
        return workflowService.initializeSubstep(sessionId, currentItem);
    }

    /**
     * Обробляє вибір плям.
     */
    public StainsDefectsContext processStainSelection(final UUID sessionId,
                                                    final String selectedStains,
                                                    final String otherStains) {
        return workflowService.processStainSelection(sessionId, selectedStains, otherStains);
    }

    /**
     * Обробляє вибір дефектів та ризиків.
     */
    public StainsDefectsContext processDefectSelection(final UUID sessionId,
                                                     final String selectedDefects,
                                                     final String noGuaranteeReason) {
        return workflowService.processDefectSelection(sessionId, selectedDefects, noGuaranteeReason);
    }

    /**
     * Обробляє додавання приміток про дефекти.
     */
    public StainsDefectsContext processDefectNotes(final UUID sessionId, final String defectNotes) {
        return workflowService.processDefectNotes(sessionId, defectNotes);
    }

    /**
     * Завершує підетап.
     */
    public StainsDefectsContext completeSubstep(final UUID sessionId) {
        return workflowService.completeSubstep(sessionId);
    }

    /**
     * Повертається до попереднього стану.
     */
    public StainsDefectsContext goBack(final UUID sessionId, final StainsDefectsState targetState) {
        return workflowService.goBack(sessionId, targetState);
    }

    /**
     * Скидає підетап до початкового стану.
     */
    public StainsDefectsContext reset(final UUID sessionId) {
        return workflowService.reset(sessionId);
    }

    /**
     * Отримує доступні типи плям.
     */
    public List<String> getAvailableStainTypes() {
        return workflowService.getAvailableStainTypes();
    }

    /**
     * Отримує доступні типи дефектів.
     */
    public List<String> getAvailableDefectTypes() {
        return workflowService.getAvailableDefectTypes();
    }

    // ===== ДЕЛЕГАЦІЯ ДО OPERATIONS SERVICE =====

    /**
     * Отримує доступні типи плям (пряма делегація).
     */
    public List<String> getAvailableStainTypesFromOperations() {
        return operationsService.getAvailableStainTypes();
    }

    /**
     * Отримує доступні типи дефектів (пряма делегація).
     */
    public List<String> getAvailableDefectTypesFromOperations() {
        return operationsService.getAvailableDefectTypes();
    }

    /**
     * Зберігає інформацію про плями для предмета.
     */
    public OrderItemAddRequest saveStains(final OrderItemAddRequest itemRequest,
                                        final String stains,
                                        final String otherStains) {
        return operationsService.saveStains(itemRequest, stains, otherStains);
    }

    /**
     * Зберігає інформацію про дефекти та ризики для предмета.
     */
    public OrderItemAddRequest saveDefectsAndRisks(final OrderItemAddRequest itemRequest,
                                                 final String defectsAndRisks,
                                                 final String noGuaranteeReason) {
        return operationsService.saveDefectsAndRisks(itemRequest, defectsAndRisks, noGuaranteeReason);
    }

    /**
     * Зберігає загальні примітки про дефекти.
     */
    public OrderItemAddRequest saveDefectNotes(final OrderItemAddRequest itemRequest,
                                             final String defectNotes) {
        return operationsService.saveDefectNotes(itemRequest, defectNotes);
    }

    /**
     * Перевіряє, чи існує замовлення.
     */
    public boolean validateOrderExists(final UUID orderId) {
        return operationsService.validateOrderExists(orderId);
    }

    // ===== ДЕЛЕГАЦІЯ ДО VALIDATION SERVICE =====

    /**
     * Валідує дані про плями та дефекти.
     */
    public ValidationResult validateStainsDefects(final StainsDefectsDTO data) {
        return validationService.validateStainsDefects(data);
    }

    /**
     * Перевіряє валідність даних для Guards.
     */
    public boolean isStainsDefectsValid(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return validationService.isDataValid(context.getData());
    }

    /**
     * Перевіряє готовність до завершення для Guards.
     */
    public boolean isReadyForCompletion(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return validationService.isReadyForCompletion(context.getData());
    }

    /**
     * Отримує повідомлення про помилки валідації.
     */
    public String getValidationErrors(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return "Контекст сесії не знайдено";
        }
        return validationService.getValidationErrors(context.getData());
    }

    // ===== ДЕЛЕГАЦІЯ ДО STATE SERVICE =====

    /**
     * Отримує контекст сесії.
     */
    public StainsDefectsContext getContext(final UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    /**
     * Встановлює помилку в контексті.
     */
    public void setError(final UUID sessionId, final String errorMessage) {
        stateService.setError(sessionId, errorMessage);
    }

    /**
     * Очищує помилку в контексті.
     */
    public void clearError(final UUID sessionId) {
        stateService.clearError(sessionId);
    }

    /**
     * Видаляє контекст сесії.
     */
    public void removeContext(final UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    // ===== ДОДАТКОВІ МЕТОДИ ДЛЯ GUARDS =====

    /**
     * Перевіряє, чи є дані в контексті (делегація до StateService).
     */
    public boolean hasData(final UUID sessionId) {
        return stateService.hasData(sessionId);
    }

    /**
     * Перевіряє, чи вибрані плями.
     */
    public boolean hasStains(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return context.getData().hasStains();
    }

    /**
     * Перевіряє, чи вибрані дефекти.
     */
    public boolean hasDefects(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return context.getData().hasDefects();
    }

    /**
     * Перевіряє, чи завершено вибір плям.
     */
    public boolean isStainSelectionCompleted(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return context.getData().isStainsSelectionCompleted();
    }

    /**
     * Перевіряє, чи завершено вибір дефектів.
     */
    public boolean isDefectSelectionCompleted(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return context.getData().isDefectsSelectionCompleted();
    }

    /**
     * Перевіряє, чи є помилки в контексті (делегація до StateService).
     */
    public boolean hasErrors(final UUID sessionId) {
        return stateService.hasErrors(sessionId);
    }

    /**
     * Перевіряє можливість збереження в базу даних (делегація до ValidationService).
     */
    public boolean canSaveToDatabase(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null || context.getData() == null) {
            return false;
        }
        return validationService.canSaveToDatabase(context.getData());
    }
}
