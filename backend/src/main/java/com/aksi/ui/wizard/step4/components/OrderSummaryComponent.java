package com.aksi.ui.wizard.step4.components;

import java.util.List;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step4.domain.ConfirmationState;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для відображення підсумку замовлення.
 * Відповідальність: відображення інформації про клієнта, параметри та список предметів.
 */
@Slf4j
public class OrderSummaryComponent extends VerticalLayout {

    // UI компоненти
    private Div clientSummaryPanel;
    private Div orderParametersPanel;
    private Grid<OrderItemDTO> itemsGrid;
    private Div financialSummaryPanel;

    // Поточний стан
    private ConfirmationState currentState;

    public OrderSummaryComponent() {
        initializeComponent();
        createComponents();
        initializeLayout();
        log.debug("OrderSummaryComponent ініціалізовано");
    }

    private void initializeComponent() {
        setPadding(false);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
        addClassName("order-summary-component");
    }

    private void createComponents() {
        H4 sectionTitle = new H4("Перегляд замовлення");
        sectionTitle.getStyle().set("margin-top", "0");

        clientSummaryPanel = createClientSummaryPanel();
        orderParametersPanel = createOrderParametersPanel();
        itemsGrid = createItemsGrid();
        financialSummaryPanel = createFinancialSummaryPanel();

        add(sectionTitle, clientSummaryPanel, orderParametersPanel, itemsGrid, financialSummaryPanel);
    }

    private void initializeLayout() {
        // Додаткові стилі для компонента
        getStyle()
                .set("background", "var(--lumo-base-color)")
                .set("border-radius", "var(--lumo-border-radius-m)")
                .set("padding", "var(--lumo-space-m)");
    }

    private Div createClientSummaryPanel() {
        Div panel = new Div();
        panel.getStyle()
                .set("background", "var(--lumo-primary-color-10pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-m)")
                .set("border-left", "4px solid var(--lumo-primary-color)");
        panel.addClassName("client-summary-panel");

        H4 title = new H4("Інформація про клієнта");
        title.getStyle().set("margin-top", "0");

        Div clientInfo = new Div();
        clientInfo.addClassName("client-info");

        panel.add(title, clientInfo);
        return panel;
    }

    private Div createOrderParametersPanel() {
        Div panel = new Div();
        panel.getStyle()
                .set("background", "var(--lumo-contrast-5pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-m)");
        panel.addClassName("order-parameters-panel");

        H4 title = new H4("Параметри замовлення");
        title.getStyle().set("margin-top", "0");

        Div parametersInfo = new Div();
        parametersInfo.addClassName("parameters-info");

        panel.add(title, parametersInfo);
        return panel;
    }

    private Grid<OrderItemDTO> createItemsGrid() {
        Grid<OrderItemDTO> grid = new Grid<>(OrderItemDTO.class, false);
        grid.setHeight("300px");
        grid.addClassName("items-grid");

        // Колонки
        grid.addColumn(OrderItemDTO::getName)
                .setHeader("Предмет")
                .setFlexGrow(2)
                .setSortable(true);

        grid.addColumn(OrderItemDTO::getCategory)
                .setHeader("Категорія")
                .setFlexGrow(1)
                .setSortable(true);

        grid.addColumn(item -> String.format("%d %s",
                item.getQuantity(),
                item.getUnitOfMeasure() != null ? item.getUnitOfMeasure() : "шт"))
                .setHeader("К-сть")
                .setFlexGrow(1);

        grid.addColumn(OrderItemDTO::getMaterial)
                .setHeader("Матеріал")
                .setFlexGrow(1);

        grid.addColumn(OrderItemDTO::getColor)
                .setHeader("Колір")
                .setFlexGrow(1);

        grid.addColumn(item -> String.format("%.2f ₴",
                item.getTotalPrice() != null ? item.getTotalPrice().doubleValue() : 0.0))
                .setHeader("Сума")
                .setFlexGrow(1);

        // Стилізація
        grid.getStyle()
                .set("border", "1px solid var(--lumo-contrast-20pct)")
                .set("border-radius", "var(--lumo-border-radius-m)");

        return grid;
    }

    private Div createFinancialSummaryPanel() {
        Div panel = new Div();
        panel.getStyle()
                .set("background", "var(--lumo-success-color-10pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-m)")
                .set("border-left", "4px solid var(--lumo-success-color)");
        panel.addClassName("financial-summary-panel");

        H4 title = new H4("Фінансовий підсумок");
        title.getStyle().set("margin-top", "0");

        Div financialInfo = new Div();
        financialInfo.addClassName("financial-info");

        panel.add(title, financialInfo);
        return panel;
    }

    /**
     * Оновлює компонент з поточного стану.
     */
    public void updateFromState(ConfirmationState state) {
        if (state == null) {
            log.warn("Спроба оновлення з null state");
            return;
        }

        this.currentState = state;
        updateClientInfo(state);
        updateOrderParameters(state);
        updateItemsList(state);
        updateFinancialSummary(state);

        log.debug("OrderSummaryComponent оновлено з стану");
    }

