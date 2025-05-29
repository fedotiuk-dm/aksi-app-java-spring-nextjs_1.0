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
 * Сторінка клієнтів
 */
@Route(value = "clients", layout = MainLayout.class)
@PageTitle("Клієнти | AKSI")
@PermitAll
public class ClientsView extends VerticalLayout {

    private Grid<ClientInfo> grid = new Grid<>(ClientInfo.class, false);

    public ClientsView() {
        addClassName("clients-view");
        setSizeFull();

        configureGrid();

        H2 title = new H2("Клієнти");
        Button addClientButton = new Button("Додати клієнта", VaadinIcon.PLUS.create());
        addClientButton.addClickListener(e -> {
            // TODO: Відкрити форму додавання клієнта
        });

        HorizontalLayout toolbar = new HorizontalLayout(title, addClientButton);
        toolbar.setAlignItems(Alignment.CENTER);
        toolbar.expand(title);

        add(toolbar, grid);
    }

    private void configureGrid() {
        grid.addClassNames("clients-grid");
        grid.setSizeFull();

        // Налаштування колонок
        grid.addColumn(ClientInfo::getFirstName).setHeader("Ім'я").setAutoWidth(true);
        grid.addColumn(ClientInfo::getLastName).setHeader("Прізвище").setAutoWidth(true);
        grid.addColumn(ClientInfo::getPhone).setHeader("Телефон").setAutoWidth(true);
        grid.addColumn(ClientInfo::getEmail).setHeader("Email").setAutoWidth(true);
        grid.addColumn(ClientInfo::getAddress).setHeader("Адреса").setAutoWidth(true);

        // TODO: Завантаження даних з сервісу клієнтів
        // clientService.findAll().forEach(client -> grid.setItems(...));
    }

    /**
     * DTO для відображення клієнтів в таблиці
     */
    public static class ClientInfo {
        private String firstName;
        private String lastName;
        private String phone;
        private String email;
        private String address;

        public ClientInfo() {}

        public ClientInfo(String firstName, String lastName, String phone, String email, String address) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
            this.email = email;
            this.address = address;
        }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }
}
