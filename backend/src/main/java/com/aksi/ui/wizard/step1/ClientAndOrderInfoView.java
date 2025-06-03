package com.aksi.ui.wizard.step1;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.context.ApplicationContext;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.service.OrderService;
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
        // Безпечне створення компонентів через Spring ApplicationContext з валідацією
        try {
            clientSelectionComponent = applicationContext.getBean(ClientSelectionComponent.class);
            if (clientSelectionComponent == null) {
                log.error("❌ ПОМИЛКА: ClientSelectionComponent не може бути створений");
                throw new IllegalStateException("ClientSelectionComponent не доступний");
            }

            clientCreationFormComponent = applicationContext.getBean(ClientCreationFormComponent.class);
            if (clientCreationFormComponent == null) {
                log.error("❌ ПОМИЛКА: ClientCreationFormComponent не може бути створений");
                throw new IllegalStateException("ClientCreationFormComponent не доступний");
            }

            orderBasicInfoComponent = applicationContext.getBean(OrderBasicInfoComponent.class);
            if (orderBasicInfoComponent == null) {
                log.error("❌ ПОМИЛКА: OrderBasicInfoComponent не може бути створений");
                throw new IllegalStateException("OrderBasicInfoComponent не доступний");
            }

            log.info("✅ УСПІХ: всі компоненти успішно створені");

            // Безпечне додавання до layout
            addComponentSafely(clientSelectionComponent);
            addComponentSafely(clientCreationFormComponent);
            addComponentSafely(orderBasicInfoComponent);

        } catch (Exception e) {
            log.error("❌ КРИТИЧНА ПОМИЛКА: Не вдалося створити компоненти: {}", e.getMessage(), e);
            createFallbackComponents();
        }
    }

    private void addComponentSafely(com.vaadin.flow.component.Component component) {
        try {
            if (component != null && !getChildren().anyMatch(c -> c.equals(component))) {
                add(component);
                log.debug("🔧 ДОДАНО: компонент {} безпечно додано до layout", component.getClass().getSimpleName());
            }
        } catch (Exception e) {
            log.error("❌ ПОМИЛКА ДОДАВАННЯ: не вдалося додати компонент {}: {}",
                      component != null ? component.getClass().getSimpleName() : "null", e.getMessage());
        }
    }

    private void createFallbackComponents() {
        log.warn("⚠️ FALLBACK: створюю резервні компоненти");
        removeAll();

        // Простий fallback UI
        add(new com.vaadin.flow.component.html.H3("Помилка завантаження компонентів"));
        add(new com.vaadin.flow.component.html.Span("Сталася помилка під час ініціалізації форми. Спробуйте перезавантажити сторінку."));

        com.vaadin.flow.component.button.Button refreshButton = new com.vaadin.flow.component.button.Button("Перезавантажити");
        refreshButton.addClickListener(e -> getUI().ifPresent(ui -> ui.getPage().reload()));
        add(refreshButton);
    }

    private void setupComponentInteractions() {
        // Безпечне налаштування взаємодії між компонентами з обробкою помилок
        try {
            if (clientSelectionComponent != null) {
                clientSelectionComponent.setOnClientSelected(this::handleClientSelected);
                clientSelectionComponent.setOnNewClientRequested(this::handleNewClientRequest);
                log.debug("✅ ClientSelectionComponent callbacks налаштовано");
            }

            if (clientCreationFormComponent != null) {
                clientCreationFormComponent.setOnClientCreated(this::handleClientCreated);
                log.debug("✅ ClientCreationFormComponent callbacks налаштовано");
            }

            if (orderBasicInfoComponent != null) {
                // Відстеження змін у базовій інформації замовлення з безпечними callbacks
                orderBasicInfoComponent.setOnReceiptNumberChanged(value -> {
                    try {
                        validateForm();
                        log.debug("📄 Receipt number changed: {}", value);
                    } catch (Exception e) {
                        log.error("❌ Помилка при обробці зміни номера квитанції: {}", e.getMessage());
                    }
                });

                orderBasicInfoComponent.setOnBranchChanged(branch -> {
                    try {
                        validateForm();
                        updateWizardDataWithBranch();
                        log.debug("🏢 Branch changed: {}", branch != null ? branch.getName() : "null");
                    } catch (Exception e) {
                        log.error("❌ Помилка при обробці зміни філії: {}", e.getMessage());
                    }
                });
                log.debug("✅ OrderBasicInfoComponent callbacks налаштовано");
            }

            log.info("✅ УСПІХ: всі interaction callbacks успішно налаштовані");
        } catch (Exception e) {
            log.error("❌ ПОМИЛКА: Не вдалося налаштувати component interactions: {}", e.getMessage(), e);
        }
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
        try {
            boolean clientSelected = selectedClientResponse != null;
            boolean orderInfoValid = orderBasicInfoComponent != null && orderBasicInfoComponent.isValid();

            log.info("🔍 ВАЛІДАЦІЯ STEP 1: client={}, orderInfo={}, nextEnabled={}",
                clientSelected, orderInfoValid, (clientSelected && orderInfoValid));

            if (nextStepButton != null) {
                nextStepButton.setEnabled(clientSelected && orderInfoValid);
                log.debug("🔍 Form validation: client={}, orderInfo={}, nextEnabled={}",
                         clientSelected, orderInfoValid, (clientSelected && orderInfoValid));
            }
        } catch (Exception e) {
            log.error("❌ Помилка валідації форми: {}", e.getMessage());
            // Fallback: disable next button on validation error
            if (nextStepButton != null) {
                nextStepButton.setEnabled(false);
            }
        }
    }

    private void updateWizardDataWithBranch() {
        try {
            if (orderBasicInfoComponent != null && orderBasicInfoComponent.getSelectedBranch() != null) {
                // Використовуємо mapper для конвертації DTO в Entity
                wizardData.getDraftOrder().setBranchLocation(
                    orderWizardDataMapper.mapBranchLocationDTOToEntity(
                        orderBasicInfoComponent.getSelectedBranch()
                    )
                );
                log.debug("🏢 Updated wizard data with branch: {}",
                    orderBasicInfoComponent.getSelectedBranch().getName());
            }
        } catch (Exception e) {
            log.error("❌ Помилка оновлення даних wizard з філією: {}", e.getMessage(), e);
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

    /**
     * Отримання оновлених даних wizard'а з поточного стану форми.
     */
    public OrderWizardData getUpdatedWizardData() {
        return wizardData; // Дані вже оновлюються в completeStep()
    }

    private void completeStep() {
        try {
            // Конвертувати ClientResponse в ClientEntity використовуючи mapper
            if (selectedClientResponse != null) {
                ClientEntity clientEntity = orderWizardDataMapper.mapClientResponseToEntity(selectedClientResponse);
                boolean isNewClient = orderWizardDataMapper.isNewClient(selectedClientResponse);

                wizardData.setClient(clientEntity, isNewClient);
                log.debug("👤 Mapped and set client entity: {} {}",
                    clientEntity.getLastName(), clientEntity.getFirstName());
            }

            // Зберегти інформацію про замовлення з валідацією
            if (orderBasicInfoComponent != null) {
                wizardData.setOrderBasicInfo(
                    orderBasicInfoComponent.getReceiptNumber(),
                    orderBasicInfoComponent.getTagNumber(),
                    LocalDateTime.now().plusDays(2) // Тимчасово, буде розраховано на етапі 3
                );

                log.info("📋 Step 1 completed for receipt: {} with branch: {}",
                    orderBasicInfoComponent.getReceiptNumber(),
                    orderBasicInfoComponent.getSelectedBranch() != null ?
                        orderBasicInfoComponent.getSelectedBranch().getName() : "null");
            }

            // Встановити філію (вже збережено в updateWizardDataWithBranch)
            updateWizardDataWithBranch();

            // НОВЕ: Створюємо замовлення в базі даних
            if (shouldCreateOrderInDatabase()) {
                createOrderDraft();
            }

            // Безпечний перехід до наступного етапу
            if (onCompleted != null) {
                onCompleted.run();
            } else {
                log.warn("⚠️ onCompleted callback не встановлено");
            }

        } catch (Exception e) {
            log.error("❌ Помилка завершення step 1: {}", e.getMessage(), e);
            showErrorNotification("Помилка збереження: " + e.getMessage());
        }
    }

    /**
     * Перевіряє чи потрібно створювати замовлення в базі даних.
     */
    private boolean shouldCreateOrderInDatabase() {
        return wizardData.getDraftOrder().getId() == null &&
               wizardData.getSelectedClient() != null &&
               orderBasicInfoComponent != null &&
               orderBasicInfoComponent.getSelectedBranch() != null;
    }

    /**
     * Створює чернетку замовлення в базі даних.
     */
    private void createOrderDraft() {
        try {
            log.debug("🔄 Створення чернетки замовлення в базі даних");

            // Отримуємо OrderService з ApplicationContext
            OrderService orderService = applicationContext.getBean(OrderService.class);

            // Створюємо запит для API
            CreateOrderRequest request = CreateOrderRequest.builder()
                .clientId(wizardData.getSelectedClient().getId())
                .branchLocationId(orderBasicInfoComponent.getSelectedBranch().getId())
                .tagNumber(orderBasicInfoComponent.getTagNumber())
                .expediteType(ExpediteType.STANDARD)
                .draft(true)
                .items(new ArrayList<>()) // Предмети будуть додані пізніше
                .build();

            // Викликаємо API
            OrderDTO createdOrder = orderService.saveOrderDraft(request);

            // Оновлюємо wizardData з ID створеного замовлення
            wizardData.getDraftOrder().setId(createdOrder.getId());
            wizardData.getDraftOrder().setReceiptNumber(createdOrder.getReceiptNumber());

            log.info("✅ Створено чернетку замовлення з ID: {} та номером квитанції: {}",
                    createdOrder.getId(), createdOrder.getReceiptNumber());

        } catch (Exception e) {
            log.error("❌ Помилка створення чернетки замовлення: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося створити замовлення: " + e.getMessage(), e);
        }
    }

    private void showErrorNotification(String message) {
        if (getUI().isPresent()) {
            com.vaadin.flow.component.notification.Notification.show(
                message,
                3000,
                com.vaadin.flow.component.notification.Notification.Position.MIDDLE
            );
        }
    }
}
