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

    // Захист від рекурсії
    private boolean isInitializing = false;

    public ItemCharacteristicsView(
            ItemCharacteristicsService infrastructureService,
            Consumer<OrderItemDTO> onNext,
            Consumer<OrderItemDTO> onPrevious,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        log.info("🚀 ПОЧАТОК СТВОРЕННЯ ItemCharacteristicsView");
        log.info("🔍 ПАРАМЕТРИ: infrastructureService={}, existingItem={}",
            infrastructureService != null ? "not null" : "null",
            existingItem != null ? existingItem.toString() : "null");

        this.characteristicsService = new CharacteristicsManagementService(infrastructureService);
        this.onNext = onNext;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;
        this.currentItem = existingItem != null ? existingItem : OrderItemDTO.builder().build();

        log.info("📋 СТВОРЕНО СЕРВІСИ: characteristicsService={}, currentItem={}",
            characteristicsService != null ? "not null" : "null",
            currentItem != null ? currentItem.toString() : "null");

        try {
            initializeComponents();
            log.info("✅ КОМПОНЕНТИ ІНІЦІАЛІЗОВАНО");

            setupEventHandlers();
            log.info("✅ ОБРОБНИКИ ПОДІЙ НАЛАШТОВАНО");

            initializeData();
            log.info("✅ ДАНІ ІНІЦІАЛІЗОВАНО");

        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА ПРИ ІНІЦІАЛІЗАЦІЇ: {}", ex.getMessage(), ex);
            throw ex;
        }

        log.info("🎉 ItemCharacteristicsView ПОВНІСТЮ ІНІЦІАЛІЗОВАНО для предмета: {}", currentItem.getName());
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
        // ВИПРАВЛЕННЯ: кнопка має бути неактивна спочатку, доки не вибрано необхідні характеристики
        nextButton.setEnabled(false);

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
            log.info("🔄 ПОЧАТОК ІНІЦІАЛІЗАЦІЇ ДАНИХ");
            isInitializing = true; // Встановлюємо флаг ініціалізації

            log.info("🔍 ВИКЛИКАЄМО characteristicsService.initializeCharacteristics з item: {}",
                currentItem != null ? currentItem.toString() : "null");

            // Ініціалізуємо стан характеристик
            currentState = characteristicsService.initializeCharacteristics(currentItem);
            log.info("✅ СТАН ІНІЦІАЛІЗОВАНО: {}", currentState != null ? "not null" : "null");

            // Якщо предмет уже має характеристики, завантажуємо їх
            if (hasExistingCharacteristics()) {
                log.info("🔄 ЗАВАНТАЖУЄМО ІСНУЮЧІ ХАРАКТЕРИСТИКИ");
                currentState = characteristicsService.loadExistingCharacteristics(currentItem, currentState);
                updateComponentsFromState();
                log.info("✅ ІСНУЮЧІ ХАРАКТЕРИСТИКИ ЗАВАНТАЖЕНО");
            } else {
                log.info("ℹ️ ІСНУЮЧИХ ХАРАКТЕРИСТИК НЕМАЄ");
            }

        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА ІНІЦІАЛІЗАЦІЇ ХАРАКТЕРИСТИК: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка ініціалізації характеристик");
        } finally {
            isInitializing = false; // Завжди скидаємо флаг
            log.info("✅ ІНІЦІАЛІЗАЦІЯ ДАНИХ ЗАВЕРШЕНА, isInitializing={}", isInitializing);

            // ВИПРАВЛЕННЯ: після завершення ініціалізації оновлюємо стан навігаційних кнопок
            updateNavigationButtons();
        }
    }

    /**
     * Обробляє події з характеристик.
     */
    private void handleCharacteristicsEvent(CharacteristicsEvents event) {
        try {
            log.debug("🔄 Отримано подію характеристик: {}", event.getClass().getSimpleName());

            // ВИПРАВЛЕННЯ: дозволяємо CharacteristicsLoaded навіть під час ініціалізації
            if (isInitializing && !(event instanceof CharacteristicsEvents.CharacteristicsLoaded)) {
                log.debug("🔄 ПРОПУСК обробки події {} - йде ініціалізація", event.getClass().getSimpleName());
                return;
            }

            // Оновлюємо компоненти інтерфейсу в залежності від типу події
            switch (event) {
                case CharacteristicsEvents.CharacteristicsLoaded loaded -> {
                    log.debug("🔄 Оновлення опцій в інтерфейсі");
                    handleCharacteristicsLoaded(loaded);
                    if (!isInitializing) {
                        updateCharacteristics();
                    }
                }
                case CharacteristicsEvents.CharacteristicsStateUpdated updated -> {
                    log.debug("🔄 Стан оновлено");
                    handleStateUpdated(updated);
                }
                case CharacteristicsEvents.CharacteristicsChanged changed -> {
                    log.debug("🔄 Характеристики змінено");
                    // ВИПРАВЛЕННЯ: НЕ оновлюємо навігацію тут, бо currentState ще старий
                    // Основна обробка буде в CharacteristicsStateUpdated з новим станом
                }
                case CharacteristicsEvents.CharacteristicsFailed failed -> {
                    log.debug("🔄 Помилка характеристик");
                    handleCharacteristicsFailed(failed);
                }
                case CharacteristicsEvents.SectionVisibilityChanged visibility -> {
                    log.debug("🔄 Зміна видимості");
                    handleVisibilityChanged(visibility);
                }
                case CharacteristicsEvents.CharacteristicsValidationCompleted validation -> {
                    log.debug("🔄 Валідація завершена");
                    handleValidationCompleted(validation);
                }
                default -> {
                    log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
                }
            }

        } catch (Exception ex) {
            log.error("Помилка обробки події характеристик: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка оновлення: " + ex.getMessage());
        }
    }

    /**
     * Обробляє завантаження характеристик.
     */
    private void handleCharacteristicsLoaded(CharacteristicsEvents.CharacteristicsLoaded loaded) {
        log.info("🔄 ЗАВАНТАЖЕННЯ ДАНИХ В UI: {} матеріалів, {} кольорів, {} наповнювачів, {} ступенів зносу",
            loaded.materials().size(), loaded.colors().size(),
            loaded.fillerTypes().size(), loaded.wearDegrees().size());

        // Передаємо дані в компоненти
        if (materialSelection != null) {
            materialSelection.loadMaterials(loaded.materials());
        }

        if (colorSelection != null) {
            colorSelection.loadColors(loaded.colors());
        }

        if (fillerSelection != null) {
            fillerSelection.loadFillerTypes(loaded.fillerTypes());
        }

        if (wearDegreeSelection != null) {
            wearDegreeSelection.loadWearDegrees(loaded.wearDegrees());
        }

        log.info("✅ ДАНІ ЗАВАНТАЖЕНО В UI КОМПОНЕНТИ");
    }

    /**
     * Обробляє оновлення стану.
     */
    private void handleStateUpdated(CharacteristicsEvents.CharacteristicsStateUpdated updated) {
        currentState = updated.characteristicsState();
        log.debug("🔄 Стан оновлено: {} матеріал, {} колір",
            currentState.getMaterial(), currentState.getColor());

        // ВИПРАВЛЕННЯ: завжди оновлюємо стан кнопок навігації після оновлення стану
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
            // ВИПРАВЛЕННЯ: захист від рекурсії
            if (isInitializing) {
                log.debug("🔄 ПРОПУСК updateCharacteristics - йде ініціалізація");
                return;
            }

            // ВИПРАВЛЕННЯ: перевірка на null currentState
            if (currentState == null) {
                log.warn("⚠️ ПОПЕРЕДЖЕННЯ: currentState is null, пропускаємо оновлення");
                return;
            }

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
            showErrorNotification("Помилка оновлення характеристик: " + ex.getMessage());
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
            log.info("🔄 ПОЧАТОК ПЕРЕХОДУ ДО НАСТУПНОГО ЕТАПУ");

            // Перевіряємо поточний стан
            if (currentState == null) {
                log.error("❌ currentState is NULL!");
                showErrorNotification("Помилка: стан характеристик не ініціалізовано");
                return;
            }

            // Валідуємо характеристики
            log.debug("🔍 ВАЛІДАЦІЯ характеристик...");
            currentState = characteristicsService.validateCharacteristics(currentState);

            if (!currentState.isValid()) {
                log.warn("⚠️ ВАЛІДАЦІЯ НЕ ПРОЙШЛА: {}", currentState.getValidationErrors());
                showValidationErrors(currentState.getValidationErrors());
                return;
            }

            // Застосовуємо характеристики до предмета
            log.debug("🔄 ЗАСТОСУВАННЯ характеристик до предмета...");
            applyCharacteristicsToItem();

            log.info("✅ Характеристики предмета збережено для: {} (матеріал: {}, колір: {})",
                    currentItem.getName(), currentItem.getMaterial(), currentItem.getColor());

            onNext.accept(currentItem);

        } catch (Exception ex) {
            log.error("❌ Помилка валідації або збереження: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка збереження характеристик: " + ex.getMessage());
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

        log.debug("🔄 Оновлення навігації: currentState={}, hasRequiredFields={}, матеріал={}, колір={}",
            currentState != null ? "not null" : "null",
            currentState != null ? currentState.hasRequiredFields() : "N/A",
            currentState != null ? currentState.getMaterial() : "null",
            currentState != null ? currentState.getColor() : "null");

        log.debug("🔄 Встановлюємо nextButton.enabled = {}", hasValidData);
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
