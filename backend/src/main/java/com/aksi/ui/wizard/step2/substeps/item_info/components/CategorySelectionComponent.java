package com.aksi.ui.wizard.step2.substeps.item_info.components;

import java.util.List;
import java.util.function.BiConsumer;

import com.aksi.ui.wizard.step2.substeps.item_info.domain.ItemBasicInfoState;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору категорії послуги.
 * Відповідає принципу єдиної відповідальності (SRP).
 */
@Slf4j
public class CategorySelectionComponent extends VerticalLayout {

    // UI компоненти
    private ComboBox<ItemBasicInfoState.CategoryOption> categoryComboBox;

    private BiConsumer<String, String> onCategorySelected; // (categoryId, categoryName)

    public CategorySelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("CategorySelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(false);
        setWidthFull();
    }

    private void createComponents() {
        categoryComboBox = new ComboBox<>("Категорія послуги");
        categoryComboBox.setItemLabelGenerator(ItemBasicInfoState.CategoryOption::name);
        categoryComboBox.setPlaceholder("Оберіть категорію послуги");
        categoryComboBox.setRequired(true);
        categoryComboBox.setWidthFull();
        categoryComboBox.setClearButtonVisible(true);
        categoryComboBox.setAllowCustomValue(false);

        add(categoryComboBox);
    }

    private void setupEventHandlers() {
        categoryComboBox.addValueChangeListener(event -> {
            ItemBasicInfoState.CategoryOption selectedCategory = event.getValue();

            if (selectedCategory != null) {
                log.debug("Вибрано категорію: {} - {}", selectedCategory.id(), selectedCategory.name());
                notifyCategorySelected(selectedCategory);
            } else {
                log.debug("Скинуто вибір категорії");
                notifyCategorySelected(null);
            }
        });
    }

    private void notifyCategorySelected(ItemBasicInfoState.CategoryOption category) {
        if (onCategorySelected != null) {
            if (category != null) {
                onCategorySelected.accept(category.id(), category.name());
            } else {
                onCategorySelected.accept(null, null);
            }
        }
    }

    /**
     * Завантажує доступні категорії.
     */
    public void loadCategories(List<ItemBasicInfoState.CategoryOption> categories) {
        log.debug("Завантаження {} категорій", categories.size());

        categoryComboBox.setItems(categories);

        if (categories.isEmpty()) {
            categoryComboBox.setPlaceholder("Немає доступних категорій");
            categoryComboBox.setEnabled(false);
        } else {
            categoryComboBox.setPlaceholder("Оберіть категорію послуги");
            categoryComboBox.setEnabled(true);
        }
    }

    /**
     * Встановлює вибрану категорію.
     */
    public void setSelectedCategory(String categoryId, String categoryName) {
        if (categoryId == null || categoryName == null) {
            categoryComboBox.clear();
            return;
        }

        log.debug("Встановлення вибраної категорії: {} - {}", categoryId, categoryName);

        // Шукаємо категорію за ID
        categoryComboBox.getListDataView().getItems()
                .filter(category -> category.id().equals(categoryId))
                .findFirst()
                .ifPresentOrElse(
                        categoryComboBox::setValue,
                        () -> log.warn("Категорію з ID {} не знайдено", categoryId)
                );
    }

    /**
     * Повертає вибрану категорію.
     */
    public CategorySelection getCategorySelection() {
        ItemBasicInfoState.CategoryOption selected = categoryComboBox.getValue();
        return new CategorySelection(
                selected != null ? selected.id() : null,
                selected != null ? selected.name() : null,
                selected != null
        );
    }

    /**
     * Встановлює обробник вибору категорії.
     */
    public void setOnCategorySelected(BiConsumer<String, String> handler) {
        this.onCategorySelected = handler;
    }

    /**
     * Очищає вибір категорії.
     */
    public void clearSelection() {
        log.debug("Очищення вибору категорії");
        categoryComboBox.clear();
    }

    /**
     * Перевіряє чи є вибрана категорія.
     */
    public boolean hasSelection() {
        return categoryComboBox.getValue() != null;
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        categoryComboBox.focus();
    }

    /**
     * Встановлює стан доступності компонента.
     */
    public void setEnabled(boolean enabled) {
        categoryComboBox.setEnabled(enabled);

        // Візуальне відображення стану
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює стан валідності компонента.
     */
    public void setInvalid(boolean invalid) {
        categoryComboBox.setInvalid(invalid);

        if (invalid) {
            categoryComboBox.setErrorMessage("Будь ласка, оберіть категорію послуги");
        } else {
            categoryComboBox.setErrorMessage(null);
        }
    }

    /**
     * Встановлює текст підказки.
     */
    public void setHelperText(String helperText) {
        categoryComboBox.setHelperText(helperText);
    }

    /**
     * Повертає кількість доступних категорій.
     */
    public int getAvailableCategoriesCount() {
        return categoryComboBox.getListDataView().getItemCount();
    }

    /**
     * Перевіряє чи є доступні категорії.
     */
    public boolean hasAvailableCategories() {
        return getAvailableCategoriesCount() > 0;
    }

    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Результат вибору категорії.
     */
    public static class CategorySelection {
        private final String selectedCategoryId;
        private final String selectedCategoryName;
        private final boolean hasSelection;

        public CategorySelection(String selectedCategoryId, String selectedCategoryName, boolean hasSelection) {
            this.selectedCategoryId = selectedCategoryId;
            this.selectedCategoryName = selectedCategoryName;
            this.hasSelection = hasSelection;
        }

        public String getSelectedCategoryId() {
            return selectedCategoryId;
        }

        public String getSelectedCategoryName() {
            return selectedCategoryName;
        }

        public boolean hasSelection() {
            return hasSelection;
        }

        public boolean isValid() {
            return hasSelection && selectedCategoryId != null && !selectedCategoryId.trim().isEmpty();
        }
    }
}
