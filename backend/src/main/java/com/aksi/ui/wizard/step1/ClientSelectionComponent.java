package com.aksi.ui.wizard.step1;

import java.util.function.Consumer;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientPageResponse;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.service.ClientService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.GridVariant;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Hr;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для пошуку та вибору існуючого клієнта.
 * Відповідає за функціональність згідно з документацією 1.1 "Вибір або створення клієнта".
 *
 * Покращення UX:
 * - Автоматичне відображення результатів пошуку в Grid
 * - Сучасний дизайн з іконками та секціями
 * - Детальне логування з emoji
 * - Зручний вибір клієнтів одним кліком
 */
@Component
@Slf4j
public class ClientSelectionComponent extends VerticalLayout {

    private final ClientService clientService;

    // UI компоненти
    private TextField clientSearchField;
    private Grid<ClientResponse> clientGrid;
    private Button newClientButton;
    private Span statusLabel;
    private Div resultsContainer;

    // Callbacks
    private Consumer<ClientResponse> onClientSelected;
    private Runnable onNewClientRequested;

    // Стан вибору
    private ClientResponse selectedClient;

    public ClientSelectionComponent(ClientService clientService) {
        this.clientService = clientService;
        log.info("🏗️ ІНІЦІАЛІЗАЦІЯ: ClientSelectionComponent створюється");

        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.info("✅ ГОТОВО: ClientSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setWidthFull();
        setPadding(true);
        setSpacing(true);
        addClassName("client-selection-container");
        getStyle().set("background", "var(--lumo-contrast-5pct)")
                  .set("border-radius", "8px")
                  .set("padding", "2rem")
                  .set("margin-bottom", "1rem")
                  .set("max-width", "none");
    }

    private void createComponents() {
        createHeader();
        createSearchSection();
        createResultsSection();
        createActionSection();
    }

    private void createHeader() {
        HorizontalLayout header = new HorizontalLayout();
        header.setAlignItems(FlexComponent.Alignment.CENTER);
        header.setSpacing(true);
        header.setWidthFull();

        Icon clientIcon = VaadinIcon.USERS.create();
        clientIcon.setColor("var(--lumo-primary-color)");
        clientIcon.setSize("24px");

        H3 title = new H3("Вибір клієнта");
        title.getStyle().set("margin", "0")
                      .set("color", "var(--lumo-primary-text-color)")
                      .set("flex-grow", "1");

        Icon infoIcon = VaadinIcon.INFO_CIRCLE.create();
        infoIcon.setColor("var(--lumo-secondary-text-color)");
        infoIcon.setTooltipText("Введіть мінімум 2 символи для автоматичного пошуку");

        header.add(clientIcon, title, infoIcon);
        add(header, new Hr());
    }

    private void createSearchSection() {
        Div sectionTitle = createSectionTitle("Пошук існуючого клієнта", VaadinIcon.SEARCH);
        add(sectionTitle);

        // Поле пошуку з покращеним дизайном
        clientSearchField = new TextField("Пошук клієнта");
        clientSearchField.setPlaceholder("Введіть прізвище, телефон або email...");
        clientSearchField.setPrefixComponent(VaadinIcon.SEARCH.create());
        clientSearchField.setSuffixComponent(createClearButton());
        clientSearchField.setWidthFull();
        clientSearchField.setHelperText("Автоматичний пошук після введення 2+ символів");

        // Статус лейбл
        statusLabel = new Span();
        statusLabel.getStyle().set("font-size", "var(--lumo-font-size-s)")
                              .set("color", "var(--lumo-secondary-text-color)")
                              .set("margin-top", "0.5rem");

        add(clientSearchField, statusLabel);
    }

    private Button createClearButton() {
        Button clearButton = new Button(VaadinIcon.CLOSE_SMALL.create());
        clearButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY_INLINE);
        clearButton.setTooltipText("Очистити пошук");
        clearButton.addClickListener(e -> {
            log.info("🧹 ОЧИЩЕННЯ: пошук скинуто");
            clientSearchField.clear();
            clearResults();
        });
        return clearButton;
    }

