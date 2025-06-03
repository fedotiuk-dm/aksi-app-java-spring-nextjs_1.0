package com.aksi.ui.wizard.step2.substeps;

import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.ItemCharacteristicsView;
import com.aksi.ui.wizard.step2.substeps.item_defects.ItemDefectsAndRisksView;
import com.aksi.ui.wizard.step2.substeps.item_info.ItemBasicInfoView;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.ItemPhotoDocumentationView;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.ItemPriceCalculatorView;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Підвізард для створення/редагування предмета замовлення.
 * Координує переходи між підетапами 2.1, 2.2, 2.3, 2.4, 2.5.
 */
@Slf4j
public class ItemSubWizardView extends VerticalLayout {

    private final ServiceCategoryService serviceCategoryService;
    private final PriceListService priceListService;
    private final ItemCharacteristicsService characteristicsService;
    private final CatalogPriceModifierService modifierService;
    private final PriceCalculationService priceCalculationService;
    private final Consumer<OrderItemDTO> onItemComplete;
    private final Runnable onCancel;

    // Поточний крок підвізарду
    private int currentSubStep = 1; // 2.1, 2.2, 2.3, 2.4, 2.5
    private OrderItemDTO currentItem;

    // UI компоненти для навігації
    private VerticalLayout navigationHeader;
    private HorizontalLayout progressSteps;
    private VerticalLayout contentArea;

    public ItemSubWizardView(
            ServiceCategoryService serviceCategoryService,
            PriceListService priceListService,
            ItemCharacteristicsService characteristicsService,
            CatalogPriceModifierService modifierService,
            PriceCalculationService priceCalculationService,
            Consumer<OrderItemDTO> onItemComplete,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        this.serviceCategoryService = serviceCategoryService;
        this.priceListService = priceListService;
        this.characteristicsService = characteristicsService;
        this.modifierService = modifierService;
        this.priceCalculationService = priceCalculationService;
        this.onItemComplete = onItemComplete;
        this.onCancel = onCancel;
        this.currentItem = existingItem != null ? existingItem : OrderItemDTO.builder().build();

        initializeLayout();
        createNavigationHeader();
        createContentArea();
        showCurrentSubStep();

        log.info("ItemSubWizardView ініціалізовано з підетапом {}", currentSubStep);
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(false);
        setMargin(false);
        setSpacing(false);
        getStyle().set("background", "var(--lumo-contrast-5pct)");
    }

    /**
     * Створює заголовок з навігацією підетапів.
     */
    private void createNavigationHeader() {
        navigationHeader = new VerticalLayout();
        navigationHeader.setPadding(true);
        navigationHeader.setSpacing(true);
        navigationHeader.getStyle()
            .set("background", "white")
            .set("border-bottom", "1px solid var(--lumo-contrast-10pct)")
            .set("box-shadow", "var(--lumo-box-shadow-s)");

        // Заголовок
        H3 title = new H3("Додавання предмета до замовлення");
        title.getStyle().set("margin", "0").set("color", "var(--lumo-primary-text-color)");

        // Підзаголовок з інформацією про предмет
        Span subtitle = new Span(currentItem.getName() != null
            ? "Редагування: " + currentItem.getName()
            : "Новий предмет");
        subtitle.getStyle()
            .set("color", "var(--lumo-secondary-text-color)")
            .set("font-size", "var(--lumo-font-size-s)");

        // Прогрес підетапів
        createProgressSteps();

        navigationHeader.add(title, subtitle, progressSteps);
        add(navigationHeader);
    }

    /**
     * Створює візуальний прогрес підетапів.
     */
    private void createProgressSteps() {
        progressSteps = new HorizontalLayout();
        progressSteps.setSpacing(false);
        progressSteps.setWidthFull();
        progressSteps.setJustifyContentMode(JustifyContentMode.BETWEEN);
        progressSteps.getStyle().set("margin-top", "var(--lumo-space-m)");

        String[] stepTitles = {
            "Основна інформація",
            "Характеристики",
            "Дефекти та ризики",
            "Розрахунок ціни",
            "Фотодокументація"
        };

        for (int i = 1; i <= 5; i++) {
            Div stepContainer = createStepIndicator(i, stepTitles[i-1]);
            progressSteps.add(stepContainer);

            // Додаємо роз'єднувач між кроками (крім останнього)
            if (i < 5) {
                Div separator = new Div();
                separator.getStyle()
                    .set("flex-grow", "1")
                    .set("height", "2px")
                    .set("background", getCurrentStep() >= i ? "var(--lumo-primary-color)" : "var(--lumo-contrast-20pct)")
                    .set("margin", "auto var(--lumo-space-s)");
                progressSteps.add(separator);
            }
        }
    }

