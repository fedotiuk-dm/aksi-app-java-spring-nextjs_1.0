package com.aksi.ui.wizard.step2.substeps.main_manager.domain;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.domain.order.dto.OrderItemDTO;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану менеджера предметів замовлення.
 * Відповідає за бізнес-логіку управління списком предметів та розрахунки.
 */
@Data
@Builder
@Slf4j
public class ItemsManagerState {

    // Основна інформація
    private final List<OrderItemDTO> items;
    private final BigDecimal totalCost;
    private final int itemsCount;

    // Стан валідності
    private final boolean isValid;
    private final List<String> validationMessages;

    // Стан UI
    private final boolean canContinueToNext;
    private final boolean hasItems;
    private final boolean isLoading;

    // Налаштування
    private final String totalCostFormatted;
    private final String statusMessage;

    /**
     * Створює початковий стан менеджера предметів.
     */
    public static ItemsManagerState createInitial() {
        log.debug("Створюється початковий стан менеджера предметів");

        return ItemsManagerState.builder()
                .items(List.of())
                .totalCost(BigDecimal.ZERO)
                .itemsCount(0)
                .isValid(false)
                .validationMessages(List.of("Додайте хоча б один предмет до замовлення"))
                .canContinueToNext(false)
                .hasItems(false)
                .isLoading(false)
                .totalCostFormatted("0.00 ₴")
                .statusMessage("Список предметів порожній")
                .build();
    }

    /**
     * Створює стан з завантаженими предметами.
     */
    public ItemsManagerState withLoadedItems(List<OrderItemDTO> items) {
        log.debug("Завантажено {} предметів", items.size());

        BigDecimal newTotalCost = calculateTotalCost(items);
        boolean hasItems = !items.isEmpty();
        var validationResult = validateItems(items);

        return ItemsManagerState.builder()
                .items(List.copyOf(items))
                .totalCost(newTotalCost)
                .itemsCount(items.size())
                .isValid(validationResult.isValid())
                .validationMessages(validationResult.messages())
                .canContinueToNext(validationResult.isValid() && hasItems)
                .hasItems(hasItems)
                .isLoading(false)
                .totalCostFormatted(formatTotalCost(newTotalCost))
                .statusMessage(createStatusMessage(items.size()))
                .build();
    }

    /**
     * Створює стан після додавання предмета.
     */
    public ItemsManagerState withAddedItem(OrderItemDTO newItem) {
        log.debug("Додається предмет: {}", newItem.getName());

        var updatedItems = new java.util.ArrayList<>(this.items);
        updatedItems.add(newItem);

        return withLoadedItems(updatedItems);
    }

    /**
     * Створює стан після оновлення предмета.
     */
    public ItemsManagerState withUpdatedItem(OrderItemDTO updatedItem) {
        log.debug("Оновлюється предмет: {}", updatedItem.getName());

        var updatedItems = new java.util.ArrayList<>(this.items);

        // Знаходимо та оновлюємо предмет
        for (int i = 0; i < updatedItems.size(); i++) {
            OrderItemDTO existing = updatedItems.get(i);
            if (isTheSameItem(existing, updatedItem)) {
                updatedItems.set(i, updatedItem);
                break;
            }
        }

        return withLoadedItems(updatedItems);
    }

    /**
     * Створює стан після видалення предмета.
     */
    public ItemsManagerState withRemovedItem(OrderItemDTO itemToRemove) {
        log.debug("Видаляється предмет: {}", itemToRemove.getName());

        var updatedItems = this.items.stream()
                .filter(item -> !isTheSameItem(item, itemToRemove))
                .toList();

        return withLoadedItems(updatedItems);
    }

    /**
     * Створює стан з індикатором завантаження.
     */
    public ItemsManagerState withLoading(boolean isLoading) {
        return ItemsManagerState.builder()
                .items(this.items)
                .totalCost(this.totalCost)
                .itemsCount(this.itemsCount)
                .isValid(this.isValid)
                .validationMessages(this.validationMessages)
                .canContinueToNext(this.canContinueToNext && !isLoading)
                .hasItems(this.hasItems)
                .isLoading(isLoading)
                .totalCostFormatted(this.totalCostFormatted)
                .statusMessage(isLoading ? "Завантаження..." : this.statusMessage)
                .build();
    }

