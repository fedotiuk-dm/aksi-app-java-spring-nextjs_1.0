package com.aksi.domain.order.statemachine.stage2.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemManagerMapper;
import com.aksi.domain.order.statemachine.stage2.service.Stage2StateService.Stage2Context;

/**
 * Сервіс синхронізації та управління життєвим циклом для Stage2.
 * Містить складну логіку управління станом та синхронізації даних.
 */
@Service
public class Stage2SynchronizationService {

    private final Stage2StateService stateService;
    private final Stage2OperationsService operationsService;
    private final ItemManagerMapper mapper;

    public Stage2SynchronizationService(
            final Stage2StateService stateService,
            final Stage2OperationsService operationsService,
            final ItemManagerMapper mapper) {
        this.stateService = stateService;
        this.operationsService = operationsService;
        this.mapper = mapper;
    }

    /**
     * Синхронізує менеджер з актуальними даними замовлення.
     * Корисно після прямих операцій або для відновлення стану.
     */
    public ItemManagerDTO synchronizeManager(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalArgumentException("Сесія не знайдена: " + sessionId);
        }

        // Завантажуємо актуальні дані з замовлення
        final List<OrderItemDTO> currentItems = operationsService.getOrderItems(context.getOrderId());

        // Отримуємо поточний менеджер
        final ItemManagerDTO currentManager = context.getManagerData();
        if (currentManager == null) {
            // Створюємо новий менеджер якщо його немає
            final ItemManagerDTO newManager = mapper.fromExistingItems(context.getOrderId(), currentItems);
            stateService.updateManagerData(sessionId, newManager);
            return newManager;
        }

        // Оновлюємо існуючий менеджер з актуальними даними
        final ItemManagerDTO synchronizedManager = currentManager.toBuilder()
                .addedItems(currentItems)
                .build();

        // Перераховуємо поля
        synchronizedManager.updateCalculatedFields();

        // Зберігаємо в контексті
        stateService.updateManagerData(sessionId, synchronizedManager);

        return synchronizedManager;
    }

    /**
     * Скидає сесію до початкового стану без видалення контексту
     */
    public void resetSession(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context != null) {
            stateService.updateState(sessionId, Stage2State.NOT_STARTED);
            stateService.updateManagerData(sessionId, null);
        }
    }

    /**
     * Ініціалізує сесію з існуючими даними замовлення
     */
    public ItemManagerDTO initializeSessionFromOrder(final UUID orderId) {
        final Stage2Context context = stateService.createContext(orderId);
        final List<OrderItemDTO> existingItems = operationsService.getOrderItems(orderId);

        final ItemManagerDTO manager = mapper.fromExistingItems(orderId, existingItems);
        stateService.updateManagerData(context.getSessionId(), manager);
        stateService.updateState(context.getSessionId(), Stage2State.ITEMS_MANAGER_SCREEN);

        return manager;
    }

    /**
     * Відновлює стан менеджера після збоїв
     */
    public ItemManagerDTO restoreManagerState(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalArgumentException("Контекст сесії не знайдений: " + sessionId);
        }

        // Перевіряємо чи існує замовлення
        if (!operationsService.orderExists(context.getOrderId())) {
            throw new IllegalArgumentException("Замовлення не знайдено: " + context.getOrderId());
        }

        // Синхронізуємо з актуальними даними
        return synchronizeManager(sessionId);
    }

    /**
     * Повністю завершує та очищає сесію
     */
    public void terminateSession(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context != null) {
            stateService.updateState(sessionId, Stage2State.COMPLETED);
            stateService.removeContext(sessionId);
        }
    }

    /**
     * Перевіряє цілісність даних сесії та виправляє розбіжності
     */
    public boolean validateAndRepairSessionIntegrity(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null) {
            return false;
        }

        final ItemManagerDTO manager = context.getManagerData();
        if (manager == null) {
            // Спробуємо відновити менеджер
            try {
                synchronizeManager(sessionId);
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        // Перевіряємо відповідність кількості предметів
        final List<OrderItemDTO> actualItems = operationsService.getOrderItems(context.getOrderId());
        if (manager.getItemCount() != actualItems.size()) {
            // Синхронізуємо дані
            synchronizeManager(sessionId);
            return true;
        }

        return true;
    }

    /**
     * Очищає всі застарілі сесії
     */
    public void cleanupStaleSessions() {
        stateService.cleanupStaleContexts();
    }

    /**
     * Створює резервну копію стану сесії
     */
    public Stage2SessionBackup createSessionBackup(final UUID sessionId) {
        final Stage2Context context = stateService.getContext(sessionId);
        if (context == null) {
            return null;
        }

        return new Stage2SessionBackup(
                sessionId,
                context.getOrderId(),
                context.getCurrentState(),
                context.getManagerData(),
                System.currentTimeMillis()
        );
    }

    /**
     * Відновлює стан сесії з резервної копії
     */
    public boolean restoreFromBackup(final Stage2SessionBackup backup) {
        if (backup == null) {
            return false;
        }

        try {
            final Stage2Context context = stateService.createContext(backup.getOrderId());
            stateService.updateState(context.getSessionId(), backup.getState());
            stateService.updateManagerData(context.getSessionId(), backup.getManagerData());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Резервна копія стану сесії
     */
    public static class Stage2SessionBackup {
        private final UUID sessionId;
        private final UUID orderId;
        private final Stage2State state;
        private final ItemManagerDTO managerData;
        private final long timestamp;

        public Stage2SessionBackup(
                final UUID sessionId,
                final UUID orderId,
                final Stage2State state,
                final ItemManagerDTO managerData,
                final long timestamp) {
            this.sessionId = sessionId;
            this.orderId = orderId;
            this.state = state;
            this.managerData = managerData;
            this.timestamp = timestamp;
        }

        // Getters
        public UUID getSessionId() { return sessionId; }
        public UUID getOrderId() { return orderId; }
        public Stage2State getState() { return state; }
        public ItemManagerDTO getManagerData() { return managerData; }
        public long getTimestamp() { return timestamp; }
    }
}
