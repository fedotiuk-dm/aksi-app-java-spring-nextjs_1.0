package com.aksi.ui.wizard.step2.substeps.item_characteristics.components;

import java.util.List;
import java.util.function.Consumer;

import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору наповнювача предмета з підтримкою власного типу.
 * Відповідає тільки за логіку вибору наповнювача (SRP).
 */
@Slf4j
public class FillerSelectionComponent extends VerticalLayout {

    private ComboBox<String> fillerTypeComboBox;
    private TextField customFillerField;
    private Checkbox fillerCompressedCheckbox;

    private Consumer<FillerSelection> onFillerChanged;

    public FillerSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("FillerSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Наповнювач");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        fillerTypeComboBox = new ComboBox<>("Тип наповнювача");
        fillerTypeComboBox.setPlaceholder("Оберіть тип наповнювача");
        fillerTypeComboBox.setClearButtonVisible(true);
        fillerTypeComboBox.setWidthFull();

        customFillerField = new TextField("Власний тип наповнювача");
        customFillerField.setPlaceholder("Введіть тип наповнювача");
        customFillerField.setVisible(false);
        customFillerField.setWidthFull();

        fillerCompressedCheckbox = new Checkbox("Збитий наповнювач");
        fillerCompressedCheckbox.setValue(false);

        add(title, fillerTypeComboBox, customFillerField, fillerCompressedCheckbox);
    }

    private void setupEventHandlers() {
        // Обробка зміни типу наповнювача
        fillerTypeComboBox.addValueChangeListener(e -> {
            String selectedType = e.getValue();
            log.debug("Обрано тип наповнювача: {}", selectedType);

            updateCustomFillerFieldVisibility(selectedType);
            notifyFillerChange();
        });

        // Обробка змін у полі власного наповнювача
        customFillerField.addValueChangeListener(e -> {
            String customFiller = e.getValue();
            log.debug("Змінено власний наповнювач: {}", customFiller);

            notifyFillerChange();
        });

        // Обробка зміни checkbox збитого наповнювача
        fillerCompressedCheckbox.addValueChangeListener(e -> {
            Boolean compressed = e.getValue();
            log.debug("Змінено стан збитого наповнювача: {}", compressed);

            notifyFillerChange();
        });
    }

    /**
     * Оновлює видимість поля власного наповнювача.
     */
    private void updateCustomFillerFieldVisibility(String selectedType) {
        boolean isCustomType = "Інше".equals(selectedType);

        customFillerField.setVisible(isCustomType);

        if (isCustomType) {
            customFillerField.focus();
        } else {
            customFillerField.clear();
        }
    }

    /**
     * Повідомляє про зміну наповнювача.
     */
    private void notifyFillerChange() {
        if (onFillerChanged != null) {
            FillerSelection selection = new FillerSelection();
            selection.setFillerType(fillerTypeComboBox.getValue());
            selection.setCustomFillerType(customFillerField.isVisible() ? customFillerField.getValue() : null);
            selection.setFillerCompressed(fillerCompressedCheckbox.getValue());

            onFillerChanged.accept(selection);
        }
    }

    /**
     * Завантажує доступні типи наповнювачів.
     */
    public void loadFillerTypes(List<String> fillerTypes) {
        log.debug("Завантаження {} типів наповнювачів", fillerTypes.size());

        fillerTypeComboBox.setItems(fillerTypes);
    }

    /**
     * Встановлює вибраний наповнювач.
     */
    public void setSelectedFiller(String fillerType, String customFillerType, Boolean compressed) {
        log.debug("Встановлення наповнювача: {} (власний: {}, збитий: {})",
                 fillerType, customFillerType, compressed);

        if (fillerType != null) {
            fillerTypeComboBox.setValue(fillerType);

            // Якщо це власний тип наповнювача
            if ("Інше".equals(fillerType) && customFillerType != null && !customFillerType.trim().isEmpty()) {
                customFillerField.setValue(customFillerType);
                customFillerField.setVisible(true);
            }
        }

        if (compressed != null) {
            fillerCompressedCheckbox.setValue(compressed);
        }
    }

    /**
     * Повертає поточний вибір наповнювача.
     */
    public FillerSelection getFillerSelection() {
        FillerSelection selection = new FillerSelection();
        selection.setFillerType(fillerTypeComboBox.getValue());
        selection.setCustomFillerType(customFillerField.isVisible() ? customFillerField.getValue() : null);
        selection.setFillerCompressed(fillerCompressedCheckbox.getValue());
        return selection;
    }

    /**
     * Встановлює обробник зміни наповнювача.
     */
    public void setOnFillerChanged(Consumer<FillerSelection> handler) {
        this.onFillerChanged = handler;
    }

    /**
     * Очищує вибір наповнювача.
     */
    public void clearSelection() {
        fillerTypeComboBox.clear();
        customFillerField.clear();
        customFillerField.setVisible(false);
        fillerCompressedCheckbox.setValue(false);
    }

    /**
     * Перевіряє чи є наповнювач вибраний (для обов'язкових категорій).
     */
    public boolean hasRequiredSelection() {
        String fillerType = fillerTypeComboBox.getValue();
        if (fillerType == null || fillerType.trim().isEmpty()) {
            return false;
        }

        // Якщо вибрано "Інше", перевіряємо чи заповнене поле власного типу
        if ("Інше".equals(fillerType)) {
            String customType = customFillerField.getValue();
            return customType != null && !customType.trim().isEmpty();
        }

        return true;
    }

    /**
     * Встановлює видимість компонента.
     */
    @Override
    public void setVisible(boolean visible) {
        super.setVisible(visible);
        log.debug("Видимість FillerSelectionComponent: {}", visible);
    }

    /**
     * Встановлює обов'язковість вибору наповнювача.
     */
    public void setRequired(boolean required) {
        fillerTypeComboBox.setRequired(required);

        if (required) {
            fillerTypeComboBox.setRequiredIndicatorVisible(true);
        }
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        if (customFillerField.isVisible()) {
            customFillerField.focus();
        } else {
            fillerTypeComboBox.focus();
        }
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        fillerTypeComboBox.setEnabled(enabled);
        customFillerField.setEnabled(enabled);
        fillerCompressedCheckbox.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        fillerTypeComboBox.setInvalid(invalid);
        customFillerField.setInvalid(invalid);

        if (invalid) {
            String errorMessage = customFillerField.isVisible()
                ? "Необхідно вказати тип наповнювача"
                : "Тип наповнювача є обов'язковим для цієї категорії";

            fillerTypeComboBox.setErrorMessage(errorMessage);
            if (customFillerField.isVisible()) {
                customFillerField.setErrorMessage(errorMessage);
            }
        } else {
            fillerTypeComboBox.setErrorMessage(null);
            customFillerField.setErrorMessage(null);
        }
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Клас для передачі даних про вибір наповнювача.
     */
    @Data
    public static class FillerSelection {
        private String fillerType;
        private String customFillerType;
        private Boolean fillerCompressed;

        /**
         * Повертає фінальний тип наповнювача (основний або власний).
         */
        public String getFinalFillerType() {
            return "Інше".equals(fillerType) && customFillerType != null ? customFillerType : fillerType;
        }
    }
}
