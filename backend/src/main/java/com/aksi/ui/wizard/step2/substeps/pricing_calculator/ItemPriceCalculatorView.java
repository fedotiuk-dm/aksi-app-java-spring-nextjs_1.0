package com.aksi.ui.wizard.step2.substeps.pricing_calculator;

import java.util.Set;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.application.PriceCalculationService;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.components.CalculationDetailsComponent;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.components.ModifiersSelectionComponent;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.components.PriceDisplayComponent;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.domain.PriceCalculationState;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.events.PriceCalculationEvents;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.data.binder.BeanValidationBinder;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.ValidationException;

import lombok.extern.slf4j.Slf4j;

/**
 * Головний координатор калькулятора цін для предметів замовлення.
 * Реалізований за принципами DDD + SOLID для забезпечення
 * модульності, тестованості та підтримки.
 *
 * Відповідальності:
 * - Координація між доменом, сервісами та UI компонентами
 * - Управління станом розрахунку
 * - Обробка подій та навігація
 */
@Slf4j
public class ItemPriceCalculatorView extends VerticalLayout {

    // Domain & Application Services
    private final PriceCalculationService priceCalculationService;

    // Navigation callbacks
    private final Consumer<OrderItemDTO> onNext;
    private final Consumer<OrderItemDTO> onPrevious;
    private final Runnable onCancel;

    // UI Components
    private PriceDisplayComponent priceDisplayComponent;
    private ModifiersSelectionComponent modifiersSelectionComponent;
    private CalculationDetailsComponent calculationDetailsComponent;

    // Navigation
    private Button previousButton;
    private Button nextButton;
    private Button cancelButton;

    // State management
    private PriceCalculationState currentCalculationState;
    private OrderItemDTO currentItem;
    private Binder<OrderItemDTO> binder;

    /**
     * Конструктор координатора калькулятора цін.
     */
    public ItemPriceCalculatorView(
            CatalogPriceModifierService modifierService,
            com.aksi.domain.pricing.service.PriceCalculationService domainPriceService,
            Consumer<OrderItemDTO> onNext,
            Consumer<OrderItemDTO> onPrevious,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        this.onNext = onNext;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;
        this.currentItem = existingItem;

        // Ініціалізуємо application service
        this.priceCalculationService = new PriceCalculationService(modifierService, domainPriceService);
        this.priceCalculationService.setEventHandler(this::handlePriceCalculationEvent);

        initializeLayout();
        createComponents();
        setupDataBinding();
        initializeCalculation();

        log.info("ItemPriceCalculatorView ініціалізовано для предмета: {}",
                existingItem != null ? existingItem.getName() : "новий");
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
    }

    private void createComponents() {
        H3 title = new H3("Калькулятор ціни предмета");
        title.getStyle().set("margin-top", "0");

        // Створюємо UI компоненти
        createPriceDisplayComponent();
        createModifiersSelectionComponent();
        createCalculationDetailsComponent();

        // Навігаційні кнопки
        HorizontalLayout buttonsLayout = createButtonsLayout();

        add(title,
            priceDisplayComponent,
            modifiersSelectionComponent,
            calculationDetailsComponent,
            buttonsLayout);
    }

    private void createPriceDisplayComponent() {
        priceDisplayComponent = new PriceDisplayComponent();
        priceDisplayComponent.setOnRecalculateRequested(this::performCalculation);
    }

    private void createModifiersSelectionComponent() {
        modifiersSelectionComponent = new ModifiersSelectionComponent();
        modifiersSelectionComponent.setOnSelectionChanged(this::handleModifiersSelectionChanged);

        // Завантажуємо модифікатори для всіх категорій
        loadModifiersForAllCategories();
    }

    private void createCalculationDetailsComponent() {
        calculationDetailsComponent = new CalculationDetailsComponent();
    }

