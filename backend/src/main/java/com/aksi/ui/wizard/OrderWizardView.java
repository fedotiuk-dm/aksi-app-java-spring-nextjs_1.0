package com.aksi.ui.wizard;

import com.aksi.ui.MainLayout;
import com.aksi.ui.wizard.application.OrderWizardService;
import com.aksi.ui.wizard.components.WizardProgressComponent;
import com.aksi.ui.wizard.components.WizardTabsComponent;
import com.aksi.ui.wizard.domain.OrderWizardState;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.events.OrderWizardEvents;
import com.aksi.ui.wizard.infrastructure.StepViewFactory;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import jakarta.annotation.security.PermitAll;
import lombok.extern.slf4j.Slf4j;

/**
 * Рефакторинований головний координатор Order Wizard.
 * Використовує event-driven архітектуру та принципи DDD + SOLID.
 *
 * Архітектура:
 * - Domain Layer: OrderWizardState (бізнес-логіка навігації)
 * - Application Layer: OrderWizardService (координація)
 * - UI Components: WizardTabsComponent, WizardProgressComponent (SRP)
 * - Infrastructure: StepViewFactory (DIP)
 */
@Route(value = "order-wizard", layout = MainLayout.class)
@PageTitle("Оформлення замовлення | Хімчистка")
@PermitAll
@Slf4j
public class OrderWizardView extends VerticalLayout implements BeforeEnterObserver {

    // Application services
    private final OrderWizardService wizardService;
    private final StepViewFactory stepViewFactory;

    // UI компоненти
    private WizardProgressComponent progressComponent;
    private WizardTabsComponent tabsComponent;
    private VerticalLayout stepContainer;

    // Поточний стан
    private OrderWizardState currentState;
    private Component currentStepView;

    public OrderWizardView(OrderWizardService wizardService, StepViewFactory stepViewFactory) {
        this.wizardService = wizardService;
        this.stepViewFactory = stepViewFactory;
        log.info("OrderWizardView creating with event-driven architecture...");
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        initializeLayout();
        initializeComponents();
        setupEventHandlers();
        initializeWizard();
        log.info("OrderWizardView initialized and ready");
    }

    private void initializeLayout() {
        removeAll();
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        addClassName("order-wizard-view");
    }

    private void initializeComponents() {
        // Компонент прогресу
        progressComponent = new WizardProgressComponent();
        progressComponent.addClassName("wizard-progress");

        // Компонент табів
        tabsComponent = new WizardTabsComponent();
        tabsComponent.addClassName("wizard-tabs");

        // Контейнер для етапів
        stepContainer = new VerticalLayout();
        stepContainer.setSizeFull();
        stepContainer.setPadding(false);
        stepContainer.setSpacing(false);
        stepContainer.addClassName("wizard-step-container");

        add(progressComponent, tabsComponent, stepContainer);
    }

    private void setupEventHandlers() {
        // Налаштування event handler для wizard service
        wizardService.setEventHandler(this::handleWizardEvent);

        // Налаштування handlers для UI компонентів
        tabsComponent.setOnTabSelectionChanged(this::handleTabSelection);
    }

    private void initializeWizard() {
        try {
            currentState = wizardService.initializeWizard();
        } catch (Exception e) {
            log.error("Failed to initialize wizard: {}", e.getMessage(), e);
            showErrorNotification("Помилка ініціалізації wizard'а: " + e.getMessage());
        }
    }

