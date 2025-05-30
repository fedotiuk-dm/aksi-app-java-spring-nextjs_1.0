package com.aksi.ui.wizard.step2.substeps.item_characteristics.components;

import java.util.List;
import java.util.function.BiConsumer;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору кольору предмета з підтримкою власного кольору.
 * Відповідає тільки за логіку вибору кольору (SRP).
 */
@Slf4j
public class ColorSelectionComponent extends VerticalLayout {

    private ComboBox<String> colorComboBox;
    private TextField customColorField;

    private BiConsumer<String, String> onColorChanged; // (color, customColor)
    private List<String> availableColors;

    public ColorSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("ColorSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Колір");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        colorComboBox = new ComboBox<>("Основний колір");
        colorComboBox.setPlaceholder("Оберіть колір або введіть власний");
        colorComboBox.setRequired(true);
        colorComboBox.setClearButtonVisible(true);
        colorComboBox.setAllowCustomValue(true);
        colorComboBox.setWidthFull();

        customColorField = new TextField("Власний колір");
        customColorField.setPlaceholder("Введіть назву кольору");
        customColorField.setVisible(false);
        customColorField.setWidthFull();

        add(title, colorComboBox, customColorField);
    }

    private void setupEventHandlers() {
        // Обробка вибору з випадаючого списку
        colorComboBox.addValueChangeListener(e -> {
            String selectedColor = e.getValue();
            log.debug("Обрано колір: {}", selectedColor);

            handleColorChange(selectedColor);
        });

        // Обробка введення власного кольору
        colorComboBox.addCustomValueSetListener(e -> {
            String customValue = e.getDetail();
            log.debug("Введено власний колір: {}", customValue);

            // Встановлюємо власний колір як вибраний
            colorComboBox.setValue(customValue);
            handleColorChange(customValue);
        });

        // Обробка змін у полі власного кольору
        customColorField.addValueChangeListener(e -> {
            String customColor = e.getValue();
            log.debug("Змінено власний колір: {}", customColor);

            notifyColorChange();
        });
    }

    /**
     * Обробляє зміну кольору.
     */
    private void handleColorChange(String selectedColor) {
        updateCustomColorFieldVisibility(selectedColor);
        notifyColorChange();
    }

    /**
     * Оновлює видимість поля власного кольору.
     */
    private void updateCustomColorFieldVisibility(String selectedColor) {
        boolean isCustomColor = selectedColor != null &&
                               !availableColors.contains(selectedColor);

        customColorField.setVisible(isCustomColor);

        if (isCustomColor) {
            customColorField.setValue(selectedColor);
            customColorField.focus();
        } else {
            customColorField.clear();
        }
    }

    /**
     * Повідомляє про зміну кольору.
     */
    private void notifyColorChange() {
        if (onColorChanged != null) {
            String selectedColor = colorComboBox.getValue();
            String customColor = customColorField.isVisible() ? customColorField.getValue() : null;

            onColorChanged.accept(selectedColor, customColor);
        }
    }

    /**
     * Завантажує доступні кольори.
     */
    public void loadColors(List<String> colors) {
        log.debug("Завантаження {} кольорів", colors.size());

        this.availableColors = colors;
        colorComboBox.setItems(colors);
    }

    /**
     * Встановлює вибраний колір.
     */
    public void setSelectedColor(String color, String customColor) {
        log.debug("Встановлення кольору: {} (власний: {})", color, customColor);

        if (color != null) {
            colorComboBox.setValue(color);

            // Якщо це власний колір
            if (customColor != null && !customColor.trim().isEmpty()) {
                customColorField.setValue(customColor);
                customColorField.setVisible(true);
            }
        }
    }

    /**
     * Повертає вибраний основний колір.
     */
    public String getSelectedColor() {
        return colorComboBox.getValue();
    }

    /**
     * Повертає власний колір (якщо введений).
     */
    public String getCustomColor() {
        return customColorField.isVisible() ? customColorField.getValue() : null;
    }

    /**
     * Повертає фінальний колір (основний або власний).
     */
    public String getFinalColor() {
        if (customColorField.isVisible() && customColorField.getValue() != null) {
            return customColorField.getValue();
        }
        return colorComboBox.getValue();
    }

    /**
     * Встановлює обробник зміни кольору.
     */
    public void setOnColorChanged(BiConsumer<String, String> handler) {
        this.onColorChanged = handler;
    }

    /**
     * Очищує вибір кольору.
     */
    public void clearSelection() {
        colorComboBox.clear();
        customColorField.clear();
        customColorField.setVisible(false);
    }

    /**
     * Перевіряє чи є колір вибраний.
     */
    public boolean hasSelection() {
        String color = colorComboBox.getValue();
        if (color == null || color.trim().isEmpty()) {
            return false;
        }

        // Якщо це власний колір, перевіряємо чи заповнене поле
        if (customColorField.isVisible()) {
            String customColor = customColorField.getValue();
            return customColor != null && !customColor.trim().isEmpty();
        }

        return true;
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        if (customColorField.isVisible()) {
            customColorField.focus();
        } else {
            colorComboBox.focus();
        }
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        colorComboBox.setEnabled(enabled);
        customColorField.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        colorComboBox.setInvalid(invalid);
        customColorField.setInvalid(invalid);

        if (invalid) {
            String errorMessage = customColorField.isVisible()
                ? "Необхідно вказати власний колір"
                : "Колір є обов'язковим";

            colorComboBox.setErrorMessage(errorMessage);
            if (customColorField.isVisible()) {
                customColorField.setErrorMessage(errorMessage);
            }
        } else {
            colorComboBox.setErrorMessage(null);
            customColorField.setErrorMessage(null);
        }
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }
}
