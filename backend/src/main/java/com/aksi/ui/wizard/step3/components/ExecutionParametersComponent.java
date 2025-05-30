package com.aksi.ui.wizard.step3.components;

import java.time.LocalDate;
import java.util.function.Consumer;

import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.UrgencyOption;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.radiobutton.RadioButtonGroup;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для параметрів виконання замовлення.
 * Відповідає за SRP - тільки дата та терміновість.
 */
@Slf4j
public class ExecutionParametersComponent extends VerticalLayout {

    // UI елементи
    private DatePicker expectedDatePicker;
    private RadioButtonGroup<UrgencyOption> urgencyGroup;
    private Div processingInfoPanel;

    // Event handlers
    private Consumer<LocalDate> onExpectedDateChanged;
    private Consumer<UrgencyOption> onUrgencyOptionChanged;

    // Стан
    private OrderParametersState currentState;

    public ExecutionParametersComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("ExecutionParametersComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        getStyle()
            .set("background", "var(--lumo-contrast-5pct)")
            .set("padding", "var(--lumo-space-m)")
            .set("border-radius", "var(--lumo-border-radius-m)");
    }

    private void createComponents() {
        H4 sectionTitle = new H4("3.1. Параметри виконання");
        sectionTitle.getStyle().set("margin-top", "0");

        // Інформаційна панель
        processingInfoPanel = new Div();
        processingInfoPanel.getStyle()
            .set("background", "var(--lumo-primary-color-10pct)")
            .set("padding", "var(--lumo-space-s)")
            .set("border-radius", "var(--lumo-border-radius-s)")
            .set("border-left", "3px solid var(--lumo-primary-color)");

        // Дата виконання
        expectedDatePicker = new DatePicker("Дата виконання");
        expectedDatePicker.setMin(LocalDate.now().plusDays(1));
        expectedDatePicker.setHelperText("Дата видачі після 14:00");
        expectedDatePicker.setPlaceholder("Оберіть дату");

        // Терміновість
        urgencyGroup = new RadioButtonGroup<>();
        urgencyGroup.setLabel("Терміновість виконання");
        urgencyGroup.setItems(UrgencyOption.values());
        urgencyGroup.setValue(UrgencyOption.STANDARD);

        add(sectionTitle, processingInfoPanel, expectedDatePicker, urgencyGroup);
    }

    private void setupEventHandlers() {
        expectedDatePicker.addValueChangeListener(e -> {
            LocalDate newDate = e.getValue();
            if (newDate != null && onExpectedDateChanged != null) {
                onExpectedDateChanged.accept(newDate);
            }
        });

        urgencyGroup.addValueChangeListener(e -> {
            UrgencyOption newUrgency = e.getValue();
            if (newUrgency != null && onUrgencyOptionChanged != null) {
                onUrgencyOptionChanged.accept(newUrgency);
            }
        });
    }

    /**
     * Оновлює компонент з поточного domain state.
     */
    public void updateFromState(OrderParametersState state) {
        this.currentState = state;

        if (state != null) {
            // Оновлюємо дату без тригера події
            expectedDatePicker.setValue(state.getExpectedCompletionDate());

            // Оновлюємо терміновість без тригера події
            urgencyGroup.setValue(state.getUrgencyOption());

            // Оновлюємо інформаційну панель
            updateProcessingInfoPanel(state);

            // Оновлюємо стиль валідації
            updateValidationStyles(state);

            log.debug("Компонент оновлено з стану: дата={}, терміновість={}",
                    state.getExpectedCompletionDate(), state.getUrgencyOption());
        }
    }

    private void updateProcessingInfoPanel(OrderParametersState state) {
        processingInfoPanel.removeAll();

        Span infoText = new Span(state.getProcessingInfoText());
        infoText.getStyle().set("font-weight", "500");

        processingInfoPanel.add(infoText);
    }

    private void updateValidationStyles(OrderParametersState state) {
        // Стиль для дати
        if (state.getValidationMessages().stream()
                .anyMatch(msg -> msg.contains("дата") || msg.contains("майбутньому"))) {
            expectedDatePicker.setInvalid(true);
            expectedDatePicker.setErrorMessage("Дата виконання повинна бути в майбутньому");
        } else {
            expectedDatePicker.setInvalid(false);
            expectedDatePicker.setErrorMessage(null);
        }

        // Підсвічування терміновості
        if (state.isUrgentOrder()) {
            urgencyGroup.getStyle().set("background", "var(--lumo-warning-color-10pct)");
        } else {
            urgencyGroup.getStyle().remove("background");
        }
    }

    /**
     * Встановлює мінімальну дату.
     */
    public void setMinDate(LocalDate minDate) {
        expectedDatePicker.setMin(minDate);
        log.debug("Встановлено мінімальну дату: {}", minDate);
    }

    /**
     * Встановлює максимальну дату.
     */
    public void setMaxDate(LocalDate maxDate) {
        expectedDatePicker.setMax(maxDate);
        log.debug("Встановлено максимальну дату: {}", maxDate);
    }

    /**
     * Увімкнути/вимкнути редагування дати.
     */
    public void setDateEnabled(boolean enabled) {
        expectedDatePicker.setEnabled(enabled);
        log.debug("Редагування дати: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Увімкнути/вимкнути вибір терміновості.
     */
    public void setUrgencyEnabled(boolean enabled) {
        urgencyGroup.setEnabled(enabled);
        log.debug("Вибір терміновості: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Показати повідомлення про терміновість.
     */
    public void showUrgencyWarning(String message) {
        Div warningDiv = new Div();
        warningDiv.getStyle()
            .set("color", "var(--lumo-warning-text-color)")
            .set("background", "var(--lumo-warning-color-10pct)")
            .set("padding", "var(--lumo-space-xs)")
            .set("border-radius", "var(--lumo-border-radius-s)")
            .set("margin-top", "var(--lumo-space-xs)");

        Span warningText = new Span("⚠️ " + message);
        warningDiv.add(warningText);

        // Додаємо після urgencyGroup
        addComponentAtIndex(getComponentCount(), warningDiv);

        log.debug("Показано попередження про терміновість: {}", message);
    }

    /**
     * Отримати поточну вибрану дату.
     */
    public LocalDate getSelectedDate() {
        return expectedDatePicker.getValue();
    }

    /**
     * Отримати поточну вибрану терміновість.
     */
    public UrgencyOption getSelectedUrgency() {
        return urgencyGroup.getValue();
    }

    /**
     * Перевірити чи компонент валідний.
     */
    public boolean isValid() {
        return !expectedDatePicker.isInvalid() &&
               getSelectedDate() != null &&
               getSelectedUrgency() != null;
    }

    // Event handlers setters

    public void setOnExpectedDateChanged(Consumer<LocalDate> handler) {
        this.onExpectedDateChanged = handler;
    }

    public void setOnUrgencyOptionChanged(Consumer<UrgencyOption> handler) {
        this.onUrgencyOptionChanged = handler;
    }

    // Геттери для тестування

    protected DatePicker getExpectedDatePicker() {
        return expectedDatePicker;
    }

    protected RadioButtonGroup<UrgencyOption> getUrgencyGroup() {
        return urgencyGroup;
    }

    protected Div getProcessingInfoPanel() {
        return processingInfoPanel;
    }
}
