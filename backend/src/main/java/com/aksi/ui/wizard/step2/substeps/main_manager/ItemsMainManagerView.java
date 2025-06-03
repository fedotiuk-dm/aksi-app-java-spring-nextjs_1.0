package com.aksi.ui.wizard.step2.substeps.main_manager;

import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.order.OrderItemManagementService;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step2.substeps.main_manager.application.ItemsManagerService;
import com.aksi.ui.wizard.step2.substeps.main_manager.components.ActionsComponent;
import com.aksi.ui.wizard.step2.substeps.main_manager.components.ItemsGridComponent;
import com.aksi.ui.wizard.step2.substeps.main_manager.components.SummaryComponent;
import com.aksi.ui.wizard.step2.substeps.main_manager.domain.ItemsManagerState;
import com.aksi.ui.wizard.step2.substeps.main_manager.events.ItemsManagerEvents;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Рефакторований головний екран менеджера предметів (підетап 2.0).
 * Event-driven координатор з DDD + SOLID архітектурою.
 */
@Slf4j
public class ItemsMainManagerView extends VerticalLayout {

    // Application layer
    private final ItemsManagerService managerService;

    // UI компоненти (SRP)
    private ItemsGridComponent itemsGrid;
    private SummaryComponent summary;
    private ActionsComponent actions;

    // Callbacks до зовнішніх компонентів
    private final Consumer<OrderItemDTO> onAddItem;
    private final Consumer<OrderItemDTO> onEditItem;
    private final Runnable onContinueToNextStep;

    // Поточний стан домену
    private ItemsManagerState currentState;

    public ItemsMainManagerView(
            OrderItemManagementService orderItemService,
            OrderWizardData wizardData,
            Consumer<OrderItemDTO> onAddItem,
            Consumer<OrderItemDTO> onEditItem,
            Runnable onContinueToNextStep) {

        this.onAddItem = onAddItem;
        this.onEditItem = onEditItem;
        this.onContinueToNextStep = onContinueToNextStep;

        // Створюємо application service
        this.managerService = new ItemsManagerService(orderItemService, wizardData);

        initializeComponents();
        initializeLayout();
        setupEventHandlers();
        initializeData();

        log.info("ItemsMainManagerView ініціалізовано для замовлення: {}",
                wizardData.getDraftOrder().getReceiptNumber());
    }

    private void initializeComponents() {
        // UI компоненти
        itemsGrid = new ItemsGridComponent();
        summary = new SummaryComponent();
        actions = new ActionsComponent();
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);

        // Заголовок
        H3 title = new H3("Менеджер предметів замовлення");
        title.getStyle().set("margin-top", "0");

