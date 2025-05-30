package com.aksi.ui.wizard.infrastructure;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Фабрика для створення view компонентів етапів wizard'а
 * Інкапсулює логіку створення та налаштування конкретних етапів.
 */
@Service
@Slf4j
public class StepViewFactory {

    private final ApplicationContext applicationContext;

    public StepViewFactory(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     * Створення view для конкретного етапу.
     */
    public Component createStepView(int stepNumber, OrderWizardData wizardData,
                                   StepViewCallbacks callbacks) {
        try {
            log.info("Creating view for step: {}", stepNumber);

            return switch (stepNumber) {
                case 0 -> createStep1View(wizardData, callbacks);
                case 1 -> createStep2View(wizardData, callbacks);
                case 2 -> createStep3View(wizardData, callbacks);
                case 3 -> createStep4View(wizardData, callbacks);
                default -> createErrorView(stepNumber,
                    new IllegalArgumentException("Невідомий номер етапу: " + stepNumber));
            };

        } catch (Exception e) {
            log.error("Error creating step view for step {}: {}", stepNumber, e.getMessage(), e);
            return createErrorView(stepNumber, e);
        }
    }

    /**
     * Створення view для етапу 1 - Клієнт та базова інформація.
     */
    private Component createStep1View(OrderWizardData wizardData, StepViewCallbacks callbacks) {
        log.debug("Creating Step 1 view - Client and Order Info");

        try {
            var view = new com.aksi.ui.wizard.step1.ClientAndOrderInfoView(
                wizardData,
                callbacks::onStepCompleted,
                applicationContext
            );

            log.debug("Step 1 view created successfully");
            return view;

        } catch (Exception e) {
            log.error("Error creating ClientAndOrderInfoView: {}", e.getMessage(), e);
            return createFallbackStep1View(wizardData, callbacks, e);
        }
    }

    /**
     * Створення view для етапу 2 - Менеджер предметів.
     */
    private Component createStep2View(OrderWizardData wizardData, StepViewCallbacks callbacks) {
        log.debug("Creating Step 2 view - Items Manager");

        try {
            // Отримуємо необхідні сервіси з ApplicationContext
            var serviceCategoryService = applicationContext.getBean(
                "serviceCategoryServiceImpl",
                com.aksi.domain.pricing.service.ServiceCategoryService.class);
            var priceListService = applicationContext.getBean(
                "priceListServiceImpl",
                com.aksi.domain.pricing.service.PriceListService.class);
            var characteristicsService = applicationContext.getBean(
                "itemCharacteristicsServiceImpl",
                com.aksi.domain.order.service.ItemCharacteristicsService.class);
            var catalogPriceModifierService = applicationContext.getBean(
                "catalogPriceModifierServiceImpl",
                com.aksi.domain.pricing.service.CatalogPriceModifierService.class);
            var priceCalculationService = applicationContext.getBean(
                "priceCalculationServiceImpl",
                com.aksi.domain.pricing.service.PriceCalculationService.class);
            var orderItemManagementService = applicationContext.getBean(
                "orderItemManagementServiceImpl",
                com.aksi.domain.order.service.order.OrderItemManagementService.class);

            var view = new com.aksi.ui.wizard.step2.ItemsManagerView(
                serviceCategoryService,
                priceListService,
                characteristicsService,
                catalogPriceModifierService,
                priceCalculationService,
                orderItemManagementService,
                wizardData,
                callbacks::onStepCompleted,
                callbacks::onStepBack
            );

            log.debug("Step 2 view created successfully");
            return view;

        } catch (Exception e) {
            log.error("Error creating ItemsManagerView: {}", e.getMessage(), e);
            return createFallbackStep2View(wizardData, callbacks, e);
        }
    }

    /**
     * Створення view для етапу 3 - Параметри замовлення.
     */
    private Component createStep3View(OrderWizardData wizardData, StepViewCallbacks callbacks) {
        log.debug("Creating Step 3 view - Order Parameters");

        try {
            var view = new com.aksi.ui.wizard.step3.OrderParametersView(
                wizardData,
                callbacks::onStepCompletedWithData,
                callbacks::onStepBack,
                callbacks::onCancel
            );

            log.debug("Step 3 view created successfully");
            return view;

        } catch (Exception e) {
            log.error("Error creating OrderParametersView: {}", e.getMessage(), e);
            return createFallbackStep3View(wizardData, callbacks, e);
        }
    }

    /**
     * Створення view для етапу 4 - Підтвердження та завершення.
     */
    private Component createStep4View(OrderWizardData wizardData, StepViewCallbacks callbacks) {
        log.debug("Creating Step 4 view - Confirmation");

        try {
            // Отримуємо ReceiptService з ApplicationContext
            var receiptService = applicationContext.getBean(
                "receiptServiceImpl",
                com.aksi.domain.order.service.ReceiptService.class);

            var view = new com.aksi.ui.wizard.step4.ConfirmationView(
                wizardData,
                receiptService,
                callbacks::onWizardCompleted,
                callbacks::onStepBack,
                callbacks::onCancel
            );

            log.debug("Step 4 view created successfully");
            return view;

        } catch (Exception e) {
            log.error("Error creating ConfirmationView: {}", e.getMessage(), e);
            return createFallbackStep4View(wizardData, callbacks, e);
        }
    }

    /**
     * Створення fallback view для етапу 1.
     */
    private Component createFallbackStep1View(OrderWizardData wizardData,
                                             StepViewCallbacks callbacks, Exception error) {
        VerticalLayout fallback = new VerticalLayout();
        fallback.add(new H2("Етап 1: Клієнт та інформація"));
        fallback.add("Помилка створення компонента: " + error.getMessage());

        Button nextButton = new Button("Далі до предметів");
        nextButton.addClickListener(e -> callbacks.onStepCompleted());
        fallback.add(nextButton);

        log.warn("Using fallback view for step 1 due to error: {}", error.getMessage());
        return fallback;
    }

    /**
     * Створення fallback view для етапу 2.
     */
    private Component createFallbackStep2View(OrderWizardData wizardData,
                                             StepViewCallbacks callbacks, Exception error) {
        VerticalLayout fallback = new VerticalLayout();
        fallback.add(new H2("Етап 2: Менеджер предметів"));
        fallback.add("Помилка створення компонента: " + error.getMessage());

        Button nextButton = new Button("Далі до параметрів");
        nextButton.addClickListener(e -> callbacks.onStepCompleted());

        Button backButton = new Button("Назад до клієнта");
        backButton.addClickListener(e -> callbacks.onStepBack());

        fallback.add(backButton, nextButton);

        log.warn("Using fallback view for step 2 due to error: {}", error.getMessage());
        return fallback;
    }

    /**
     * Створення fallback view для етапу 3.
     */
    private Component createFallbackStep3View(OrderWizardData wizardData,
                                             StepViewCallbacks callbacks, Exception error) {
        VerticalLayout fallback = new VerticalLayout();
        fallback.add(new H2("Етап 3: Параметри замовлення"));
        fallback.add("Помилка створення компонента: " + error.getMessage());

        Button nextButton = new Button("Далі до підтвердження");
        nextButton.addClickListener(e -> callbacks.onStepCompletedWithData(wizardData));

        Button backButton = new Button("Назад до предметів");
        backButton.addClickListener(e -> callbacks.onStepBack());

        fallback.add(backButton, nextButton);

        log.warn("Using fallback view for step 3 due to error: {}", error.getMessage());
        return fallback;
    }

    /**
     * Створення fallback view для етапу 4.
     */
    private Component createFallbackStep4View(OrderWizardData wizardData,
                                             StepViewCallbacks callbacks, Exception error) {
        VerticalLayout fallback = new VerticalLayout();
        fallback.add(new H2("Етап 4: Підтвердження та завершення"));
        fallback.add("Помилка створення компонента: " + error.getMessage());

        Button completeButton = new Button("Завершити замовлення");
        completeButton.addClickListener(e -> callbacks.onWizardCompleted());

        Button backButton = new Button("Назад до параметрів");
        backButton.addClickListener(e -> callbacks.onStepBack());

        fallback.add(backButton, completeButton);

        log.warn("Using fallback view for step 4 due to error: {}", error.getMessage());
        return fallback;
    }

    /**
     * Створення view для відображення помилки.
     */
    private Component createErrorView(int stepNumber, Exception error) {
        VerticalLayout errorLayout = new VerticalLayout();
        errorLayout.addClassName("wizard-error-view");

        errorLayout.add(new H2("Помилка завантаження етапу " + (stepNumber + 1)));
        errorLayout.add("Сталася помилка: " + error.getMessage());

        Button retryButton = new Button("Спробувати ще раз");
        retryButton.addClickListener(e -> {
            // Цей обробник має бути налаштований зовні для повторного створення view
            log.info("Retry requested for step: {}", stepNumber);
        });

        errorLayout.add(retryButton);

        log.error("Created error view for step {}: {}", stepNumber, error.getMessage());
        return errorLayout;
    }

    /**
     * Перевірка доступності сервісів для етапу.
     */
    public boolean isStepSupported(int stepNumber) {
        return stepNumber >= 0 && stepNumber <= 3;
    }

    /**
     * Отримання назви етапу.
     */
    public String getStepName(int stepNumber) {
        return switch (stepNumber) {
            case 0 -> "Клієнт та інформація";
            case 1 -> "Менеджер предметів";
            case 2 -> "Параметри замовлення";
            case 3 -> "Підтвердження";
            default -> "Невідомий етап";
        };
    }

    /**
     * Callback interface для взаємодії між етапами та wizard'ом.
     */
    public interface StepViewCallbacks {
        void onStepCompleted();
        void onStepCompletedWithData(OrderWizardData data);
        void onStepBack();
        void onCancel();
        void onWizardCompleted();
    }
}
