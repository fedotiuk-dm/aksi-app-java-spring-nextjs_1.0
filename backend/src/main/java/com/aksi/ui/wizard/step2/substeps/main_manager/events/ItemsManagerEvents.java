package com.aksi.ui.wizard.step2.substeps.main_manager.events;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step2.substeps.main_manager.domain.ItemsManagerState;

/**
 * Events для координації між компонентами менеджера предметів.
 * Дотримуємось принципу інверсії залежностей (DIP).
 */
public sealed interface ItemsManagerEvents {

    /**
     * Подія запиту завантаження предметів замовлення.
     */
    record ItemsLoadRequested(
            UUID orderId
    ) implements ItemsManagerEvents {}

    /**
     * Подія завершення завантаження предметів.
     */
    record ItemsLoaded(
            List<OrderItemDTO> items,
            boolean fromDatabase
    ) implements ItemsManagerEvents {}

    /**
     * Подія додавання нового предмета.
     */
    record ItemAdded(
            OrderItemDTO addedItem
    ) implements ItemsManagerEvents {}

    /**
     * Подія оновлення існуючого предмета.
     */
    record ItemUpdated(
            OrderItemDTO updatedItem,
            OrderItemDTO previousItem
    ) implements ItemsManagerEvents {}

    /**
     * Подія запиту видалення предмета.
     */
    record ItemDeletionRequested(
            OrderItemDTO itemToDelete
    ) implements ItemsManagerEvents {}

    /**
     * Подія підтвердження видалення предмета.
     */
    record ItemDeletionConfirmed(
            OrderItemDTO deletedItem
    ) implements ItemsManagerEvents {}

    /**
     * Подія видалення предмета.
     */
    record ItemDeleted(
            OrderItemDTO deletedItem
    ) implements ItemsManagerEvents {}

    /**
     * Подія запиту редагування предмета.
     */
    record ItemEditRequested(
            OrderItemDTO itemToEdit
    ) implements ItemsManagerEvents {}

    /**
     * Подія запиту додавання нового предмета.
     */
    record AddNewItemRequested() implements ItemsManagerEvents {}

    /**
     * Подія оновлення повного стану менеджера.
     */
    record ManagerStateUpdated(
            ItemsManagerState managerState
    ) implements ItemsManagerEvents {}

    /**
     * Подія оновлення загальної вартості.
     */
    record TotalCostUpdated(
            BigDecimal totalCost,
            String formattedTotalCost,
            int itemsCount
    ) implements ItemsManagerEvents {}

    /**
     * Подія валідації стану менеджера.
     */
    record ManagerValidationRequested(
            ItemsManagerState currentState
    ) implements ItemsManagerEvents {}

    /**
     * Подія результату валідації менеджера.
     */
    record ManagerValidationCompleted(
            boolean isValid,
            List<String> validationMessages,
            boolean canContinueToNext
    ) implements ItemsManagerEvents {}

    /**
     * Подія помилки в менеджері предметів.
     */
    record ManagerError(
            String errorMessage,
            Throwable cause,
            String operation
    ) implements ItemsManagerEvents {}

    /**
     * Подія початку завантаження.
     */
    record LoadingStarted(
            String operation
    ) implements ItemsManagerEvents {}

    /**
     * Подія завершення завантаження.
     */
    record LoadingCompleted(
            String operation
    ) implements ItemsManagerEvents {}

    /**
     * Подія запиту переходу до наступного етапу.
     */
    record ContinueToNextStepRequested(
            ItemsManagerState currentState
    ) implements ItemsManagerEvents {}

    /**
     * Подія готовності до переходу.
     */
    record ReadyToContinue(
            boolean isReady,
            String buttonText,
            List<OrderItemDTO> items
    ) implements ItemsManagerEvents {}

    /**
     * Подія оновлення стану UI компонентів.
     */
    record UIStateChanged(
            boolean canAddItems,
            boolean canContinueToNext,
            boolean isLoading,
            String statusMessage
    ) implements ItemsManagerEvents {}

    /**
     * Подія ініціалізації менеджера.
     */
    record ManagerInitialized(
            ItemsManagerState initialState
    ) implements ItemsManagerEvents {}

    /**
     * Подія оновлення відображення після змін.
     */
    record ViewRefreshRequested() implements ItemsManagerEvents {}

    /**
     * Подія успішного збереження.
     */
    record ItemSaved(
            OrderItemDTO savedItem,
            boolean wasNewItem
    ) implements ItemsManagerEvents {}

    /**
     * Подія оновлення статистики.
     */
    record StatisticsUpdated(
            int itemsCount,
            BigDecimal totalCost,
            String statusMessage
    ) implements ItemsManagerEvents {}
}
