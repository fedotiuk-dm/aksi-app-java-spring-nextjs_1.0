package com.aksi.ui.wizard.components;

import java.util.function.BiConsumer;

import com.aksi.ui.wizard.domain.OrderWizardState;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.tabs.Tab;
import com.vaadin.flow.component.tabs.Tabs;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент табів для навігації між етапами Order Wizard.
 * Відповідає за відображення та обробку переключення між етапами.
 */
@Slf4j
public class WizardTabsComponent extends VerticalLayout {

    // UI компоненти
    private Tabs stepTabs;
    private Tab clientInfoTab;
    private Tab itemsTab;
    private Tab parametersTab;
    private Tab confirmationTab;

    // Event handlers
    private BiConsumer<Integer, Boolean> onTabSelectionChanged;

    // Поточний стан
    private OrderWizardState currentState;

    public WizardTabsComponent() {
        initializeComponent();
        createComponents();
        initializeLayout();
        setupEventHandlers();
    }

    private void initializeComponent() {
        setPadding(false);
        setSpacing(false);
        setWidthFull();
        addClassName("wizard-tabs-component");
    }

    private void initializeLayout() {
        add(stepTabs);
    }

    private void createComponents() {
        // Створення табів з українськими назвами
        clientInfoTab = new Tab("1. Клієнт та інформація");
        clientInfoTab.addClassName("wizard-tab-client");
        clientInfoTab.getElement().setAttribute("aria-label", "Етап 1: Клієнт та базова інформація");

        itemsTab = new Tab("2. Предмети замовлення");
        itemsTab.addClassName("wizard-tab-items");
        itemsTab.getElement().setAttribute("aria-label", "Етап 2: Додавання предметів");

        parametersTab = new Tab("3. Параметри замовлення");
        parametersTab.addClassName("wizard-tab-parameters");
        parametersTab.getElement().setAttribute("aria-label", "Етап 3: Налаштування параметрів");

        confirmationTab = new Tab("4. Підтвердження");
        confirmationTab.addClassName("wizard-tab-confirmation");
        confirmationTab.getElement().setAttribute("aria-label", "Етап 4: Підтвердження та завершення");

        // Створення контейнера табів
        stepTabs = new Tabs(clientInfoTab, itemsTab, parametersTab, confirmationTab);
        stepTabs.setWidthFull();
        stepTabs.addClassName("wizard-tabs");
        stepTabs.getElement().setAttribute("aria-label", "Навігація по етапах створення замовлення");
    }

    private void setupEventHandlers() {
        stepTabs.addSelectedChangeListener(event -> {
            int selectedIndex = stepTabs.getSelectedIndex();
            int previousIndex = getCurrentTabIndex();
            boolean isUserInitiated = !getElement().getProperty("ignoreSelection", false);

            if (onTabSelectionChanged != null) {
                onTabSelectionChanged.accept(selectedIndex, isUserInitiated);
            }
        });
    }

    /**
     * Оновлення компонента відповідно до стану wizard'а.
     */
    public void updateFromState(OrderWizardState state) {
        if (state == null) {
            log.warn("Cannot update tabs from null state");
            return;
        }

        this.currentState = state;
        updateTabsEnabled(state);
        updateSelectedTab(state);
        updateTabsStyles(state);
        updateTabsTooltips(state);
    }

    private void updateTabsEnabled(OrderWizardState state) {
        // Спочатку вимикаємо всі таби
        setAllTabsEnabled(false);

        // Вмикаємо дозволені таби
        for (int step : state.getEnabledSteps()) {
            setTabEnabled(step, true);
        }

        log.debug("Updated tabs enabled state. Enabled steps: {}", state.getEnabledSteps());
    }

    private void updateSelectedTab(OrderWizardState state) {
        int targetStep = state.getCurrentStep();

        // Встановлюємо прапорець для ігнорування event'а
        getElement().setProperty("ignoreSelection", true);
        stepTabs.setSelectedIndex(targetStep);
        getElement().setProperty("ignoreSelection", false);

        log.debug("Updated selected tab to step: {}", targetStep);
    }

    private void updateTabsStyles(OrderWizardState state) {
        // Очищаємо попередні стилі
        clearTabStyles();

        // Додаємо стилі на основі стану
        for (int step = 0; step < OrderWizardState.TOTAL_STEPS; step++) {
            Tab tab = getTabByIndex(step);
            if (tab != null) {
                if (state.isStepCompleted(step)) {
                    tab.addClassName("wizard-tab-completed");
                } else if (step == state.getCurrentStep()) {
                    tab.addClassName("wizard-tab-current");
                } else if (state.isStepEnabled(step)) {
                    tab.addClassName("wizard-tab-enabled");
                } else {
                    tab.addClassName("wizard-tab-disabled");
                }
            }
        }

        // Додаткові стилі для помилок
        if (state.hasError()) {
            Tab currentTab = getTabByIndex(state.getCurrentStep());
            if (currentTab != null) {
                currentTab.addClassName("wizard-tab-error");
            }
        }
    }

