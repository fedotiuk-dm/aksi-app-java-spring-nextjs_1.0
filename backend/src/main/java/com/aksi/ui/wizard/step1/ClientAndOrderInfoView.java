package com.aksi.ui.wizard.step1;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.service.ClientService;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для першого етапу Order Wizard.
 * Відповідає за вибір/створення клієнта та базову інформацію замовлення.
 */
@Slf4j
public class ClientAndOrderInfoView extends VerticalLayout {

    private final OrderWizardData wizardData;
    private final Runnable onCompleted;

    @Autowired
    private ClientService clientService;

    @Autowired
    private BranchLocationService branchLocationService;

    // Client selection components
    private TextField clientSearchField;
    private ComboBox<ClientResponse> clientSelector;
    private Button newClientButton;

    // Client form components (for new client)
    private VerticalLayout clientFormContainer;
    private FormLayout clientForm;
    private TextField lastNameField;
    private TextField firstNameField;
    private TextField phoneField;
    private TextField emailField;
    private Button saveClientButton;

    // Order info components
    private FormLayout orderForm;
    private TextField receiptNumberField;
    private TextField tagNumberField;
    private ComboBox<BranchLocationDTO> branchSelector;

    // Navigation
    private Button nextStepButton;

    // Selected client data
    private ClientResponse selectedClientResponse;

    public ClientAndOrderInfoView(OrderWizardData wizardData, Runnable onCompleted) {
        this.wizardData = wizardData;
        this.onCompleted = onCompleted;

        initializeLayout();
        createClientSelectionSection();
        createClientFormSection();
        createOrderInfoSection();
        createNavigationSection();

        updateFormVisibility();
        loadData();

        log.info("ClientAndOrderInfoView initialized");
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
    }

    private void createClientSelectionSection() {
        add(new H3("Оберіть або створіть клієнта"));

        HorizontalLayout searchLayout = new HorizontalLayout();
        searchLayout.setWidthFull();
        searchLayout.setAlignItems(Alignment.END);

        clientSearchField = new TextField("Пошук клієнта");
        clientSearchField.setPlaceholder("Введіть прізвище, телефон або email");
        clientSearchField.setWidthFull();
        clientSearchField.addValueChangeListener(e -> searchClients(e.getValue()));

        clientSelector = new ComboBox<>("Оберіть клієнта");
        clientSelector.setItemLabelGenerator(client ->
            String.format("%s %s (%s)", client.getLastName(), client.getFirstName(), client.getPhone()));
        clientSelector.setWidthFull();
        clientSelector.addValueChangeListener(e -> onClientSelected(e.getValue()));

        newClientButton = new Button("Новий клієнт");
        newClientButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        newClientButton.addClickListener(e -> showNewClientForm());

        searchLayout.add(clientSearchField, clientSelector, newClientButton);
        add(searchLayout);
    }

    private void createClientFormSection() {
        clientForm = new FormLayout();
        clientForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("500px", 2)
        );

        lastNameField = new TextField("Прізвище *");
        firstNameField = new TextField("Ім'я *");
        phoneField = new TextField("Телефон *");
        emailField = new TextField("Email");

        lastNameField.setRequired(true);
        firstNameField.setRequired(true);
        phoneField.setRequired(true);

        saveClientButton = new Button("Зберегти клієнта");
        saveClientButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        saveClientButton.addClickListener(e -> saveNewClient());

        clientForm.add(lastNameField, firstNameField, phoneField, emailField);

        clientFormContainer = new VerticalLayout();
        clientFormContainer.add(new H3("Новий клієнт"), clientForm, saveClientButton);
        clientFormContainer.setVisible(false);