    /**
     * Централізований обробник подій wizard'а з pattern matching.
     */
    private void handleWizardEvent(OrderWizardEvents event) {
        try {
            switch (event) {
                case OrderWizardEvents.WizardInitialized initialized ->
                    handleWizardInitialized(initialized);
                case OrderWizardEvents.WizardStateUpdated stateUpdated ->
                    handleStateUpdated(stateUpdated);
                case OrderWizardEvents.NavigationRequested navigationRequested ->
                    handleNavigationRequested(navigationRequested);
                case OrderWizardEvents.StepCompleted stepCompleted ->
                    handleStepCompleted(stepCompleted);
                case OrderWizardEvents.StepNavigationChanged navigationChanged ->
                    handleNavigationChanged(navigationChanged);
                case OrderWizardEvents.StepViewRequested viewRequested ->
                    handleStepViewRequested(viewRequested);
                case OrderWizardEvents.TabSelectionChanged tabSelectionChanged ->
                    handleTabSelectionChanged(tabSelectionChanged);
                case OrderWizardEvents.WizardDataUpdated dataUpdated ->
                    handleDataUpdated(dataUpdated);
                case OrderWizardEvents.WizardCompleted wizardCompleted ->
                    handleWizardCompleted(wizardCompleted);
                case OrderWizardEvents.WizardCancelled wizardCancelled ->
                    handleWizardCancelled(wizardCancelled);
                case OrderWizardEvents.WizardError wizardError ->
                    handleWizardError(wizardError);
                case OrderWizardEvents.LoadingStarted loadingStarted ->
                    handleLoadingStarted(loadingStarted);
                case OrderWizardEvents.LoadingCompleted loadingCompleted ->
                    handleLoadingCompleted(loadingCompleted);
                case OrderWizardEvents.ProgressUpdated progressUpdated ->
                    handleProgressUpdated(progressUpdated);
                case OrderWizardEvents.ValidationCompleted validationCompleted ->
                    handleValidationCompleted(validationCompleted);
                case OrderWizardEvents.UIStateChanged uiStateChanged ->
                    handleUIStateChanged(uiStateChanged);
            }
        } catch (Exception e) {
            log.error("Error handling wizard event {}: {}", event.getClass().getSimpleName(), e.getMessage(), e);
            showErrorNotification("Помилка обробки події: " + e.getMessage());
        }
    }

    private void handleWizardInitialized(OrderWizardEvents.WizardInitialized initialized) {
        currentState = initialized.initialState();
        updateAllComponentsFromState();
        showInfoNotification("Wizard ініціалізовано успішно");
        log.info("Wizard initialized with session: {}", initialized.sessionId());
    }

    private void handleStateUpdated(OrderWizardEvents.WizardStateUpdated stateUpdated) {
        currentState = stateUpdated.wizardState();
        updateAllComponentsFromState();
        log.debug("Wizard state updated: {}", stateUpdated.changeReason());
    }

    private void handleNavigationRequested(OrderWizardEvents.NavigationRequested navigationRequested) {
        if (!navigationRequested.isAllowed()) {
            showWarningNotification("Навігація до етапу " + (navigationRequested.targetStep() + 1) + " недоступна");
        }
        log.debug("Navigation requested: {} to step {}", navigationRequested.navigationType(), navigationRequested.targetStep());
    }

    private void handleStepCompleted(OrderWizardEvents.StepCompleted stepCompleted) {
        showSuccessNotification("Етап \"" + stepCompleted.stepName() + "\" завершено");
        log.info("Step {} completed: {}", stepCompleted.completedStep(), stepCompleted.stepName());
    }

    private void handleNavigationChanged(OrderWizardEvents.StepNavigationChanged navigationChanged) {
        // Компоненти оновляться автоматично через updateAllComponentsFromState
        log.debug("Navigation changed for step: {}", navigationChanged.currentStep());
    }

    private void handleStepViewRequested(OrderWizardEvents.StepViewRequested viewRequested) {
        createAndShowStepView(viewRequested.stepNumber(), viewRequested.wizardData(), viewRequested.isRecreation());
        log.debug("Step view requested for step: {} (recreation: {})", viewRequested.stepNumber(), viewRequested.isRecreation());
    }

    private void handleTabSelectionChanged(OrderWizardEvents.TabSelectionChanged tabSelectionChanged) {
        if (!tabSelectionChanged.isAllowed()) {
            // Повертаємо вибір назад до поточного етапу
            tabsComponent.setSelectedTabQuiet(currentState.getCurrentStep());
        }
        log.debug("Tab selection changed: {} -> {} (allowed: {})",
                 tabSelectionChanged.previousTabIndex(),
                 tabSelectionChanged.selectedTabIndex(),
                 tabSelectionChanged.isAllowed());
    }