    /**
     * Розраховує загальну вартість всіх предметів.
     */
    private BigDecimal calculateTotalCost(List<OrderItemDTO> items) {
        return items.stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Валідує список предметів.
     */
    private ValidationResult validateItems(List<OrderItemDTO> items) {
        var messages = new java.util.ArrayList<String>();

        if (items.isEmpty()) {
            messages.add("Додайте хоча б один предмет до замовлення");
        }

        // Перевірка на дублікати
        var duplicates = findDuplicateItems(items);
        if (!duplicates.isEmpty()) {
            messages.add("Знайдено дубльовані предмети: " + String.join(", ", duplicates));
        }

        // Перевірка на предмети без ціни
        var itemsWithoutPrice = items.stream()
                .filter(item -> item.getTotalPrice() == null || item.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0)
                .map(OrderItemDTO::getName)
                .toList();

        if (!itemsWithoutPrice.isEmpty()) {
            messages.add("Предмети без ціни: " + String.join(", ", itemsWithoutPrice));
        }

        return new ValidationResult(messages.isEmpty(), List.copyOf(messages));
    }

    /**
     * Знаходить дубльовані предмети.
     */
    private List<String> findDuplicateItems(List<OrderItemDTO> items) {
        var seen = new java.util.HashSet<String>();
        var duplicates = new java.util.HashSet<String>();

        for (OrderItemDTO item : items) {
            String itemKey = createItemKey(item);
            if (!seen.add(itemKey)) {
                duplicates.add(item.getName());
            }
        }

        return List.copyOf(duplicates);
    }

    /**
     * Створює унікальний ключ для предмета.
     */
    private String createItemKey(OrderItemDTO item) {
        return String.format("%s_%s_%s_%s",
                item.getName(),
                item.getCategory(),
                item.getMaterial() != null ? item.getMaterial() : "",
                item.getColor() != null ? item.getColor() : "");
    }

    /**
     * Перевіряє чи це той самий предмет (для оновлення/видалення).
     */
    private boolean isTheSameItem(OrderItemDTO item1, OrderItemDTO item2) {
        // Спочатку перевіряємо ID якщо є
        if (item1.getId() != null && item2.getId() != null) {
            return item1.getId().equals(item2.getId());
        }

        // Інакше порівнюємо за ключовими характеристиками
        return createItemKey(item1).equals(createItemKey(item2));
    }

    /**
     * Форматує загальну вартість.
     */
    private String formatTotalCost(BigDecimal totalCost) {
        return String.format("%.2f ₴", totalCost);
    }

    /**
     * Створює повідомлення про статус.
     */
    private String createStatusMessage(int itemsCount) {
        if (itemsCount == 0) {
            return "Список предметів порожній";
        } else if (itemsCount == 1) {
            return "Додано 1 предмет";
        } else {
            return String.format("Додано %d предметів", itemsCount);
        }
    }

    /**
     * Перевіряє чи готовий до переходу на наступний етап.
     */
    public boolean isReadyForNext() {
        return hasItems && isValid && !isLoading;
    }

    /**
     * Повертає повідомлення для кнопки продовження.
     */
    public String getContinueButtonText() {
        if (!hasItems) {
            return "Спочатку додайте предмети";
        } else if (!isValid) {
            return "Виправте помилки";
        } else if (isLoading) {
            return "Завантаження...";
        } else {
            return "Продовжити до наступного етапу";
        }
    }

    /**
     * Повертає детальну інформацію про предмет для відображення.
     */
    public static class ItemDisplayInfo {
        private final String name;
        private final String category;
        private final String quantityWithUnit;
        private final String material;
        private final String color;
        private final String formattedPrice;
        private final boolean hasValidPrice;

        public ItemDisplayInfo(OrderItemDTO item) {
            this.name = item.getName();
            this.category = item.getCategory();
            this.quantityWithUnit = formatQuantityWithUnit(item);
            this.material = item.getMaterial() != null ? item.getMaterial() : "—";
            this.color = item.getColor() != null ? item.getColor() : "—";
            this.formattedPrice = formatItemPrice(item);
            this.hasValidPrice = item.getTotalPrice() != null && item.getTotalPrice().compareTo(BigDecimal.ZERO) > 0;
        }

        private String formatQuantityWithUnit(OrderItemDTO item) {
            String unit = item.getUnitOfMeasure() != null ? item.getUnitOfMeasure() : "шт";
            return item.getQuantity() + " " + unit;
        }

        private String formatItemPrice(OrderItemDTO item) {
            if (item.getTotalPrice() != null) {
                return String.format("%.2f ₴", item.getTotalPrice());
            }
            return "—";
        }

        // Getters
        public String getName() { return name; }
        public String getCategory() { return category; }
        public String getQuantityWithUnit() { return quantityWithUnit; }
        public String getMaterial() { return material; }
        public String getColor() { return color; }
        public String getFormattedPrice() { return formattedPrice; }
        public boolean hasValidPrice() { return hasValidPrice; }
    }

    /**
     * Результат валідації.
     */
    private record ValidationResult(boolean isValid, List<String> messages) {}
}
