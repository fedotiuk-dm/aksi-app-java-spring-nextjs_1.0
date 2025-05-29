package com.aksi.ui.wizard;

import com.aksi.ui.MainLayout;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.tabs.Tab;
import com.vaadin.flow.component.tabs.Tabs;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import lombok.extern.slf4j.Slf4j;

/**
 * Головний контролер Order Wizard для оформлення замовлень хімчистки.
 * Координує взаємодію між всіма етапами створення замовлення.
 */
@Route(value = "order-wizard", layout = MainLayout.class)
@PageTitle("Оформлення замовлення | Хімчистка")
@Slf4j
public class OrderWizardView extends VerticalLayout {

    private final OrderWizardData wizardData;

    // Tabs for navigation
    private Tabs stepTabs;
    private Tab clientInfoTab;
    private Tab itemsTab;
    private Tab parametersTab;
    private Tab confirmationTab;

    // Current step container
    private VerticalLayout stepContainer;

    private int currentStep = 0;

    public OrderWizardView() {
        this.wizardData = new OrderWizardData();
        initializeLayout();
        initializeTabs();
        showStep(0); // Почати з першого етапу

        log.info("OrderWizardView initialized");
    }

    private void initializeLayout() {
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
        stepContainer.removeAll();
        currentStep = stepIndex;

        Component stepView = createStepView(stepIndex);
        stepContainer.add(stepView);

        log.info("Showing step: {}", stepIndex);
    }

    private Component createStepView(int stepIndex) {
        return switch (stepIndex) {
            case 0 -> createStep1View();
            case 1 -> createStep2View();
            case 2 -> createStep3View();
            case 3 -> createStep4View();
            default -> createStep1View();
        };
    }

    private Component createStep1View() {
        VerticalLayout step1 = new VerticalLayout();
        step1.add(new H2("Етап 1: Клієнт та базова інформація"));

        // TODO: Тут буде повна реалізація ClientAndOrderInfoView
        Button nextButton = new Button("Далі до предметів");
        nextButton.addClickListener(e -> onStep1Completed());

        step1.add(nextButton);
        return step1;
    }

    private Component createStep2View() {
        VerticalLayout step2 = new VerticalLayout();
        step2.add(new H2("Етап 2: Менеджер предметів"));

        // TODO: Тут буде повна реалізація ItemsManagerView
        Button nextButton = new Button("Далі до параметрів");
        nextButton.addClickListener(e -> onStep2Completed());

        step2.add(nextButton);
        return step2;
    }

    private Component createStep3View() {
        VerticalLayout step3 = new VerticalLayout();
        step3.add(new H2("Етап 3: Параметри замовлення"));

        // TODO: Тут буде повна реалізація OrderParametersView
        Button nextButton = new Button("Далі до підтвердження");
        nextButton.addClickListener(e -> onStep3Completed());

        step3.add(nextButton);
        return step3;
    }

    private Component createStep4View() {
        VerticalLayout step4 = new VerticalLayout();
        step4.add(new H2("Етап 4: Підтвердження та завершення"));

        // TODO: Тут буде повна реалізація ConfirmationView
        Button completeButton = new Button("Завершити замовлення");
        completeButton.addClickListener(e -> onOrderCompleted());

        step4.add(completeButton);
        return step4;
    }

    /**
     * Callback для завершення етапу 1 - інформація про клієнта
     */
    private void onStep1Completed() {
        itemsTab.setEnabled(true);
        stepTabs.setSelectedTab(itemsTab);
        showStep(1);
        log.info("Step 1 completed");
    }

    /**
     * Callback для завершення етапу 2 - предмети замовлення
     */
    private void onStep2Completed() {
        parametersTab.setEnabled(true);
        stepTabs.setSelectedTab(parametersTab);
        showStep(2);
        log.info("Step 2 completed");
    }

    /**
     * Callback для завершення етапу 3 - параметри замовлення
     */
    private void onStep3Completed() {
        confirmationTab.setEnabled(true);
        stepTabs.setSelectedTab(confirmationTab);
        showStep(3);
        log.info("Step 3 completed");
    }

    /**
     * Callback для завершення всього процесу оформлення
     */
    private void onOrderCompleted() {
        // Логіка завершення замовлення та перенаправлення
        getUI().ifPresent(ui -> ui.navigate("orders"));
        log.info("Order completed, navigating to orders view");
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
