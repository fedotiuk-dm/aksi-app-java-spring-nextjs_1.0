package com.aksi.ui.wizard.step2;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.domain.order.service.order.OrderItemManagementService;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step2.substeps.ItemSubWizardView;
import com.aksi.ui.wizard.step2.substeps.main_manager.ItemsMainManagerView;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для другого етапу Order Wizard.
 * Відповідає за управління предметами замовлення (циклічний процес).
 */
@Slf4j
public class ItemsManagerView extends VerticalLayout {

    private final ServiceCategoryService serviceCategoryService;
    private final PriceListService priceListService;
    private final ItemCharacteristicsService characteristicsService;
    private final CatalogPriceModifierService catalogPriceModifierService;
    private final PriceCalculationService priceCalculationService;
    private final OrderItemManagementService orderItemManagementService;
    private final OrderWizardData wizardData;
    private final Runnable onStepComplete;
    private final Runnable onStepBack;

    // UI стан
    private Component currentView;
    private boolean isInSubWizard = false;

    public ItemsManagerView(
            ServiceCategoryService serviceCategoryService,
            PriceListService priceListService,
            ItemCharacteristicsService characteristicsService,
            CatalogPriceModifierService catalogPriceModifierService,
            PriceCalculationService priceCalculationService,
            OrderItemManagementService orderItemManagementService,
            OrderWizardData wizardData,
            Runnable onStepComplete,
            Runnable onStepBack) {

        this.serviceCategoryService = serviceCategoryService;
        this.priceListService = priceListService;
        this.characteristicsService = characteristicsService;
        this.catalogPriceModifierService = catalogPriceModifierService;
        this.priceCalculationService = priceCalculationService;
        this.orderItemManagementService = orderItemManagementService;
        this.wizardData = wizardData;
        this.onStepComplete = onStepComplete;
        this.onStepBack = onStepBack;

        log.info("🔍 ІНІЦІАЛІЗАЦІЯ ItemsManagerView:");
        log.info("   - onStepComplete callback: {}", onStepComplete != null ? "встановлено" : "NULL");
        log.info("   - onStepBack callback: {}", onStepBack != null ? "встановлено" : "NULL");

        initializeLayout();
        showMainManager();

        log.info("ItemsManagerView ініціалізовано з {} предметами",
                wizardData.getItems().size());
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(false);
        setMargin(false);
        setSpacing(false);
    }

    private void showMainManager() {
        try {
            removeAll();
            isInSubWizard = false;

            log.info("🔍 СТВОРЕННЯ ItemsMainManagerView:");
            log.info("   - передаємо onStepComplete: {}", onStepComplete != null ? "встановлено" : "NULL");

            currentView = new ItemsMainManagerView(
                    orderItemManagementService,
                    wizardData,
                    this::onAddItem,
                    this::onEditItem,
                    onStepComplete
            );

            add(currentView);

            log.debug("Показано головний менеджер предметів");

        } catch (Exception ex) {
            log.error("Помилка при відображенні головного менеджера: {}", ex.getMessage(), ex);
        }
    }

    private void showSubWizard(OrderItemDTO existingItem) {
        try {
            removeAll();
            isInSubWizard = true;

            currentView = new ItemSubWizardView(
                    serviceCategoryService,
                    priceListService,
                    characteristicsService,
                    catalogPriceModifierService,
                    priceCalculationService,
                    this::onItemCompleted,
                    this::onSubWizardCancel,
                    existingItem
            );

            add(currentView);

            log.debug("Показано підвізард для {}",
                    existingItem != null ? "редагування" : "створення нового предмета");

        } catch (Exception ex) {
            log.error("Помилка при відображенні підвізарду: {}", ex.getMessage(), ex);
            showMainManager(); // Fallback
        }
    }

    // Обробники подій головного менеджера

    private void onAddItem(OrderItemDTO ignored) {
        log.info("Додавання нового предмета");
        showSubWizard(null);
    }

    private void onEditItem(OrderItemDTO item) {
        log.info("Редагування предмета: {}", item.getName());
        showSubWizard(item);
    }

    // Обробники подій підвізарду

    private void onItemCompleted(OrderItemDTO item) {
        try {
            log.info("Завершено роботу з предметом: {}", item.getName());

            // ВАЖЛИВО: зберігаємо предмет в базі даних одразу, якщо є ID замовлення
            if (wizardData.getDraftOrder().getId() != null) {
                if (item.getId() == null) {
                    // Новий предмет - зберігаємо в БД
                    OrderItemDTO savedItem = orderItemManagementService.addOrderItem(
                            wizardData.getDraftOrder().getId(),
                            item
                    );
                    // Додаємо збережений предмет з ID до локального списку
                    wizardData.getItems().add(savedItem);
                    log.info("✅ Новий предмет збережено в БД з ID: {}", savedItem.getId());
                } else {
                    // Оновлення існуючого предмета в БД
                    OrderItemDTO updatedItem = orderItemManagementService.updateOrderItem(
                            wizardData.getDraftOrder().getId(),
                            item.getId(),
                            item
                    );
                    // Оновлюємо в локальному списку
                    wizardData.getItems().removeIf(existingItem ->
                            existingItem.getId() != null && existingItem.getId().equals(item.getId()));
                    wizardData.getItems().add(updatedItem);
                    log.info("✅ Предмет оновлено в БД: {}", updatedItem.getName());
                }
            } else {
                // Якщо замовлення ще не створене в БД, додаємо тільки локально
                if (item.getId() == null) {
                    wizardData.getItems().add(item);
                    log.debug("Новий предмет додано до локального списку: {}", item.getName());
                } else {
                    wizardData.getItems().removeIf(existingItem ->
                            existingItem.getId() != null && existingItem.getId().equals(item.getId()));
                    wizardData.getItems().add(item);
                    log.debug("Предмет оновлено в локальному списку: {}", item.getName());
                }
            }

            // Повернення до головного менеджера
            showMainManager();

        } catch (Exception ex) {
            log.error("Помилка при збереженні предмета {}: {}", item.getName(), ex.getMessage(), ex);

            // Показуємо користувачу помилку
            com.vaadin.flow.component.notification.Notification.show(
                "Помилка збереження предмета: " + ex.getMessage(),
                5000,
                com.vaadin.flow.component.notification.Notification.Position.MIDDLE
            );
        }
    }

    private void onSubWizardCancel() {
        log.info("Скасовано роботу з підвізардом");
        showMainManager();
    }

    // Публічні методи

    /**
     * Оновити дані в поточному view.
     */
    public void refresh() {
        if (!isInSubWizard && currentView instanceof ItemsMainManagerView mainManager) {
            mainManager.refreshView();
        }
    }

    /**
     * Перевірити, чи знаходимося в підвізарді.
     *
     * @return true якщо в підвізарді
     */
    public boolean isInSubWizard() {
        return isInSubWizard;
    }
}
