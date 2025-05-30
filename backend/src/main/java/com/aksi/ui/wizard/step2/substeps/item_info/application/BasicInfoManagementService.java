package com.aksi.ui.wizard.step2.substeps.item_info.application;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.ui.wizard.step2.substeps.item_info.domain.ItemBasicInfoState;
import com.aksi.ui.wizard.step2.substeps.item_info.events.BasicInfoEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації управління основною інформацією про предмет.
 * Відповідає за координацію між доменом та інфраструктурою.
 */
@RequiredArgsConstructor
@Slf4j
public class BasicInfoManagementService {

    private final ServiceCategoryService serviceCategoryService;
    private final PriceListService priceListService;

    // Event handlers
    private Consumer<BasicInfoEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<BasicInfoEvents> handler) {
        this.eventHandler = handler;
    }

    /**
     * Ініціалізує основну інформацію для предмета.
     */
    public ItemBasicInfoState initializeBasicInfo(OrderItemDTO existingItem) {
        log.debug("Ініціалізація основної інформації для предмета");

        try {
            // Створюємо початковий стан
            ItemBasicInfoState initialState = ItemBasicInfoState.createInitial();

            // Завантажуємо категорії
            loadCategories(initialState);

            // Повідомляємо про ініціалізацію
            publishEvent(new BasicInfoEvents.BasicInfoInitialized(initialState));

            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації основної інформації: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка ініціалізації: " + ex.getMessage(),
                    ex
            ));

            // Повертаємо порожній стан при помилці
            return ItemBasicInfoState.createInitial();
        }
    }

    /**
     * Завантажує категорії послуг.
     */
    private void loadCategories(ItemBasicInfoState currentState) {
        log.debug("Завантаження категорій послуг");

        try {
            publishEvent(new BasicInfoEvents.CategoriesLoadRequested());

            List<ServiceCategoryDTO> serviceCategories = serviceCategoryService.getAllActiveCategories();

            // Конвертуємо до domain моделі
            List<ItemBasicInfoState.CategoryOption> categoryOptions = serviceCategories.stream()
                    .map(cat -> new ItemBasicInfoState.CategoryOption(
                            cat.getId().toString(),
                            cat.getName(),
                            cat.getDescription(),
                            cat.isActive()
                    ))
                    .collect(Collectors.toList());

            publishEvent(new BasicInfoEvents.CategoriesLoaded(categoryOptions));

            // Оновлюємо стан з новими категоріями
            ItemBasicInfoState updatedState = currentState.withAvailableCategories(categoryOptions);
            publishEvent(new BasicInfoEvents.BasicInfoStateUpdated(updatedState));

        } catch (Exception ex) {
            log.error("Помилка завантаження категорій: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка завантаження категорій: " + ex.getMessage(),
                    ex
            ));
        }
    }

    /**
     * Обробляє вибір категорії.
     */
    public ItemBasicInfoState selectCategory(
            ItemBasicInfoState currentState,
            String categoryId,
            String categoryName) {

        log.debug("Вибір категорії: {} - {}", categoryId, categoryName);

        try {
            publishEvent(new BasicInfoEvents.CategorySelected(categoryId, categoryName));

            // Оновлюємо стан з вибраною категорією
            ItemBasicInfoState newState = currentState.withSelectedCategory(categoryId, categoryName);

            publishEvent(new BasicInfoEvents.BasicInfoStateUpdated(newState));

            // Скидаємо вибір предмета
            publishEvent(new BasicInfoEvents.ItemSelectionCleared());

            // Завантажуємо предмети для категорії
            loadItemsForCategory(categoryId, newState);

            // Оновлюємо стан UI
            updateUIState(newState);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка вибору категорії: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка вибору категорії: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Завантажує предмети для вибраної категорії.
     */
    private void loadItemsForCategory(String categoryId, ItemBasicInfoState currentState) {
        log.debug("Завантаження предметів для категорії: {}", categoryId);

        try {
            publishEvent(new BasicInfoEvents.ItemsLoadRequested(categoryId));

            List<PriceListItemDTO> priceListItems = priceListService.getItemsByCategory(UUID.fromString(categoryId));

            // Конвертуємо до domain моделі
            List<ItemBasicInfoState.ItemOption> itemOptions = priceListItems.stream()
                    .map(item -> new ItemBasicInfoState.ItemOption(
                            item.getId().toString(),
                            item.getName(),
                            item.getUnitOfMeasure(),
                            item.getBasePrice(),
                            true // всі активні з БД
                    ))
                    .collect(Collectors.toList());

            publishEvent(new BasicInfoEvents.ItemsLoaded(categoryId, itemOptions));

            // Оновлюємо стан з новими предметами
            ItemBasicInfoState updatedState = currentState.withAvailableItems(itemOptions);
            publishEvent(new BasicInfoEvents.BasicInfoStateUpdated(updatedState));

        } catch (Exception ex) {
            log.error("Помилка завантаження предметів для категорії {}: {}", categoryId, ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка завантаження предметів: " + ex.getMessage(),
                    ex
            ));
        }
    }

    /**
     * Обробляє вибір предмета.
     */
    public ItemBasicInfoState selectItem(
            ItemBasicInfoState currentState,
            String itemId,
            String itemName,
            String unitOfMeasure,
            BigDecimal unitPrice) {

        log.debug("Вибір предмета: {} - {} за {} ₴/{}", itemId, itemName, unitPrice, unitOfMeasure);

        try {
            publishEvent(new BasicInfoEvents.ItemSelected(itemId, itemName, unitOfMeasure, unitPrice));

            // Оновлюємо стан з вибраним предметом
            ItemBasicInfoState newState = currentState.withSelectedItem(
                    itemId, itemName, unitOfMeasure, unitPrice
            );

            publishEvent(new BasicInfoEvents.BasicInfoStateUpdated(newState));

            // Оновлюємо інформацію про ціни
            updatePriceInfo(newState);

            // Оновлюємо стан UI
            updateUIState(newState);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка вибору предмета: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка вибору предмета: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Обробляє зміну кількості.
     */
    public ItemBasicInfoState changeQuantity(
            ItemBasicInfoState currentState,
            Integer newQuantity) {

        log.debug("Зміна кількості: {}", newQuantity);

        try {
            publishEvent(new BasicInfoEvents.QuantityChanged(newQuantity));

            // Оновлюємо стан з новою кількістю
            ItemBasicInfoState newState = currentState.withQuantity(newQuantity);

            publishEvent(new BasicInfoEvents.BasicInfoStateUpdated(newState));

            // Оновлюємо інформацію про ціни
            updatePriceInfo(newState);

            // Оновлюємо стан UI
            updateUIState(newState);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка зміни кількості: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка зміни кількості: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Валідує поточний стан основної інформації.
     */
    public ItemBasicInfoState validateBasicInfo(ItemBasicInfoState currentState) {
        log.debug("Валідація основної інформації для предмета: {}", currentState.getSelectedItemName());

        try {
            publishEvent(new BasicInfoEvents.BasicInfoValidationRequested(currentState));

            // Валідація відбувається автоматично в domain model при створенні стану
            publishEvent(new BasicInfoEvents.BasicInfoValidationCompleted(
                    currentState.isValid(),
                    currentState.getValidationErrors(),
                    currentState.isReadyForNext()
            ));

            // Оновлюємо готовність до переходу
            publishEvent(new BasicInfoEvents.ReadyForNext(
                    currentState,
                    currentState.isReadyForNext()
            ));

            return currentState;

        } catch (Exception ex) {
            log.error("Помилка валідації основної інформації: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка валідації: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Застосовує основну інформацію до предмета замовлення.
     */
    public OrderItemDTO applyBasicInfoToItem(OrderItemDTO item, ItemBasicInfoState basicInfoState) {
        log.debug("Застосування основної інформації до предмета: {}", basicInfoState.getSelectedItemName());

        try {
            // Застосовуємо основну інформацію
            item.setCategory(basicInfoState.getSelectedCategoryName());
            item.setName(basicInfoState.getSelectedItemName());
            item.setQuantity(basicInfoState.getQuantity());
            item.setUnitOfMeasure(basicInfoState.getUnitOfMeasure());
            item.setUnitPrice(basicInfoState.getUnitPrice());
            item.setTotalPrice(basicInfoState.getTotalPrice());

            return item;

        } catch (Exception ex) {
            log.error("Помилка застосування основної інформації: {}", ex.getMessage(), ex);
            publishEvent(new BasicInfoEvents.BasicInfoFailed(
                    "Помилка застосування інформації: " + ex.getMessage(),
                    ex
            ));
            return item;
        }
    }

    /**
     * Завантажує існуючу основну інформацію з предмета.
     */
    public ItemBasicInfoState loadExistingBasicInfo(OrderItemDTO item, ItemBasicInfoState baseState) {
        log.debug("Завантаження існуючої основної інформації з предмета: {}", item.getName());

        try {
            // Поки що повертаємо базовий стан, оскільки потрібна логіка завантаження існуючих даних
            // TODO: Реалізувати завантаження існуючих значень для редагування

            return baseState;

        } catch (Exception ex) {
            log.error("Помилка завантаження існуючої основної інформації: {}", ex.getMessage(), ex);
            return baseState;
        }
    }

    /**
     * Оновлює інформацію про ціни.
     */
    private void updatePriceInfo(ItemBasicInfoState state) {
        publishEvent(new BasicInfoEvents.PriceInfoUpdated(
                state.getFormattedPriceInfo(),
                state.getFormattedTotalPrice(),
                state.getTotalPrice()
        ));
    }

    /**
     * Оновлює стан UI компонентів.
     */
    private void updateUIState(ItemBasicInfoState state) {
        publishEvent(new BasicInfoEvents.UIStateChanged(
                state.isItemSelectionEnabled(),
                state.isQuantityEnabled(),
                state.isReadyForNext()
        ));
    }

    /**
     * Публікує подію, якщо є обробник.
     */
    private void publishEvent(BasicInfoEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }
}