    private void handleDataUpdated(OrderWizardEvents.WizardDataUpdated dataUpdated) {
        log.debug("Wizard data updated from: {}", dataUpdated.updateSource());
    }

    private void handleWizardCompleted(OrderWizardEvents.WizardCompleted wizardCompleted) {
        currentState = wizardCompleted.finalState();
        updateAllComponentsFromState();
        showSuccessNotification("Замовлення створено успішно!");

        // Навігація до списку замовлень
        getUI().ifPresent(ui -> {
            ui.access(() -> {
                try {
                    ui.navigate("orders");
                } catch (Exception e) {
                    log.error("Error navigating to orders view: {}", e.getMessage(), e);
                }
            });
        });

        log.info("Wizard completed successfully at: {}", wizardCompleted.completionTime());
    }

    private void handleWizardCancelled(OrderWizardEvents.WizardCancelled wizardCancelled) {
        showInfoNotification("Створення замовлення скасовано");

        // Навігація до списку замовлень
        getUI().ifPresent(ui -> {
            ui.access(() -> {
                try {
                    ui.navigate("orders");
                } catch (Exception e) {
                    log.error("Error navigating to orders view: {}", e.getMessage(), e);
                }
            });
        });

        log.info("Wizard cancelled on step {} with reason: {}", wizardCancelled.cancelledOnStep(), wizardCancelled.cancelReason());
    }

    private void handleWizardError(OrderWizardEvents.WizardError wizardError) {
        showErrorNotification("Помилка: " + wizardError.errorMessage());
        log.error("Wizard error in operation '{}' on step {}: {}",
                 wizardError.operation(), wizardError.stepNumber(), wizardError.errorMessage(), wizardError.exception());
    }

    private void handleLoadingStarted(OrderWizardEvents.LoadingStarted loadingStarted) {
        progressComponent.showLoading(true, loadingStarted.description());
        log.debug("Loading started: {}", loadingStarted.operation());
    }

    private void handleLoadingCompleted(OrderWizardEvents.LoadingCompleted loadingCompleted) {
        progressComponent.showLoading(false, null);
        if (!loadingCompleted.success()) {
            showErrorNotification("Операція не вдалася: " + loadingCompleted.message());
        }
        log.debug("Loading completed: {} (success: {})", loadingCompleted.operation(), loadingCompleted.success());
    }

    private void handleProgressUpdated(OrderWizardEvents.ProgressUpdated progressUpdated) {
        // Прогрес оновиться автоматично через updateAllComponentsFromState
        log.debug("Progress updated: {}% - {}", progressUpdated.progressPercentage(), progressUpdated.progressText());
    }

    private void handleValidationCompleted(OrderWizardEvents.ValidationCompleted validationCompleted) {
        if (!validationCompleted.isValid()) {
            showValidationErrors(validationCompleted.validationMessages());
        }
        if (!validationCompleted.warnings().isEmpty()) {
            showWarnings(validationCompleted.warnings());
        }
        log.debug("Validation completed for step {}: valid={}", validationCompleted.stepNumber(), validationCompleted.isValid());
    }

    private void handleUIStateChanged(OrderWizardEvents.UIStateChanged uiStateChanged) {
        tabsComponent.showLoading(uiStateChanged.isLoading());
        tabsComponent.showError(uiStateChanged.hasError());
        tabsComponent.setTabsEnabled(uiStateChanged.tabsEnabled());

        if (uiStateChanged.statusMessage() != null) {
            showInfoNotification(uiStateChanged.statusMessage());
        }

        log.debug("UI state changed: loading={}, error={}, completed={}",
                 uiStateChanged.isLoading(), uiStateChanged.hasError(), uiStateChanged.isWizardCompleted());
    }

    private void handleTabSelection(int selectedTabIndex, boolean isUserInitiated) {
        if (currentState != null && isUserInitiated) {
            currentState = wizardService.handleTabSelection(currentState, selectedTabIndex, true);
        }
    }