    /**
     * Створює індикатор одного кроку.
     */
    private Div createStepIndicator(int stepNumber, String title) {
        Div container = new Div();
        container.getStyle()
            .set("display", "flex")
            .set("flex-direction", "column")
            .set("align-items", "center")
            .set("min-width", "80px");

        // Номер кроку
        Div stepCircle = new Div();
        stepCircle.setText(String.valueOf(stepNumber));
        stepCircle.getStyle()
            .set("width", "32px")
            .set("height", "32px")
            .set("border-radius", "50%")
            .set("display", "flex")
            .set("align-items", "center")
            .set("justify-content", "center")
            .set("font-weight", "bold")
            .set("font-size", "var(--lumo-font-size-s)")
            .set("margin-bottom", "var(--lumo-space-xs)");

        // Колір в залежності від стану
        if (stepNumber == currentSubStep) {
            stepCircle.getStyle()
                .set("background", "var(--lumo-primary-color)")
                .set("color", "var(--lumo-primary-contrast-color)");
        } else if (stepNumber < currentSubStep) {
            stepCircle.getStyle()
                .set("background", "var(--lumo-success-color)")
                .set("color", "var(--lumo-success-contrast-color)");
        } else {
            stepCircle.getStyle()
                .set("background", "var(--lumo-contrast-20pct)")
                .set("color", "var(--lumo-secondary-text-color)");
        }

        // Назва кроку
        Span stepTitle = new Span(title);
        stepTitle.getStyle()
            .set("font-size", "var(--lumo-font-size-xs)")
            .set("text-align", "center")
            .set("color", stepNumber <= currentSubStep ? "var(--lumo-body-text-color)" : "var(--lumo-secondary-text-color)")
            .set("font-weight", stepNumber == currentSubStep ? "bold" : "normal");

        container.add(stepCircle, stepTitle);
        return container;
    }

    /**
     * Створює область контенту.
     */
    private void createContentArea() {
        contentArea = new VerticalLayout();
        contentArea.setSizeFull();
        contentArea.setPadding(false);
        contentArea.setMargin(false);
        contentArea.setSpacing(false);
        add(contentArea);
        setFlexGrow(1, contentArea);
    }

    private void showCurrentSubStep() {
        contentArea.removeAll();

        log.info("🔍 ПОКАЗ ПІДЕТАПУ: currentSubStep={}, currentItem.name={}",
            currentSubStep, currentItem.getName());

        Component stepComponent = null;

        try {
            stepComponent = switch (currentSubStep) {
                case 1 -> createStep21(); // Основна інформація
                case 2 -> createStep22(); // Характеристики
                case 3 -> createStep23(); // Забруднення та дефекти
                case 4 -> createStep24(); // Розрахунок ціни
                case 5 -> createStep25(); // Фотодокументація
                default -> {
                    log.error("Невідомий підетап: {}", currentSubStep);
                    yield createStep21();
                }
            };

            log.info("🔍 СТВОРЕНО КОМПОНЕНТ: stepComponent={}, class={}",
                stepComponent != null ? "not null" : "null",
                stepComponent != null ? stepComponent.getClass().getSimpleName() : "none");

            if (stepComponent != null) {
                contentArea.add(stepComponent);

                // Оновлюємо прогрес і підзаголовок після успішного створення компонента
                updateProgressSteps();
                updateSubtitle();

                log.debug("Відображено підетап {} для предмета: {}", currentSubStep, currentItem.getName());
            } else {
                log.error("❌ Не вдалося створити компонент для підетапу {}", currentSubStep);
                createErrorView("Не вдалося створити компонент підетапу", new RuntimeException("Component is null"));
            }

        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА створення підетапу {}: {}", currentSubStep, ex.getMessage(), ex);
            stepComponent = createErrorView("Помилка створення підетапу", ex);
            contentArea.add(stepComponent);
        }
    }

