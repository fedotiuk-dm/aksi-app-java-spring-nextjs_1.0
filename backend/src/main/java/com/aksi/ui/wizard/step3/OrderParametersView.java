package com.aksi.ui.wizard.step3;

import java.math.BigDecimal;
import java.util.function.Consumer;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step3.application.OrderParametersService;
import com.aksi.ui.wizard.step3.components.AdditionalInfoComponent;
import com.aksi.ui.wizard.step3.components.DiscountComponent;
import com.aksi.ui.wizard.step3.components.ExecutionParametersComponent;
import com.aksi.ui.wizard.step3.components.OrderSummaryComponent;
import com.aksi.ui.wizard.step3.components.ParametersNavigationComponent;
import com.aksi.ui.wizard.step3.components.PaymentComponent;
import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.events.OrderParametersEvents;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Етап 3: Загальні параметри замовлення (рефакторинований).
 * Event-driven координатор з використанням DDD + SOLID принципів.
 */
@Slf4j
public class OrderParametersView extends VerticalLayout {

    // Application Service та callbacks
    private final OrderParametersService parametersService;
    private final Consumer<OrderWizardData> onNext;
    private final Runnable onPrevious;
    private final Runnable onCancel;

    // UI компоненти
    private H3 title;
    private Span subtitle;
    private OrderSummaryComponent orderSummary;
    private ExecutionParametersComponent executionParameters;
    private DiscountComponent discountComponent;
    private PaymentComponent paymentComponent;
    private AdditionalInfoComponent additionalInfo;
    private ParametersNavigationComponent navigation;

    // Поточний стан
    private OrderParametersState currentState;
    private OrderWizardData currentWizardData;

    public OrderParametersView(
            OrderWizardData wizardData,
            com.aksi.domain.order.service.OrderService orderService,
            Consumer<OrderWizardData> onNext,
            Runnable onPrevious,
            Runnable onCancel) {

        this.currentWizardData = wizardData;
        this.onNext = onNext;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;

        // Ініціалізуємо сервіс з переданим OrderService
        this.parametersService = new OrderParametersService(orderService);

        initializeComponents();
        initializeLayout();
        setupEventHandlers();
        initializeData();

        log.info("OrderParametersView ініціалізовано для замовлення: {}",
                wizardData.getDraftOrder().getReceiptNumber());
    }

    private void initializeComponents() {
        // Заголовок та підзаголовок
        title = new H3("Параметри замовлення");
        title.getStyle().set("margin-top", "0");

        subtitle = new Span(String.format("Замовлення: %s | Предметів: %d | Сума: ₴%.2f",
                currentWizardData.getDraftOrder().getReceiptNumber(),
                currentWizardData.getItems().size(),
                currentWizardData.getTotalAmount().doubleValue()));
        subtitle.getStyle().set("color", "var(--lumo-secondary-text-color)");

        // Компоненти
        orderSummary = new OrderSummaryComponent();
        executionParameters = new ExecutionParametersComponent();
        discountComponent = new DiscountComponent();
        paymentComponent = new PaymentComponent();
        additionalInfo = new AdditionalInfoComponent();
        navigation = new ParametersNavigationComponent();
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);