    private void createResultsSection() {
        resultsContainer = new Div();
        resultsContainer.setVisible(false);
        resultsContainer.setWidthFull();
        resultsContainer.getStyle()
                        .set("margin-top", "1.5rem")
                        .set("width", "100%")
                        .set("overflow-x", "auto");

        Div sectionTitle = createSectionTitle("Результати пошуку", VaadinIcon.LIST);
        resultsContainer.add(sectionTitle);

        // Grid для результатів пошуку з розширеними налаштуваннями
        clientGrid = new Grid<>(ClientResponse.class, false);
        clientGrid.setWidthFull();
        clientGrid.setHeight("500px");
        clientGrid.addThemeVariants(
            GridVariant.LUMO_ROW_STRIPES,
            GridVariant.LUMO_WRAP_CELL_CONTENT,
            GridVariant.LUMO_COLUMN_BORDERS
        );

        // Додаткові CSS стилі для Grid
        clientGrid.getStyle()
                  .set("width", "100%")
                  .set("min-width", "800px")
                  .set("border", "1px solid var(--lumo-contrast-20pct)")
                  .set("border-radius", "4px");

        // Налаштування колонок з покращеними пропорціями
        clientGrid.addColumn(client ->
            String.format("%s %s", client.getLastName(), client.getFirstName()))
            .setHeader(createColumnHeader("👤 Прізвище та ім'я"))
            .setFlexGrow(3)
            .setSortable(true)
            .setResizable(true);

        clientGrid.addColumn(ClientResponse::getPhone)
            .setHeader(createColumnHeader("📞 Телефон"))
            .setFlexGrow(2)
            .setResizable(true);

        clientGrid.addColumn(ClientResponse::getEmail)
            .setHeader(createColumnHeader("✉️ Email"))
            .setFlexGrow(3)
            .setResizable(true);

        clientGrid.addColumn(ClientResponse::getAddress)
            .setHeader(createColumnHeader("📍 Адреса"))
            .setFlexGrow(4)
            .setResizable(true);

        // Кнопка вибору з фіксованою шириною
        clientGrid.addComponentColumn(this::createSelectButton)
            .setHeader("Дії")
            .setFlexGrow(0)
            .setWidth("120px")
            .setResizable(false);

        // Обробник подвійного кліку
        clientGrid.addItemDoubleClickListener(e -> {
            ClientResponse client = e.getItem();
            log.info("🖱️ ПОДВІЙНИЙ КЛІК: автоматичний вибір клієнта '{} {}'",
                    client.getLastName(), client.getFirstName());
            selectClient(client);
        });

        // Налаштування responsive поведінки
        clientGrid.setAllRowsVisible(false);

        resultsContainer.add(clientGrid);
        add(resultsContainer);
    }

    private Span createColumnHeader(String text) {
        Span header = new Span(text);
        header.getStyle().set("font-weight", "600");
        return header;
    }

    private Button createSelectButton(ClientResponse client) {
        Button selectButton = new Button("Вибрати");
        selectButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SMALL);
        selectButton.setIcon(VaadinIcon.CHECK.create());

        selectButton.addClickListener(e -> {
            log.info("✅ КНОПКА ВИБОРУ: клієнт '{} {}' обраний",
                    client.getLastName(), client.getFirstName());
            selectClient(client);
        });