    private void createAndShowStepView(int stepNumber, OrderWizardData wizardData, boolean isRecreation) {
        try {
            // Видаляємо поточний view
            if (currentStepView != null) {
                stepContainer.remove(currentStepView);
            }

            // Створюємо callbacks для взаємодії з етапами
            var callbacks = new StepViewFactory.StepViewCallbacks() {
                @Override
                public void onStepCompleted() {
                    handleStepCompletionRequest();
                }

                @Override
                public void onStepCompletedWithData(OrderWizardData data) {
                    handleStepCompletionRequestWithData(data);
                }

                @Override
                public void onStepBack() {
                    handleStepBackRequest();
                }

                @Override
                public void onCancel() {
                    handleCancelRequest();
                }

                @Override
                public void onWizardCompleted() {
                    handleWizardCompletionRequest();
                }

                @Override
                public void onWizardCompletedWithData(OrderWizardData data) {
                    handleStepCompletionRequestWithData(data);
                    handleWizardCompletionRequest();
                }
            };

            // Створюємо новий view
            currentStepView = stepViewFactory.createStepView(stepNumber, wizardData, callbacks);
            stepContainer.add(currentStepView);

            log.debug("Step view created and shown for step: {}", stepNumber);

        } catch (Exception e) {
            log.error("Error creating step view for step {}: {}", stepNumber, e.getMessage(), e);
            showErrorNotification("Помилка створення інтерфейсу етапу: " + e.getMessage());
        }
    }

    private void handleStepCompletionRequest() {
        if (currentState != null) {
            currentState = wizardService.moveToNextStep(currentState);
        }
    }

    private void handleStepCompletionRequestWithData(OrderWizardData data) {
        if (currentState != null) {
            currentState = wizardService.completeStep(currentState, data);
            currentState = wizardService.moveToNextStep(currentState);
        }
    }

    private void handleStepBackRequest() {
        if (currentState != null) {
            currentState = wizardService.moveToPreviousStep(currentState);
        }
    }

    private void handleCancelRequest() {
        if (currentState != null) {
            wizardService.cancelWizard(currentState, "Скасування користувачем");
        }
    }

    private void handleWizardCompletionRequest() {
        if (currentState != null) {
            currentState = wizardService.completeWizard(currentState);
        }
    }

    private void updateAllComponentsFromState() {
        if (currentState != null) {
            progressComponent.updateFromState(currentState);
            tabsComponent.updateFromState(currentState);
        }
    }

    private void showValidationErrors(java.util.List<String> errors) {
        if (errors != null && !errors.isEmpty()) {
            String errorMessage = "Помилки валідації:\n" + String.join("\n", errors);
            showErrorNotification(errorMessage);
        }
    }

    private void showWarnings(java.util.List<String> warnings) {
        if (warnings != null && !warnings.isEmpty()) {
            String warningMessage = "Попередження:\n" + String.join("\n", warnings);
            showWarningNotification(warningMessage);
        }
    }

    private void showSuccessNotification(String message) {
        Notification notification = Notification.show(message, 3000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    private void showInfoNotification(String message) {
        Notification notification = Notification.show(message, 3000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_PRIMARY);
    }

    private void showWarningNotification(String message) {
        Notification notification = Notification.show(message, 4000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_CONTRAST);
    }

    private void showErrorNotification(String message) {
        Notification notification = Notification.show(message, 5000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    /**
     * Публічні методи для зовнішнього використання.
     */
    public void refreshWizard() {
        if (currentState != null) {
            wizardService.requestStepView(currentState, true);
        }
    }

    public OrderWizardState getCurrentState() {
        return currentState;
    }

    public boolean isWizardCompleted() {
        return currentState != null && currentState.isCompleted();
    }

    public void setCompactMode(boolean compact) {
        progressComponent.setCompactMode(compact);
        if (compact) {
            addClassName("wizard-compact-mode");
        } else {
            removeClassName("wizard-compact-mode");
        }
    }
}
