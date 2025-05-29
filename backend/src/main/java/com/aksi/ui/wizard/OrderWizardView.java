package com.aksi.ui.wizard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.aksi.ui.MainLayout;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step1.ClientAndOrderInfoView;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.tabs.Tab;
import com.vaadin.flow.component.tabs.Tabs;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import jakarta.annotation.security.PermitAll;
import lombok.extern.slf4j.Slf4j;

/**
 * Головний контролер Order Wizard для оформлення замовлень хімчистки.
 * Координує взаємодію між всіма етапами створення замовлення.
 */
@Route(value = "order-wizard", layout = MainLayout.class)
@PageTitle("Оформлення замовлення | Хімчистка")
@PermitAll
@Slf4j
public class OrderWizardView extends VerticalLayout implements BeforeEnterObserver {

    private final ApplicationContext applicationContext;
    private OrderWizardData wizardData;

    // Tabs for navigation
    private Tabs stepTabs;
    private Tab clientInfoTab;
    private Tab itemsTab;
    private Tab parametersTab;
    private Tab confirmationTab;

    // Current step container
    private VerticalLayout stepContainer;

    // Step components - cache to avoid recreation issues
    private Component currentStepView;

    private int currentStep = 0;

    @Autowired
    public OrderWizardView(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
        log.info("OrderWizardView creating...");
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        // Initialize data and UI on navigation
        this.wizardData = new OrderWizardData();
        initializeLayout();
        initializeTabs();
        showStep(0); // Почати з першого етапу
        log.info("OrderWizardView initialized and ready");
    }

    private void initializeLayout() {
        removeAll(); // Clean any existing content
        setSizeFull();
        setPadding(true);
        setSpacing(true);

        stepContainer = new VerticalLayout();
        stepContainer.setSizeFull();
        stepContainer.setPadding(false);
    }

    private void initializeTabs() {
        clientInfoTab = new Tab("1. Клієнт та інформація");
        itemsTab = new Tab("2. Предмети замовлення");
        parametersTab = new Tab("3. Параметри замовлення");
        confirmationTab = new Tab("4. Підтвердження");

        stepTabs = new Tabs(clientInfoTab, itemsTab, parametersTab, confirmationTab);
        stepTabs.setWidthFull();

        // Спочатку тільки перший таб активний
        setTabsEnabled(false);
        clientInfoTab.setEnabled(true);

        stepTabs.addSelectedChangeListener(e -> {
            int selectedIndex = stepTabs.getSelectedIndex();
            if (selectedIndex <= currentStep) {
                showStep(selectedIndex);
            } else {
                stepTabs.setSelectedIndex(currentStep);
            }
        });

        add(stepTabs, stepContainer);
    }

    private void showStep(int stepIndex) {
        try {
            log.info("Showing step: {} (current: {})", stepIndex, currentStep);

            // Safely remove current component if exists
            if (currentStepView != null && stepContainer.getChildren().anyMatch(c -> c.equals(currentStepView))) {
                log.debug("Removing current step view from container");
                stepContainer.remove(currentStepView);
            }

            currentStep = stepIndex;
            currentStepView = createStepView(stepIndex);

            if (currentStepView != null) {
                stepContainer.add(currentStepView);
                log.debug("Added new step view to container");
            } else {
                log.warn("Created step view is null for step: {}", stepIndex);
            }
        } catch (Exception e) {
            log.error("Error during step transition to step {}: {}", stepIndex, e.getMessage(), e);
            // Fallback to prevent UI corruption
            stepContainer.removeAll();
            stepContainer.add(createErrorStep(stepIndex, e));
        }
    }

    private Component createStepView(int stepIndex) {
        try {
            return switch (stepIndex) {
                case 0 -> createStep1View();
                case 1 -> createStep2View();
                case 2 -> createStep3View();
                case 3 -> createStep4View();
                default -> createStep1View();
            };
        } catch (Exception e) {
            log.error("Error creating step view for step {}: {}", stepIndex, e.getMessage(), e);
            return createErrorStep(stepIndex, e);
        }
    }

    private Component createStep1View() {
        log.debug("Creating Step 1 view");
        return new ClientAndOrderInfoView(wizardData, this::onStep1Completed, applicationContext);
    }

    private Component createStep2View() {
        log.debug("Creating Step 2 view");
        VerticalLayout step2 = new VerticalLayout();
        step2.add(new H2("Етап 2: Менеджер предметів"));

        // TODO: Тут буде повна реалізація ItemsManagerView
        Button nextButton = new Button("Далі до параметрів");
        nextButton.addClickListener(e -> onStep2Completed());

        step2.add(nextButton);
        return step2;
    }

    private Component createStep3View() {
        log.debug("Creating Step 3 view");
        VerticalLayout step3 = new VerticalLayout();
        step3.add(new H2("Етап 3: Параметри замовлення"));

        // TODO: Тут буде повна реалізація OrderParametersView
        Button nextButton = new Button("Далі до підтвердження");
        nextButton.addClickListener(e -> onStep3Completed());

        step3.add(nextButton);
        return step3;
    }

    private Component createStep4View() {
        log.debug("Creating Step 4 view");
        VerticalLayout step4 = new VerticalLayout();
        step4.add(new H2("Етап 4: Підтвердження та завершення"));

        // TODO: Тут буде повна реалізація ConfirmationView
        Button completeButton = new Button("Завершити замовлення");
        completeButton.addClickListener(e -> onOrderCompleted());

        step4.add(completeButton);
        return step4;
    }

    private Component createErrorStep(int stepIndex, Exception error) {
        VerticalLayout errorLayout = new VerticalLayout();
        errorLayout.add(new H2("Помилка завантаження етапу " + (stepIndex + 1)));
        errorLayout.add("Сталася помилка: " + error.getMessage());

        Button retryButton = new Button("Спробувати ще раз");
        retryButton.addClickListener(e -> showStep(stepIndex));
        errorLayout.add(retryButton);

        return errorLayout;
    }

    /**
     * Callback для завершення етапу 1 - інформація про клієнта
     */
    private void onStep1Completed() {
        log.info("Step 1 completed");
        itemsTab.setEnabled(true);
        stepTabs.setSelectedTab(itemsTab);
        showStep(1);
    }

    /**
     * Callback для завершення етапу 2 - предмети замовлення
     */
    private void onStep2Completed() {
        log.info("Step 2 completed");
        parametersTab.setEnabled(true);
        stepTabs.setSelectedTab(parametersTab);
        showStep(2);
    }

    /**
     * Callback для завершення етапу 3 - параметри замовлення
     */
    private void onStep3Completed() {
        log.info("Step 3 completed");
        confirmationTab.setEnabled(true);
        stepTabs.setSelectedTab(confirmationTab);
        showStep(3);
    }

    /**
     * Callback для завершення всього процесу оформлення
     */
    private void onOrderCompleted() {
        log.info("Order completed, navigating to orders view");
        // Safely navigate away
        getUI().ifPresent(ui -> {
            try {
                ui.navigate("orders");
            } catch (Exception e) {
                log.error("Error navigating to orders view: {}", e.getMessage(), e);
            }
        });
    }

    private void setTabsEnabled(boolean enabled) {
        itemsTab.setEnabled(enabled);
        parametersTab.setEnabled(enabled);
        confirmationTab.setEnabled(enabled);
    }

    /**
     * Доступ до спільних даних візарда
     */
    public OrderWizardData getWizardData() {
        return wizardData;
    }
}