        add(title, itemsGrid, summary, actions);
    }

    private void setupEventHandlers() {
        // Встановлюємо обробник подій для application service
        managerService.setEventHandler(this::handleManagerEvent);

        // Налаштовуємо обробники UI компонентів
        itemsGrid.setOnEditItem(this::handleEditItemRequest);
        itemsGrid.setOnDeleteItem(this::handleDeleteItemRequest);

        actions.setOnAddItem(this::handleAddItemRequest);
        actions.setOnContinueToNext(this::handleContinueRequest);
    }

    private void initializeData() {
        // Ініціалізуємо менеджер предметів
        currentState = managerService.initializeManager();
    }

    /**
     * Централізований обробник подій з pattern matching.
     */
    private void handleManagerEvent(ItemsManagerEvents event) {
        log.debug("Обробка події: {}", event.getClass().getSimpleName());

        switch (event) {
            case ItemsManagerEvents.ManagerStateUpdated updated ->
                handleStateUpdated(updated);

            case ItemsManagerEvents.ItemsLoaded loaded ->
                handleItemsLoaded(loaded);

            case ItemsManagerEvents.ItemAdded added ->
                handleItemAdded(added);

            case ItemsManagerEvents.ItemUpdated updated ->
                handleItemUpdated(updated);

            case ItemsManagerEvents.ItemDeleted deleted ->
                handleItemDeleted(deleted);

            case ItemsManagerEvents.TotalCostUpdated costUpdated ->
                handleTotalCostUpdated(costUpdated);

            case ItemsManagerEvents.UIStateChanged uiState ->
                handleUIStateChanged(uiState);

            case ItemsManagerEvents.ManagerValidationCompleted validation ->
                handleValidationCompleted(validation);

            case ItemsManagerEvents.ReadyToContinue ready ->
                handleReadyToContinue(ready);

            case ItemsManagerEvents.ManagerError error ->
                handleManagerError(error);

            case ItemsManagerEvents.LoadingStarted loadingStarted ->
                handleLoadingStarted(loadingStarted);

            case ItemsManagerEvents.LoadingCompleted loadingCompleted ->
                handleLoadingCompleted(loadingCompleted);

            case ItemsManagerEvents.ItemSaved saved ->
                handleItemSaved(saved);

            case ItemsManagerEvents.StatisticsUpdated stats ->
                handleStatisticsUpdated(stats);

            default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
        }
    }

    private void handleStateUpdated(ItemsManagerEvents.ManagerStateUpdated updated) {
        currentState = updated.managerState();
        updateAllComponentsFromState();
    }

    private void handleItemsLoaded(ItemsManagerEvents.ItemsLoaded loaded) {
        log.debug("Завантажено {} предметів (з БД: {})",
                 loaded.items().size(), loaded.fromDatabase());
        showSuccessNotification(String.format("Завантажено %d предметів", loaded.items().size()));
    }

    private void handleItemAdded(ItemsManagerEvents.ItemAdded added) {
        log.info("Додано предмет: {}", added.addedItem().getName());
        showSuccessNotification("Предмет додано успішно");
    }

    private void handleItemUpdated(ItemsManagerEvents.ItemUpdated updated) {
        log.info("Оновлено предмет: {}", updated.updatedItem().getName());
        showSuccessNotification("Предмет оновлено успішно");
    }

    private void handleItemDeleted(ItemsManagerEvents.ItemDeleted deleted) {
        log.info("Видалено предмет: {}", deleted.deletedItem().getName());
        showSuccessNotification("Предмет видалено успішно");
    }

    private void handleTotalCostUpdated(ItemsManagerEvents.TotalCostUpdated costUpdated) {
        summary.updateTotalCost(costUpdated.totalCost(), costUpdated.formattedTotalCost());
    }

    private void handleUIStateChanged(ItemsManagerEvents.UIStateChanged uiState) {
        actions.setLoading(!uiState.canAddItems());
    }

    private void handleValidationCompleted(ItemsManagerEvents.ManagerValidationCompleted validation) {
        if (!validation.isValid()) {
            showValidationErrors(validation.validationMessages());
        }
    }

    private void handleReadyToContinue(ItemsManagerEvents.ReadyToContinue ready) {
        if (ready.isReady()) {
            actions.showContinueSuccess();
        }
    }

    private void handleManagerError(ItemsManagerEvents.ManagerError error) {
        log.error("Помилка менеджера [{}]: {}", error.operation(), error.errorMessage(), error.cause());
        showErrorNotification("Помилка: " + error.errorMessage());
        actions.showContinueError();
    }

    private void handleLoadingStarted(ItemsManagerEvents.LoadingStarted loadingStarted) {
        actions.setLoading(true);
        summary.showLoading(true);
    }

    private void handleLoadingCompleted(ItemsManagerEvents.LoadingCompleted loadingCompleted) {
        actions.setLoading(false);
        summary.showLoading(false);
    }

    private void handleItemSaved(ItemsManagerEvents.ItemSaved saved) {
        String message = saved.wasNewItem() ? "Новий предмет додано" : "Предмет оновлено";
        showSuccessNotification(message);
    }

    private void handleStatisticsUpdated(ItemsManagerEvents.StatisticsUpdated stats) {
        summary.updateItemsCount(stats.itemsCount());
        summary.updateStatus(stats.statusMessage());
    }

    private void handleEditItemRequest(OrderItemDTO item) {
        log.debug("Запит на редагування предмета: {}", item.getName());
        managerService.requestItemEdit(item);
        if (onEditItem != null) {
            onEditItem.accept(item);
        }
    }

    private void handleDeleteItemRequest(OrderItemDTO item) {
        log.debug("Запит на видалення предмета: {}", item.getName());
        managerService.requestItemDeletion(item);

        // Після підтвердження в компоненті викликається справжнє видалення
        currentState = managerService.deleteItem(currentState, item);
    }

    private void handleAddItemRequest() {
        log.debug("Запит на додавання нового предмета");
        managerService.requestAddNewItem();
        if (onAddItem != null) {
            onAddItem.accept(null);
        }
    }

    private void handleContinueRequest() {
        log.debug("Запит на продовження до наступного етапу");

        // ВИПРАВЛЕННЯ: Перезавантажуємо актуальний стан перед перевіркою
        log.info("🔄 Перезавантаження актуального стану перед переходом...");
        currentState = managerService.loadItems(currentState);

        managerService.requestContinueToNextStep(currentState);

        log.info("🔍 ДЕТАЛЬНА ІНФОРМАЦІЯ ПРО ПЕРЕХІД:");
        log.info("   - currentState.isReadyForNext(): {}", currentState.isReadyForNext());
        log.info("   - onContinueToNextStep != null: {}", onContinueToNextStep != null);
        log.info("   - currentState items: {}", currentState.getItems().size());

        if (currentState.isReadyForNext() && onContinueToNextStep != null) {
            log.info("✅ ВИКЛИКАЄМО callback onContinueToNextStep.run()");
            onContinueToNextStep.run();
            log.info("✅ callback onContinueToNextStep.run() ВИКОНАНО");
        } else {
            log.warn("❌ CALLBACK НЕ ВИКЛИКАЄТЬСЯ:");
            log.warn("   - isReadyForNext: {}", currentState.isReadyForNext());
            log.warn("   - callback існує: {}", onContinueToNextStep != null);
            log.warn("   - кількість предметів: {}", currentState.getItems().size());
        }
    }

    private void updateAllComponentsFromState() {
        if (currentState != null) {
            itemsGrid.updateFromState(currentState);
            summary.updateFromState(currentState);
            actions.updateFromState(currentState);
        }
    }

    private void showValidationErrors(java.util.List<String> errors) {
        if (!errors.isEmpty()) {
            String message = "Помилки валідації: " + String.join(", ", errors);
            showErrorNotification(message);
        }
    }

    private void showSuccessNotification(String message) {
        Notification.show(message, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    private void showErrorNotification(String message) {
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    /**
     * Публічні методи для зовнішньої інтеграції.
     */

    public void refreshView() {
        log.debug("Оновлення відображення менеджера предметів");
        currentState = managerService.loadItems(currentState);
    }

    public void addNewItem(OrderItemDTO newItem) {
        log.debug("Додавання нового предмета ззовні: {}", newItem.getName());
        currentState = managerService.addItem(currentState, newItem);
    }

    public void updateExistingItem(OrderItemDTO updatedItem, OrderItemDTO previousItem) {
        log.debug("Оновлення існуючого предмета ззовні: {}", updatedItem.getName());
        currentState = managerService.updateItem(currentState, updatedItem, previousItem);
    }

    public ItemsManagerState getCurrentState() {
        return currentState;
    }

    public boolean isReadyForNext() {
        return currentState != null && currentState.isReadyForNext();
    }
}
