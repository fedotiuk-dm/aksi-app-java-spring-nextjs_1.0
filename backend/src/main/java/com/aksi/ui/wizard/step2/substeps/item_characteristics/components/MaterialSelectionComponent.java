package com.aksi.ui.wizard.step2.substeps.item_characteristics.components;

import java.util.List;
import java.util.function.Consumer;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору матеріалу предмета.
 * Відповідає тільки за логіку вибору матеріалу (SRP).
 */
@Slf4j
public class MaterialSelectionComponent extends VerticalLayout {

    private ComboBox<String> materialComboBox;
    private Consumer<String> onMaterialChanged;

    public MaterialSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("MaterialSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Матеріал");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        materialComboBox = new ComboBox<>("Тип матеріалу");
        materialComboBox.setPlaceholder("Оберіть матеріал");
        materialComboBox.setRequired(true);
        materialComboBox.setClearButtonVisible(true);
        materialComboBox.setWidthFull();

        add(title, materialComboBox);
    }

    private void setupEventHandlers() {
        materialComboBox.addValueChangeListener(e -> {
            String selectedMaterial = e.getValue();
            log.debug("Обрано матеріал: {}", selectedMaterial);

            if (onMaterialChanged != null) {
                onMaterialChanged.accept(selectedMaterial);
            }
        });
    }

    /**
     * Завантажує доступні матеріали.
     */
    public void loadMaterials(List<String> materials) {
        log.debug("Завантаження {} матеріалів", materials.size());

        materialComboBox.setItems(materials);
        log.debug("Матеріали завантажено в ComboBox");
    }

    /**
     * Встановлює вибраний матеріал.
     */
    public void setSelectedMaterial(String material) {
        log.debug("Встановлення матеріалу: {}", material);
        materialComboBox.setValue(material);
    }

    /**
     * Повертає вибраний матеріал.
     */
    public String getSelectedMaterial() {
        return materialComboBox.getValue();
    }

    /**
     * Встановлює обробник зміни матеріалу.
     */
    public void setOnMaterialChanged(Consumer<String> handler) {
        this.onMaterialChanged = handler;
    }

    /**
     * Очищує вибір матеріалу.
     */
    public void clearSelection() {
        materialComboBox.clear();
    }

    /**
     * Перевіряє чи є матеріал вибраний.
     */
    public boolean hasSelection() {
        return materialComboBox.getValue() != null && !materialComboBox.getValue().trim().isEmpty();
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        materialComboBox.focus();
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        materialComboBox.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        materialComboBox.setInvalid(invalid);
        if (invalid) {
            materialComboBox.setErrorMessage("Матеріал є обов'язковим");
        } else {
            materialComboBox.setErrorMessage(null);
        }
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }
}