        return selectButton;
    }

    private void createActionSection() {
        Div sectionTitle = createSectionTitle("Створення нового клієнта", VaadinIcon.PLUS);
        add(sectionTitle);

        // Кнопка нового клієнта з покращеним дизайном
        newClientButton = new Button("Створити нового клієнта", VaadinIcon.PLUS.create());
        newClientButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS, ButtonVariant.LUMO_LARGE);
        newClientButton.getStyle().set("margin-top", "1rem");
        newClientButton.setWidthFull();

        add(newClientButton);
    }

    private Div createSectionTitle(String title, VaadinIcon icon) {
        Div sectionDiv = new Div();
        sectionDiv.getStyle().set("margin-top", "1.5rem")
                           .set("margin-bottom", "1rem");

        HorizontalLayout sectionLayout = new HorizontalLayout();
        sectionLayout.setAlignItems(FlexComponent.Alignment.CENTER);
        sectionLayout.setSpacing(true);

        Icon sectionIcon = icon.create();
        sectionIcon.setColor("var(--lumo-primary-color)");
        sectionIcon.setSize("16px");

        Span sectionTitle = new Span(title);
        sectionTitle.getStyle().set("font-weight", "600")
                             .set("color", "var(--lumo-primary-text-color)");

        sectionLayout.add(sectionIcon, sectionTitle);
        sectionDiv.add(sectionLayout);

        return sectionDiv;
    }

    private void setupEventHandlers() {
        clientSearchField.addValueChangeListener(e -> {
            String searchTerm = e.getValue();
            log.info("🔍 ПОШУК ВВЕДЕННЯ: термін '{}'", searchTerm);
            searchClients(searchTerm);
        });

        newClientButton.addClickListener(e -> {
            log.info("➕ НОВИЙ КЛІЄНТ: натиснуто кнопку створення нового клієнта");
            handleNewClientRequest();
        });
    }

    private void searchClients(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().length() < 2) {
            log.debug("🔍 ПОШУК: термін '{}' закороткий, приховуємо результати", searchTerm);
            clearResults();
            statusLabel.setText(searchTerm != null && !searchTerm.trim().isEmpty() ?
                "💡 Введіть мінімум 2 символи" : "");
            return;
        }

        try {
            log.info("🔄 ПОШУК ПОЧАТОК: виконуємо пошук за терміном '{}'", searchTerm.trim());
            statusLabel.setText("🔄 Пошук...");

            ClientSearchRequest searchRequest = new ClientSearchRequest();
            searchRequest.setQuery(searchTerm.trim());
            searchRequest.setPage(0);
            searchRequest.setSize(50); // Збільшуємо для Grid

            log.info("�� ПОШУК ЗАПИТ: query='{}', page={}, size={}",
                searchRequest.getQuery(), searchRequest.getPage(), searchRequest.getSize());

            ClientPageResponse response = clientService.searchClients(searchRequest);

            log.info("🔍 ПОШУК ВІДПОВІДЬ: знайдено {} клієнтів з {} загальних",
                response.getContent().size(), response.getTotalElements());

            // Відображаємо результати в Grid автоматично
            clientGrid.setItems(response.getContent());
            resultsContainer.setVisible(!response.getContent().isEmpty());

            if (response.getContent().isEmpty()) {
                statusLabel.setText("❌ Клієнтів не знайдено за запитом '" + searchTerm.trim() + "'");
                log.info("📊 РЕЗУЛЬТАТ: немає клієнтів за запитом '{}'", searchTerm.trim());
            } else {
                statusLabel.setText(String.format("✅ Знайдено %d клієнт(ів). Натисніть для вибору",
                    response.getContent().size()));
                log.info("📊 РЕЗУЛЬТАТ: відображено {} клієнтів в Grid", response.getContent().size());
            }

        } catch (Exception e) {
            log.error("❌ ПОМИЛКА ПОШУКУ: {}", e.getMessage(), e);
            statusLabel.setText("❌ Помилка пошуку: " + e.getMessage());
            clearResults();

            Notification notification = Notification.show("❌ Помилка пошуку клієнтів: " + e.getMessage());
            notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
            notification.setDuration(5000);
        }
    }

    private void selectClient(ClientResponse client) {
        if (client == null) {
            log.warn("⚠️ ПОПЕРЕДЖЕННЯ: спроба вибрати null клієнта");
            return;
        }

        this.selectedClient = client;

        log.info("✅ КЛІЄНТ ОБРАНО: {} {} (ID: {}, телефон: {})",
            client.getLastName(), client.getFirstName(), client.getId(), client.getPhone());

        // Візуальне підтвердження
        Notification notification = Notification.show(
            String.format("✅ Клієнт обрано: %s %s", client.getLastName(), client.getFirstName()));
        notification.addThemeVariants(NotificationVariant.LUMO_SUCCESS);
        notification.setDuration(3000);

        // Виділяємо вибраний рядок в Grid
        clientGrid.select(client);

        // Викликаємо callback
        if (onClientSelected != null) {
            onClientSelected.accept(client);
        }
    }

    private void clearResults() {
        clientGrid.setItems();
        resultsContainer.setVisible(false);
        this.selectedClient = null;
        clientGrid.deselectAll();
        log.debug("🧹 ОЧИЩЕННЯ: результати пошуку приховано");
    }

    private void handleNewClientRequest() {
        clearSelection();
        if (onNewClientRequested != null) {
            onNewClientRequested.run();
        }
    }

    /**
     * Отримати обраного клієнта.
     */
    public ClientResponse getSelectedClient() {
        return selectedClient;
    }

    /**
     * Встановити callback для обробки вибору клієнта.
     */
    public void setOnClientSelected(Consumer<ClientResponse> onClientSelected) {
        this.onClientSelected = onClientSelected;
    }

    /**
     * Встановити callback для запиту створення нового клієнта.
     */
    public void setOnNewClientRequested(Runnable onNewClientRequested) {
        this.onNewClientRequested = onNewClientRequested;
    }

    /**
     * Очистити вибір та пошук.
     */
    public void clearSelection() {
        log.info("🧹 ОЧИЩЕННЯ: скидаємо вибір та пошук");
        clientSearchField.clear();
        clearResults();
        statusLabel.setText("");
        this.selectedClient = null;
    }

    /**
     * Встановити фокус на поле пошуку.
     */
    public void focusSearchField() {
        clientSearchField.focus();
    }
}
