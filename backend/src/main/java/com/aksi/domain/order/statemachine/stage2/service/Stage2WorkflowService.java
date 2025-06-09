package com.aksi.domain.order.statemachine.stage2.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemManagerMapper;
import com.aksi.domain.order.statemachine.stage2.service.Stage2StateService.Stage2Context;
import com.aksi.domain.order.statemachine.stage2.validator.ValidationResult;

/**
 * Сервіс робочого процесу для бізнес-логіки головного екрану менеджера предметів.
 */
@Service
public class Stage2WorkflowService {

    private final Stage2ValidationService validationService;
    private final Stage2StateService stateService;
    private final Stage2OperationsService operationsService;
    private final ItemManagerMapper mapper;

    public Stage2WorkflowService(
            final Stage2ValidationService validationService,
            final Stage2StateService stateService,
            final Stage2OperationsService operationsService,
            final ItemManagerMapper mapper) {
        this.validationService = validationService;
        this.stateService = stateService;
        this.operationsService = operationsService;
        this.mapper = mapper;
    }

    /**
     * Ініціалізує менеджер предметів для замовлення
     */
    public ItemManagerDTO initializeItemManager(final UUID orderId) {
        // Створюємо контекст
        final Stage2Context context = stateService.createContext(orderId);

        // Завантажуємо існуючі предмети (якщо є)
        final List<OrderItemDTO> existingItems = operationsService.getOrderItems(orderId);

        // Створюємо менеджер з існуючими даними
        final ItemManagerDTO manager = mapper.fromExistingItems(orderId, existingItems);

        // Зберігаємо в контексті
        stateService.updateManagerData(context.getSessionId(), manager);
        stateService.updateState(context.getSessionId(), Stage2State.ITEMS_MANAGER_SCREEN);

        return manager;
    }

    /**
     * Запускає новий підвізард додавання предмета
     */
    public ItemManagerDTO startNewItemWizard(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();

        // Валідуємо можливість запуску підвізарда
        final ValidationResult validation = validationService.validateNewWizardStart(manager);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Неможливо запустити підвізард: " + validation.getFirstError());
        }

        // Запускаємо підвізард
        final ItemManagerDTO updatedManager = mapper.startNewItemWizard(manager);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, updatedManager);
        stateService.updateState(sessionId, Stage2State.ITEM_WIZARD_ACTIVE);

        return updatedManager;
    }

    /**
     * Запускає підвізард редагування предмета
     */
    public ItemManagerDTO startEditItemWizard(final UUID sessionId, final UUID itemId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();

        // Валідуємо можливість редагування
        final ValidationResult validation = validationService.validateEditWizardStart(manager, itemId);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Неможливо редагувати предмет: " + validation.getFirstError());
        }

        // Запускаємо підвізард редагування
        final ItemManagerDTO updatedManager = mapper.startEditItemWizard(manager, itemId);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, updatedManager);
        stateService.updateState(sessionId, Stage2State.ITEM_WIZARD_ACTIVE);

        return updatedManager;
    }

    /**
     * Додає новий предмет до замовлення
     */
    public ItemManagerDTO addItemToOrder(final UUID sessionId, final OrderItemDTO itemDTO) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();

        // Додаємо предмет до замовлення через операційний сервіс
        final OrderItemDTO savedItem = operationsService.addItemToOrder(context.getOrderId(), itemDTO);

        // Оновлюємо менеджер
        final ItemManagerDTO updatedManager = mapper.addItem(manager, savedItem);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, updatedManager);
        stateService.updateState(sessionId, Stage2State.ITEMS_MANAGER_SCREEN);

        return updatedManager;
    }

    /**
     * Оновлює існуючий предмет замовлення
     */
    public ItemManagerDTO updateItemInOrder(final UUID sessionId, final UUID itemId, final OrderItemDTO itemDTO) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();

        // Оновлюємо предмет в замовленні
        final OrderItemDTO updatedItem = operationsService.updateOrderItem(context.getOrderId(), itemId, itemDTO);

        // Оновлюємо менеджер
        final ItemManagerDTO updatedManager = mapper.updateItem(manager, itemId, updatedItem);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, updatedManager);
        stateService.updateState(sessionId, Stage2State.ITEMS_MANAGER_SCREEN);

        return updatedManager;
    }

    /**
     * Видаляє предмет з замовлення
     */
    public ItemManagerDTO deleteItemFromOrder(final UUID sessionId, final UUID itemId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();

        // Валідуємо можливість видалення
        final ValidationResult validation = validationService.validateItemDeletion(manager, itemId);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Неможливо видалити предмет: " + validation.getFirstError());
        }

        // Видаляємо предмет з замовлення
        operationsService.deleteOrderItem(context.getOrderId(), itemId);

        // Оновлюємо менеджер
        final ItemManagerDTO updatedManager = mapper.removeItem(manager, itemId);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, updatedManager);

        return updatedManager;
    }

    /**
     * Закриває активний підвізард
     */
    public ItemManagerDTO closeWizard(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();
        final ItemManagerDTO updatedManager = mapper.closeWizard(manager);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, updatedManager);
        stateService.updateState(sessionId, Stage2State.ITEMS_MANAGER_SCREEN);

        return updatedManager;
    }

    /**
     * Перевіряє готовність до переходу на наступний етап
     */
    public boolean checkReadinessToProceed(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            return false;
        }

        final ItemManagerDTO manager = context.getManagerData();
        final ValidationResult validation = validationService.validateReadinessToProceed(manager);

        if (validation.isValid()) {
            stateService.updateState(sessionId, Stage2State.READY_TO_PROCEED);
            return true;
        }

        return false;
    }

    /**
     * Завершує етап 2 та переходить до наступного етапу
     */
    public ItemManagerDTO completeStage2(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null || !context.hasManagerData()) {
            throw new IllegalArgumentException("Контекст не знайдений або дані не ініціалізовані");
        }

        final ItemManagerDTO manager = context.getManagerData();

        // Валідуємо готовність
        final ValidationResult validation = validationService.validateReadinessToProceed(manager);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Неможливо завершити етап: " + validation.getFirstError());
        }

        // Позначаємо як готовий
        final ItemManagerDTO completedManager = mapper.markReadyToProceed(manager);

        // Оновлюємо контекст
        stateService.updateManagerData(sessionId, completedManager);
        stateService.updateState(sessionId, Stage2State.COMPLETED);

        return completedManager;
    }

    /**
     * Отримує поточний стан менеджера
     */
    public ItemManagerDTO getCurrentManager(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        return context != null ? context.getManagerData() : null;
    }
}
