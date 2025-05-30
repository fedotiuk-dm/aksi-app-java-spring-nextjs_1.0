package com.aksi.ui.wizard.step2.substeps.item_characteristics;

import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.application.CharacteristicsManagementService;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.components.ColorSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.components.FillerSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.components.MaterialSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.components.WearDegreeSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.domain.ItemCharacteristicsState;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.events.CharacteristicsEvents;
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
 * Підетап 2.2: Характеристики предмета (рефакторинг за принципами DDD + SOLID).
 * Координатор для управління характеристиками предмета з використанням компонентів.
 */
@Slf4j
public class ItemCharacteristicsView extends VerticalLayout {

    // Залежності через конструктор (DI)
    private final CharacteristicsManagementService characteristicsService;
    private final Consumer<OrderItemDTO> onNext;
    private final Consumer<OrderItemDTO> onPrevious;
    private final Runnable onCancel;

    // UI компоненти (FSD outside)
    private MaterialSelectionComponent materialSelection;
    private ColorSelectionComponent colorSelection;
    private FillerSelectionComponent fillerSelection;
    private WearDegreeSelectionComponent wearDegreeSelection;

    private Button previousButton;
    private Button nextButton;
    private Button cancelButton;

    // Domain state (DDD inside)
    private ItemCharacteristicsState currentState;
    private OrderItemDTO currentItem;

    public ItemCharacteristicsView(
            ItemCharacteristicsService infrastructureService,
            Consumer<OrderItemDTO> onNext,
            Consumer<OrderItemDTO> onPrevious,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        this.characteristicsService = new CharacteristicsManagementService(infrastructureService);
        this.onNext = onNext;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;
        this.currentItem = existingItem != null ? existingItem : OrderItemDTO.builder().build();

        initializeComponents();
        setupEventHandlers();
        initializeData();

        log.info("ItemCharacteristicsView ініціалізовано для предмета: {}", currentItem.getName());
    }

