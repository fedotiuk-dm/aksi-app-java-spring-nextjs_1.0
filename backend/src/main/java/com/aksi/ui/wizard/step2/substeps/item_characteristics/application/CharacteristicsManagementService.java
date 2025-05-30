package com.aksi.ui.wizard.step2.substeps.item_characteristics.application;

import java.util.List;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.domain.ItemCharacteristicsState;
import com.aksi.ui.wizard.step2.substeps.item_characteristics.events.CharacteristicsEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації управління характеристиками предмета.
 * Відповідає за координацію між доменом та інфраструктурою.
 */
@RequiredArgsConstructor
@Slf4j
public class CharacteristicsManagementService {

    private final ItemCharacteristicsService characteristicsService;

    // Event handlers
    private Consumer<CharacteristicsEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<CharacteristicsEvents> handler) {
        this.eventHandler = handler;
    }

    /**
     * Ініціалізує характеристики для предмета.
     */
    public ItemCharacteristicsState initializeCharacteristics(OrderItemDTO item) {
        log.debug("Ініціалізація характеристик для предмета: {} категорії: {}",
                 item.getName(), item.getCategory());

        try {
            // Створюємо початковий стан
            ItemCharacteristicsState initialState = ItemCharacteristicsState.createInitial(
                    item.getCategory(),
                    item.getName()
            );

            // Завантажуємо доступні опції
            loadCharacteristicsOptions(item.getCategory(), initialState);

            // Повідомляємо про ініціалізацію
            publishEvent(new CharacteristicsEvents.CharacteristicsInitialized(initialState));

            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації характеристик: {}", ex.getMessage(), ex);
            publishEvent(new CharacteristicsEvents.CharacteristicsFailed(
                    "Помилка ініціалізації характеристик: " + ex.getMessage(),
                    ex
            ));

            // Повертаємо порожній стан при помилці
            return ItemCharacteristicsState.createInitial(
                    item.getCategory(),
                    item.getName()
            );
        }
    }

    /**
     * Завантажує доступні опції характеристик для категорії.
     */
    private void loadCharacteristicsOptions(String categoryCode, ItemCharacteristicsState currentState) {
        log.debug("Завантаження опцій характеристик для категорії: {}", categoryCode);

        try {
            publishEvent(new CharacteristicsEvents.CharacteristicsLoadRequested(categoryCode));

            // Завантажуємо дані з сервісу
            List<String> materials = characteristicsService.getMaterialsByCategory(categoryCode);
            List<String> colors = characteristicsService.getAllColors();
            List<String> fillerTypes = characteristicsService.getAllFillerTypes();
            List<String> wearDegrees = characteristicsService.getAllWearDegrees();

            publishEvent(new CharacteristicsEvents.CharacteristicsLoaded(
                    categoryCode, materials, colors, fillerTypes, wearDegrees
            ));

            // Оновлюємо стан з новими опціями
            ItemCharacteristicsState updatedState = currentState.withAvailableOptions(
                    materials, colors, fillerTypes, wearDegrees
            );

            publishEvent(new CharacteristicsEvents.CharacteristicsStateUpdated(updatedState));

        } catch (Exception ex) {
            log.error("Помилка завантаження характеристик для категорії {}: {}",
                     categoryCode, ex.getMessage(), ex);
            publishEvent(new CharacteristicsEvents.CharacteristicsFailed(
                    "Помилка завантаження характеристик: " + ex.getMessage(),
                    ex
            ));
        }
    }

    /**
     * Оновлює характеристики предмета.
     */
    public ItemCharacteristicsState updateCharacteristics(
            ItemCharacteristicsState currentState,
            String material,
            String color,
            String customColor,
            String fillerType,
            String customFillerType,
            Boolean fillerCompressed,
            String wearDegree) {

        log.debug("Оновлення характеристик: матеріал={}, колір={}, наповнювач={}",
                 material, color, fillerType);

        try {
            publishEvent(new CharacteristicsEvents.CharacteristicsChanged(
                    material, color, customColor, fillerType, customFillerType,
                    fillerCompressed, wearDegree
            ));

            // Створюємо новий стан з оновленими характеристиками
            ItemCharacteristicsState newState = currentState.withCharacteristics(
                    material, color, customColor, fillerType, customFillerType,
                    fillerCompressed, wearDegree
            );

            publishEvent(new CharacteristicsEvents.CharacteristicsStateUpdated(newState));

            // Перевіряємо зміни видимості
            checkVisibilityChanges(currentState, newState);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка оновлення характеристик: {}", ex.getMessage(), ex);
            publishEvent(new CharacteristicsEvents.CharacteristicsFailed(
                    "Помилка оновлення характеристик: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Валідує поточні характеристики.
     */
    public ItemCharacteristicsState validateCharacteristics(ItemCharacteristicsState currentState) {
        log.debug("Валідація характеристик для предмета: {}", currentState.getItemName());

        try {
            publishEvent(new CharacteristicsEvents.CharacteristicsValidationRequested(currentState));

            // Валідація відбувається автоматично в domain model при створенні стану
            publishEvent(new CharacteristicsEvents.CharacteristicsValidationCompleted(
                    currentState.isValid(),
                    currentState.getValidationErrors()
            ));

            return currentState;

        } catch (Exception ex) {
            log.error("Помилка валідації характеристик: {}", ex.getMessage(), ex);
            publishEvent(new CharacteristicsEvents.CharacteristicsFailed(
                    "Помилка валідації характеристик: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Застосовує характеристики до предмета замовлення.
     */
    public OrderItemDTO applyCharacteristicsToItem(OrderItemDTO item, ItemCharacteristicsState characteristicsState) {
        log.debug("Застосування характеристик до предмета: {}", item.getName());

        if (!characteristicsState.isValid()) {
            log.warn("Спроба застосування невалідних характеристик до предмета");
            return item;
        }

        // Оновлюємо характеристики в предметі
        item.setMaterial(characteristicsState.getMaterial());
        item.setColor(characteristicsState.getFinalColor());
        item.setFillerType(characteristicsState.getFinalFillerType());
        item.setFillerCompressed(characteristicsState.getFillerCompressed());
        item.setWearDegree(characteristicsState.getWearDegree());

        return item;
    }

    /**
     * Завантажує існуючі характеристики з предмета.
     */
    public ItemCharacteristicsState loadExistingCharacteristics(OrderItemDTO item, ItemCharacteristicsState baseState) {
        log.debug("Завантаження існуючих характеристик з предмета: {}", item.getName());

        // Визначаємо власні кольори та наповнювачі
        String customColor = null;
        String customFillerType = null;

        // Якщо колір не з базового списку - це власний колір
        if (item.getColor() != null && !baseState.getAvailableColors().contains(item.getColor())) {
            customColor = item.getColor();
        }

        // Якщо наповнювач не з базового списку - це власний наповнювач
        if (item.getFillerType() != null &&
            !baseState.getAvailableFillerTypes().contains(item.getFillerType())) {
            customFillerType = item.getFillerType();
        }

        return baseState.withCharacteristics(
                item.getMaterial(),
                item.getColor(),
                customColor,
                customFillerType != null ? "Інше" : item.getFillerType(),
                customFillerType,
                item.getFillerCompressed(),
                item.getWearDegree()
        );
    }

    /**
     * Перевіряє зміни видимості секцій.
     */
    private void checkVisibilityChanges(ItemCharacteristicsState oldState, ItemCharacteristicsState newState) {
        if (oldState.isFillerSectionVisible() != newState.isFillerSectionVisible() ||
            oldState.isCustomColorVisible() != newState.isCustomColorVisible() ||
            oldState.isCustomFillerVisible() != newState.isCustomFillerVisible()) {

            publishEvent(new CharacteristicsEvents.SectionVisibilityChanged(
                    newState.isFillerSectionVisible(),
                    newState.isCustomColorVisible(),
                    newState.isCustomFillerVisible()
            ));
        }
    }

    /**
     * Публікує подію, якщо є обробник.
     */
    private void publishEvent(CharacteristicsEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }
}
