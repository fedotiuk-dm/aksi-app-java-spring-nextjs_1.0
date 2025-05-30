package com.aksi.ui.wizard.step2.substeps.item_info.domain;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану основної інформації про предмет.
 * Відповідає за бізнес-логіку вибору категорії, предмета та кількості.
 */
@Data
@Builder
@Slf4j
public class ItemBasicInfoState {

    // Основна інформація
    private final String selectedCategoryId;
    private final String selectedCategoryName;
    private final String selectedItemId;
    private final String selectedItemName;
    private final Integer quantity;
    private final String unitOfMeasure;
    private final BigDecimal unitPrice;
    private final BigDecimal totalPrice;

    // Доступні опції
    private final List<CategoryOption> availableCategories;
    private final List<ItemOption> availableItems;

    // Стан валідності
    private final boolean isValid;
    private final List<String> validationErrors;

    // Стан UI
    private final boolean itemSelectionEnabled;
    private final boolean quantityEnabled;
    private final boolean canProceedNext;

    /**
     * Створює початковий стан основної інформації предмета.
     */
    public static ItemBasicInfoState createInitial() {
        log.debug("Створюється початковий стан основної інформації предмета");

        return ItemBasicInfoState.builder()
                .selectedCategoryId(null)
                .selectedCategoryName(null)
                .selectedItemId(null)
                .selectedItemName(null)
                .quantity(1)
                .unitOfMeasure(null)
                .unitPrice(BigDecimal.ZERO)
                .totalPrice(BigDecimal.ZERO)
                .availableCategories(List.of())
                .availableItems(List.of())
                .isValid(false)
                .validationErrors(List.of())
                .itemSelectionEnabled(false)
                .quantityEnabled(true)
                .canProceedNext(false)
                .build();
    }

