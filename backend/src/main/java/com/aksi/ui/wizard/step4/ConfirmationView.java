package com.aksi.ui.wizard.step4;

import java.util.function.Consumer;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step4.application.ConfirmationService;
import com.aksi.ui.wizard.step4.components.AgreementComponent;
import com.aksi.ui.wizard.step4.components.NavigationComponent;
import com.aksi.ui.wizard.step4.components.OrderSummaryComponent;
import com.aksi.ui.wizard.step4.components.ReceiptActionsComponent;
import com.aksi.ui.wizard.step4.domain.ConfirmationState;
import com.aksi.ui.wizard.step4.events.ConfirmationEvents;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Рефакторинований етап 4: Підтвердження та завершення замовлення.
 * Event-driven координатор з використанням DDD + SOLID принципів.
 *
 * Архітектура:
 * - Domain Layer: ConfirmationState (бізнес-логіка підтвердження)
 * - Application Layer: ConfirmationService (координація)
 * - UI Components: OrderSummaryComponent, AgreementComponent, ReceiptActionsComponent, NavigationComponent (SRP)
 */
@Slf4j
public class ConfirmationView extends VerticalLayout {

    // Application service та callbacks
    private final ConfirmationService confirmationService;
    private final Consumer<OrderWizardData> onCompleted;
    private final Runnable onPrevious;
    private final Runnable onCancel;

    // UI компоненти
    private H3 title;
    private OrderSummaryComponent orderSummary;
    private AgreementComponent agreement;
    private ReceiptActionsComponent receiptActions;
    private NavigationComponent navigation;

    // Поточний стан
    private ConfirmationState currentState;
    private OrderWizardData wizardData;

    public ConfirmationView(
            OrderWizardData wizardData,
            ConfirmationService confirmationService,
            Consumer<OrderWizardData> onCompleted,
            Runnable onPrevious,
            Runnable onCancel) {

        this.wizardData = wizardData;
        this.confirmationService = confirmationService;
        this.onCompleted = onCompleted;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;

        initializeLayout();
        initializeComponents();
        setupEventHandlers();
        initializeData();

        log.info("ConfirmationView ініціалізовано з event-driven архітектурою для замовлення: {}",
                wizardData.getDraftOrder() != null ? wizardData.getDraftOrder().getReceiptNumber() : "невідомо");
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
        addClassName("confirmation-view");
    }

    private void initializeComponents() {
        // Заголовок
        title = new H3("Підтвердження та завершення замовлення");
        title.getStyle().set("margin-top", "0");

        // Компоненти
        orderSummary = new OrderSummaryComponent();
        agreement = new AgreementComponent();
        receiptActions = new ReceiptActionsComponent();
        navigation = new NavigationComponent();

        add(title, orderSummary, agreement, receiptActions, navigation);
    }

    private void setupEventHandlers() {
        // Налаштовуємо обробник подій для Application Service
        confirmationService.setEventHandler(this::handleConfirmationEvent);

        // Налаштовуємо обробники для UI компонентів
        setupAgreementHandlers();
        setupReceiptActionsHandlers();
        setupNavigationHandlers();
    }

    private void setupAgreementHandlers() {
        agreement.setOnAgreementChange(isAccepted -> {
            currentState = confirmationService.handleAgreementChange(currentState, isAccepted);
        });
    }

    private void setupReceiptActionsHandlers() {
        receiptActions.setOnGenerateReceipt(() -> {
            currentState = confirmationService.generateReceipt(currentState);
        });

        receiptActions.setOnEmailReceipt(() -> {
            currentState = confirmationService.sendReceiptByEmail(currentState);
        });
    }

    private void setupNavigationHandlers() {
        navigation.setOnCancel(() -> {
            handleCancelRequest();
        });

        navigation.setOnPrevious(() -> {
            confirmationService.handleNavigationRequest(currentState, ConfirmationEvents.NavigationType.PREVIOUS);
        });

        navigation.setOnComplete(() -> {
            handleCompleteOrderRequest();
        });
    }

    private void initializeData() {
        try {
            currentState = confirmationService.initializeConfirmation(wizardData, generateSessionId());
        } catch (Exception e) {
            log.error("Failed to initialize confirmation: {}", e.getMessage(), e);
            showErrorNotification("Помилка ініціалізації підтвердження: " + e.getMessage());
        }
    }

