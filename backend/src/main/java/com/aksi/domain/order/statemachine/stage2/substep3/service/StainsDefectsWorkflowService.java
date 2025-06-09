package com.aksi.domain.order.statemachine.stage2.substep3.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsStateService.StainsDefectsContext;

/**
 * Workflow сервіс для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Управляє бізнес-логікою етапів вибору плям, дефектів та додавання приміток.
 */
@Service
public class StainsDefectsWorkflowService {

    private final StainsDefectsStateService stateService;
    private final StainsDefectsOperationsService operationsService;

    public StainsDefectsWorkflowService(final StainsDefectsStateService stateService,
                                      final StainsDefectsOperationsService operationsService) {
        this.stateService = stateService;
        this.operationsService = operationsService;
    }

    /**
     * Ініціалізує підетап для сесії.
     *
     * @param sessionId ідентифікатор сесії
     * @param currentItem поточний предмет для обробки
     * @return контекст підетапу
     */
    public StainsDefectsContext initializeSubstep(final UUID sessionId, final OrderItemAddRequest currentItem) {
        final StainsDefectsContext context = stateService.createContext(sessionId);

        // Ініціалізуємо DTO з поточним предметом
        final StainsDefectsDTO dto = StainsDefectsDTO.builder()
            .currentItem(currentItem)
            .stainsSelectionCompleted(false)
            .defectsSelectionCompleted(false)
            .build();

        context.setData(dto);
        context.setCurrentState(StainsDefectsState.SELECTING_STAINS);

        return context;
    }

    /**
     * Обробляє вибір плям.
     *
     * @param sessionId ідентифікатор сесії
     * @param selectedStains вибрані плями
     * @param otherStains інші плями (текст)
     * @return оновлений контекст
     */
    public StainsDefectsContext processStainSelection(final UUID sessionId,
                                                    final String selectedStains,
                                                    final String otherStains) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено: " + sessionId);
        }

        // Оновлюємо предмет з інформацією про плями
        final OrderItemAddRequest updatedItem = operationsService.saveStains(
            context.getData().getCurrentItem(), selectedStains, otherStains
        );

        // Оновлюємо DTO
        final StainsDefectsDTO updatedData = context.getData().toBuilder()
            .currentItem(updatedItem)
            .stainsSelectionCompleted(true)
            .build();

        context.setData(updatedData);
        context.setCurrentState(StainsDefectsState.SELECTING_DEFECTS);

        return context;
    }

    /**
     * Обробляє вибір дефектів та ризиків.
     *
     * @param sessionId ідентифікатор сесії
     * @param selectedDefects вибрані дефекти
     * @param noGuaranteeReason причина відмови від гарантій
     * @return оновлений контекст
     */
    public StainsDefectsContext processDefectSelection(final UUID sessionId,
                                                     final String selectedDefects,
                                                     final String noGuaranteeReason) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено: " + sessionId);
        }

        // Оновлюємо предмет з інформацією про дефекти
        final OrderItemAddRequest updatedItem = operationsService.saveDefectsAndRisks(
            context.getData().getCurrentItem(), selectedDefects, noGuaranteeReason
        );

        // Оновлюємо DTO
        final StainsDefectsDTO updatedData = context.getData().toBuilder()
            .currentItem(updatedItem)
            .defectsSelectionCompleted(true)
            .build();

        context.setData(updatedData);
        context.setCurrentState(StainsDefectsState.ENTERING_NOTES);

        return context;
    }

    /**
     * Обробляє додавання приміток про дефекти.
     *
     * @param sessionId ідентифікатор сесії
     * @param defectNotes примітки про дефекти
     * @return оновлений контекст
     */
    public StainsDefectsContext processDefectNotes(final UUID sessionId, final String defectNotes) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено: " + sessionId);
        }

        // Оновлюємо предмет з примітками
        final OrderItemAddRequest updatedItem = operationsService.saveDefectNotes(
            context.getData().getCurrentItem(), defectNotes
        );

        // Оновлюємо DTO
        final StainsDefectsDTO updatedData = context.getData().toBuilder()
            .currentItem(updatedItem)
            .build();

        context.setData(updatedData);
        context.setCurrentState(StainsDefectsState.VALIDATING_DATA);

        return context;
    }

    /**
     * Завершує підетап.
     *
     * @param sessionId ідентифікатор сесії
     * @return фінальний контекст
     */
    public StainsDefectsContext completeSubstep(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено: " + sessionId);
        }

        context.setCurrentState(StainsDefectsState.COMPLETED);
        return context;
    }

    /**
     * Отримує доступні типи плям.
     *
     * @return список типів плям
     */
    public List<String> getAvailableStainTypes() {
        return operationsService.getAvailableStainTypes();
    }

    /**
     * Отримує доступні типи дефектів.
     *
     * @return список типів дефектів
     */
    public List<String> getAvailableDefectTypes() {
        return operationsService.getAvailableDefectTypes();
    }

    /**
     * Повертається до попереднього стану.
     *
     * @param sessionId ідентифікатор сесії
     * @param targetState цільовий стан для повернення
     * @return оновлений контекст
     */
    public StainsDefectsContext goBack(final UUID sessionId, final StainsDefectsState targetState) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено: " + sessionId);
        }

        context.setCurrentState(targetState);
        context.clearError();

        return context;
    }

    /**
     * Скидає підетап до початкового стану.
     *
     * @param sessionId ідентифікатор сесії
     * @return скинутий контекст
     */
    public StainsDefectsContext reset(final UUID sessionId) {
        final StainsDefectsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено: " + sessionId);
        }

        // Скидаємо дані
        final StainsDefectsDTO resetData = context.getData().toBuilder()
            .stainsSelectionCompleted(false)
            .defectsSelectionCompleted(false)
            .build();

        context.setData(resetData);
        context.setCurrentState(StainsDefectsState.NOT_STARTED);
        context.clearError();

        return context;
    }
}
