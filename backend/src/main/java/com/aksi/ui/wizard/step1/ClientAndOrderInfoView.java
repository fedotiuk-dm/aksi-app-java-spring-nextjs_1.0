package com.aksi.ui.wizard.step1;

import java.time.LocalDateTime;

import org.springframework.context.ApplicationContext;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step1.mapper.Step1WizardDataMapper;
import com.aksi.ui.wizard.step1.service.WizardDataRestoreService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Головний UI компонент для першого етапу Order Wizard.
 * Координатор компонентів згідно з принципами DDD та SOLID.
 * Відповідає за вибір/створення клієнта та базову інформацію замовлення.
 * Використовує компонентну архітектуру для mapper та service логіки.
 */
@Slf4j
public class ClientAndOrderInfoView extends VerticalLayout {

    private final OrderWizardData wizardData;
    private final Runnable onCompleted;
    private final ApplicationContext applicationContext;

    // Service компоненти
    private final Step1WizardDataMapper orderWizardDataMapper;
    private final WizardDataRestoreService wizardDataRestoreService;

    // UI компоненти
    private ClientSelectionComponent clientSelectionComponent;
    private ClientCreationFormComponent clientCreationFormComponent;
    private OrderBasicInfoComponent orderBasicInfoComponent;

    // Навігація
    private Button nextStepButton;

    // Поточний стан
    private ClientResponse selectedClientResponse;

    public ClientAndOrderInfoView(OrderWizardData wizardData, Runnable onCompleted,
                                 ApplicationContext applicationContext) {
        this.wizardData = wizardData;
        this.onCompleted = onCompleted;
        this.applicationContext = applicationContext;

        // Ініціалізація service компонентів
        this.orderWizardDataMapper = applicationContext.getBean(Step1WizardDataMapper.class);
        this.wizardDataRestoreService = applicationContext.getBean(WizardDataRestoreService.class);

        initializeLayout();
        createComponents();
        setupComponentInteractions();
        createNavigationSection();
        restoreDataFromWizard();

        log.info("ClientAndOrderInfoView initialized with component-based architecture");
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
    }

    private void createComponents() {
        // Створення компонентів через Spring ApplicationContext
        clientSelectionComponent = applicationContext.getBean(ClientSelectionComponent.class);
        clientCreationFormComponent = applicationContext.getBean(ClientCreationFormComponent.class);
        orderBasicInfoComponent = applicationContext.getBean(OrderBasicInfoComponent.class);

        // Додавання до layout
        add(clientSelectionComponent);
        add(clientCreationFormComponent);
        add(orderBasicInfoComponent);
    }

    private void setupComponentInteractions() {
        // Налаштування взаємодії між компонентами
        clientSelectionComponent.setOnClientSelected(this::handleClientSelected);
        clientSelectionComponent.setOnNewClientRequested(this::handleNewClientRequest);

        clientCreationFormComponent.setOnClientCreated(this::handleClientCreated);

        // Відстеження змін у базовій інформації замовлення
        orderBasicInfoComponent.setOnReceiptNumberChanged(value -> validateForm());
        orderBasicInfoComponent.setOnBranchChanged(branch -> {
            validateForm();
            updateWizardDataWithBranch();
        });
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

    private void handleClientSelected(ClientResponse client) {
        this.selectedClientResponse = client;
        clientCreationFormComponent.hideForm();
        validateForm();
        log.info("Client selected: {} {}", client.getLastName(), client.getFirstName());
    }

    private void handleNewClientRequest() {
        this.selectedClientResponse = null;
        clientCreationFormComponent.showForm();
        validateForm();
    }

    private void handleClientCreated(ClientResponse client) {
        this.selectedClientResponse = client;
        clientSelectionComponent.clearSelection();
        validateForm();
    }

    private void validateForm() {
        boolean clientSelected = selectedClientResponse != null;
        boolean orderInfoValid = orderBasicInfoComponent.isValid();

        nextStepButton.setEnabled(clientSelected && orderInfoValid);
    }

    private void updateWizardDataWithBranch() {
        if (orderBasicInfoComponent.getSelectedBranch() != null) {
            // Використовуємо mapper для конвертації DTO в Entity
            wizardData.getDraftOrder().setBranchLocation(
                orderWizardDataMapper.mapBranchLocationDTOToEntity(
                    orderBasicInfoComponent.getSelectedBranch()
                )
            );
            log.debug("Updated wizard data with branch: {}",
                orderBasicInfoComponent.getSelectedBranch().getName());
        }
    }

    private void restoreDataFromWizard() {
        wizardDataRestoreService.logRestoredData(wizardData);

        if (!wizardDataRestoreService.hasDataToRestore(wizardData)) {
            return;
        }

        // Відновити дані клієнта якщо є
        ClientResponse restoredClient = wizardDataRestoreService.restoreClientResponse(wizardData);
        if (restoredClient != null) {
            this.selectedClientResponse = restoredClient;
            log.info("Restored client data: {} {}", restoredClient.getLastName(), restoredClient.getFirstName());
        }

        // Відновити номер квитанції
        String receiptNumber = wizardDataRestoreService.restoreReceiptNumber(wizardData);
        if (receiptNumber != null) {
            orderBasicInfoComponent.setReceiptNumber(receiptNumber);
        }

        // Відновити номер мітки
        String tagNumber = wizardDataRestoreService.restoreTagNumber(wizardData);
        if (tagNumber != null) {
            orderBasicInfoComponent.setTagNumber(tagNumber);
        }

        validateForm();
    }

    private void completeStep() {
        // Конвертувати ClientResponse в ClientEntity використовуючи mapper
        if (selectedClientResponse != null) {
            ClientEntity clientEntity = orderWizardDataMapper.mapClientResponseToEntity(selectedClientResponse);
            boolean isNewClient = orderWizardDataMapper.isNewClient(selectedClientResponse);

            wizardData.setClient(clientEntity, isNewClient);
            log.debug("Mapped and set client entity: {} {}",
                clientEntity.getLastName(), clientEntity.getFirstName());
        }

        // Зберегти інформацію про замовлення
        wizardData.setOrderBasicInfo(
            orderBasicInfoComponent.getReceiptNumber(),
            orderBasicInfoComponent.getTagNumber(),
            LocalDateTime.now().plusDays(2) // Тимчасово, буде розраховано на етапі 3
        );

        // Встановити філію (вже збережено в updateWizardDataWithBranch)
        updateWizardDataWithBranch();

        log.info("Step 1 completed for receipt: {} with branch: {}",
            orderBasicInfoComponent.getReceiptNumber(),
            orderBasicInfoComponent.getSelectedBranch() != null ?
                orderBasicInfoComponent.getSelectedBranch().getName() : "null");

        // Перейти до наступного етапу
        onCompleted.run();
    }
}