        add(clientFormContainer);
    }

    private void createOrderInfoSection() {
        add(new H3("Інформація про замовлення"));

        orderForm = new FormLayout();
        orderForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("500px", 2)
        );

        receiptNumberField = new TextField("Номер квитанції *");
        receiptNumberField.setValue(generateReceiptNumber());
        receiptNumberField.setRequired(true);

        tagNumberField = new TextField("Унікальна мітка");
        tagNumberField.setPlaceholder("Введіть або скануйте");

        branchSelector = new ComboBox<>("Пункт прийому *");
        branchSelector.setItemLabelGenerator(BranchLocationDTO::getName);
        branchSelector.setRequired(true);

        orderForm.add(receiptNumberField, tagNumberField, branchSelector);
        add(orderForm);
    }

    private void createNavigationSection() {
        HorizontalLayout navigation = new HorizontalLayout();
        navigation.setJustifyContentMode(JustifyContentMode.END);
        navigation.setPadding(true);

        nextStepButton = new Button("Далі до предметів");
        nextStepButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextStepButton.setEnabled(false);
        nextStepButton.addClickListener(e -> completeStep());

        navigation.add(nextStepButton);
        add(navigation);
    }

    private void loadData() {
        try {
            // Завантажити активні філії
            List<BranchLocationDTO> branches = branchLocationService.getActiveBranchLocations();
            branchSelector.setItems(branches);
            if (!branches.isEmpty()) {
                branchSelector.setValue(branches.get(0)); // Вибрати першу за замовчуванням
            }

            // Якщо дані вже збережені в wizardData, відновити їх
            if (wizardData.getSelectedClient() != null) {
                // TODO: конвертувати ClientEntity в ClientResponse для відображення
                log.info("Client already selected: {}", wizardData.getSelectedClient().getLastName());
            }

            if (wizardData.getDraftOrder().getReceiptNumber() != null) {
                receiptNumberField.setValue(wizardData.getDraftOrder().getReceiptNumber());
            }

            validateForm();

        } catch (Exception e) {
            log.error("Error loading data for ClientAndOrderInfoView", e);
            Notification.show("Помилка завантаження даних: " + e.getMessage())
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
        }
    }

    private void searchClients(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().length() < 2) {
            clientSelector.setItems();
            return;
        }

        try {
            @SuppressWarnings("deprecation")
            List<ClientResponse> clients = clientService.searchClients(searchTerm.trim());
            clientSelector.setItems(clients);
        } catch (Exception e) {
            log.error("Error searching clients", e);
            Notification.show("Помилка пошуку клієнтів: " + e.getMessage())
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
        }
    }

    private void onClientSelected(ClientResponse client) {
        if (client != null) {
            this.selectedClientResponse = client;
            // TODO: конвертувати ClientResponse в ClientEntity
            hideNewClientForm();
            validateForm();
            log.info("Client selected: {} {}", client.getLastName(), client.getFirstName());
        }
    }

    private void showNewClientForm() {
        clientFormContainer.setVisible(true);
        clientSelector.clear();
        selectedClientResponse = null;
        validateForm();
    }

    private void hideNewClientForm() {
        clientFormContainer.setVisible(false);
    }

    private void saveNewClient() {
        if (!validateClientForm()) {
            return;
        }

        try {
            CreateClientRequest request = CreateClientRequest.builder()
                .lastName(lastNameField.getValue().trim())
                .firstName(firstNameField.getValue().trim())
                .phone(phoneField.getValue().trim())
                .email(emailField.getValue() != null ? emailField.getValue().trim() : null)
                .build();

            ClientResponse savedClient = clientService.createClient(request);
            this.selectedClientResponse = savedClient;

            clearClientForm();
            hideNewClientForm();

            Notification.show("Клієнта успішно створено")
                .addThemeVariants(NotificationVariant.LUMO_SUCCESS);

            validateForm();
            log.info("New client created: {} {}", savedClient.getLastName(), savedClient.getFirstName());

        } catch (Exception e) {
            log.error("Error creating client", e);
            Notification.show("Помилка при створенні клієнта: " + e.getMessage())
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
        }
    }

    private boolean validateClientForm() {
        return lastNameField.getValue() != null && !lastNameField.getValue().trim().isEmpty() &&
               firstNameField.getValue() != null && !firstNameField.getValue().trim().isEmpty() &&
               phoneField.getValue() != null && !phoneField.getValue().trim().isEmpty();
    }

    private void clearClientForm() {
        lastNameField.clear();
        firstNameField.clear();
        phoneField.clear();
        emailField.clear();
    }

    private void validateForm() {
        boolean clientSelected = selectedClientResponse != null;
        boolean receiptNumberValid = receiptNumberField.getValue() != null &&
                                   !receiptNumberField.getValue().trim().isEmpty();
        boolean branchSelected = branchSelector.getValue() != null;

        nextStepButton.setEnabled(clientSelected && receiptNumberValid && branchSelected);
    }

    private void completeStep() {
        // TODO: конвертувати ClientResponse в ClientEntity
        // wizardData.setClient(convertedClient, selectedClientResponse.getId() == null);

        // Зберегти інформацію про замовлення
        wizardData.setOrderBasicInfo(
            receiptNumberField.getValue().trim(),
            tagNumberField.getValue() != null ? tagNumberField.getValue().trim() : null,
            LocalDateTime.now().plusDays(2) // Тимчасово, буде розраховано на етапі 3
        );

        // TODO: встановити філію після конвертації DTO в Entity
        // wizardData.getDraftOrder().setBranchLocation(convertedBranch);

        log.info("Step 1 completed for receipt: {}", receiptNumberField.getValue());

        // Перейти до наступного етапу
        onCompleted.run();
    }

    private String generateReceiptNumber() {
        return "RCP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void updateFormVisibility() {
        // Додаткова логіка для динамічного відображення форм
    }
}
