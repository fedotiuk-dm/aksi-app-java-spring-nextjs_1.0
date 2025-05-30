package com.aksi.ui.wizard.step2.substeps.pricing_calculator.components;

import java.util.List;
import java.util.Set;
import java.util.function.Consumer;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.vaadin.flow.component.checkbox.CheckboxGroup;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.data.renderer.ComponentRenderer;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору модифікаторів цін.
 * Відповідає тільки за логіку вибору модифікаторів (SRP).
 */
@Slf4j
public class ModifiersSelectionComponent extends VerticalLayout {

    private CheckboxGroup<PriceModifierDTO> generalModifiersGroup;
    private CheckboxGroup<PriceModifierDTO> textileModifiersGroup;
    private CheckboxGroup<PriceModifierDTO> leatherModifiersGroup;

    private Consumer<Set<PriceModifierDTO>> onSelectionChanged;

    public ModifiersSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("ModifiersSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Модифікатори ціни");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        FormLayout formLayout = new FormLayout();
        formLayout.setResponsiveSteps(new FormLayout.ResponsiveStep("0", 1));

        // Загальні модифікатори
        generalModifiersGroup = createModifierGroup("Загальні модифікатори");
        formLayout.addFormItem(generalModifiersGroup, "");

        // Модифікатори для текстилю
        textileModifiersGroup = createModifierGroup("Текстильні вироби");
        formLayout.addFormItem(textileModifiersGroup, "");

        // Модифікатори для шкіри
        leatherModifiersGroup = createModifierGroup("Шкіряні вироби");
        formLayout.addFormItem(leatherModifiersGroup, "");

        add(title, formLayout);
    }

    private CheckboxGroup<PriceModifierDTO> createModifierGroup(String label) {
        CheckboxGroup<PriceModifierDTO> group = new CheckboxGroup<>();
        group.setLabel(label);

        // Кастомний рендерер для відображення модифікаторів
        group.setRenderer(new ComponentRenderer<>(modifier -> {
            String labelText = getModifierLabel(modifier);
            return new com.vaadin.flow.component.html.Span(labelText);
        }));

        return group;
    }

    private void setupEventHandlers() {
        // Слухач змін для загальних модифікаторів
        generalModifiersGroup.addValueChangeListener(e -> handleSelectionChange());

        // Слухач змін для текстильних модифікаторів
        textileModifiersGroup.addValueChangeListener(e -> handleSelectionChange());

        // Слухач змін для шкіряних модифікаторів
        leatherModifiersGroup.addValueChangeListener(e -> handleSelectionChange());
    }

    /**
     * Завантажує модифікатори для відповідної категорії.
     */
    public void loadModifiers(ModifierCategory category, List<PriceModifierDTO> modifiers) {
        log.debug("Завантаження {} модифікаторів для категорії {}", modifiers.size(), category);

        switch (category) {
            case GENERAL -> {
                generalModifiersGroup.setItems(modifiers);
                generalModifiersGroup.setVisible(!modifiers.isEmpty());
            }
            case TEXTILE -> {
                textileModifiersGroup.setItems(modifiers);
                textileModifiersGroup.setVisible(!modifiers.isEmpty());
            }
            case LEATHER -> {
                leatherModifiersGroup.setItems(modifiers);
                leatherModifiersGroup.setVisible(!modifiers.isEmpty());
            }
        }
    }

    /**
     * Встановлює вибрані модифікатори.
     */
    public void setSelectedModifiers(Set<PriceModifierDTO> selectedModifiers) {
        log.debug("Встановлення {} вибраних модифікаторів", selectedModifiers.size());

        // Розподіляємо модифікатори по групах
        Set<PriceModifierDTO> generalSelected = selectedModifiers.stream()
                .filter(m -> ModifierCategory.GENERAL.equals(m.getCategory()))
                .collect(java.util.stream.Collectors.toSet());

        Set<PriceModifierDTO> textileSelected = selectedModifiers.stream()
                .filter(m -> ModifierCategory.TEXTILE.equals(m.getCategory()))
                .collect(java.util.stream.Collectors.toSet());

        Set<PriceModifierDTO> leatherSelected = selectedModifiers.stream()
                .filter(m -> ModifierCategory.LEATHER.equals(m.getCategory()))
                .collect(java.util.stream.Collectors.toSet());

        // Встановлюємо значення без тригеру подій
        generalModifiersGroup.setValue(generalSelected);
        textileModifiersGroup.setValue(textileSelected);
        leatherModifiersGroup.setValue(leatherSelected);
    }

    /**
     * Повертає всі вибрані модифікатори.
     */
    public Set<PriceModifierDTO> getSelectedModifiers() {
        Set<PriceModifierDTO> allSelected = new java.util.HashSet<>();

        if (generalModifiersGroup.getValue() != null) {
            allSelected.addAll(generalModifiersGroup.getValue());
        }
        if (textileModifiersGroup.getValue() != null) {
            allSelected.addAll(textileModifiersGroup.getValue());
        }
        if (leatherModifiersGroup.getValue() != null) {
            allSelected.addAll(leatherModifiersGroup.getValue());
        }

        return allSelected;
    }

    /**
     * Встановлює обробник зміни вибору.
     */
    public void setOnSelectionChanged(Consumer<Set<PriceModifierDTO>> handler) {
        this.onSelectionChanged = handler;
    }

    /**
     * Очищує всі вибрані модифікатори.
     */
    public void clearSelection() {
        log.debug("Очищення вибору модифікаторів");

        generalModifiersGroup.clear();
        textileModifiersGroup.clear();
        leatherModifiersGroup.clear();
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        generalModifiersGroup.setEnabled(enabled);
        textileModifiersGroup.setEnabled(enabled);
        leatherModifiersGroup.setEnabled(enabled);

        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Обробляє зміну вибору модифікаторів.
     */
    private void handleSelectionChange() {
        Set<PriceModifierDTO> selectedModifiers = getSelectedModifiers();

        log.debug("Зміна вибору модифікаторів: {} вибрано", selectedModifiers.size());

        if (onSelectionChanged != null) {
            onSelectionChanged.accept(selectedModifiers);
        }
    }

    /**
     * Створює лейбл для модифікатора з ціною.
     */
    private String getModifierLabel(PriceModifierDTO modifier) {
        if (modifier == null) {
            return "";
        }

        StringBuilder label = new StringBuilder(modifier.getName());

        // Додаємо опис зміни ціни
        String changeDescription = modifier.getChangeDescription();
        if (changeDescription != null && !changeDescription.isEmpty()) {
            label.append(" (").append(changeDescription).append(")");
        }

        return label.toString();
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }
}
