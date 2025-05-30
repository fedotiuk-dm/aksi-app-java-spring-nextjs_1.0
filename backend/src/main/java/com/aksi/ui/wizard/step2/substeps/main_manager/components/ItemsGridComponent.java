package com.aksi.ui.wizard.step2.substeps.main_manager.components;

import java.util.List;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step2.substeps.main_manager.domain.ItemsManagerState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.data.renderer.ComponentRenderer;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для відображення таблиці предметів замовлення.
 * Дотримується принципу SRP - відповідає тільки за відображення сітки.
 */
@Slf4j
public class ItemsGridComponent extends VerticalLayout {

    // UI елементи
    private Grid<OrderItemDTO> itemsGrid;

    // Обробники подій
    private Consumer<OrderItemDTO> onEditItem;
    private Consumer<OrderItemDTO> onDeleteItem;

    public ItemsGridComponent() {
        initializeLayout();
        createComponents();
        log.debug("ItemsGridComponent ініціалізовано");
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(false);
        setSpacing(false);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
    }

    private void createComponents() {
        createItemsGrid();
        add(itemsGrid);
    }

    private void createItemsGrid() {
        itemsGrid = new Grid<>(OrderItemDTO.class, false);
        itemsGrid.setSizeFull();
        itemsGrid.setMinHeight("300px");

        // Колонка найменування
        itemsGrid.addColumn(OrderItemDTO::getName)
                .setHeader("Найменування")
                .setFlexGrow(2)
                .setSortable(true)
                .setResizable(true);

        // Колонка категорії
        itemsGrid.addColumn(OrderItemDTO::getCategory)
                .setHeader("Категорія")
                .setFlexGrow(1)
                .setSortable(true)
                .setResizable(true);

        // Колонка кількості з одиницею виміру
        itemsGrid.addColumn(this::formatQuantityWithUnit)
                .setHeader("Кількість")
                .setFlexGrow(1)
                .setResizable(true);

        // Колонка матеріалу
        itemsGrid.addColumn(this::formatMaterial)
                .setHeader("Матеріал")
                .setFlexGrow(1)
                .setResizable(true);

        // Колонка кольору
        itemsGrid.addColumn(this::formatColor)
                .setHeader("Колір")
                .setFlexGrow(1)
                .setResizable(true);

        // Колонка суми
        itemsGrid.addColumn(this::formatPrice)
                .setHeader("Сума")
                .setFlexGrow(1)
                .setResizable(true);

        // Колонка дій
        itemsGrid.addColumn(new ComponentRenderer<>(this::createActionButtons))
                .setHeader("Дії")
                .setFlexGrow(0)
                .setWidth("140px");

        itemsGrid.getStyle()
                .set("border", "1px solid var(--lumo-contrast-20pct)")
                .set("border-radius", "var(--lumo-border-radius-m)");
    }

    private String formatQuantityWithUnit(OrderItemDTO item) {
        String unit = item.getUnitOfMeasure() != null ? item.getUnitOfMeasure() : "шт";
        return item.getQuantity() + " " + unit;
    }

    private String formatMaterial(OrderItemDTO item) {
        return item.getMaterial() != null ? item.getMaterial() : "—";
    }

    private String formatColor(OrderItemDTO item) {
        return item.getColor() != null ? item.getColor() : "—";
    }

    private String formatPrice(OrderItemDTO item) {
        if (item.getTotalPrice() != null) {
            return String.format("%.2f ₴", item.getTotalPrice());
        }
        return "—";
    }

    private HorizontalLayout createActionButtons(OrderItemDTO item) {
        Button editButton = new Button(VaadinIcon.EDIT.create());
        editButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY, ButtonVariant.LUMO_SMALL);
        editButton.setTooltipText("Редагувати предмет");
        editButton.addClickListener(e -> notifyEditItem(item));

        Button deleteButton = new Button(VaadinIcon.TRASH.create());
        deleteButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY, ButtonVariant.LUMO_ERROR, ButtonVariant.LUMO_SMALL);
        deleteButton.setTooltipText("Видалити предмет");
        deleteButton.addClickListener(e -> confirmAndDeleteItem(item));

        HorizontalLayout actions = new HorizontalLayout(editButton, deleteButton);
        actions.setSpacing(false);
        actions.setJustifyContentMode(JustifyContentMode.CENTER);
        return actions;
    }

    private void confirmAndDeleteItem(OrderItemDTO item) {
        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Підтвердження видалення");
        dialog.setText(String.format("Ви впевнені, що хочете видалити предмет \"%s\"?", item.getName()));
        dialog.setCancelable(true);
        dialog.setCancelText("Скасувати");
        dialog.setConfirmText("Видалити");
        dialog.setConfirmButtonTheme("error primary");

        dialog.addConfirmListener(e -> notifyDeleteItem(item));
        dialog.open();
    }

    private void notifyEditItem(OrderItemDTO item) {
        log.debug("Запит на редагування предмета: {}", item.getName());
        if (onEditItem != null) {
            onEditItem.accept(item);
        }
    }

    private void notifyDeleteItem(OrderItemDTO item) {
        log.debug("Запит на видалення предмета: {}", item.getName());
        if (onDeleteItem != null) {
            onDeleteItem.accept(item);
        }
    }

    /**
     * Завантажує предмети в сітку.
     */
    public void loadItems(List<OrderItemDTO> items) {
        log.debug("Завантаження {} предметів в сітку", items.size());
        itemsGrid.setItems(items);
    }

    /**
     * Оновлює відображення сітки з новим станом.
     */
    public void updateFromState(ItemsManagerState state) {
        loadItems(state.getItems());
        updateGridStyles(state);
    }

    /**
     * Оновлює стилі сітки відповідно до стану.
     */
    private void updateGridStyles(ItemsManagerState state) {
        if (state.isLoading()) {
            itemsGrid.getStyle().set("opacity", "0.6");
        } else {
            itemsGrid.getStyle().remove("opacity");
        }
    }

    /**
     * Очищає сітку.
     */
    public void clearItems() {
        log.debug("Очищення сітки предметів");
        itemsGrid.setItems();
    }

    /**
     * Встановлює обробник редагування предмета.
     */
    public void setOnEditItem(Consumer<OrderItemDTO> handler) {
        this.onEditItem = handler;
    }

    /**
     * Встановлює обробник видалення предмета.
     */
    public void setOnDeleteItem(Consumer<OrderItemDTO> handler) {
        this.onDeleteItem = handler;
    }

    /**
     * Повертає кількість відображених предметів.
     */
    public int getDisplayedItemsCount() {
        return itemsGrid.getDataProvider().size(null);
    }

    /**
     * Перевіряє чи є предмети в сітці.
     */
    public boolean hasItems() {
        return getDisplayedItemsCount() > 0;
    }

    /**
     * Встановлює enabled стан сітки.
     */
    public void setEnabled(boolean enabled) {
        itemsGrid.setEnabled(enabled);
        if (!enabled) {
            itemsGrid.getStyle().set("opacity", "0.6");
        } else {
            itemsGrid.getStyle().remove("opacity");
        }
    }

    /**
     * Встановлює висоту сітки.
     */
    public void setGridHeight(String height) {
        itemsGrid.setHeight(height);
    }

    /**
     * Оновлює одиничний предмет в сітці.
     */
    public void updateSingleItem(OrderItemDTO updatedItem) {
        itemsGrid.getDataProvider().refreshItem(updatedItem);
    }
}
