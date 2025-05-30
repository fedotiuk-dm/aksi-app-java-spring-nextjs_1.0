package com.aksi.ui.wizard.step2.substeps.item_info;

import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.ui.wizard.step2.substeps.item_info.application.BasicInfoManagementService;
import com.aksi.ui.wizard.step2.substeps.item_info.components.CategorySelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_info.components.ItemSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_info.components.QuantityAndPriceComponent;
import com.aksi.ui.wizard.step2.substeps.item_info.domain.ItemBasicInfoState;
import com.aksi.ui.wizard.step2.substeps.item_info.events.BasicInfoEvents;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Рефакторингований View для основної інформації про предмет.
 * Координує роботу між Domain, Application та UI компонентами.
 * Дотримується принципів DDD + SOLID з event-driven архітектурою.
 */
@Slf4j
public class ItemBasicInfoView extends VerticalLayout {

    // Services
    private final BasicInfoManagementService basicInfoService;
    private final Consumer<OrderItemDTO> onNext;
    private final Runnable onCancel;

    // UI Components
    private CategorySelectionComponent categorySelection;
    private ItemSelectionComponent itemSelection;
    private QuantityAndPriceComponent quantityAndPrice;

    private Button nextButton;
    private Button cancelButton;

    // State
    private ItemBasicInfoState currentState;
    private OrderItemDTO currentItem;

    public ItemBasicInfoView(
            ServiceCategoryService serviceCategoryService,
            PriceListService priceListService,
            Consumer<OrderItemDTO> onNext,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        this.basicInfoService = new BasicInfoManagementService(serviceCategoryService, priceListService);
        this.onNext = onNext;
        this.onCancel = onCancel;
        this.currentItem = existingItem != null ? existingItem : createNewItem();

        initializeComponents();
        setupEventHandlers();
        initializeData();

        log.info("ItemBasicInfoView ініціалізовано");
    }

    private void initializeComponents() {
        initializeLayout();
        createHeaderSection();
        createFormComponents();
        createButtonsSection();
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
    }

    private void createHeaderSection() {
        H3 title = new H3("Основна інформація про предмет");
        title.getStyle().set("margin-top", "0");
        add(title);
    }

    private void createFormComponents() {
        // Форма з responsive layout
        FormLayout formLayout = new FormLayout();
        formLayout.setResponsiveSteps(
                new FormLayout.ResponsiveStep("0", 1),
                new FormLayout.ResponsiveStep("600px", 2)
        );

        // Створюємо UI компоненти
        categorySelection = new CategorySelectionComponent();
        itemSelection = new ItemSelectionComponent();
        quantityAndPrice = new QuantityAndPriceComponent();

        // Додаємо до форми
        formLayout.add(categorySelection, itemSelection);
        formLayout.add(quantityAndPrice);

        add(formLayout);
    }

    private void createButtonsSection() {
        HorizontalLayout buttonsLayout = new HorizontalLayout();
        buttonsLayout.setJustifyContentMode(JustifyContentMode.END);
        buttonsLayout.setSpacing(true);

        cancelButton = new Button("Скасувати");
        cancelButton.addClickListener(e -> handleCancel());

        nextButton = new Button("Далі до характеристик");
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextButton.setEnabled(false);
        nextButton.addClickListener(e -> handleNext());

        buttonsLayout.add(cancelButton, nextButton);
        add(buttonsLayout);
    }

    private void setupEventHandlers() {
        // Event handler для Basic Info Management Service
        basicInfoService.setEventHandler(this::handleBasicInfoEvent);

        // UI Component event handlers
        categorySelection.setOnCategorySelected(this::handleCategoryChange);
        itemSelection.setOnItemSelected(this::handleItemChange);
        quantityAndPrice.setOnQuantityChanged(this::handleQuantityChange);
    }

    private void initializeData() {
        currentState = basicInfoService.initializeBasicInfo(currentItem);
    }

    /**
     * Централізований обробник подій через pattern matching.
     */
    private void handleBasicInfoEvent(BasicInfoEvents event) {
        log.debug("Обробка події: {}", event.getClass().getSimpleName());

        switch (event) {
            case BasicInfoEvents.CategoriesLoaded loaded -> handleCategoriesLoaded(loaded);
            case BasicInfoEvents.ItemsLoaded itemsLoaded -> handleItemsLoaded(itemsLoaded);
            case BasicInfoEvents.BasicInfoStateUpdated updated -> handleStateUpdated(updated);
            case BasicInfoEvents.BasicInfoFailed failed -> handleBasicInfoFailed(failed);
            case BasicInfoEvents.UIStateChanged uiState -> handleUIStateChanged(uiState);
            case BasicInfoEvents.PriceInfoUpdated priceInfo -> handlePriceInfoUpdated(priceInfo);
            case BasicInfoEvents.BasicInfoValidationCompleted validation -> handleValidationCompleted(validation);
            case BasicInfoEvents.ReadyForNext ready -> handleReadyForNext(ready);
            case BasicInfoEvents.BasicInfoInitialized initialized -> handleBasicInfoInitialized(initialized);
            case BasicInfoEvents.ItemSelectionCleared cleared -> handleItemSelectionCleared();
            default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
        }
    }