    /**
     * Створює стан з вибраною категорією.
     */
    public ItemBasicInfoState withSelectedCategory(String categoryId, String categoryName) {
        log.debug("Вибрано категорію: {} - {}", categoryId, categoryName);

        var validationResult = validateWithCategory(categoryId, categoryName);

        return ItemBasicInfoState.builder()
                .selectedCategoryId(categoryId)
                .selectedCategoryName(categoryName)
                .selectedItemId(null) // Скидаємо вибір предмета при зміні категорії
                .selectedItemName(null)
                .quantity(this.quantity)
                .unitOfMeasure(null)
                .unitPrice(BigDecimal.ZERO)
                .totalPrice(BigDecimal.ZERO)
                .availableCategories(this.availableCategories)
                .availableItems(List.of()) // Очищуємо список предметів
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.errors())
                .itemSelectionEnabled(true) // Активуємо вибір предмета
                .quantityEnabled(this.quantityEnabled)
                .canProceedNext(false) // Поки що не можна продовжити
                .build();
    }

    /**
     * Створює стан з вибраним предметом.
     */
    public ItemBasicInfoState withSelectedItem(
            String itemId,
            String itemName,
            String unitOfMeasure,
            BigDecimal unitPrice) {

        log.debug("Вибрано предмет: {} - {} за {} ₴/{}", itemId, itemName, unitPrice, unitOfMeasure);

        BigDecimal newTotalPrice = calculateTotalPrice(unitPrice, this.quantity);
        var validationResult = validateWithItem(itemId, itemName, unitPrice);

        return ItemBasicInfoState.builder()
                .selectedCategoryId(this.selectedCategoryId)
                .selectedCategoryName(this.selectedCategoryName)
                .selectedItemId(itemId)
                .selectedItemName(itemName)
                .quantity(this.quantity)
                .unitOfMeasure(unitOfMeasure)
                .unitPrice(unitPrice)
                .totalPrice(newTotalPrice)
                .availableCategories(this.availableCategories)
                .availableItems(this.availableItems)
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.errors())
                .itemSelectionEnabled(this.itemSelectionEnabled)
                .quantityEnabled(true)
                .canProceedNext(validationResult.isValid())
                .build();
    }

    /**
     * Створює стан з новою кількістю.
     */
    public ItemBasicInfoState withQuantity(Integer newQuantity) {
        log.debug("Оновлено кількість: {}", newQuantity);

        BigDecimal newTotalPrice = calculateTotalPrice(this.unitPrice, newQuantity);
        var validationResult = validateWithQuantity(newQuantity);

        return ItemBasicInfoState.builder()
                .selectedCategoryId(this.selectedCategoryId)
                .selectedCategoryName(this.selectedCategoryName)
                .selectedItemId(this.selectedItemId)
                .selectedItemName(this.selectedItemName)
                .quantity(newQuantity)
                .unitOfMeasure(this.unitOfMeasure)
                .unitPrice(this.unitPrice)
                .totalPrice(newTotalPrice)
                .availableCategories(this.availableCategories)
                .availableItems(this.availableItems)
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.errors())
                .itemSelectionEnabled(this.itemSelectionEnabled)
                .quantityEnabled(this.quantityEnabled)
                .canProceedNext(validationResult.isValid())
                .build();
    }

    /**
     * Створює стан з доступними категоріями.
     */
    public ItemBasicInfoState withAvailableCategories(List<CategoryOption> categories) {
        log.debug("Завантажено {} категорій", categories.size());

        return ItemBasicInfoState.builder()
                .selectedCategoryId(this.selectedCategoryId)
                .selectedCategoryName(this.selectedCategoryName)
                .selectedItemId(this.selectedItemId)
                .selectedItemName(this.selectedItemName)
                .quantity(this.quantity)
                .unitOfMeasure(this.unitOfMeasure)
                .unitPrice(this.unitPrice)
                .totalPrice(this.totalPrice)
                .availableCategories(List.copyOf(categories))
                .availableItems(this.availableItems)
                .isValid(this.isValid)
                .validationErrors(this.validationErrors)
                .itemSelectionEnabled(this.itemSelectionEnabled)
                .quantityEnabled(this.quantityEnabled)
                .canProceedNext(this.canProceedNext)
                .build();
    }

    /**
     * Створює стан з доступними предметами для вибраної категорії.
     */
    public ItemBasicInfoState withAvailableItems(List<ItemOption> items) {
        log.debug("Завантажено {} предметів для категорії", items.size());

        return ItemBasicInfoState.builder()
                .selectedCategoryId(this.selectedCategoryId)
                .selectedCategoryName(this.selectedCategoryName)
                .selectedItemId(this.selectedItemId)
                .selectedItemName(this.selectedItemName)
                .quantity(this.quantity)
                .unitOfMeasure(this.unitOfMeasure)
                .unitPrice(this.unitPrice)
                .totalPrice(this.totalPrice)
                .availableCategories(this.availableCategories)
                .availableItems(List.copyOf(items))
                .isValid(this.isValid)
                .validationErrors(this.validationErrors)
                .itemSelectionEnabled(this.itemSelectionEnabled)
                .quantityEnabled(this.quantityEnabled)
                .canProceedNext(this.canProceedNext)
                .build();
    }

    /**
     * Розраховує загальну ціну на основі одиничної ціни та кількості.
     */
    private BigDecimal calculateTotalPrice(BigDecimal unitPrice, Integer quantity) {
        if (unitPrice == null || quantity == null || quantity <= 0) {
            return BigDecimal.ZERO;
        }
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    /**
     * Валідує стан з вибраною категорією.
     */
    private ValidationResult validateWithCategory(String categoryId, String categoryName) {
        var errors = new java.util.ArrayList<String>();

        if (categoryId == null || categoryId.trim().isEmpty()) {
            errors.add("Категорія послуги не вибрана");
        }

        if (categoryName == null || categoryName.trim().isEmpty()) {
            errors.add("Назва категорії послуги порожня");
        }

        return new ValidationResult(errors.isEmpty(), List.copyOf(errors));
    }

    /**
     * Валідує стан з вибраним предметом.
     */
    private ValidationResult validateWithItem(String itemId, String itemName, BigDecimal unitPrice) {
        var errors = new java.util.ArrayList<String>();

        if (this.selectedCategoryId == null) {
            errors.add("Спочатку оберіть категорію послуги");
        }

        if (itemId == null || itemId.trim().isEmpty()) {
            errors.add("Предмет не вибрано");
        }

        if (itemName == null || itemName.trim().isEmpty()) {
            errors.add("Назва предмета порожня");
        }

        if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Ціна предмета повинна бути більше нуля");
        }

        if (this.quantity == null || this.quantity <= 0) {
            errors.add("Кількість повинна бути більше нуля");
        }

        return new ValidationResult(errors.isEmpty(), List.copyOf(errors));
    }

    /**
     * Валідує стан з новою кількістю.
     */
    private ValidationResult validateWithQuantity(Integer quantity) {
        var errors = new java.util.ArrayList<String>();

        if (quantity == null) {
            errors.add("Кількість обов'язкова");
        } else if (quantity <= 0) {
            errors.add("Кількість повинна бути більше нуля");
        } else if (quantity > 999) {
            errors.add("Кількість не може перевищувати 999");
        }

        // Перевіряємо загальну валідність
        if (this.selectedCategoryId == null) {
            errors.add("Спочатку оберіть категорію послуги");
        }

        if (this.selectedItemId == null) {
            errors.add("Спочатку оберіть предмет");
        }

        return new ValidationResult(errors.isEmpty(), List.copyOf(errors));
    }

    /**
     * Перевіряє чи вся основна інформація заповнена для переходу далі.
     */
    public boolean isReadyForNext() {
        return selectedCategoryId != null &&
               selectedItemId != null &&
               quantity != null &&
               quantity > 0 &&
               unitPrice != null &&
               unitPrice.compareTo(BigDecimal.ZERO) > 0 &&
               isValid;
    }

    /**
     * Повертає інформацію про ціну як форматований рядок.
     */
    public String getFormattedPriceInfo() {
        if (unitPrice == null || unitOfMeasure == null) {
            return "—";
        }
        return String.format("%.2f ₴ за %s", unitPrice, unitOfMeasure);
    }

    /**
     * Повертає інформацію про загальну ціну як форматований рядок.
     */
    public String getFormattedTotalPrice() {
        if (totalPrice == null) {
            return "0.00 ₴";
        }
        return String.format("%.2f ₴", totalPrice);
    }

    /**
     * Перевіряє чи є критичні помилки що блокують роботу.
     */
    public boolean hasCriticalErrors() {
        return !isValid && validationErrors.stream()
                .anyMatch(error -> error.contains("обов'язков") || error.contains("Спочатку"));
    }

    /**
     * Опція категорії для UI.
     */
    public record CategoryOption(
            String id,
            String name,
            String description,
            boolean isActive
    ) {}

    /**
     * Опція предмета для UI.
     */
    public record ItemOption(
            String id,
            String name,
            String unitOfMeasure,
            BigDecimal basePrice,
            boolean isActive
    ) {}

    /**
     * Результат валідації.
     */
    private record ValidationResult(boolean isValid, List<String> errors) {}
}
