package com.aksi.ui.wizard.step2.substeps.item_defects.components;

import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;

import com.vaadin.flow.component.checkbox.CheckboxGroup;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору плям предмета з підтримкою власних типів.
 * Відповідає тільки за логіку вибору плям (SRP).
 */
@Slf4j
public class StainsSelectionComponent extends VerticalLayout {

    private CheckboxGroup<String> stainsCheckboxGroup;
    private TextField otherStainField;

    private BiConsumer<Set<String>, String> onStainsChanged; // (selectedStains, otherStains)

    public StainsSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("StainsSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Плями");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        stainsCheckboxGroup = new CheckboxGroup<>();
        stainsCheckboxGroup.setLabel("Виберіть типи плям");
        stainsCheckboxGroup.getStyle().set("--lumo-checkbox-group-column-count", "2");

        otherStainField = new TextField("Інша пляма");
        otherStainField.setPlaceholder("Вкажіть тип плями");
        otherStainField.setVisible(false);
        otherStainField.setWidthFull();
        otherStainField.setMaxLength(100);

        add(title, stainsCheckboxGroup, otherStainField);
    }

    private void setupEventHandlers() {
        // Обробка зміни вибраних плям
        stainsCheckboxGroup.addSelectionListener(e -> {
            Set<String> selectedStains = e.getValue();
            log.debug("Змінено вибір плям: {}", selectedStains);

            updateOtherStainFieldVisibility(selectedStains);
            notifyStainsChange(selectedStains);
        });

        // Обробка змін у полі власної плями
        otherStainField.addValueChangeListener(e -> {
            String otherStains = e.getValue();
            log.debug("Змінено власну пляму: {}", otherStains);

            notifyStainsChange(stainsCheckboxGroup.getValue());
        });
    }

    /**
     * Оновлює видимість поля власної плями.
     */
    private void updateOtherStainFieldVisibility(Set<String> selectedStains) {
        boolean shouldShowOtherField = selectedStains.contains("Інше");

        otherStainField.setVisible(shouldShowOtherField);

        if (shouldShowOtherField) {
            otherStainField.focus();
        } else {
            otherStainField.clear();
        }
    }

    /**
     * Повідомляє про зміну плям.
     */
    private void notifyStainsChange(Set<String> selectedStains) {
        if (onStainsChanged != null) {
            String otherStains = otherStainField.isVisible() ? otherStainField.getValue() : null;
            onStainsChanged.accept(selectedStains, otherStains);
        }
    }

    /**
     * Завантажує доступні типи плям.
     */
    public void loadStainTypes(List<String> stainTypes) {
        log.debug("Завантаження {} типів плям", stainTypes.size());

        stainsCheckboxGroup.setItems(stainTypes);
    }

    /**
     * Встановлює вибрані плями.
     */
    public void setSelectedStains(Set<String> selectedStains, String otherStains) {
        log.debug("Встановлення плям: {} (власна: {})", selectedStains, otherStains);

        stainsCheckboxGroup.setValue(selectedStains);

        if (selectedStains.contains("Інше") && otherStains != null && !otherStains.trim().isEmpty()) {
            otherStainField.setValue(otherStains);
            otherStainField.setVisible(true);
        }
    }

    /**
     * Повертає поточний вибір плям.
     */
    public StainSelection getStainSelection() {
        StainSelection selection = new StainSelection();
        selection.setSelectedStains(stainsCheckboxGroup.getValue());
        selection.setOtherStains(otherStainField.isVisible() ? otherStainField.getValue() : null);
        return selection;
    }

    /**
     * Встановлює обробник зміни плям.
     */
    public void setOnStainsChanged(BiConsumer<Set<String>, String> handler) {
        this.onStainsChanged = handler;
    }

    /**
     * Очищує вибір плям.
     */
    public void clearSelection() {
        stainsCheckboxGroup.clear();
        otherStainField.clear();
        otherStainField.setVisible(false);
    }

    /**
     * Перевіряє чи є плями вибрані.
     */
    public boolean hasSelection() {
        Set<String> selected = stainsCheckboxGroup.getValue();

        if (selected.isEmpty()) {
            return false;
        }

        // Якщо вибрано "Інше", перевіряємо чи заповнене поле
        if (selected.contains("Інше")) {
            String otherStains = otherStainField.getValue();
            return otherStains != null && !otherStains.trim().isEmpty();
        }

        return true;
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        if (otherStainField.isVisible()) {
            otherStainField.focus();
        }
        // CheckboxGroup не має методу focus(), тому просто не викликаємо його
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        stainsCheckboxGroup.setEnabled(enabled);
        otherStainField.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        if (invalid) {
            stainsCheckboxGroup.setErrorMessage("Необхідно вказати тип плям");
            if (otherStainField.isVisible()) {
                otherStainField.setInvalid(true);
                otherStainField.setErrorMessage("Необхідно вказати тип іншої плями");
            }
        } else {
            stainsCheckboxGroup.setErrorMessage(null);
            otherStainField.setInvalid(false);
            otherStainField.setErrorMessage(null);
        }
    }

    /**
     * Встановлює підказку для користувача.
     */
    public void setHelperText(String helperText) {
        stainsCheckboxGroup.setHelperText(helperText);
    }

    /**
     * Повертає кількість вибраних плям.
     */
    public int getSelectedCount() {
        return stainsCheckboxGroup.getValue().size();
    }

    /**
     * Перевіряє чи вибрана власна пляма.
     */
    public boolean hasOtherStain() {
        return stainsCheckboxGroup.getValue().contains("Інше") &&
               otherStainField.getValue() != null && !otherStainField.getValue().trim().isEmpty();
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Клас для передачі даних про вибір плям.
     */
    @Data
    public static class StainSelection {
        private Set<String> selectedStains;
        private String otherStains;

        /**
         * Перевіряє чи є вибір валідним.
         */
        public boolean isValid() {
            if (selectedStains == null || selectedStains.isEmpty()) {
                return true; // Плями не обов'язкові
            }

            // Якщо вибрано "Інше", перевіряємо чи вказано тип
            if (selectedStains.contains("Інше")) {
                return otherStains != null && !otherStains.trim().isEmpty();
            }

            return true;
        }

        /**
         * Повертає загальну кількість плям.
         */
        public int getTotalCount() {
            return selectedStains != null ? selectedStains.size() : 0;
        }
    }
}
