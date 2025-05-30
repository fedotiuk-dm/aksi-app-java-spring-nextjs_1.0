package com.aksi.ui.wizard.step2.substeps.item_characteristics.components;

import java.util.List;
import java.util.function.Consumer;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору ступеня зносу предмета.
 * Відповідає тільки за логіку вибору ступеня зносу (SRP).
 */
@Slf4j
public class WearDegreeSelectionComponent extends VerticalLayout {

    private ComboBox<String> wearDegreeComboBox;
    private Consumer<String> onWearDegreeChanged;

    public WearDegreeSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("WearDegreeSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Ступінь зносу");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        wearDegreeComboBox = new ComboBox<>("Ступінь зносу виробу");
        wearDegreeComboBox.setPlaceholder("Оберіть ступінь зносу");
        wearDegreeComboBox.setClearButtonVisible(true);
        wearDegreeComboBox.setWidthFull();

        // Встановлюємо кастомний рендерер для кращого відображення
        wearDegreeComboBox.setRenderer(createWearDegreeRenderer());

        add(title, wearDegreeComboBox);
    }

    private void setupEventHandlers() {
        wearDegreeComboBox.addValueChangeListener(e -> {
            String selectedWearDegree = e.getValue();
            log.debug("Обрано ступінь зносу: {}", selectedWearDegree);

            if (onWearDegreeChanged != null) {
                onWearDegreeChanged.accept(selectedWearDegree);
            }
        });
    }

    /**
     * Створює кастомний рендерер для ступеня зносу.
     */
    private com.vaadin.flow.data.renderer.Renderer<String> createWearDegreeRenderer() {
        return com.vaadin.flow.data.renderer.LitRenderer.<String>of(
                "<div style='display: flex; align-items: center;'>" +
                "<span style='font-weight: bold; margin-right: 8px;'>${item.value}</span>" +
                "<span style='color: var(--lumo-secondary-text-color);'>${item.description}</span>" +
                "</div>"
        )
        .withProperty("value", wear -> wear)
        .withProperty("description", this::getWearDegreeDescription);
    }

    /**
     * Повертає опис для ступеня зносу.
     */
    private String getWearDegreeDescription(String wearDegree) {
        return switch (wearDegree) {
            case "10%" -> "Мінімальний знос";
            case "30%" -> "Невеликий знос";
            case "50%" -> "Помірний знос";
            case "75%" -> "Значний знос";
            default -> "";
        };
    }

    /**
     * Завантажує доступні ступені зносу.
     */
    public void loadWearDegrees(List<String> wearDegrees) {
        log.debug("Завантаження {} ступенів зносу", wearDegrees.size());

        wearDegreeComboBox.setItems(wearDegrees);

        // За замовчуванням встановлюємо мінімальний знос
        if (wearDegrees.contains("10%")) {
            wearDegreeComboBox.setValue("10%");
        }
    }

    /**
     * Встановлює вибраний ступінь зносу.
     */
    public void setSelectedWearDegree(String wearDegree) {
        log.debug("Встановлення ступеня зносу: {}", wearDegree);
        wearDegreeComboBox.setValue(wearDegree);
    }

    /**
     * Повертає вибраний ступінь зносу.
     */
    public String getSelectedWearDegree() {
        return wearDegreeComboBox.getValue();
    }

    /**
     * Встановлює обробник зміни ступеня зносу.
     */
    public void setOnWearDegreeChanged(Consumer<String> handler) {
        this.onWearDegreeChanged = handler;
    }

    /**
     * Очищує вибір ступеня зносу.
     */
    public void clearSelection() {
        wearDegreeComboBox.clear();
    }

    /**
     * Перевіряє чи є ступінь зносу вибраний.
     */
    public boolean hasSelection() {
        return wearDegreeComboBox.getValue() != null && !wearDegreeComboBox.getValue().trim().isEmpty();
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        wearDegreeComboBox.focus();
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        wearDegreeComboBox.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        wearDegreeComboBox.setInvalid(invalid);
        if (invalid) {
            wearDegreeComboBox.setErrorMessage("Ступінь зносу є бажаним для заповнення");
        } else {
            wearDegreeComboBox.setErrorMessage(null);
        }
    }

    /**
     * Встановлює обов'язковість поля.
     */
    public void setRequired(boolean required) {
        wearDegreeComboBox.setRequired(required);
        wearDegreeComboBox.setRequiredIndicatorVisible(required);
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Встановлює підказку для користувача.
     */
    public void setHelperText(String helperText) {
        wearDegreeComboBox.setHelperText(helperText);
    }

    /**
     * Встановлює плейсхолдер.
     */
    public void setPlaceholder(String placeholder) {
        wearDegreeComboBox.setPlaceholder(placeholder);
    }
}
