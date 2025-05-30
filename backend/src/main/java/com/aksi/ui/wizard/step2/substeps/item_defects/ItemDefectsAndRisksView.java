package com.aksi.ui.wizard.step2.substeps.item_defects;

import java.util.Set;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.ui.wizard.step2.substeps.item_defects.application.DefectsManagementService;
import com.aksi.ui.wizard.step2.substeps.item_defects.components.DefectsAndRisksSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_defects.components.DefectsNotesComponent;
import com.aksi.ui.wizard.step2.substeps.item_defects.components.StainsSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.item_defects.domain.ItemDefectsState;
import com.aksi.ui.wizard.step2.substeps.item_defects.events.DefectsEvents;
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
 * Рефакторингований координатор для дефектів, плям та ризиків предмета.
 * Дотримується принципів DDD + SOLID та використовує event-driven архітектуру.
 */
@Slf4j
public class ItemDefectsAndRisksView extends VerticalLayout {

    // Dependencies (DIP)
    private final DefectsManagementService defectsService;
    private final Consumer<OrderItemDTO> onNext;
    private final Consumer<OrderItemDTO> onPrevious;
    private final Runnable onCancel;

    // UI Components (SRP)
    private StainsSelectionComponent stainsSelection;
    private DefectsAndRisksSelectionComponent defectsAndRisksSelection;
    private DefectsNotesComponent defectsNotes;

    private Button previousButton;
    private Button nextButton;
    private Button cancelButton;

    // State management
    private ItemDefectsState currentState;
    private OrderItemDTO currentItem;

    public ItemDefectsAndRisksView(
            ItemCharacteristicsService infrastructureService,
            Consumer<OrderItemDTO> onNext,
            Consumer<OrderItemDTO> onPrevious,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        this.defectsService = new DefectsManagementService(infrastructureService);
        this.onNext = onNext;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;
        this.currentItem = existingItem != null ? existingItem : OrderItemDTO.builder().build();

        initializeComponents();
        initializeData();

        log.info("ItemDefectsAndRisksView ініціалізовано для предмета: {}", currentItem.getName());
    }