    private void updateClientInfo(ConfirmationState state) {
        Div clientInfo = (Div) clientSummaryPanel.getChildren()
                .filter(component -> component.hasClassName("client-info"))
                .findFirst()
                .orElse(null);

        if (clientInfo == null) return;

        clientInfo.removeAll();

        if (state.hasValidClient()) {
            var client = state.getWizardData().getSelectedClient();

            Span nameSpan = new Span(String.format("👤 %s %s",
                    client.getLastName(), client.getFirstName()));
            nameSpan.getStyle()
                    .set("font-weight", "bold")
                    .set("display", "block")
                    .set("margin-bottom", "var(--lumo-space-xs)");

            Span phoneSpan = new Span(String.format("📞 %s", client.getPhone()));
            phoneSpan.getStyle()
                    .set("display", "block")
                    .set("margin-bottom", "var(--lumo-space-xs)");

            clientInfo.add(nameSpan, phoneSpan);

            if (client.getEmail() != null && !client.getEmail().trim().isEmpty()) {
                Span emailSpan = new Span(String.format("📧 %s", client.getEmail()));
                emailSpan.getStyle().set("display", "block");
                clientInfo.add(emailSpan);
            }
        } else {
            Span noClientSpan = new Span("❌ Клієнта не вибрано");
            noClientSpan.getStyle()
                    .set("color", "var(--lumo-error-text-color)")
                    .set("font-weight", "bold");
            clientInfo.add(noClientSpan);
        }
    }

    private void updateOrderParameters(ConfirmationState state) {
        Div parametersInfo = (Div) orderParametersPanel.getChildren()
                .filter(component -> component.hasClassName("parameters-info"))
                .findFirst()
                .orElse(null);

        if (parametersInfo == null) return;

        parametersInfo.removeAll();

        if (state.hasValidOrder()) {
            var order = state.getWizardData().getDraftOrder();

            Span receiptSpan = new Span(String.format("🧾 Квитанція: %s",
                    order.getReceiptNumber() != null ? order.getReceiptNumber() : "Не вказано"));
            receiptSpan.getStyle()
                    .set("display", "block")
                    .set("margin-bottom", "var(--lumo-space-xs)");

            Span dateSpan = new Span(String.format("📅 Дата виконання: %s",
                    order.getExpectedCompletionDate() != null ?
                            order.getExpectedCompletionDate().toLocalDate().toString() + " після 14:00" : "Не вказано"));
            dateSpan.getStyle().set("display", "block");

            parametersInfo.add(receiptSpan, dateSpan);
        } else {
            Span noOrderSpan = new Span("❌ Інформація про замовлення відсутня");
            noOrderSpan.getStyle()
                    .set("color", "var(--lumo-error-text-color)")
                    .set("font-weight", "bold");
            parametersInfo.add(noOrderSpan);
        }
    }

    private void updateItemsList(ConfirmationState state) {
        if (state.hasItems()) {
            List<OrderItemDTO> items = state.getWizardData().getItems();
            itemsGrid.setItems(items);
            log.debug("Завантажено {} предметів до таблиці", items.size());
        } else {
            itemsGrid.setItems();
            log.debug("Таблиця предметів очищена - немає предметів");
        }
    }

    private void updateFinancialSummary(ConfirmationState state) {
        Div financialInfo = (Div) financialSummaryPanel.getChildren()
                .filter(component -> component.hasClassName("financial-info"))
                .findFirst()
                .orElse(null);

        if (financialInfo == null) return;

        financialInfo.removeAll();

        double totalAmount = state.getTotalAmount();

        Span totalSpan = new Span(String.format("💰 Загальна вартість: %.2f ₴", totalAmount));
        totalSpan.getStyle()
                .set("font-size", "var(--lumo-font-size-l)")
                .set("font-weight", "bold")
                .set("display", "block")
                .set("color", totalAmount > 0 ? "var(--lumo-success-text-color)" : "var(--lumo-error-text-color)");

        Span itemsCountSpan = new Span(String.format("📦 Кількість предметів: %d", state.getItemsCount()));
        itemsCountSpan.getStyle()
                .set("display", "block")
                .set("margin-top", "var(--lumo-space-xs)")
                .set("font-size", "var(--lumo-font-size-s)")
                .set("color", "var(--lumo-secondary-text-color)");

        financialInfo.add(totalSpan, itemsCountSpan);
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            addClassName("compact-mode");
            itemsGrid.setHeight("200px");
        } else {
            removeClassName("compact-mode");
            itemsGrid.setHeight("300px");
        }
        log.debug("Компактний режим встановлено: {}", compact);
    }

    /**
     * Показує стан завантаження.
     */
    public void showLoading(boolean loading) {
        if (loading) {
            addClassName("loading-state");
            setEnabled(false);
        } else {
            removeClassName("loading-state");
            setEnabled(true);
        }
    }

    /**
     * Показує стан помилки.
     */
    public void showError(boolean hasError) {
        if (hasError) {
            addClassName("error-state");
        } else {
            removeClassName("error-state");
        }
    }

    /**
     * Повертає кількість відображених предметів.
     */
    public int getDisplayedItemsCount() {
        return itemsGrid.getListDataView().getItemCount();
    }

    /**
     * Перевіряє чи відображається валідна інформація.
     */
    public boolean isDisplayingValidData() {
        return currentState != null && currentState.isValid();
    }

    // Геттери для тестування
    protected Div getClientSummaryPanel() { return clientSummaryPanel; }
    protected Div getOrderParametersPanel() { return orderParametersPanel; }
    protected Grid<OrderItemDTO> getItemsGrid() { return itemsGrid; }
    protected Div getFinancialSummaryPanel() { return financialSummaryPanel; }
}