    /**
     * Централізований обробник подій confirmation з pattern matching.
     */
    private void handleConfirmationEvent(ConfirmationEvents event) {
        try {
            switch (event) {
                case ConfirmationEvents.ConfirmationInitialized initialized ->
                    handleConfirmationInitialized(initialized);
                case ConfirmationEvents.ConfirmationStateUpdated stateUpdated ->
                    handleStateUpdated(stateUpdated);
                case ConfirmationEvents.OrderValidationCompleted validationCompleted ->
                    handleValidationCompleted(validationCompleted);
                case ConfirmationEvents.AgreementStatusChanged agreementChanged ->
                    handleAgreementStatusChanged(agreementChanged);
                case ConfirmationEvents.ReceiptGenerationRequested receiptRequested ->
                    handleReceiptGenerationRequested(receiptRequested);
                case ConfirmationEvents.ReceiptGenerationCompleted receiptCompleted ->
                    handleReceiptGenerationCompleted(receiptCompleted);
                case ConfirmationEvents.ReceiptGenerationFailed receiptFailed ->
                    handleReceiptGenerationFailed(receiptFailed);
                case ConfirmationEvents.EmailSendingRequested emailRequested ->
                    handleEmailSendingRequested(emailRequested);
                case ConfirmationEvents.EmailSendingCompleted emailCompleted ->
                    handleEmailSendingCompleted(emailCompleted);
                case ConfirmationEvents.EmailSendingFailed emailFailed ->
                    handleEmailSendingFailed(emailFailed);
                case ConfirmationEvents.OrderCompletionRequested orderRequested ->
                    handleOrderCompletionRequested(orderRequested);
                case ConfirmationEvents.OrderCompletionCompleted orderCompleted ->
                    handleOrderCompletionCompleted(orderCompleted);
                case ConfirmationEvents.OrderCompletionFailed orderFailed ->
                    handleOrderCompletionFailed(orderFailed);
                case ConfirmationEvents.NavigationRequested navigationRequested ->
                    handleNavigationRequested(navigationRequested);
                case ConfirmationEvents.ConfirmationError error ->
                    handleConfirmationError(error);
                case ConfirmationEvents.LoadingStarted loadingStarted ->
                    handleLoadingStarted(loadingStarted);
                case ConfirmationEvents.LoadingCompleted loadingCompleted ->
                    handleLoadingCompleted(loadingCompleted);
                case ConfirmationEvents.UIStateChanged uiStateChanged ->
                    handleUIStateChanged(uiStateChanged);
                case ConfirmationEvents.ValidationWarningsDisplayed warningsDisplayed ->
                    handleValidationWarningsDisplayed(warningsDisplayed);
                case ConfirmationEvents.ProgressUpdated progressUpdated ->
                    handleProgressUpdated(progressUpdated);
                default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
            }
        } catch (Exception e) {
            log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), e.getMessage(), e);
            showErrorNotification("Системна помилка: " + e.getMessage());
        }
    }

    private void handleConfirmationInitialized(ConfirmationEvents.ConfirmationInitialized initialized) {
        currentState = initialized.initialState();
        updateAllComponentsFromState();
        showInfoNotification("Етап підтвердження ініціалізовано");
        log.info("Confirmation initialized with session: {}", initialized.sessionId());
    }

    private void handleStateUpdated(ConfirmationEvents.ConfirmationStateUpdated stateUpdated) {
        currentState = stateUpdated.confirmationState();
        updateAllComponentsFromState();
        log.debug("Confirmation state updated: {}", stateUpdated.changeReason());
    }

    private void handleValidationCompleted(ConfirmationEvents.OrderValidationCompleted validationCompleted) {
        if (!validationCompleted.isValid()) {
            showValidationErrors(validationCompleted.validationErrors());
        }
        if (!validationCompleted.warnings().isEmpty()) {
            showWarnings(validationCompleted.warnings());
        }
        log.debug("Validation completed: valid={}, items={}, total={}",
                validationCompleted.isValid(), validationCompleted.itemsCount(), validationCompleted.totalAmount());
    }

    private void handleAgreementStatusChanged(ConfirmationEvents.AgreementStatusChanged agreementChanged) {
        if (agreementChanged.isAccepted()) {
            showSuccessNotification("Угоду прийнято ✅");
        } else {
            showInfoNotification("Угоду скасовано");
        }
        log.debug("Agreement status changed: {}", agreementChanged.isAccepted());
    }

    private void handleReceiptGenerationRequested(ConfirmationEvents.ReceiptGenerationRequested receiptRequested) {
        log.debug("Receipt generation requested for: {}", receiptRequested.receiptNumber());
    }

    private void handleReceiptGenerationCompleted(ConfirmationEvents.ReceiptGenerationCompleted receiptCompleted) {
        showSuccessNotification("PDF квитанція успішно згенерована!");
        log.info("Receipt generated: {} ({} bytes)", receiptCompleted.fileName(), receiptCompleted.fileSizeBytes());
    }

    private void handleReceiptGenerationFailed(ConfirmationEvents.ReceiptGenerationFailed receiptFailed) {
        showErrorNotification("Помилка генерації квитанції: " + receiptFailed.errorMessage());
        receiptActions.showError(true, receiptFailed.errorMessage());
        log.error("Receipt generation failed: {}", receiptFailed.errorMessage(), receiptFailed.exception());
    }

    private void handleEmailSendingRequested(ConfirmationEvents.EmailSendingRequested emailRequested) {
        showInfoNotification("Відправка квитанції на " + emailRequested.recipientEmail());
        log.debug("Email sending requested to: {}", emailRequested.recipientEmail());
    }

    private void handleEmailSendingCompleted(ConfirmationEvents.EmailSendingCompleted emailCompleted) {
        showSuccessNotification("Квитанцію успішно надіслано на " + emailCompleted.recipientEmail());
        log.info("Email sent to: {} with messageId: {}", emailCompleted.recipientEmail(), emailCompleted.messageId());
    }

    private void handleEmailSendingFailed(ConfirmationEvents.EmailSendingFailed emailFailed) {
        showErrorNotification("Помилка відправки email: " + emailFailed.errorMessage());
        log.error("Email sending failed to {}: {}", emailFailed.recipientEmail(), emailFailed.errorMessage(), emailFailed.exception());
    }

    private void handleOrderCompletionRequested(ConfirmationEvents.OrderCompletionRequested orderRequested) {
        log.debug("Order completion requested");
    }

    private void handleOrderCompletionCompleted(ConfirmationEvents.OrderCompletionCompleted orderCompleted) {
        showSuccessNotification("Замовлення успішно завершено!");
        navigation.showSuccess();

        // Завершуємо wizard через callback
        getUI().ifPresent(ui -> {
            ui.access(() -> {
                try {
                    onCompleted.accept(wizardData);
                } catch (Exception e) {
                    log.error("Error completing wizard: {}", e.getMessage(), e);
                }
            });
        });

        log.info("Order completed: {} with receipt: {} (amount: {})",
                orderCompleted.orderNumber(), orderCompleted.receiptNumber(), orderCompleted.finalAmount());
    }

    private void handleOrderCompletionFailed(ConfirmationEvents.OrderCompletionFailed orderFailed) {
        showErrorNotification("Помилка завершення замовлення: " + orderFailed.errorMessage());
        navigation.showError(true);
        log.error("Order completion failed: {}", orderFailed.errorMessage(), orderFailed.exception());
    }

    private void handleNavigationRequested(ConfirmationEvents.NavigationRequested navigationRequested) {
        switch (navigationRequested.navigationType()) {
            case PREVIOUS -> onPrevious.run();
            case CANCEL -> onCancel.run();
            case COMPLETE -> handleCompleteOrderRequest();
            case VIEW_RECEIPT -> log.debug("Receipt view navigation not implemented yet");
        }
        log.debug("Navigation requested: {} to {}", navigationRequested.navigationType(), navigationRequested.targetDestination());
    }

    private void handleConfirmationError(ConfirmationEvents.ConfirmationError error) {
        showErrorNotification("Помилка: " + error.errorMessage());
        log.error("Confirmation error in operation '{}': {}", error.operation(), error.errorMessage(), error.exception());
    }

    private void handleLoadingStarted(ConfirmationEvents.LoadingStarted loadingStarted) {
        navigation.showLoading(true, loadingStarted.operation());
        receiptActions.showLoading(true, loadingStarted.description());
        log.debug("Loading started: {}", loadingStarted.operation());
    }

    private void handleLoadingCompleted(ConfirmationEvents.LoadingCompleted loadingCompleted) {
        navigation.showLoading(false, null);
        receiptActions.showLoading(false, null);

        if (!loadingCompleted.success()) {
            showErrorNotification("Операція не вдалася: " + loadingCompleted.message());
        }
        log.debug("Loading completed: {} (success: {})", loadingCompleted.operation(), loadingCompleted.success());
    }

    private void handleUIStateChanged(ConfirmationEvents.UIStateChanged uiStateChanged) {
        orderSummary.showLoading(uiStateChanged.isLoading());
        orderSummary.showError(uiStateChanged.hasError());
        agreement.showLoading(uiStateChanged.isLoading());
        agreement.showError(uiStateChanged.hasError());

        if (uiStateChanged.statusMessage() != null) {
            showInfoNotification(uiStateChanged.statusMessage());
        }

        log.debug("UI state changed: loading={}, error={}, canComplete={}",
                uiStateChanged.isLoading(), uiStateChanged.hasError(), uiStateChanged.canCompleteOrder());
    }

    private void handleValidationWarningsDisplayed(ConfirmationEvents.ValidationWarningsDisplayed warningsDisplayed) {
        showWarnings(warningsDisplayed.warnings());
        if (warningsDisplayed.recommendedAction() != null) {
            showInfoNotification("Рекомендація: " + warningsDisplayed.recommendedAction());
        }
    }

    private void handleProgressUpdated(ConfirmationEvents.ProgressUpdated progressUpdated) {
        receiptActions.showProgress(progressUpdated.currentStep(), progressUpdated.statusText());
        log.debug("Progress updated: {}% - {}", progressUpdated.percentage(), progressUpdated.statusText());
    }

    private void handleCancelRequest() {
        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Скасувати замовлення?");
        dialog.setText("Ви впевнені, що хочете скасувати оформлення замовлення? " +
                      "Всі введені дані будуть втрачені.");

        dialog.setCancelable(true);
        dialog.setCancelText("Продовжити роботу");
        dialog.setConfirmText("Скасувати замовлення");
        dialog.setConfirmButtonTheme("error primary");

        dialog.addConfirmListener(e -> {
            confirmationService.handleNavigationRequest(currentState, ConfirmationEvents.NavigationType.CANCEL);
        });

        dialog.open();
    }

    private void handleCompleteOrderRequest() {
        if (currentState == null || !currentState.isCanCompleteOrder()) {
            showWarningNotification("Неможливо завершити замовлення. Перевірте всі умови.");
            return;
        }

        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Завершити замовлення?");
        dialog.setText("Ви впевнені, що хочете завершити оформлення замовлення? " +
                      "Після підтвердження замовлення буде збережено в системі.");

        dialog.setCancelable(true);
        dialog.setCancelText("Скасувати");
        dialog.setConfirmText("Завершити");
        dialog.setConfirmButtonTheme("primary success");

        dialog.addConfirmListener(e -> {
            currentState = confirmationService.completeOrder(currentState);
        });

        dialog.open();
    }

    /**
     * Оновлює всі UI компоненти з поточного domain state.
     */
    private void updateAllComponentsFromState() {
        if (currentState != null) {
            orderSummary.updateFromState(currentState);
            agreement.updateFromState(currentState);
            receiptActions.updateFromState(currentState);
            navigation.updateFromState(currentState);
        }
    }

    /**
     * Показує помилки валідації.
     */
    private void showValidationErrors(java.util.Set<String> errors) {
        if (errors != null && !errors.isEmpty()) {
            String errorMessage = "Помилки валідації:\n" + String.join("\n", errors);
            showErrorNotification(errorMessage);
        }
    }

    /**
     * Показує попередження.
     */
    private void showWarnings(java.util.Set<String> warnings) {
        if (warnings != null && !warnings.isEmpty()) {
            String warningMessage = "Попередження:\n" + String.join("\n", warnings);
            showWarningNotification(warningMessage);
        }
    }

    /**
     * Показує повідомлення про успіх.
     */
    private void showSuccessNotification(String message) {
        Notification notification = Notification.show(message, 3000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    /**
     * Показує інформаційне повідомлення.
     */
    private void showInfoNotification(String message) {
        Notification notification = Notification.show(message, 3000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_PRIMARY);
    }

    /**
     * Показує попередження.
     */
    private void showWarningNotification(String message) {
        Notification notification = Notification.show(message, 4000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_CONTRAST);
    }

    /**
     * Показує повідомлення про помилку.
     */
    private void showErrorNotification(String message) {
        Notification notification = Notification.show(message, 5000, Notification.Position.TOP_END);
        notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    /**
     * Генерує ідентифікатор сесії.
     */
    private String generateSessionId() {
        return "confirmation_" + System.currentTimeMillis();
    }

    // Публічні методи для зовнішнього використання

    /**
     * Оновлює відображення після зовнішніх змін.
     */
    public void refreshView() {
        if (currentState != null) {
            currentState = confirmationService.validateCurrentState(currentState);
        }
    }

    /**
     * Повертає поточний стан підтвердження.
     */
    public ConfirmationState getCurrentState() {
        return currentState;
    }

    /**
     * Перевіряє чи готове до завершення.
     */
    public boolean isReadyToComplete() {
        return currentState != null && currentState.isCanCompleteOrder();
    }

    /**
     * Перевіряє чи згенерована квитанція.
     */
    public boolean isReceiptGenerated() {
        return currentState != null && currentState.isReceiptGenerated();
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        orderSummary.setCompactMode(compact);
        agreement.setCompactMode(compact);
        receiptActions.setCompactMode(compact);
        navigation.setCompactMode(compact);

        if (compact) {
            addClassName("confirmation-compact-mode");
        } else {
            removeClassName("confirmation-compact-mode");
        }
        log.debug("Встановлено компактний режим: {}", compact);
    }
}
