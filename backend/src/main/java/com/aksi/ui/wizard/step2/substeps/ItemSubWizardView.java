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
        showCurrentSubStep();

        log.info("ItemSubWizardView ініціалізовано з підетапом {}", currentSubStep);
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(false);
        setMargin(false);
        setSpacing(false);
    }

    private void showCurrentSubStep() {
        removeAll();

        Component stepComponent = switch (currentSubStep) {
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

        add(stepComponent);

        log.debug("Відображено підетап {} для предмета: {}", currentSubStep, currentItem.getName());
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
        return new ItemCharacteristicsView(
                characteristicsService,
                this::handleStep22Next,
                this::handleStep22Previous,
                onCancel,
                currentItem
        );
    }

    private Component createStep23() {
        // Підетап 2.3: Забруднення та дефекти
        return new ItemDefectsAndRisksView(
                characteristicsService,
                this::handleStep23Next,
                this::handleStep23Previous,
                onCancel,
                currentItem
        );
    }

    private Component createStep24() {
        // Підетап 2.4: Розрахунок ціни
        return new ItemPriceCalculatorView(
                modifierService,
                priceCalculationService,
                this::handleStep24Next,
                this::handleStep24Previous,
                onCancel,
                currentItem
        );
    }

    private Component createStep25() {
        // Підетап 2.5: Фотодокументація
        return new ItemPhotoDocumentationView(
                this::handleStep25Next,
                this::handleStep25Previous,
                onCancel,
                currentItem
        );
    }

    // Обробники переходів

    private void handleStep21Next(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 2;
        showCurrentSubStep();

        log.info("Перехід до характеристик для предмета: {}", item.getName());
    }

    private void handleStep22Next(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 3;
        showCurrentSubStep();

        log.info("Перехід до дефектів для предмета: {} (матеріал: {}, колір: {})",
                item.getName(), item.getMaterial(), item.getColor());
    }

    private void handleStep22Previous(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 1;
        showCurrentSubStep();

        log.info("Повернення до основної інформації для предмета: {}", item.getName());
    }

    private void handleStep23Next(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 4;
        showCurrentSubStep();

        log.info("Перехід до розрахунку ціни для предмета: {} (плями: {}, дефекти: {})",
                item.getName(), item.getStains(), item.getDefectsAndRisks());
    }

    private void handleStep23Previous(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 2;
        showCurrentSubStep();

        log.info("Повернення до характеристик для предмета: {}", item.getName());
    }

    private void handleStep24Next(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 5;
        showCurrentSubStep();

        log.info("Перехід до фотодокументації для предмета: {} (ціна: {}, загальна: {})",
                item.getName(), item.getUnitPrice(), item.getTotalPrice());
    }

    private void handleStep24Previous(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 3;
        showCurrentSubStep();

        log.info("Повернення до дефектів для предмета: {}", item.getName());
    }

    private void handleStep25Next(OrderItemDTO item) {
        // Завершуємо додавання предмета
        this.currentItem = item;
        onItemComplete.accept(item);

        log.info("Завершено додавання предмета: {} з фотодокументацією", item.getName());
    }

    private void handleStep25Previous(OrderItemDTO item) {
        this.currentItem = item;
        currentSubStep = 4;
        showCurrentSubStep();

        log.info("Повернення до розрахунку ціни для предмета: {}", item.getName());
    }

    // Публічні методи

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
}
