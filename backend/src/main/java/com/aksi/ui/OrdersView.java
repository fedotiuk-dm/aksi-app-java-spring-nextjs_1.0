package com.aksi.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import jakarta.annotation.security.PermitAll;

/**
 * Сторінка замовлень
 */
@Route(value = "orders", layout = MainLayout.class)
@PageTitle("Замовлення | AKSI")
@PermitAll
public class OrdersView extends VerticalLayout {

    private Grid<OrderInfo> grid = new Grid<>(OrderInfo.class, false);

    public OrdersView() {
        addClassName("orders-view");
        setSizeFull();

        configureGrid();

        H2 title = new H2("Замовлення");
        Button addOrderButton = new Button("Створити замовлення", VaadinIcon.PLUS.create());
        addOrderButton.addClickListener(e -> {
            // TODO: Перехід до Order Wizard
            getUI().ifPresent(ui -> ui.navigate("order-wizard"));
        });

        HorizontalLayout toolbar = new HorizontalLayout(title, addOrderButton);
        toolbar.setAlignItems(Alignment.CENTER);
        toolbar.expand(title);

        add(toolbar, grid);
    }

    private void configureGrid() {
        grid.addClassNames("orders-grid");
        grid.setSizeFull();

        // Налаштування колонок
        grid.addColumn(OrderInfo::getOrderNumber).setHeader("№ Замовлення").setAutoWidth(true);
        grid.addColumn(OrderInfo::getClientName).setHeader("Клієнт").setAutoWidth(true);
        grid.addColumn(OrderInfo::getCreatedDate).setHeader("Дата створення").setAutoWidth(true);
        grid.addColumn(OrderInfo::getDueDate).setHeader("Дата готовності").setAutoWidth(true);
        grid.addColumn(OrderInfo::getStatus).setHeader("Статус").setAutoWidth(true);
        grid.addColumn(OrderInfo::getTotalAmount).setHeader("Сума").setAutoWidth(true);

        // TODO: Завантаження даних з сервісу замовлень
        // orderService.findAll().forEach(order -> grid.setItems(...));
    }

    /**
     * DTO для відображення замовлень в таблиці
     */
    public static class OrderInfo {
        private String orderNumber;
        private String clientName;
        private String createdDate;
        private String dueDate;
        private String status;
        private String totalAmount;

        public OrderInfo() {}

        public OrderInfo(String orderNumber, String clientName, String createdDate,
                        String dueDate, String status, String totalAmount) {
            this.orderNumber = orderNumber;
            this.clientName = clientName;
            this.createdDate = createdDate;
            this.dueDate = dueDate;
            this.status = status;
            this.totalAmount = totalAmount;
        }

        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

        public String getClientName() { return clientName; }
        public void setClientName(String clientName) { this.clientName = clientName; }

        public String getCreatedDate() { return createdDate; }
        public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getTotalAmount() { return totalAmount; }
        public void setTotalAmount(String totalAmount) { this.totalAmount = totalAmount; }
    }
}