    /**
     * Оновлює підзаголовок з інформацією про предмет.
     */
    private void updateSubtitle() {
        if (navigationHeader.getComponentCount() >= 2) {
            Component subtitleComponent = navigationHeader.getComponentAt(1);
            if (subtitleComponent instanceof Span subtitle) {
                String itemName = currentItem.getName() != null && !currentItem.getName().trim().isEmpty()
                    ? currentItem.getName()
                    : "Новий предмет";

                String stepInfo = String.format("Крок %d з 5: %s", currentSubStep, itemName);
                subtitle.setText(stepInfo);
            }
        }
    }

    /**
     * Оновлює візуальний прогрес кроків.
     */
    private void updateProgressSteps() {
        // Видаляємо старий прогрес якщо він існує
        if (navigationHeader.getComponentCount() >= 3) {
            Component oldProgress = navigationHeader.getComponentAt(2);
            navigationHeader.remove(oldProgress);
        }

        // Створюємо новий прогрес
        createProgressSteps();

        // Додаємо новий прогрес
        navigationHeader.add(progressSteps);

        log.debug("Прогрес підетапів оновлено для кроку {}", currentSubStep);
    }

    /**
     * Повертає поточний крок для обчислень.
     */
    private int getCurrentStep() {
        return currentSubStep;
    }

    private Component createStep21() {
        // Підетап 2.1: Основна інформація про предмет
        return new ItemBasicInfoView(
                serviceCategoryService,
                priceListService,
                this::handleStep21Next,
                onCancel,
                currentItem
        );
    }

    private Component createStep22() {
        // Підетап 2.2: Характеристики предмета
        log.info("🔍 СТВОРЕННЯ STEP22: characteristicsService={}, currentItem={}",
            characteristicsService != null ? "not null" : "null",
            currentItem != null ? currentItem.toString() : "null");

        try {
            var view = new ItemCharacteristicsView(
                    characteristicsService,
                    this::handleStep22Next,
                    this::handleStep22Previous,
                    onCancel,
                    currentItem
            );
            log.info("✅ STEP22 СТВОРЕНО УСПІШНО: {}", view.getClass().getSimpleName());
            return view;
        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА СТВОРЕННЯ STEP22: {}", ex.getMessage(), ex);
            // Повертаємо fallback
            return createErrorView("Помилка створення характеристик", ex);
        }
    }

    private Component createStep23() {
        // Підетап 2.3: Забруднення та дефекти
        try {
            log.debug("🔍 СТВОРЕННЯ STEP23: characteristicsService={}, currentItem={}",
                characteristicsService != null ? "not null" : "null",
                currentItem != null ? currentItem.getName() : "null");

            var view = new ItemDefectsAndRisksView(
                    characteristicsService,
                    this::handleStep23Next,
                    this::handleStep23Previous,
                    onCancel,
                    currentItem
            );
            log.info("✅ STEP23 СТВОРЕНО УСПІШНО: {}", view.getClass().getSimpleName());
            return view;
        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА СТВОРЕННЯ STEP23: {}", ex.getMessage(), ex);
            return createErrorView("Помилка створення дефектів", ex);
        }
    }

    private Component createStep24() {
        // Підетап 2.4: Розрахунок ціни
        try {
            log.debug("🔍 СТВОРЕННЯ STEP24: modifierService={}, priceCalculationService={}, currentItem={}",
                modifierService != null ? "not null" : "null",
                priceCalculationService != null ? "not null" : "null",
                currentItem != null ? currentItem.getName() : "null");

            var view = new ItemPriceCalculatorView(
                    modifierService,
                    priceCalculationService,
                    this::handleStep24Next,
                    this::handleStep24Previous,
                    onCancel,
                    currentItem
            );
            log.info("✅ STEP24 СТВОРЕНО УСПІШНО: {}", view.getClass().getSimpleName());
            return view;
        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА СТВОРЕННЯ STEP24: {}", ex.getMessage(), ex);
            return createErrorView("Помилка створення розрахунку ціни", ex);
        }
    }