    private HorizontalLayout createButtonsLayout() {
        HorizontalLayout buttonsLayout = new HorizontalLayout();
        buttonsLayout.setJustifyContentMode(JustifyContentMode.BETWEEN);
        buttonsLayout.setWidthFull();

        // Ліва група кнопок
        cancelButton = new Button("Скасувати");
        cancelButton.addClickListener(e -> handleCancel());

        // Права група кнопок
        previousButton = new Button("Назад до характеристик");
        previousButton.addClickListener(e -> handlePrevious());

        nextButton = new Button("Далі до фото");
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextButton.setIcon(VaadinIcon.ARROW_RIGHT.create());
        nextButton.setIconAfterText(true);
        nextButton.addClickListener(e -> handleNext());

        HorizontalLayout rightButtons = new HorizontalLayout(previousButton, nextButton);
        rightButtons.setSpacing(true);

        buttonsLayout.add(cancelButton, rightButtons);
        return buttonsLayout;
    }

    private void setupDataBinding() {
        binder = new BeanValidationBinder<>(OrderItemDTO.class);
        binder.setBean(currentItem);
    }

    /**
     * Ініціалізує розрахунок для поточного предмета.
     */
    private void initializeCalculation() {
        if (currentItem == null) {
            log.warn("Спроба ініціалізації розрахунку з null предметом");
            return;
        }

        try {
            currentCalculationState = priceCalculationService.initializeCalculation(currentItem);
            updateUIFromCalculationState();

        } catch (Exception ex) {
            log.error("Помилка ініціалізації розрахунку: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка ініціалізації розрахунку: " + ex.getMessage());
        }
    }

    /**
     * Завантажує модифікатори для всіх категорій.
     */
    private void loadModifiersForAllCategories() {
        try {
            // Завантажуємо модифікатори для кожної категорії
            var generalModifiers = priceCalculationService.loadModifiersForCategory(ModifierCategory.GENERAL);
            var textileModifiers = priceCalculationService.loadModifiersForCategory(ModifierCategory.TEXTILE);
            var leatherModifiers = priceCalculationService.loadModifiersForCategory(ModifierCategory.LEATHER);

            // Передаємо в UI компонент
            modifiersSelectionComponent.loadModifiers(ModifierCategory.GENERAL, generalModifiers);
            modifiersSelectionComponent.loadModifiers(ModifierCategory.TEXTILE, textileModifiers);
            modifiersSelectionComponent.loadModifiers(ModifierCategory.LEATHER, leatherModifiers);

            log.debug("Завантажено модифікатори: загальні={}, текстильні={}, шкіряні={}",
                     generalModifiers.size(), textileModifiers.size(), leatherModifiers.size());

        } catch (Exception ex) {
            log.error("Помилка завантаження модифікаторів: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка завантаження модифікаторів: " + ex.getMessage());
        }
    }

    /**
     * Обробляє зміну вибору модифікаторів.
     */
    private void handleModifiersSelectionChanged(Set<PriceModifierDTO> selectedModifiers) {
        log.debug("Зміна вибору модифікаторів: {} вибрано", selectedModifiers.size());

        // Автоматично виконуємо розрахунок при зміні вибору
        performCalculation();
    }

    /**
     * Виконує розрахунок ціни з поточними модифікаторами.
     */
    private void performCalculation() {
        if (currentCalculationState == null) {
            log.warn("Спроба розрахунку з null станом");
            return;
        }

        try {
            Set<PriceModifierDTO> selectedModifiers = modifiersSelectionComponent.getSelectedModifiers();

            log.debug("Виконання розрахунку з {} модифікаторами", selectedModifiers.size());

            currentCalculationState = priceCalculationService.calculatePrice(
                    currentCalculationState,
                    selectedModifiers
            );

            updateUIFromCalculationState();

        } catch (Exception ex) {
            log.error("Помилка розрахунку ціни: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка розрахунку ціни: " + ex.getMessage());
        }
    }

    /**
     * Оновлює UI компоненти на основі стану розрахунку.
     */
    private void updateUIFromCalculationState() {
        if (currentCalculationState == null) {
            return;
        }

        // Оновлюємо компонент відображення цін
        priceDisplayComponent.updatePrices(currentCalculationState);

        // Оновлюємо деталі розрахунку
        calculationDetailsComponent.updateCalculationDetails(currentCalculationState.getCalculationDetails());

        // Оновлюємо стан кнопок
        updateNavigationButtons();
    }

    /**
     * Оновлює стан навігаційних кнопок.
     */
    private void updateNavigationButtons() {
        boolean calculationValid = currentCalculationState != null && currentCalculationState.isValid();
        nextButton.setEnabled(calculationValid);
    }

