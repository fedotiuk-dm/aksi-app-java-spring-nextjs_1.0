package com.aksi.ui.wizard.step2.substeps.item_info.components;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.ui.wizard.step2.substeps.item_info.domain.ItemBasicInfoState;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору найменування предмета.
 * Відповідає принципу єдиної відповідальності (SRP).
 */
@Slf4j
public class ItemSelectionComponent extends VerticalLayout {

    // UI компоненти
    private ComboBox<ItemBasicInfoState.ItemOption> itemComboBox;

    // Функціональний інтерфейс для 4 параметрів
    public interface ItemSelectedHandler {
        void onItemSelected(String itemId, String itemName, String unitOfMeasure, BigDecimal unitPrice);
    }

    private ItemSelectedHandler onItemSelected;

    public ItemSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("ItemSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(false);
        setWidthFull();
    }

    private void createComponents() {
        itemComboBox = new ComboBox<>("Найменування виробу");
        itemComboBox.setItemLabelGenerator(item -> String.format("%s (%.2f ₴/%s)",
                item.name(), item.basePrice(), item.unitOfMeasure()));
        itemComboBox.setPlaceholder("Спочатку оберіть категорію");
        itemComboBox.setRequired(true);
        itemComboBox.setWidthFull();
        itemComboBox.setClearButtonVisible(true);
        itemComboBox.setAllowCustomValue(false);
        itemComboBox.setEnabled(false); // Спочатку неактивний

        add(itemComboBox);
    }

    private void setupEventHandlers() {
        itemComboBox.addValueChangeListener(event -> {
            ItemBasicInfoState.ItemOption selectedItem = event.getValue();

            if (selectedItem != null) {
                log.debug("Вибрано предмет: {} - {} за {} ₴/{}",
                         selectedItem.id(), selectedItem.name(),
                         selectedItem.basePrice(), selectedItem.unitOfMeasure());
                notifyItemSelected(selectedItem);
            } else {
                log.debug("Скинуто вибір предмета");
                notifyItemSelected(null);
            }
        });
    }

    private void notifyItemSelected(ItemBasicInfoState.ItemOption item) {
        if (onItemSelected != null) {
            if (item != null) {
                onItemSelected.onItemSelected(
                        item.id(),
                        item.name(),
                        item.unitOfMeasure(),
                        item.basePrice()
                );
            } else {
                onItemSelected.onItemSelected(null, null, null, null);
            }
        }
    }

    /**
     * Завантажує доступні предмети.
     */
    public void loadItems(List<ItemBasicInfoState.ItemOption> items) {
        log.debug("Завантаження {} предметів", items.size());

        itemComboBox.setItems(items);

        if (items.isEmpty()) {
            itemComboBox.setPlaceholder("Немає доступних предметів для вибраної категорії");
            itemComboBox.setEnabled(false);
        } else {
            itemComboBox.setPlaceholder("Оберіть найменування виробу");
            itemComboBox.setEnabled(true);
        }
    }

    /**
     * Встановлює вибраний предмет.
     */
    public void setSelectedItem(String itemId, String itemName) {
        if (itemId == null || itemName == null) {
            itemComboBox.clear();
            return;
        }

        log.debug("Встановлення вибраного предмета: {} - {}", itemId, itemName);

        // Шукаємо предмет за ID
        itemComboBox.getListDataView().getItems()
                .filter(item -> item.id().equals(itemId))
                .findFirst()
                .ifPresentOrElse(
                        itemComboBox::setValue,
                        () -> log.warn("Предмет з ID {} не знайдено", itemId)
                );
    }

    /**
     * Повертає вибраний предмет.
     */
    public ItemSelection getItemSelection() {
        ItemBasicInfoState.ItemOption selected = itemComboBox.getValue();
        return new ItemSelection(
                selected != null ? selected.id() : null,
                selected != null ? selected.name() : null,
                selected != null ? selected.unitOfMeasure() : null,
                selected != null ? selected.basePrice() : null,
                selected != null
        );
    }

    /**
     * Встановлює обробник вибору предмета.
     */
    public void setOnItemSelected(ItemSelectedHandler handler) {
        this.onItemSelected = handler;
    }

    /**
     * Очищає вибір предмета.
     */
    public void clearSelection() {
        log.debug("Очищення вибору предмета");
        itemComboBox.clear();
    }

    /**
     * Перевіряє чи є вибраний предмет.
     */
    public boolean hasSelection() {
        return itemComboBox.getValue() != null;
    }

    /**
     * Встановлює стан активності компонента.
     */
    public void setSelectionEnabled(boolean enabled) {
        itemComboBox.setEnabled(enabled);

        if (!enabled) {
            itemComboBox.setPlaceholder("Спочатку оберіть категорію");
            itemComboBox.clear();
        }

        // Візуальне відображення стану
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        if (itemComboBox.isEnabled()) {
            itemComboBox.focus();
        }
    }

    /**
     * Встановлює стан доступності компонента.
     */
    public void setEnabled(boolean enabled) {
        itemComboBox.setEnabled(enabled);

        // Візуальне відображення стану
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює стан валідності компонента.
     */
    public void setInvalid(boolean invalid) {
        itemComboBox.setInvalid(invalid);

        if (invalid) {
            itemComboBox.setErrorMessage("Будь ласка, оберіть найменування виробу");
        } else {
            itemComboBox.setErrorMessage(null);
        }
    }

    /**
     * Встановлює текст підказки.
     */
    public void setHelperText(String helperText) {
        itemComboBox.setHelperText(helperText);
    }

    /**
     * Повертає кількість доступних предметів.
     */
    public int getAvailableItemsCount() {
        return itemComboBox.getListDataView().getItemCount();
    }

    /**
     * Перевіряє чи є доступні предмети.
     */
    public boolean hasAvailableItems() {
        return getAvailableItemsCount() > 0;
    }

    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Результат вибору предмета.
     */
    public static class ItemSelection {
        private final String selectedItemId;
        private final String selectedItemName;
        private final String unitOfMeasure;
        private final BigDecimal unitPrice;
        private final boolean hasSelection;

        public ItemSelection(String selectedItemId, String selectedItemName,
                           String unitOfMeasure, BigDecimal unitPrice, boolean hasSelection) {
            this.selectedItemId = selectedItemId;
            this.selectedItemName = selectedItemName;
            this.unitOfMeasure = unitOfMeasure;
            this.unitPrice = unitPrice;
            this.hasSelection = hasSelection;
        }

        public String getSelectedItemId() {
            return selectedItemId;
        }

        public String getSelectedItemName() {
            return selectedItemName;
        }

        public String getUnitOfMeasure() {
            return unitOfMeasure;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public boolean hasSelection() {
            return hasSelection;
        }

        public boolean isValid() {
            return hasSelection && selectedItemId != null && !selectedItemId.trim().isEmpty()
                    && unitPrice != null && unitPrice.compareTo(BigDecimal.ZERO) > 0;
        }
    }
}