    private Component createStep25() {
        // Підетап 2.5: Фотодокументація
        try {
            log.debug("🔍 СТВОРЕННЯ STEP25: currentItem={}",
                currentItem != null ? currentItem.getName() : "null");

            var view = new ItemPhotoDocumentationView(
                    this::handleStep25Next,
                    this::handleStep25Previous,
                    onCancel,
                    currentItem
            );
            log.info("✅ STEP25 СТВОРЕНО УСПІШНО: {}", view.getClass().getSimpleName());
            return view;
        } catch (Exception ex) {
            log.error("❌ ПОМИЛКА СТВОРЕННЯ STEP25: {}", ex.getMessage(), ex);
            return createErrorView("Помилка створення фотодокументації", ex);
        }
    }

    // Обробники переходів

    private void handleStep21Next(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 21->22: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 2;
            showCurrentSubStep();
            log.info("✅ Успішний перехід до характеристик для предмета: {}", item.getName());
        } catch (Exception ex) {
            log.error("❌ Помилка переходу 21->22: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка переходу до характеристик", 1);
        }
    }

    private void handleStep22Next(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 22->23: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 3;
            showCurrentSubStep();
            log.info("✅ Успішний перехід до дефектів для предмета: {} (матеріал: {}, колір: {})",
                    item.getName(), item.getMaterial(), item.getColor());
        } catch (Exception ex) {
            log.error("❌ Помилка переходу 22->23: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка переходу до дефектів", 2);
        }
    }

    private void handleStep22Previous(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 22->21: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 1;
            showCurrentSubStep();
            log.info("✅ Успішне повернення до основної інформації для предмета: {}", item.getName());
        } catch (Exception ex) {
            log.error("❌ Помилка повернення 22->21: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка повернення до основної інформації", 2);
        }
    }

    private void handleStep23Next(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 23->24: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 4;
            showCurrentSubStep();
            log.info("✅ Успішний перехід до розрахунку ціни для предмета: {} (плями: {}, дефекти: {})",
                    item.getName(), item.getStains(), item.getDefectsAndRisks());
        } catch (Exception ex) {
            log.error("❌ Помилка переходу 23->24: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка переходу до розрахунку ціни", 3);
        }
    }

    private void handleStep23Previous(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 23->22: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 2;
            showCurrentSubStep();
            log.info("✅ Успішне повернення до характеристик для предмета: {}", item.getName());
        } catch (Exception ex) {
            log.error("❌ Помилка повернення 23->22: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка повернення до характеристик", 3);
        }
    }

    private void handleStep24Next(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 24->25: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 5;
            showCurrentSubStep();
            log.info("✅ Успішний перехід до фотодокументації для предмета: {} (ціна: {}, загальна: {})",
                    item.getName(), item.getUnitPrice(), item.getTotalPrice());
        } catch (Exception ex) {
            log.error("❌ Помилка переходу 24->25: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка переходу до фотодокументації", 4);
        }
    }

    private void handleStep24Previous(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 24->23: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 3;
            showCurrentSubStep();
            log.info("✅ Успішне повернення до дефектів для предмета: {}", item.getName());
        } catch (Exception ex) {
            log.error("❌ Помилка повернення 24->23: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка повернення до дефектів", 4);
        }
    }

    private void handleStep25Next(OrderItemDTO item) {
        log.info("🔄 ЗАВЕРШЕННЯ: item={}", item != null ? item.getName() : "null");
        try {
            // Завершуємо додавання предмета
            this.currentItem = item;
            onItemComplete.accept(item);
            log.info("✅ Завершено додавання предмета: {} з фотодокументацією", item.getName());
        } catch (Exception ex) {
            log.error("❌ Помилка завершення: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка завершення додавання предмета", 5);
        }
    }

    private void handleStep25Previous(OrderItemDTO item) {
        log.info("🔄 ПЕРЕХІД 25->24: item={}", item != null ? item.getName() : "null");
        try {
            this.currentItem = item;
            currentSubStep = 4;
            showCurrentSubStep();
            log.info("✅ Успішне повернення до розрахунку ціни для предмета: {}", item.getName());
        } catch (Exception ex) {
            log.error("❌ Помилка повернення 25->24: {}", ex.getMessage(), ex);
            showErrorAndRevert("Помилка повернення до розрахунку ціни", 5);
        }
    }

    /**
     * Показує помилку та повертає до попереднього кроку.
     */
    private void showErrorAndRevert(String message, int revertToStep) {
        log.warn("⚠️ Повернення до кроку {} через помилку: {}", revertToStep, message);
        currentSubStep = revertToStep;
        showCurrentSubStep();

        // Тут можна додати показ повідомлення користувачу через Notification
        // Notification.show(message, 3000, Notification.Position.TOP_CENTER)
        //     .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    // Публічні методи

    /**
     * Безпечний перехід до конкретного підетапу.
     *
     * @param step Номер підетапу (1-5)
     * @return true якщо перехід успішний, false якщо є помилка
     */
    public boolean navigateToStep(int step) {
        if (step < 1 || step > 5) {
            log.warn("⚠️ Неправильний номер підетапу: {}", step);
            return false;
        }

        try {
            log.info("🔄 НАВІГАЦІЯ ДО ПІДЕТАПУ: {} -> {}", currentSubStep, step);
            currentSubStep = step;
            showCurrentSubStep();
            log.info("✅ Успішна навігація до підетапу: {}", step);
            return true;
        } catch (Exception ex) {
            log.error("❌ Помилка навігації до підетапу {}: {}", step, ex.getMessage(), ex);
            return false;
        }
    }

    /**
     * Отримати поточний номер підетапу.
     *
     * @return Номер поточного підетапу
     */
    public int getCurrentSubStep() {
        return currentSubStep;
    }

    /**
     * Отримати поточний предмет.
     *
     * @return Поточний предмет
     */
    public OrderItemDTO getCurrentItem() {
        return currentItem;
    }

    /**
     * Встановити новий предмет для редагування.
     *
     * @param item Предмет для редагування
     */
    public void setCurrentItem(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 1;
        showCurrentSubStep();

        log.info("Встановлено новий предмет для редагування: {}", item.getName());
    }

    /**
     * Скинути підвізард до початкового стану.
     */
    public void reset() {
        this.currentItem = OrderItemDTO.builder().build();
        this.currentSubStep = 1;
        showCurrentSubStep();

        log.info("Підвізард скинуто до початкового стану");
    }

    /**
     * Створює компонент помилки як fallback.
     */
    private Component createErrorView(String message, Exception ex) {
        VerticalLayout errorLayout = new VerticalLayout();
        errorLayout.setSizeFull();
        errorLayout.setPadding(true);
        errorLayout.setSpacing(true);
        errorLayout.getStyle().set("background", "var(--lumo-error-color-10pct)");

        H3 errorTitle = new H3("Помилка створення компонента");
        errorTitle.getStyle().set("color", "var(--lumo-error-text-color)");

        Span errorMessage = new Span(message);
        errorMessage.getStyle()
            .set("color", "var(--lumo-error-text-color)")
            .set("font-size", "var(--lumo-font-size-s)");

        Span technicalDetails = new Span("Технічні деталі: " + ex.getMessage());
        technicalDetails.getStyle()
            .set("color", "var(--lumo-secondary-text-color)")
            .set("font-size", "var(--lumo-font-size-xs)");

        HorizontalLayout buttonLayout = new HorizontalLayout();
        buttonLayout.setSpacing(true);

        Button retryButton = new Button("Спробувати знову", e -> {
            log.info("🔄 Повторна спроба створення підетапу {}", currentSubStep);
            showCurrentSubStep();
        });
        retryButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        Button backButton = new Button("Повернутися до початку", e -> {
            log.info("🔄 Повернення до першого підетапу");
            currentSubStep = 1;
            showCurrentSubStep();
        });

        buttonLayout.add(retryButton, backButton);

        errorLayout.add(errorTitle, errorMessage, technicalDetails, buttonLayout);

        log.warn("⚠️ Створено error view для підетапу {} з повідомленням: {}", currentSubStep, message);

        return errorLayout;
    }
}