    private void updateTabsTooltips(OrderWizardState state) {
        clientInfoTab.getElement().setAttribute("title",
            getTabTooltip(0, state.isStepCompleted(0), state.isStepEnabled(0)));
        itemsTab.getElement().setAttribute("title",
            getTabTooltip(1, state.isStepCompleted(1), state.isStepEnabled(1)));
        parametersTab.getElement().setAttribute("title",
            getTabTooltip(2, state.isStepCompleted(2), state.isStepEnabled(2)));
        confirmationTab.getElement().setAttribute("title",
            getTabTooltip(3, state.isStepCompleted(3), state.isStepEnabled(3)));
    }

    private String getTabTooltip(int step, boolean isCompleted, boolean isEnabled) {
        var stepInfo = OrderWizardState.WizardStep.fromStepNumber(step);

        if (isCompleted) {
            return stepInfo.getDescription() + " (Завершено)";
        } else if (isEnabled) {
            return stepInfo.getDescription() + " (Доступно)";
        } else {
            return stepInfo.getDescription() + " (Недоступно)";
        }
    }

    private void clearTabStyles() {
        for (int i = 0; i < OrderWizardState.TOTAL_STEPS; i++) {
            Tab tab = getTabByIndex(i);
            if (tab != null) {
                tab.removeClassNames("wizard-tab-completed", "wizard-tab-current",
                                   "wizard-tab-enabled", "wizard-tab-disabled", "wizard-tab-error");
            }
        }
    }

    private Tab getTabByIndex(int index) {
        return switch (index) {
            case 0 -> clientInfoTab;
            case 1 -> itemsTab;
            case 2 -> parametersTab;
            case 3 -> confirmationTab;
            default -> null;
        };
    }

    private void setAllTabsEnabled(boolean enabled) {
        clientInfoTab.setEnabled(enabled);
        itemsTab.setEnabled(enabled);
        parametersTab.setEnabled(enabled);
        confirmationTab.setEnabled(enabled);
    }

    private void setTabEnabled(int index, boolean enabled) {
        Tab tab = getTabByIndex(index);
        if (tab != null) {
            tab.setEnabled(enabled);
        }
    }

    private int getCurrentTabIndex() {
        return stepTabs.getSelectedIndex();
    }

    /**
     * Примусове встановлення вибраного табу без генерації подій.
     */
    public void setSelectedTabQuiet(int index) {
        if (index >= 0 && index < OrderWizardState.TOTAL_STEPS) {
            getElement().setProperty("ignoreSelection", true);
            stepTabs.setSelectedIndex(index);
            getElement().setProperty("ignoreSelection", false);
            log.debug("Set selected tab quietly to index: {}", index);
        }
    }

    /**
     * Увімкнення/вимкнення всіх табів.
     */
    public void setTabsEnabled(boolean enabled) {
        stepTabs.setEnabled(enabled);
    }

    /**
     * Відображення режиму завантаження.
     */
    public void showLoading(boolean loading) {
        if (loading) {
            stepTabs.addClassName("wizard-tabs-loading");
            stepTabs.getElement().setAttribute("aria-busy", "true");
        } else {
            stepTabs.removeClassName("wizard-tabs-loading");
            stepTabs.getElement().removeAttribute("aria-busy");
        }
    }

    /**
     * Відображення режиму помилки.
     */
    public void showError(boolean hasError) {
        if (hasError) {
            stepTabs.addClassName("wizard-tabs-error");
        } else {
            stepTabs.removeClassName("wizard-tabs-error");
        }
    }

    /**
     * Виділення конкретного табу.
     */
    public void highlightTab(int index, boolean highlight) {
        Tab tab = getTabByIndex(index);
        if (tab != null) {
            if (highlight) {
                tab.addClassName("wizard-tab-highlight");
            } else {
                tab.removeClassName("wizard-tab-highlight");
            }
        }
    }

    /**
     * Отримання індексу поточного вибраного табу.
     */
    public int getSelectedTabIndex() {
        return stepTabs.getSelectedIndex();
    }

    /**
     * Перевірка чи таб активний.
     */
    public boolean isTabEnabled(int index) {
        Tab tab = getTabByIndex(index);
        return tab != null && tab.isEnabled();
    }

    /**
     * Встановлення обробника зміни табу.
     */
    public void setOnTabSelectionChanged(BiConsumer<Integer, Boolean> handler) {
        this.onTabSelectionChanged = handler;
    }

    // Protected методи для тестування
    protected Tabs getStepTabs() { return stepTabs; }
    protected Tab getClientInfoTab() { return clientInfoTab; }
    protected Tab getItemsTab() { return itemsTab; }
    protected Tab getParametersTab() { return parametersTab; }
    protected Tab getConfirmationTab() { return confirmationTab; }
}