    /**
     * Ініціалізує компоненти інтерфейсу.
     */
    private void initializeComponents() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);

        // Створюємо компоненти
        createHeaderSection();
        createFormComponents();
        createButtonsSection();
    }

    /**
     * Створює секцію заголовку.
     */
    private void createHeaderSection() {
        H3 title = new H3("Характеристики предмета");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-l)");
        add(title);
    }

    /**
     * Створює компоненти форми.
     */
    private void createFormComponents() {
        FormLayout formLayout = new FormLayout();
        formLayout.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("768px", 2)
        );

        // Створюємо модульні компоненти
        materialSelection = new MaterialSelectionComponent();
        colorSelection = new ColorSelectionComponent();
        fillerSelection = new FillerSelectionComponent();
        wearDegreeSelection = new WearDegreeSelectionComponent();

        // Додаємо компоненти до форми
        formLayout.add(materialSelection, colorSelection);
        formLayout.add(fillerSelection, wearDegreeSelection);

        add(formLayout);
    }

    /**
     * Створює секцію кнопок.
     */
    private void createButtonsSection() {
        HorizontalLayout buttonsLayout = new HorizontalLayout();
        buttonsLayout.setJustifyContentMode(JustifyContentMode.BETWEEN);
        buttonsLayout.setWidthFull();

        // Ліва частина - Скасувати
        cancelButton = new Button("Скасувати");
        cancelButton.addClickListener(e -> handleCancel());

        // Права частина - Назад та Далі
        previousButton = new Button("Назад");
        previousButton.addClickListener(e -> handlePrevious());

        nextButton = new Button("Далі до дефектів");
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextButton.addClickListener(e -> handleNext());

        HorizontalLayout rightButtons = new HorizontalLayout(previousButton, nextButton);
        rightButtons.setSpacing(true);

        buttonsLayout.add(cancelButton, rightButtons);
        add(buttonsLayout);
    }

    /**
     * Налаштовує обробники подій.
     */
    private void setupEventHandlers() {
        // Встановлюємо обробник подій для application service
        characteristicsService.setEventHandler(this::handleCharacteristicsEvent);

        // Обробники змін в компонентах
        materialSelection.setOnMaterialChanged(this::handleMaterialChange);
        colorSelection.setOnColorChanged(this::handleColorChange);
        fillerSelection.setOnFillerChanged(this::handleFillerChange);
        wearDegreeSelection.setOnWearDegreeChanged(this::handleWearDegreeChange);
    }

    /**
     * Ініціалізує дані.
     */
    private void initializeData() {
        try {
            // Ініціалізуємо стан характеристик
            currentState = characteristicsService.initializeCharacteristics(currentItem);

            // Якщо предмет уже має характеристики, завантажуємо їх
            if (hasExistingCharacteristics()) {
                currentState = characteristicsService.loadExistingCharacteristics(currentItem, currentState);
                updateComponentsFromState();
            }

        } catch (Exception ex) {
            log.error("Помилка ініціалізації характеристик: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка ініціалізації характеристик");
        }
    }

    /**
     * Обробляє події з характеристик.
     */
    private void handleCharacteristicsEvent(CharacteristicsEvents event) {
        log.debug("Обробка події: {}", event.getClass().getSimpleName());

        switch (event) {
            case CharacteristicsEvents.CharacteristicsLoaded loaded -> handleCharacteristicsLoaded(loaded);
            case CharacteristicsEvents.CharacteristicsStateUpdated updated -> handleStateUpdated(updated);
            case CharacteristicsEvents.CharacteristicsFailed failed -> handleCharacteristicsFailed(failed);
            case CharacteristicsEvents.SectionVisibilityChanged visibility -> handleVisibilityChanged(visibility);
            case CharacteristicsEvents.CharacteristicsValidationCompleted validation -> handleValidationCompleted(validation);
            default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
        }
    }

    /**
     * Обробляє завантаження характеристик.
     */
    private void handleCharacteristicsLoaded(CharacteristicsEvents.CharacteristicsLoaded loaded) {
        materialSelection.loadMaterials(loaded.materials());
        colorSelection.loadColors(loaded.colors());
        fillerSelection.loadFillerTypes(loaded.fillerTypes());
        wearDegreeSelection.loadWearDegrees(loaded.wearDegrees());

        log.debug("Завантажено характеристики: {} матеріалів, {} кольорів",
                 loaded.materials().size(), loaded.colors().size());
    }

    /**
     * Обробляє оновлення стану.
     */
    private void handleStateUpdated(CharacteristicsEvents.CharacteristicsStateUpdated updated) {
        currentState = updated.characteristicsState();
        updateNavigationButtons();
    }

    /**
     * Обробляє помилки.
     */
    private void handleCharacteristicsFailed(CharacteristicsEvents.CharacteristicsFailed failed) {
        log.error("Помилка характеристик: {}", failed.errorMessage(), failed.cause());
        showErrorNotification(failed.errorMessage());
    }

    /**
     * Обробляє зміни видимості секцій.
     */
    private void handleVisibilityChanged(CharacteristicsEvents.SectionVisibilityChanged visibility) {
        fillerSelection.setVisible(visibility.fillerSectionVisible());

        if (visibility.fillerSectionVisible()) {
            fillerSelection.setRequired(isFillerRequiredForCategory());
        }
    }

    /**
     * Обробляє завершення валідації.
     */
    private void handleValidationCompleted(CharacteristicsEvents.CharacteristicsValidationCompleted validation) {
        updateComponentsValidation(validation.isValid(), validation.validationErrors());
    }

    /**
     * Обробляє зміну матеріалу.
     */
    private void handleMaterialChange(String material) {
        updateCharacteristics();
    }

    /**
     * Обробляє зміну кольору.
     */
    private void handleColorChange(String color, String customColor) {
        updateCharacteristics();
    }

    /**
     * Обробляє зміну наповнювача.
     */
    private void handleFillerChange(FillerSelectionComponent.FillerSelection fillerSelection) {
        updateCharacteristics();
    }

    /**
     * Обробляє зміну ступеня зносу.
     */
    private void handleWearDegreeChange(String wearDegree) {
        updateCharacteristics();
    }

    /**
     * Оновлює характеристики після змін в компонентах.
     */
    private void updateCharacteristics() {
        try {
            var fillerData = fillerSelection.getFillerSelection();

            currentState = characteristicsService.updateCharacteristics(
                currentState,
                materialSelection.getSelectedMaterial(),
                colorSelection.getSelectedColor(),
                colorSelection.getCustomColor(),
                fillerData.getFillerType(),
                fillerData.getCustomFillerType(),
                fillerData.getFillerCompressed(),
                wearDegreeSelection.getSelectedWearDegree()
            );

        } catch (Exception ex) {
            log.error("Помилка оновлення характеристик: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка оновлення характеристик");
        }
    }

    /**
     * Обробляє скасування.
     */
    private void handleCancel() {
        onCancel.run();
    }

    /**
     * Обробляє повернення до попереднього етапу.
     */
    private void handlePrevious() {
        try {
            // Зберігаємо поточні дані незалежно від валідності
            applyCharacteristicsToItem();
            onPrevious.accept(currentItem);

            log.info("Повернення до попереднього етапу для предмета: {}", currentItem.getName());

        } catch (Exception ex) {
            log.error("Помилка при поверненні назад: {}", ex.getMessage(), ex);
            // При поверненні назад завжди дозволяємо перехід
            onPrevious.accept(currentItem);
        }
    }

    /**
     * Обробляє перехід до наступного етапу.
     */
    private void handleNext() {
        try {
            // Валідуємо характеристики
            currentState = characteristicsService.validateCharacteristics(currentState);

            if (!currentState.isValid()) {
                showValidationErrors(currentState.getValidationErrors());
                return;
            }

            // Застосовуємо характеристики до предмета
            applyCharacteristicsToItem();
            onNext.accept(currentItem);

            log.info("Характеристики предмета збережено для: {} (матеріал: {}, колір: {})",
                    currentItem.getName(), currentItem.getMaterial(), currentItem.getColor());

        } catch (Exception ex) {
            log.error("Помилка валідації або збереження: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка збереження характеристик");
        }
    }

    /**
     * Застосовує поточні характеристики до предмета.
     */
    private void applyCharacteristicsToItem() {
        characteristicsService.applyCharacteristicsToItem(currentItem, currentState);
    }

    /**
     * Оновлює компоненти на основі поточного стану.
     */
    private void updateComponentsFromState() {
        materialSelection.setSelectedMaterial(currentState.getMaterial());
        colorSelection.setSelectedColor(currentState.getColor(), currentState.getCustomColor());
        fillerSelection.setSelectedFiller(
            currentState.getFillerType(),
            currentState.getCustomFillerType(),
            currentState.getFillerCompressed()
        );
        wearDegreeSelection.setSelectedWearDegree(currentState.getWearDegree());
    }

    /**
     * Оновлює валідацію компонентів.
     */
    private void updateComponentsValidation(boolean isValid, java.util.List<String> errors) {
        // Скидаємо попередні помилки
        materialSelection.setInvalid(false);
        colorSelection.setInvalid(false);
        fillerSelection.setInvalid(false);

        if (!isValid) {
            for (String error : errors) {
                if (error.contains("Матеріал")) {
                    materialSelection.setInvalid(true);
                } else if (error.contains("колір")) {
                    colorSelection.setInvalid(true);
                } else if (error.contains("наповнювач")) {
                    fillerSelection.setInvalid(true);
                }
            }
        }
    }

    /**
     * Оновлює стан кнопок навігації.
     */
    private void updateNavigationButtons() {
        boolean hasValidData = currentState != null && currentState.hasRequiredFields();
        nextButton.setEnabled(hasValidData);
    }

    /**
     * Перевіряє чи є існуючі характеристики.
     */
    private boolean hasExistingCharacteristics() {
        return currentItem.getMaterial() != null || currentItem.getColor() != null;
    }

    /**
     * Перевіряє чи наповнювач обов'язковий для категорії.
     */
    private boolean isFillerRequiredForCategory() {
        String category = currentItem.getCategory();
        if (category == null) return false;

        String lowerCategory = category.toLowerCase();
        return lowerCategory.contains("дублянки") || lowerCategory.contains("куртка");
    }

    /**
     * Показує помилки валідації.
     */
    private void showValidationErrors(java.util.List<String> errors) {
        String message = "Будь ласка, виправте помилки:\n" + String.join("\n", errors);
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    /**
     * Показує помилку.
     */
    private void showErrorNotification(String message) {
        Notification.show(message, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }
}