    /**
     * Обробляє події розрахунку цін.
     */
    private void handlePriceCalculationEvent(PriceCalculationEvents event) {
        log.debug("Обробка події: {}", event.getClass().getSimpleName());

        if (event instanceof PriceCalculationEvents.CalculationCompleted calculationCompleted) {
            showSuccessNotification("Розрахунок успішно завершено");
            log.debug("Розрахунок завершено: базова ціна={}, фінальна ціна={}",
                     calculationCompleted.calculationState().getBasePrice(),
                     calculationCompleted.calculationState().getFinalPrice());

        } else if (event instanceof PriceCalculationEvents.CalculationFailed calculationFailed) {
            showErrorNotification("Помилка розрахунку: " + calculationFailed.errorMessage());
            log.error("Розрахунок не вдався: {}", calculationFailed.errorMessage(), calculationFailed.cause());

        } else if (event instanceof PriceCalculationEvents.BasePriceLoaded basePriceLoaded) {
            log.debug("Базова ціна завантажена: {} - {} = {}",
                     basePriceLoaded.itemCategory(), basePriceLoaded.itemName(), basePriceLoaded.basePrice());

        } else if (event instanceof PriceCalculationEvents.ModifiersLoaded modifiersLoaded) {
            log.debug("Модифікатори завантажені для {}: {} шт",
                     modifiersLoaded.categoryCode(), modifiersLoaded.modifiers().size());

        } else {
            log.debug("Необроблена подія: {}", event);
        }
    }

    /**
     * Обробляє навігацію назад.
     */
    private void handlePrevious() {
        try {
            saveCurrentCalculationToItem();
            onPrevious.accept(currentItem);

        } catch (Exception ex) {
            log.error("Помилка при поверненні назад: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка збереження даних: " + ex.getMessage());
        }
    }

    /**
     * Обробляє навігацію вперед.
     */
    private void handleNext() {
        try {
            if (!validateCalculation()) {
                return;
            }

            saveCurrentCalculationToItem();
            onNext.accept(currentItem);

        } catch (Exception ex) {
            log.error("Помилка при переході далі: {}", ex.getMessage(), ex);
            showErrorNotification("Помилка збереження даних: " + ex.getMessage());
        }
    }

    /**
     * Обробляє скасування.
     */
    private void handleCancel() {
        onCancel.run();
    }

    /**
     * Валідує поточний розрахунок.
     */
    private boolean validateCalculation() {
        try {
            binder.writeBean(currentItem);

            if (currentCalculationState == null || !currentCalculationState.isValid()) {
                showWarningNotification("Розрахунок ціни не завершено або некоректний");
                return false;
            }

            return true;

        } catch (ValidationException ex) {
            log.warn("Помилка валідації: {}", ex.getMessage());
            showWarningNotification("Перевірте правильність введених даних");
            return false;
        }
    }

    /**
     * Зберігає поточний розрахунок до предмета.
     */
    private void saveCurrentCalculationToItem() {
        if (currentCalculationState != null && currentCalculationState.isValid()) {
            currentItem = priceCalculationService.applyCalculationToItem(currentItem, currentCalculationState);

            log.debug("Розрахунок збережено до предмета: базова ціна={}, фінальна ціна={}",
                     currentItem.getUnitPrice(), currentItem.getTotalPrice());
        }
    }

    /**
     * Показує повідомлення про успіх.
     */
    private void showSuccessNotification(String message) {
        Notification.show(message, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    /**
     * Показує повідомлення про помилку.
     */
    private void showErrorNotification(String message) {
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    /**
     * Показує попереджувальне повідомлення.
     */
    private void showWarningNotification(String message) {
        Notification.show(message, 4000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_CONTRAST);
    }

    // Public API для доступу до стану

    /**
     * Повертає поточний стан розрахунку.
     */
    public PriceCalculationState getCurrentCalculationState() {
        return currentCalculationState;
    }

    /**
     * Повертає поточний предмет.
     */
    public OrderItemDTO getCurrentItem() {
        return currentItem;
    }

    /**
     * Перевіряє чи готовий калькулятор до переходу далі.
     */
    public boolean isReadyForNext() {
        return currentCalculationState != null && currentCalculationState.isValid();
    }
}