    private void initializeComponents() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);

        createHeaderSection();
        createFormComponents();
        createButtonsSection();

        setupEventHandlers();
    }

    private void createHeaderSection() {
        H3 title = new H3("Забруднення, дефекти та ризики");
        title.getStyle().set("margin-top", "0");
        add(title);
    }

    private void createFormComponents() {
        FormLayout formLayout = new FormLayout();
        formLayout.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        // Створюємо компоненти
        stainsSelection = new StainsSelectionComponent();
        defectsAndRisksSelection = new DefectsAndRisksSelectionComponent();
        defectsNotes = new DefectsNotesComponent();

        // Додаємо до layout
        formLayout.add(stainsSelection);
        formLayout.setColspan(stainsSelection, 2);

        formLayout.add(defectsAndRisksSelection);
        formLayout.setColspan(defectsAndRisksSelection, 2);

        formLayout.add(defectsNotes);
        formLayout.setColspan(defectsNotes, 2);

        add(formLayout);
    }

    private void createButtonsSection() {
        HorizontalLayout buttonsLayout = new HorizontalLayout();
        buttonsLayout.setJustifyContentMode(JustifyContentMode.BETWEEN);
        buttonsLayout.setWidthFull();

        // Ліва частина - Скасувати
        cancelButton = new Button("Скасувати");
        cancelButton.addClickListener(e -> handleCancel());

        // Права частина - Назад та Далі
        previousButton = new Button("Назад до характеристик");
        previousButton.addClickListener(e -> handlePrevious());

        nextButton = new Button("Далі до розрахунку ціни");
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextButton.addClickListener(e -> handleNext());

        HorizontalLayout rightButtons = new HorizontalLayout(previousButton, nextButton);
        rightButtons.setSpacing(true);

        buttonsLayout.add(cancelButton, rightButtons);
        add(buttonsLayout);
    }

    private void setupEventHandlers() {
        // Встановлюємо обробник подій для сервісу
        defectsService.setEventHandler(this::handleDefectsEvent);

        // Компоненти
        stainsSelection.setOnStainsChanged(this::handleStainsChange);
        defectsAndRisksSelection.setOnDefectsAndRisksChanged(this::handleDefectsAndRisksChange);
        defectsNotes.setOnNotesChanged(this::handleNotesChange);
    }

    private void initializeData() {
        // Ініціалізуємо стан дефектів
        currentState = defectsService.initializeDefects(currentItem);

        // Завантажуємо існуючі дефекти якщо є
        if (hasExistingDefects()) {
            currentState = defectsService.loadExistingDefects(currentItem, currentState);
        }
    }

    /**
     * Центральний обробник подій (Event Coordinator).
     */
    private void handleDefectsEvent(DefectsEvents event) {
        try {
            switch (event) {
                case DefectsEvents.DefectsDataLoaded loaded -> handleDefectsDataLoaded(loaded);
                case DefectsEvents.DefectsStateUpdated updated -> handleStateUpdated(updated);
                case DefectsEvents.DefectsFailed failed -> handleDefectsFailed(failed);
                case DefectsEvents.FieldVisibilityChanged visibility -> handleVisibilityChanged(visibility);
                case DefectsEvents.DefectsValidationCompleted validation -> handleValidationCompleted(validation);
                case DefectsEvents.CriticalRisksWarning warning -> handleCriticalRisksWarning(warning);
                case DefectsEvents.DefectsStatistics statistics -> handleStatistics(statistics);
                case DefectsEvents.DefectsInitialized initialized -> handleDefectsInitialized(initialized);
                default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
            }
        } catch (Exception ex) {
            log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            showErrorNotification("Помилка обробки: " + ex.getMessage());
        }
    }

    private void handleDefectsDataLoaded(DefectsEvents.DefectsDataLoaded loaded) {
        log.debug("Завантажено дані дефектів: {} плям, {} дефектів/ризиків",
                 loaded.stainTypes().size(), loaded.defectsAndRisks().size());

        // Завантажуємо дані у компоненти
        stainsSelection.loadStainTypes(loaded.stainTypes());
        defectsAndRisksSelection.loadDefectsAndRisks(loaded.defectsAndRisks());
    }

    private void handleStateUpdated(DefectsEvents.DefectsStateUpdated updated) {
        currentState = updated.defectsState();
        log.debug("Стан дефектів оновлено");

        // Оновлюємо компоненти відповідно до нового стану
        updateComponentsFromState();
    }

    private void handleDefectsFailed(DefectsEvents.DefectsFailed failed) {
        log.error("Помилка дефектів: {}", failed.errorMessage());
        showErrorNotification(failed.errorMessage());
    }

    private void handleVisibilityChanged(DefectsEvents.FieldVisibilityChanged visibility) {
        log.debug("Зміна видимості полів: інше плям={}, причина гарантій={}",
                 visibility.otherStainsVisible(), visibility.noGuaranteeReasonVisible());
        // Компоненти самі управляють видимістю своїх полів
    }

    private void handleValidationCompleted(DefectsEvents.DefectsValidationCompleted validation) {
        updateComponentsValidation(validation.isValid(), validation.validationErrors());
        updateNavigationButtons();
    }

    private void handleCriticalRisksWarning(DefectsEvents.CriticalRisksWarning warning) {
        log.warn("Критичні ризики: {}", warning.criticalRisks());

        Notification.show(warning.warningMessage(), 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_WARNING);
    }

    private void handleStatistics(DefectsEvents.DefectsStatistics statistics) {
        log.debug("Статистика дефектів: {} плям, {} дефектів/ризиків, потребує уваги: {}",
                 statistics.totalStains(), statistics.totalDefectsAndRisks(), statistics.requiresAttention());
    }

    private void handleDefectsInitialized(DefectsEvents.DefectsInitialized initialized) {
        currentState = initialized.initialState();
        log.debug("Дефекти ініціалізовано");
    }

    private void handleStainsChange(Set<String> selectedStains, String otherStains) {
        log.debug("Зміна плям: {} вибрано", selectedStains.size());
        currentState = defectsService.updateStains(currentState, selectedStains, otherStains);
    }

    private void handleDefectsAndRisksChange(Set<String> selectedDefects, String noGuaranteeReason) {
        log.debug("Зміна дефектів та ризиків: {} вибрано", selectedDefects.size());
        currentState = defectsService.updateDefectsAndRisks(currentState, selectedDefects, noGuaranteeReason);
    }

    private void handleNotesChange(String notes) {
        log.debug("Зміна примітки: {}", notes != null ? notes.length() + " символів" : "порожня");
        currentState = defectsService.updateDefectsNotes(currentState, notes);
    }

    private void handleCancel() {
        log.info("Скасування введення дефектів для предмета: {}", currentItem.getName());
        onCancel.run();
    }

    private void handlePrevious() {
        try {
            // Зберігаємо поточний стан (навіть якщо є помилки)
            applyDefectsToItem();
            onPrevious.accept(currentItem);

            log.info("Дефекти збережено, повернення до характеристик для предмета: {}", currentItem.getName());

        } catch (Exception ex) {
            log.warn("Попередження при збереженні дефектів: {}", ex.getMessage());
            // При поверненні назад ігноруємо помилки
            onPrevious.accept(currentItem);
        }
    }

    private void handleNext() {
        try {
            // Валідуємо дефекти
            currentState = defectsService.validateDefects(currentState);

            if (currentState.hasCriticalErrors()) {
                showValidationErrors(currentState.getValidationErrors());
                return;
            }

            // Застосовуємо дефекти до предмета
            applyDefectsToItem();

            onNext.accept(currentItem);

            log.info("Дефекти заповнено для: {} (плями: {}, дефекти: {})",
                    currentItem.getName(),
                    currentState.getTotalStainsCount(),
                    currentState.getTotalDefectsAndRisksCount());

        } catch (Exception ex) {
            log.error("Помилка при переході далі: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка: " + ex.getMessage());
        }
    }

    private void applyDefectsToItem() {
        currentItem = defectsService.applyDefectsToItem(currentItem, currentState);
    }

    private void updateComponentsFromState() {
        // Оновлюємо плями
        stainsSelection.setSelectedStains(
                currentState.getSelectedStains(),
                currentState.getOtherStains()
        );

        // Оновлюємо дефекти та ризики
        defectsAndRisksSelection.setSelectedDefectsAndRisks(
                currentState.getSelectedDefectsAndRisks(),
                currentState.getNoGuaranteeReason()
        );

        // Оновлюємо примітку
        defectsNotes.setNotes(currentState.getDefectsNotes());
    }

    private void updateComponentsValidation(boolean isValid, java.util.List<String> errors) {
        // Перевіряємо валідність компонентів
        boolean stainsValid = stainsSelection.getStainSelection().isValid();
        boolean defectsValid = defectsAndRisksSelection.getDefectsAndRisksSelection().isValid();

        stainsSelection.setInvalid(!stainsValid);
        defectsAndRisksSelection.setInvalid(!defectsValid);

        if (!isValid && !errors.isEmpty()) {
            showValidationErrors(errors);
        }
    }

    private void updateNavigationButtons() {
        boolean canProceed = currentState.isValid() && !currentState.hasCriticalErrors();
        nextButton.setEnabled(canProceed);
    }

    private boolean hasExistingDefects() {
        return (currentItem.getStains() != null && !currentItem.getStains().trim().isEmpty()) ||
               (currentItem.getDefectsAndRisks() != null && !currentItem.getDefectsAndRisks().trim().isEmpty()) ||
               (currentItem.getDefectsNotes() != null && !currentItem.getDefectsNotes().trim().isEmpty());
    }

    private void showValidationErrors(java.util.List<String> errors) {
        String errorMessage = String.join("\n", errors);
        Notification.show(errorMessage, 4000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    private void showErrorNotification(String message) {
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }
}
