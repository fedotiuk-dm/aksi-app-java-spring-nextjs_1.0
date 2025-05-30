package com.aksi.ui.wizard.step2.substeps.pricing_calculator.application;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.domain.PriceCalculationState;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.events.PriceCalculationEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації розрахунку цін.
 * Відповідає за координацію між доменом та інфраструктурою.
 */
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationService {

    private final CatalogPriceModifierService modifierService;
    private final com.aksi.domain.pricing.service.PriceCalculationService priceCalculationService;

    // Event handlers
    private Consumer<PriceCalculationEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<PriceCalculationEvents> handler) {
        this.eventHandler = handler;
    }

    /**
     * Ініціалізує розрахунок для предмета.
     */
    public PriceCalculationState initializeCalculation(OrderItemDTO item) {
        log.debug("Ініціалізація розрахунку для предмета: {}", item.getName());

        try {
            // Завантажуємо базову ціну
            BigDecimal basePrice = loadBasePriceForItem(item);

            // Створюємо початковий стан
            PriceCalculationState initialState = PriceCalculationState.createInitial(
                    item.getCategory(),
                    item.getName(),
                    basePrice
            );

            // Повідомляємо про завантаження базової ціни
            publishEvent(new PriceCalculationEvents.BasePriceLoaded(
                    item.getCategory(),
                    item.getName(),
                    basePrice
            ));

            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації розрахунку: {}", ex.getMessage(), ex);
            publishEvent(new PriceCalculationEvents.CalculationFailed(
                    "Помилка ініціалізації розрахунку: " + ex.getMessage(),
                    ex
            ));

            // Повертаємо порожній стан при помилці
            return PriceCalculationState.createInitial(
                    item.getCategory(),
                    item.getName(),
                    BigDecimal.ZERO
            );
        }
    }

    /**
     * Завантажує модифікатори для категорії.
     */
    public List<PriceModifierDTO> loadModifiersForCategory(ModifierCategory category) {
        log.debug("Завантаження модифікаторів для категорії: {}", category);

        try {
            publishEvent(new PriceCalculationEvents.ModifiersLoadRequested(category.name()));

            List<PriceModifierDTO> modifiers = modifierService.getModifiersByCategory(category);

            publishEvent(new PriceCalculationEvents.ModifiersLoaded(category.name(), modifiers));

            return modifiers;

        } catch (Exception ex) {
            log.error("Помилка завантаження модифікаторів для категорії {}: {}",
                     category, ex.getMessage(), ex);
            publishEvent(new PriceCalculationEvents.CalculationFailed(
                    "Помилка завантаження модифікаторів: " + ex.getMessage(),
                    ex
            ));
            return List.of();
        }
    }

    /**
     * Виконує розрахунок ціни з модифікаторами.
     */
    public PriceCalculationState calculatePrice(PriceCalculationState currentState,
                                               Set<PriceModifierDTO> selectedModifiers) {
        log.debug("Розрахунок ціни з {} модифікаторами", selectedModifiers.size());

        try {
            publishEvent(new PriceCalculationEvents.CalculationRequested(
                    currentState.getItemCategory(),
                    currentState.getItemName(),
                    currentState.getBasePrice(),
                    selectedModifiers
            ));

            // Підготовляємо список кодів модифікаторів
            List<String> modifierCodes = selectedModifiers.stream()
                    .map(PriceModifierDTO::getCode)
                    .toList();

            // Виконуємо розрахунок через domain service
            PriceCalculationResponseDTO calculationResult = priceCalculationService.calculatePrice(
                    currentState.getItemCategory(),
                    currentState.getItemName(),
                    1, // quantity
                    null, // color
                    modifierCodes,
                    List.of(), // rangeModifierValues
                    List.of(), // fixedModifierQuantities
                    false, // isExpedited
                    BigDecimal.ZERO, // expediteFactor
                    BigDecimal.ZERO // discountPercent
            );

            // Створюємо новий стан з результатами
            PriceCalculationState newState = currentState.withModifiers(
                    selectedModifiers,
                    calculationResult.getFinalTotalPrice(),
                    calculationResult.getCalculationDetails()
            );

            publishEvent(new PriceCalculationEvents.CalculationCompleted(newState));

            return newState;

        } catch (Exception ex) {
            log.error("Помилка розрахунку ціни: {}", ex.getMessage(), ex);
            publishEvent(new PriceCalculationEvents.CalculationFailed(
                    "Помилка розрахунку ціни: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Зберігає результати розрахунку до предмета.
     */
    public OrderItemDTO applyCalculationToItem(OrderItemDTO item, PriceCalculationState calculationState) {
        log.debug("Застосування розрахунку до предмета: {}", item.getName());

        if (!calculationState.isValid()) {
            log.warn("Спроба застосування невалідного розрахунку до предмета");
            return item;
        }

        // Оновлюємо ціни в предметі
        item.setUnitPrice(calculationState.getBasePrice());
        item.setTotalPrice(calculationState.getFinalPrice());

        // TODO: Зберегти інформацію про модифікатори та деталі розрахунку
        // Можливо потрібно додати поля до OrderItemDTO або створити окремий DTO

        return item;
    }

    /**
     * Завантажує базову ціну для предмета.
     */
    private BigDecimal loadBasePriceForItem(OrderItemDTO item) {
        try {
            return priceCalculationService.getBasePrice(
                    item.getCategory(),
                    item.getName(),
                    item.getColor()
            );
        } catch (Exception ex) {
            log.error("Помилка завантаження базової ціни для {} - {}: {}",
                     item.getCategory(), item.getName(), ex.getMessage(), ex);
            // Якщо не вдалося завантажити, повертаємо існуючу ціну або нуль
            return item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
        }
    }

    /**
     * Публікує подію, якщо є обробник.
     */
    private void publishEvent(PriceCalculationEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }
}
