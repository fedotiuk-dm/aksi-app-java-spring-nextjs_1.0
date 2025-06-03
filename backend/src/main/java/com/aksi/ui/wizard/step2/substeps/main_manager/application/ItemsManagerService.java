package com.aksi.ui.wizard.step2.substeps.main_manager.application;

import java.util.List;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.order.OrderItemManagementService;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step2.substeps.main_manager.domain.ItemsManagerState;
import com.aksi.ui.wizard.step2.substeps.main_manager.events.ItemsManagerEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації управління менеджером предметів.
 * Відповідає за координацію між доменом, інфраструктурою та UI.
 */
@RequiredArgsConstructor
@Slf4j
public class ItemsManagerService {

    private final OrderItemManagementService orderItemService;
    private final OrderWizardData wizardData;

    // Event handlers
    private Consumer<ItemsManagerEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<ItemsManagerEvents> handler) {
        this.eventHandler = handler;
    }

    /**
     * Ініціалізує менеджер предметів.
     */
    public ItemsManagerState initializeManager() {
        log.debug("Ініціалізація менеджера предметів для замовлення: {}",
                wizardData.getDraftOrder().getReceiptNumber());

        try {
            // Створюємо початковий стан
            ItemsManagerState initialState = ItemsManagerState.createInitial();

            publishEvent(new ItemsManagerEvents.ManagerInitialized(initialState));

            // Завантажуємо існуючі предмети
            loadItems(initialState);

            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації менеджера предметів: {}", ex.getMessage(), ex);
            publishEvent(new ItemsManagerEvents.ManagerError(
                    "Помилка ініціалізації: " + ex.getMessage(),
                    ex,
                    "initialization"
            ));

            return ItemsManagerState.createInitial();
        }
    }

    /**
     * Завантажує предмети замовлення з бази даних або локального списку.
     */
    public ItemsManagerState loadItems(ItemsManagerState currentState) {
        log.debug("Завантаження предметів замовлення");

        try {
            publishEvent(new ItemsManagerEvents.LoadingStarted("Завантаження предметів"));
            publishEvent(new ItemsManagerEvents.ItemsLoadRequested(wizardData.getDraftOrder().getId()));

            // Показуємо індикатор завантаження
            ItemsManagerState loadingState = currentState.withLoading(true);
            publishEvent(new ItemsManagerEvents.ManagerStateUpdated(loadingState));

            List<OrderItemDTO> items;
            boolean fromDatabase = false;

            if (wizardData.getDraftOrder().getId() != null) {
                // Завантажуємо з бази даних
                items = orderItemService.getOrderItems(wizardData.getDraftOrder().getId());
                wizardData.setItems(items);
                fromDatabase = true;
                log.debug("Завантажено {} предметів з БД", items.size());
            } else {
                // Використовуємо локальний список
                items = wizardData.getItems();
                log.debug("Використано {} предметів з локального списку", items.size());
            }

            // ДЕТАЛЬНЕ ЛОГУВАННЯ
            log.info("🔍 ДЕТАЛЬНА ІНФОРМАЦІЯ ПРО ПРЕДМЕТИ:");
            log.info("   - Кількість предметів: {}", items.size());
            log.info("   - З бази даних: {}", fromDatabase);
            log.info("   - ID замовлення: {}", wizardData.getDraftOrder().getId());
            log.info("   - Предмети у wizardData: {}", wizardData.getItems().size());

            if (!items.isEmpty()) {
                for (int i = 0; i < items.size(); i++) {
                    OrderItemDTO item = items.get(i);
                    log.info("   - Предмет {}: {} (ID: {}, Категорія: {}, Ціна: {})",
                            i + 1, item.getName(), item.getId(), item.getCategory(), item.getTotalPrice());
                }
            } else {
                log.warn("⚠️ СПИСОК ПРЕДМЕТІВ ПОРОЖНІЙ!");
            }

            publishEvent(new ItemsManagerEvents.ItemsLoaded(items, fromDatabase));

            // Оновлюємо стан з завантаженими предметами
            ItemsManagerState newState = currentState.withLoadedItems(items);
            publishEvent(new ItemsManagerEvents.ManagerStateUpdated(newState));

            // Оновлюємо статистику
            updateStatistics(newState);

            // Валідуємо стан
            validateManagerState(newState);

            publishEvent(new ItemsManagerEvents.LoadingCompleted("Завантаження предметів"));

            return newState;

        } catch (Exception ex) {
            log.error("Помилка завантаження предметів: {}", ex.getMessage(), ex);
            publishEvent(new ItemsManagerEvents.ManagerError(
                    "Помилка завантаження: " + ex.getMessage(),
                    ex,
                    "loading"
            ));

            publishEvent(new ItemsManagerEvents.LoadingCompleted("Завантаження предметів"));
            return currentState.withLoading(false);
        }
    }

    /**
     * Обробляє додавання нового предмета.
     */
    public ItemsManagerState addItem(ItemsManagerState currentState, OrderItemDTO newItem) {
        log.debug("Додавання предмета: {}", newItem.getName());

        try {
            publishEvent(new ItemsManagerEvents.ItemAdded(newItem));

            // Додаємо до локального списку
            wizardData.getItems().add(newItem);

            // Оновлюємо стан
            ItemsManagerState newState = currentState.withAddedItem(newItem);
            publishEvent(new ItemsManagerEvents.ManagerStateUpdated(newState));

            // Оновлюємо статистику
            updateStatistics(newState);

            // Повідомляємо про успішне збереження
            publishEvent(new ItemsManagerEvents.ItemSaved(newItem, true));

            // Валідуємо стан
            validateManagerState(newState);

            log.info("Додано предмет: {} до замовлення: {}",
                    newItem.getName(), wizardData.getDraftOrder().getReceiptNumber());

            return newState;

        } catch (Exception ex) {
            log.error("Помилка додавання предмета: {}", ex.getMessage(), ex);
            publishEvent(new ItemsManagerEvents.ManagerError(
                    "Помилка додавання предмета: " + ex.getMessage(),
                    ex,
                    "add_item"
            ));
            return currentState;
        }
    }

    /**
     * Обробляє оновлення існуючого предмета.
     */
    public ItemsManagerState updateItem(ItemsManagerState currentState, OrderItemDTO updatedItem, OrderItemDTO previousItem) {
        log.debug("Оновлення предмета: {}", updatedItem.getName());

        try {
            publishEvent(new ItemsManagerEvents.ItemUpdated(updatedItem, previousItem));

            // Оновлюємо в локальному списку
            var items = wizardData.getItems();
            for (int i = 0; i < items.size(); i++) {
                if (isSameItem(items.get(i), previousItem)) {
                    items.set(i, updatedItem);
                    break;
                }
            }

            // Оновлюємо стан
            ItemsManagerState newState = currentState.withUpdatedItem(updatedItem);
            publishEvent(new ItemsManagerEvents.ManagerStateUpdated(newState));

            // Оновлюємо статистику
            updateStatistics(newState);

            // Повідомляємо про успішне збереження
            publishEvent(new ItemsManagerEvents.ItemSaved(updatedItem, false));

            // Валідуємо стан
            validateManagerState(newState);

            log.info("Оновлено предмет: {} у замовленні: {}",
                    updatedItem.getName(), wizardData.getDraftOrder().getReceiptNumber());

            return newState;

        } catch (Exception ex) {
            log.error("Помилка оновлення предмета: {}", ex.getMessage(), ex);
            publishEvent(new ItemsManagerEvents.ManagerError(
                    "Помилка оновлення предмета: " + ex.getMessage(),
                    ex,
                    "update_item"
            ));
            return currentState;
        }
    }

    /**
     * Обробляє запит на видалення предмета.
     */
    public void requestItemDeletion(OrderItemDTO item) {
        log.debug("Запит на видалення предмета: {}", item.getName());
        publishEvent(new ItemsManagerEvents.ItemDeletionRequested(item));
    }

    /**
     * Обробляє підтверджене видалення предмета.
     */
    public ItemsManagerState deleteItem(ItemsManagerState currentState, OrderItemDTO itemToDelete) {
        log.debug("Видалення предмета: {}", itemToDelete.getName());

        try {
            publishEvent(new ItemsManagerEvents.ItemDeletionConfirmed(itemToDelete));

            // Видаляємо з бази даних якщо потрібно
            if (wizardData.getDraftOrder().getId() != null && itemToDelete.getId() != null) {
                orderItemService.deleteOrderItem(wizardData.getDraftOrder().getId(), itemToDelete.getId());
            }

            // Видаляємо з локального списку
            wizardData.getItems().removeIf(item -> isSameItem(item, itemToDelete));

            publishEvent(new ItemsManagerEvents.ItemDeleted(itemToDelete));

            // Оновлюємо стан
            ItemsManagerState newState = currentState.withRemovedItem(itemToDelete);
            publishEvent(new ItemsManagerEvents.ManagerStateUpdated(newState));

            // Оновлюємо статистику
            updateStatistics(newState);

            // Валідуємо стан
            validateManagerState(newState);

            log.info("Видалено предмет: {} з замовлення: {}",
                    itemToDelete.getName(), wizardData.getDraftOrder().getReceiptNumber());

            return newState;

        } catch (Exception ex) {
            log.error("Помилка видалення предмета: {}", ex.getMessage(), ex);
            publishEvent(new ItemsManagerEvents.ManagerError(
                    "Помилка видалення предмета: " + ex.getMessage(),
                    ex,
                    "delete_item"
            ));
            return currentState;
        }
    }

    /**
     * Обробляє запит на редагування предмета.
     */
    public void requestItemEdit(OrderItemDTO item) {
        log.debug("Запит на редагування предмета: {}", item.getName());
        publishEvent(new ItemsManagerEvents.ItemEditRequested(item));
    }

    /**
     * Обробляє запит на додавання нового предмета.
     */
    public void requestAddNewItem() {
        log.debug("Запит на додавання нового предмета");
        publishEvent(new ItemsManagerEvents.AddNewItemRequested());
    }

    /**
     * Обробляє запит на перехід до наступного етапу.
     */
    public void requestContinueToNextStep(ItemsManagerState currentState) {
        log.debug("Запит на перехід до наступного етапу");

        publishEvent(new ItemsManagerEvents.ContinueToNextStepRequested(currentState));

        // Перевіряємо готовність
        boolean isReady = currentState.isReadyForNext();
        String buttonText = currentState.getContinueButtonText();

        log.debug("🔍 ДЕТАЛЬНА ІНФОРМАЦІЯ ВАЛІДАЦІЇ:");
        log.debug("   - isReady: {}", isReady);
        log.debug("   - hasItems: {}", currentState.isHasItems());
        log.debug("   - items.size(): {}", currentState.getItems().size());
        log.debug("   - buttonText: {}", buttonText);

        // ВИПРАВЛЕННЯ: Перевіряємо що список предметів насправді порожній
        if (!isReady && currentState.getItems().isEmpty()) {
            log.warn("⚠️ Показуємо помилку валідації - список предметів порожній");
            publishEvent(new ItemsManagerEvents.ManagerValidationCompleted(
                    false,
                    List.of("Додайте хоча б один предмет до замовлення"),
                    false
            ));
        }

        publishEvent(new ItemsManagerEvents.ReadyToContinue(
                isReady,
                buttonText,
                currentState.getItems()
        ));
    }

    /**
     * Валідує поточний стан менеджера.
     */
    public ItemsManagerState validateManagerState(ItemsManagerState currentState) {
        log.debug("Валідація стану менеджера предметів");

        try {
            publishEvent(new ItemsManagerEvents.ManagerValidationRequested(currentState));

            // ВИПРАВЛЕННЯ: Валідація відбувається автоматично в domain model,
            // але не показуємо помилки одразу
            // publishEvent(new ItemsManagerEvents.ManagerValidationCompleted(
            //         currentState.isValid(),
            //         currentState.getValidationMessages(),
            //         currentState.isReadyForNext()
            // ));

            // Оновлюємо стан UI без показу валідаційних помилок
            updateUIState(currentState);

            return currentState;

        } catch (Exception ex) {
            log.error("Помилка валідації стану менеджера: {}", ex.getMessage(), ex);
            publishEvent(new ItemsManagerEvents.ManagerError(
                    "Помилка валідації: " + ex.getMessage(),
                    ex,
                    "validation"
            ));
            return currentState;
        }
    }

    /**
     * Оновлює статистику менеджера.
     */
    private void updateStatistics(ItemsManagerState state) {
        publishEvent(new ItemsManagerEvents.StatisticsUpdated(
                state.getItemsCount(),
                state.getTotalCost(),
                state.getStatusMessage()
        ));

        publishEvent(new ItemsManagerEvents.TotalCostUpdated(
                state.getTotalCost(),
                state.getTotalCostFormatted(),
                state.getItemsCount()
        ));
    }

    /**
     * Оновлює стан UI компонентів.
     */
    private void updateUIState(ItemsManagerState state) {
        publishEvent(new ItemsManagerEvents.UIStateChanged(
                !state.isLoading(), // можна додавати предмети якщо не завантажуємо
                state.isReadyForNext(),
                state.isLoading(),
                state.getStatusMessage()
        ));
    }

    /**
     * Перевіряє чи це той самий предмет.
     */
    private boolean isSameItem(OrderItemDTO item1, OrderItemDTO item2) {
        if (item1.getId() != null && item2.getId() != null) {
            return item1.getId().equals(item2.getId());
        }

        // Порівнюємо за ключовими характеристиками
        return item1.getName().equals(item2.getName()) &&
               item1.getCategory().equals(item2.getCategory()) &&
               java.util.Objects.equals(item1.getMaterial(), item2.getMaterial()) &&
               java.util.Objects.equals(item1.getColor(), item2.getColor());
    }

    /**
     * Публікує подію, якщо є обробник.
     */
    private void publishEvent(ItemsManagerEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }
}