    private void handleCategoriesLoaded(BasicInfoEvents.CategoriesLoaded loaded) {
        log.debug("Завантажено {} категорій", loaded.categories().size());
        categorySelection.loadCategories(loaded.categories());
    }

    private void handleItemsLoaded(BasicInfoEvents.ItemsLoaded loaded) {
        log.debug("Завантажено {} предметів для категорії {}", loaded.items().size(), loaded.categoryId());
        itemSelection.loadItems(loaded.items());
    }

    private void handleStateUpdated(BasicInfoEvents.BasicInfoStateUpdated updated) {
        currentState = updated.basicInfoState();
        updateComponentsFromState();
    }

    private void handleBasicInfoFailed(BasicInfoEvents.BasicInfoFailed failed) {
        log.error("Помилка основної інформації: {}", failed.errorMessage());
        showErrorNotification(failed.errorMessage());
    }

    private void handleUIStateChanged(BasicInfoEvents.UIStateChanged uiState) {
        itemSelection.setSelectionEnabled(uiState.itemSelectionEnabled());
        quantityAndPrice.setEnabled(uiState.quantityEnabled());
        nextButton.setEnabled(uiState.nextButtonEnabled());
    }

    private void handlePriceInfoUpdated(BasicInfoEvents.PriceInfoUpdated priceInfo) {
        quantityAndPrice.updatePriceInfo(
                currentState != null ? currentState.getUnitOfMeasure() : null,
                priceInfo.formattedUnitPrice(),
                priceInfo.formattedTotalPrice()
        );
    }

    private void handleValidationCompleted(BasicInfoEvents.BasicInfoValidationCompleted validation) {
        updateComponentsValidation(validation.isValid(), validation.validationErrors());
    }

    private void handleReadyForNext(BasicInfoEvents.ReadyForNext ready) {
        nextButton.setEnabled(ready.isReadyToNavigate());
    }

    private void handleBasicInfoInitialized(BasicInfoEvents.BasicInfoInitialized initialized) {
        currentState = initialized.initialState();
    }

    private void handleItemSelectionCleared() {
        itemSelection.clearSelection();
        quantityAndPrice.clearPriceInfo();
    }

    private void handleCategoryChange(String categoryId, String categoryName) {
        log.debug("Зміна категорії: {} - {}", categoryId, categoryName);
        if (categoryId != null && categoryName != null) {
            currentState = basicInfoService.selectCategory(currentState, categoryId, categoryName);
        }
    }

    private void handleItemChange(String itemId, String itemName, String unitOfMeasure, java.math.BigDecimal unitPrice) {
        log.debug("Зміна предмета: {} - {}", itemId, itemName);
        if (itemId != null && itemName != null) {
            currentState = basicInfoService.selectItem(currentState, itemId, itemName, unitOfMeasure, unitPrice);
        }
    }

    private void handleQuantityChange(Integer quantity) {
        log.debug("Зміна кількості: {}", quantity);
        if (quantity != null && quantity > 0) {
            currentState = basicInfoService.changeQuantity(currentState, quantity);
        }
    }

    private void handleCancel() {
        log.debug("Скасування введення основної інформації");
        onCancel.run();
    }

    private void handleNext() {
        log.debug("Перехід до наступного етапу");

        try {
            // Валідуємо поточний стан
            currentState = basicInfoService.validateBasicInfo(currentState);

            if (!currentState.isReadyForNext()) {
                showValidationErrors(currentState.getValidationErrors());
                return;
            }

            // Застосовуємо основну інформацію до предмета
            applyBasicInfoToItem();

            // Переходимо далі
            onNext.accept(currentItem);

        } catch (Exception ex) {
            log.error("Помилка переходу до наступного етапу: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка збереження: " + ex.getMessage());
        }
    }

    private void applyBasicInfoToItem() {
        currentItem = basicInfoService.applyBasicInfoToItem(currentItem, currentState);
    }

    private void updateComponentsFromState() {
        if (currentState == null) return;

        // Оновлюємо компоненти відповідно до стану
        categorySelection.setSelectedCategory(
                currentState.getSelectedCategoryId(),
                currentState.getSelectedCategoryName()
        );

        itemSelection.setSelectedItem(
                currentState.getSelectedItemId(),
                currentState.getSelectedItemName()
        );

        quantityAndPrice.setQuantity(currentState.getQuantity());
    }

    private void updateComponentsValidation(boolean isValid, java.util.List<String> errors) {
        // Встановлюємо валідність компонентів
        categorySelection.setInvalid(!isValid && currentState.getSelectedCategoryId() == null);
        itemSelection.setInvalid(!isValid && currentState.getSelectedItemId() == null);
        quantityAndPrice.setInvalid(!isValid && !quantityAndPrice.isQuantityValid());

        if (!isValid) {
            showValidationErrors(errors);
        }
    }

    private void showValidationErrors(java.util.List<String> errors) {
        String errorMessage = String.join("; ", errors);
        Notification.show("Помилки валідації: " + errorMessage, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    private void showErrorNotification(String message) {
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    private OrderItemDTO createNewItem() {
        return OrderItemDTO.builder()
                .quantity(1)
                .unitPrice(java.math.BigDecimal.ZERO)
                .totalPrice(java.math.BigDecimal.ZERO)
                .build();
    }
}
