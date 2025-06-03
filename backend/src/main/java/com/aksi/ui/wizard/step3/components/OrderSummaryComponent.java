package com.aksi.ui.wizard.step3.components;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.H5;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для відображення підсумку замовлення.
 * Показує всі предмети та загальні модифікатори ціни.
 */
@Slf4j
public class OrderSummaryComponent extends VerticalLayout {

    // UI елементи
    private Grid<OrderItemDTO> itemsGrid;
    private VerticalLayout summaryLayout;
    private Span subtotalLabel;
    private Span discountLabel;
    private Span urgencyLabel;
    private Span totalLabel;

    // Event handlers
    private Consumer<BigDecimal> onTotalChanged;

    // Стан
    private OrderParametersState currentState;
    private List<OrderItemDTO> currentItems;

    public OrderSummaryComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("OrderSummaryComponent ініціалізовано");
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
        H4 sectionTitle = new H4("3.0. Підсумок замовлення");
        sectionTitle.getStyle().set("margin-top", "0");

        // Сітка предметів
        createItemsGrid();

        // Підсумковий розрахунок
        createSummaryLayout();

        add(sectionTitle, itemsGrid, summaryLayout);
    }

    private void createItemsGrid() {
        itemsGrid = new Grid<>(OrderItemDTO.class, false);
        itemsGrid.setHeight("200px");
        itemsGrid.addClassName("order-items-grid");

        itemsGrid.addColumn(OrderItemDTO::getName)
                .setHeader("Найменування")
                .setFlexGrow(2);

        itemsGrid.addColumn(OrderItemDTO::getCategory)
                .setHeader("Категорія")
                .setFlexGrow(1);

        itemsGrid.addColumn(item -> String.format("%d %s",
                item.getQuantity(),
                item.getUnitOfMeasure()))
                .setHeader("Кількість")
                .setFlexGrow(0);

        itemsGrid.addColumn(item -> formatPrice(item.getUnitPrice()))
                .setHeader("Ціна за од.")
                .setFlexGrow(0);

        itemsGrid.addColumn(item -> formatPrice(item.getTotalPrice()))
                .setHeader("Загалом")
                .setFlexGrow(0);
    }

    private void createSummaryLayout() {
        summaryLayout = new VerticalLayout();
        summaryLayout.setPadding(false);
        summaryLayout.setSpacing(false);
        summaryLayout.getStyle()
            .set("background", "var(--lumo-primary-color-10pct)")
            .set("padding", "var(--lumo-space-s)")
            .set("border-radius", "var(--lumo-border-radius-s)");

        H5 summaryTitle = new H5("Розрахунок вартості");
        summaryTitle.getStyle().set("margin", "0 0 var(--lumo-space-xs) 0");

        subtotalLabel = new Span();
        discountLabel = new Span();
        urgencyLabel = new Span();
        totalLabel = new Span();

        // Стилізація для підсумкової суми
        totalLabel.getStyle()
            .set("font-weight", "bold")
            .set("font-size", "var(--lumo-font-size-l)")
            .set("color", "var(--lumo-primary-text-color)");

        summaryLayout.add(summaryTitle, subtotalLabel, discountLabel, urgencyLabel, totalLabel);
    }

    private void setupEventHandlers() {
        // Поки що немає обробників подій
    }

    /**
     * Оновлює компонент з поточного domain state.
     */
    public void updateFromState(OrderParametersState state) {
        this.currentState = state;

        if (state != null) {
            updateSummaryLabels(state);
            log.debug("Компонент підсумку оновлено з стану");
        }
    }

    /**
     * Встановлює предмети замовлення.
     */
    public void setOrderItems(List<OrderItemDTO> items) {
        this.currentItems = items;
        itemsGrid.setItems(items);

        if (currentState != null) {
            updateSummaryLabels(currentState);
        }

        log.debug("Встановлено {} предметів в підсумок", items.size());
    }

    private void updateSummaryLabels(OrderParametersState state) {
        // Підсумок предметів
        BigDecimal itemsTotal = currentItems != null
            ? currentItems.stream()
                .map(OrderItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
            : BigDecimal.ZERO;

        subtotalLabel.setText("Вартість предметів: " + formatPrice(itemsTotal));

        // Знижка
        if (state.getDiscountType() != OrderParametersState.DiscountType.NONE) {
            BigDecimal discountPercent = state.getEffectiveDiscountPercent();
            BigDecimal discountAmount = itemsTotal.multiply(discountPercent).divide(BigDecimal.valueOf(100));
            discountLabel.setText(String.format("Знижка (%s, %.0f%%): -%s",
                state.getDiscountType().getLabel(),
                discountPercent.doubleValue(),
                formatPrice(discountAmount)));
            discountLabel.setVisible(true);
            discountLabel.getStyle().set("color", "var(--lumo-success-text-color)");
        } else {
            discountLabel.setText("");
            discountLabel.setVisible(false);
        }

        // Терміновість
        if (state.getUrgencyOption().getSurchargePercent() > 0) {
            BigDecimal urgencyPercent = BigDecimal.valueOf(state.getUrgencyOption().getSurchargePercent());
            BigDecimal urgencyAmount = itemsTotal.multiply(urgencyPercent).divide(BigDecimal.valueOf(100));
            urgencyLabel.setText(String.format("Терміновість (%s, +%d%%): +%s",
                state.getUrgencyOption().getLabel(),
                state.getUrgencyOption().getSurchargePercent(),
                formatPrice(urgencyAmount)));
            urgencyLabel.setVisible(true);
            urgencyLabel.getStyle().set("color", "var(--lumo-error-text-color)");
        } else {
            urgencyLabel.setText("");
            urgencyLabel.setVisible(false);
        }

        // Загальна сума
        BigDecimal totalAmount = state.getTotalAmount() != null ? state.getTotalAmount() : itemsTotal;
        totalLabel.setText("Загальна сума: " + formatPrice(totalAmount));

        // Нотифікація про зміну загальної суми
        if (onTotalChanged != null) {
            onTotalChanged.accept(totalAmount);
        }
    }

    private String formatPrice(BigDecimal price) {
        return String.format("₴%.2f", price.doubleValue());
    }

    /**
     * Показує детальну інформацію про розрахунок.
     */
    public void showDetailedCalculation() {
        if (currentState != null && currentItems != null) {
            Span detailsInfo = new Span("Детальний розрахунок доступний у квитанції");
            detailsInfo.getStyle()
                .set("font-size", "var(--lumo-font-size-s)")
                .set("color", "var(--lumo-secondary-text-color)")
                .set("font-style", "italic");

            add(detailsInfo);
            log.debug("Показано детальну інформацію про розрахунок");
        }
    }

    /**
     * Отримати загальну суму.
     */
    public BigDecimal getTotalAmount() {
        return currentState != null ? currentState.getTotalAmount() : BigDecimal.ZERO;
    }

    /**
     * Перевірити чи компонент валідний.
     */
    public boolean isValid() {
        return currentItems != null && !currentItems.isEmpty() &&
               getTotalAmount().compareTo(BigDecimal.ZERO) > 0;
    }

    // Event handlers setters

    public void setOnTotalChanged(Consumer<BigDecimal> handler) {
        this.onTotalChanged = handler;
    }

    // Геттери для тестування

    protected Grid<OrderItemDTO> getItemsGrid() {
        return itemsGrid;
    }

    protected VerticalLayout getSummaryLayout() {
        return summaryLayout;
    }
}