        add(title, subtitle, orderSummary, executionParameters, discountComponent,
            paymentComponent, additionalInfo, navigation);
    }

    private void setupEventHandlers() {
        // Налаштовуємо обробник подій для Application Service
        parametersService.setEventHandler(this::handleParametersEvent);

        // Налаштовуємо обробники для UI компонентів
        setupOrderSummaryHandlers();
        setupExecutionParametersHandlers();
        setupDiscountHandlers();
        setupPaymentHandlers();
        setupAdditionalInfoHandlers();
        setupNavigationHandlers();
    }

    private void setupOrderSummaryHandlers() {
        orderSummary.setOnTotalChanged(newTotal -> {
            // Оновлюємо загальну суму в draft order
            currentWizardData.getDraftOrder().setFinalAmount(newTotal);
            currentWizardData.getDraftOrder().setTotalAmount(newTotal);

            // Перераховуємо стан з новою базовою сумою
            currentState = parametersService.recalculateTotal(currentState, newTotal);

            log.debug("Загальна сума оновлена до: {}", newTotal);
        });
    }

    private void setupExecutionParametersHandlers() {
        executionParameters.setOnExpectedDateChanged(newDate -> {
            currentState = parametersService.updateExpectedDate(currentState, newDate);
        });

        executionParameters.setOnUrgencyOptionChanged(newUrgency -> {
            currentState = parametersService.updateUrgencyOption(currentState, newUrgency);
        });
    }

    private void setupDiscountHandlers() {
        discountComponent.setOnDiscountTypeChanged(newDiscountType -> {
            currentState = parametersService.updateDiscountType(currentState, newDiscountType);
        });

        discountComponent.setOnCustomDiscountChanged(newPercent -> {
            currentState = parametersService.updateCustomDiscountPercent(currentState, newPercent);
        });
    }

    private void setupPaymentHandlers() {
        paymentComponent.setOnPaymentMethodChanged(newPaymentMethod -> {
            currentState = parametersService.updatePaymentMethod(currentState, newPaymentMethod);
        });

        paymentComponent.setOnPaidAmountChanged(newPaidAmount -> {
            currentState = parametersService.updatePaidAmount(currentState, newPaidAmount);
        });
    }

    private void setupAdditionalInfoHandlers() {
        additionalInfo.setOnNotesChanged((orderNotes, clientRequirements) -> {
            currentState = parametersService.updateNotes(currentState, orderNotes, clientRequirements);
        });
    }

    private void setupNavigationHandlers() {
        navigation.setOnCancel(() -> {
            log.debug("Скасування параметрів замовлення");
            parametersService.requestCancel("user_cancel");
        });

        navigation.setOnPrevious(() -> {
            parametersService.requestNavigateBack(currentState, currentWizardData);
        });

        navigation.setOnNext(() -> {
            parametersService.requestProceedToNext(currentState, currentWizardData);
        });
    }

    private void initializeData() {
        currentState = parametersService.initializeParameters(currentWizardData);

        // Передаємо предмети до компонента підсумку
        orderSummary.setOrderItems(currentWizardData.getItems());
    }

    /**
     * Централізований обробник подій з Application Service.
     */
    private void handleParametersEvent(OrderParametersEvents event) {
        try {
            switch (event) {
                case OrderParametersEvents.ParametersInitialized initialized ->
                    handleParametersInitialized(initialized);
                case OrderParametersEvents.ParametersStateUpdated stateUpdated ->
                    handleStateUpdated(stateUpdated);
                case OrderParametersEvents.ExpectedDateChanged dateChanged ->
                    handleExpectedDateChanged(dateChanged);
                case OrderParametersEvents.UrgencyOptionChanged urgencyChanged ->
                    handleUrgencyOptionChanged(urgencyChanged);
                case OrderParametersEvents.DiscountTypeChanged discountChanged ->
                    handleDiscountTypeChanged(discountChanged);
                case OrderParametersEvents.CustomDiscountChanged customDiscountChanged ->
                    handleCustomDiscountChanged(customDiscountChanged);
                case OrderParametersEvents.PaymentMethodChanged paymentChanged ->
                    handlePaymentMethodChanged(paymentChanged);
                case OrderParametersEvents.PaidAmountChanged paidAmountChanged ->
                    handlePaidAmountChanged(paidAmountChanged);
                case OrderParametersEvents.NotesChanged notesChanged ->
                    handleNotesChanged(notesChanged);
                case OrderParametersEvents.ParametersValidated validated ->
                    handleParametersValidated(validated);
                case OrderParametersEvents.ReadyToProceed readyToProceed ->
                    handleReadyToProceed(readyToProceed);
                case OrderParametersEvents.NavigateBackRequested navigateBack ->
                    handleNavigateBackRequested(navigateBack);
                case OrderParametersEvents.CancelRequested cancelRequested ->
                    handleCancelRequested(cancelRequested);
                case OrderParametersEvents.ParametersError error ->
                    handleParametersError(error);
                case OrderParametersEvents.CalculationCompleted calculationCompleted ->
                    handleCalculationCompleted(calculationCompleted);
                case OrderParametersEvents.LoadingStarted loadingStarted ->
                    handleLoadingStarted(loadingStarted);
                case OrderParametersEvents.LoadingCompleted loadingCompleted ->
                    handleLoadingCompleted(loadingCompleted);
                case OrderParametersEvents.FinancialStateChanged financialStateChanged ->
                    handleFinancialStateChanged(financialStateChanged);
                case OrderParametersEvents.DiscountWarningUpdated discountWarningUpdated ->
                    handleDiscountWarningUpdated(discountWarningUpdated);
                case OrderParametersEvents.ProcessingInfoUpdated processingInfoUpdated ->
                    handleProcessingInfoUpdated(processingInfoUpdated);
                case OrderParametersEvents.UIStateChanged uiStateChanged ->
                    handleUIStateChanged(uiStateChanged);
                default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
            }
        } catch (Exception ex) {
            log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            showErrorNotification("Системна помилка: " + ex.getMessage());
        }
    }

    private void handleParametersInitialized(OrderParametersEvents.ParametersInitialized initialized) {
        currentState = initialized.initialState();
        updateAllComponentsFromState();
        log.debug("Параметри замовлення ініціалізовано");
    }

    private void handleStateUpdated(OrderParametersEvents.ParametersStateUpdated stateUpdated) {
        currentState = stateUpdated.parametersState();
        updateAllComponentsFromState();
        log.debug("Стан параметрів оновлено: {}", stateUpdated.changeReason());
    }

    private void handleExpectedDateChanged(OrderParametersEvents.ExpectedDateChanged dateChanged) {
        if (dateChanged.isValidDate()) {
            log.debug("Дата виконання змінена: {} -> {}", dateChanged.previousDate(), dateChanged.newDate());
        } else {
            showErrorNotification("Неправильна дата виконання");
        }
    }

    private void handleUrgencyOptionChanged(OrderParametersEvents.UrgencyOptionChanged urgencyChanged) {
        if (urgencyChanged.surchargePercent() > 0) {
            showInfoNotification(String.format("Терміновість: %s (+%d%%)",
                    urgencyChanged.newUrgency().getLabel(), urgencyChanged.surchargePercent()));
        }
        log.debug("Терміновість змінена: {} -> {}", urgencyChanged.previousUrgency(), urgencyChanged.newUrgency());
    }

    private void handleDiscountTypeChanged(OrderParametersEvents.DiscountTypeChanged discountChanged) {
        if (discountChanged.effectivePercent().compareTo(BigDecimal.ZERO) > 0) {
            showSuccessNotification(String.format("Знижка: %s (%.0f%%)",
                    discountChanged.newDiscountType().getLabel(),
                    discountChanged.effectivePercent().doubleValue()));
        }
        log.debug("Тип знижки змінений: {} -> {}", discountChanged.previousDiscountType(), discountChanged.newDiscountType());
    }

    private void handleCustomDiscountChanged(OrderParametersEvents.CustomDiscountChanged customDiscountChanged) {
        if (!customDiscountChanged.isValidPercent()) {
            showErrorNotification("Неправильний відсоток знижки");
        }
        log.debug("Кастомна знижка змінена: {} -> {}", customDiscountChanged.previousPercent(), customDiscountChanged.newPercent());
    }

    private void handlePaymentMethodChanged(OrderParametersEvents.PaymentMethodChanged paymentChanged) {
        log.debug("Спосіб оплати змінений: {} -> {}", paymentChanged.previousPaymentMethod(), paymentChanged.newPaymentMethod());
    }

    private void handlePaidAmountChanged(OrderParametersEvents.PaidAmountChanged paidAmountChanged) {
        if (!paidAmountChanged.isValidAmount()) {
            showErrorNotification("Неправильна сума оплати");
        }
        log.debug("Сума оплати змінена: {} -> {}", paidAmountChanged.previousPaidAmount(), paidAmountChanged.newPaidAmount());
    }

    private void handleNotesChanged(OrderParametersEvents.NotesChanged notesChanged) {
        log.debug("Примітки змінені");
    }

    private void handleParametersValidated(OrderParametersEvents.ParametersValidated validated) {
        if (!validated.isValid()) {
            showValidationErrors(validated.validationMessages());
        }
        if (!validated.warnings().isEmpty()) {
            showWarnings(validated.warnings());
        }
    }

    private void handleReadyToProceed(OrderParametersEvents.ReadyToProceed readyToProceed) {
        if (readyToProceed.isReady()) {
            log.debug("Готовий до переходу на наступний етап");
            navigation.showNextSuccess();
            currentWizardData = readyToProceed.updatedWizardData();
            onNext.accept(currentWizardData);
        }
    }

    private void handleNavigateBackRequested(OrderParametersEvents.NavigateBackRequested navigateBack) {
        log.debug("Перехід назад до управління предметами");
        currentWizardData = navigateBack.currentWizardData();
        onPrevious.run();
    }

    private void handleCancelRequested(OrderParametersEvents.CancelRequested cancelRequested) {
        log.debug("Скасування: {}", cancelRequested.cancelReason());
        onCancel.run();
    }

    private void handleParametersError(OrderParametersEvents.ParametersError error) {
        log.error("Помилка параметрів в операції {}: {}", error.operation(), error.errorMessage());
        showErrorNotification("Помилка: " + error.errorMessage());
        navigation.showNextError();
    }

    private void handleCalculationCompleted(OrderParametersEvents.CalculationCompleted calculationCompleted) {
        log.debug("Розрахунок завершено: {} = {}", calculationCompleted.calculationType(), calculationCompleted.result());
    }

    private void handleLoadingStarted(OrderParametersEvents.LoadingStarted loadingStarted) {
        navigation.showNextLoading(true);
        log.debug("Початок операції: {}", loadingStarted.operation());
    }

    private void handleLoadingCompleted(OrderParametersEvents.LoadingCompleted loadingCompleted) {
        navigation.showNextLoading(false);
        if (loadingCompleted.success()) {
            showSuccessNotification(loadingCompleted.message());
        }
        log.debug("Завершення операції: {}", loadingCompleted.operation());
    }

    private void handleFinancialStateChanged(OrderParametersEvents.FinancialStateChanged financialStateChanged) {
        paymentComponent.showFinancialSummary();

        // Оновлюємо підзаголовок з новою сумою
        subtitle.setText(String.format("Замовлення: %s | Предметів: %d | Сума: ₴%.2f",
                currentWizardData.getDraftOrder().getReceiptNumber(),
                currentWizardData.getItems().size(),
                financialStateChanged.totalAmount().doubleValue()));

        log.debug("Фінансовий стан змінений: всього={}, сплачено={}, борг={}",
                financialStateChanged.totalAmount(), financialStateChanged.paidAmount(), financialStateChanged.debtAmount());
    }

    private void handleDiscountWarningUpdated(OrderParametersEvents.DiscountWarningUpdated discountWarningUpdated) {
        if (discountWarningUpdated.showWarning()) {
            discountComponent.showAdditionalWarning(String.join(", ", discountWarningUpdated.warnings()));
        }
    }

    private void handleProcessingInfoUpdated(OrderParametersEvents.ProcessingInfoUpdated processingInfoUpdated) {
        log.debug("Інформація про обробку оновлена: {} днів, {} предметів",
                processingInfoUpdated.processingDays(), processingInfoUpdated.itemsCount());
    }

    private void handleUIStateChanged(OrderParametersEvents.UIStateChanged uiStateChanged) {
        navigation.setNextEnabled(uiStateChanged.canProceedToNext());
        if (uiStateChanged.isLoading()) {
            navigation.showNextLoading(true);
        }
    }

    /**
     * Оновлює всі UI компоненти з поточного domain state.
     */
    private void updateAllComponentsFromState() {
        if (currentState != null) {
            orderSummary.updateFromState(currentState);
            orderSummary.setOrderItems(currentWizardData.getItems());
            executionParameters.updateFromState(currentState);
            discountComponent.updateFromState(currentState);
            paymentComponent.updateFromState(currentState);
            additionalInfo.updateFromState(currentState);
            navigation.updateFromState(currentState);
        }
    }

    /**
     * Показує помилки валідації.
     */
    private void showValidationErrors(java.util.List<String> errors) {
        String errorMessage = "Помилки валідації:\n" + String.join("\n", errors);
        showErrorNotification(errorMessage);
    }

    /**
     * Показує попередження.
     */
    private void showWarnings(java.util.List<String> warnings) {
        String warningMessage = String.join("\n", warnings);
        Notification.show(warningMessage, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_CONTRAST);
    }

    /**
     * Показує повідомлення про успіх.
     */
    private void showSuccessNotification(String message) {
        Notification.show(message, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    /**
     * Показує інформаційне повідомлення.
     */
    private void showInfoNotification(String message) {
        Notification.show(message, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_PRIMARY);
    }

    /**
     * Показує повідомлення про помилку.
     */
    private void showErrorNotification(String message) {
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    // Публічні методи для зовнішнього використання

    /**
     * Оновлює відображення після зовнішніх змін.
     */
    public void refreshView() {
        currentState = parametersService.validateParameters(currentState);
    }

    /**
     * Повертає поточний стан параметрів.
     */
    public OrderParametersState getCurrentState() {
        return currentState;
    }

    /**
     * Перевіряє чи готовий до завершення.
     */
    public boolean isReadyToComplete() {
        return currentState != null && currentState.isCanProceedToNext();
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        navigation.setCompactMode(compact);
        log.debug("Встановлено компактний режим: {}", compact);
    }
}
