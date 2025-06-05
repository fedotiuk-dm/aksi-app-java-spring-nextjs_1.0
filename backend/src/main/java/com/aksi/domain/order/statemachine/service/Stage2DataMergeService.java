package com.aksi.domain.order.statemachine.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.service.TempOrderItemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для керування даними етапу 2 Order Wizard (Менеджер предметів).
 * Відповідає за збереження та валідацію даних предметів під час їх додавання.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage2DataMergeService {

    private static final String ITEMS_KEY = "stage2Items";
    private static final String CURRENT_TEMP_ITEM_KEY = "currentTempItem";

    private final TempOrderItemService tempOrderItemService;

    /**
     * === КЕРУВАННЯ СПИСКОМ ПРЕДМЕТІВ ===
     */

    /**
     * Додати предмет до замовлення.
     */
    public void addItemToOrder(Map<String, Object> contextVariables, TempOrderItemDTO tempItem) {
        if (tempItem == null || !tempItem.isReadyForOrder()) {
            log.warn("Спроба додання неготового предмета до замовлення");
            return;
        }

        List<TempOrderItemDTO> items = loadItems(contextVariables);
        items.add(tempItem);

        contextVariables.put(ITEMS_KEY, items);

        log.debug("Предмет додано до замовлення: {} (всього предметів: {})",
                 tempItem.getName(), items.size());
    }

    /**
     * Завантажити всі предмети замовлення.
     */
    @SuppressWarnings("unchecked")
    public List<TempOrderItemDTO> loadItems(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(ITEMS_KEY);
        if (data == null) {
            List<TempOrderItemDTO> newList = new java.util.ArrayList<>();
            contextVariables.put(ITEMS_KEY, newList);
            log.debug("Створено новий список предметів");
            return newList;
        }

        try {
            return (List<TempOrderItemDTO>) data;
        } catch (Exception e) {
            log.error("Помилка завантаження предметів: {}", e.getMessage(), e);
            return new java.util.ArrayList<>();
        }
    }

    /**
     * Видалити предмет з замовлення за індексом.
     */
    public boolean removeItemByIndex(Map<String, Object> contextVariables, int itemIndex) {
        List<TempOrderItemDTO> items = loadItems(contextVariables);

        if (itemIndex >= 0 && itemIndex < items.size()) {
            TempOrderItemDTO removedItem = items.remove(itemIndex);
            contextVariables.put(ITEMS_KEY, items);

            log.debug("Предмет видалено з замовлення: {} (залишилось: {})",
                     removedItem.getName(), items.size());
            return true;
        } else {
            log.warn("Спроба видалення неіснуючого предмета з індексом: {}", itemIndex);
            return false;
        }
    }

    /**
     * Оновити предмет в замовленні.
     */
    public boolean updateItem(Map<String, Object> contextVariables, int itemIndex, TempOrderItemDTO updatedItem) {
        if (updatedItem == null || !updatedItem.isReadyForOrder()) {
            log.warn("Спроба оновлення предмета неготовими даними");
            return false;
        }

        List<TempOrderItemDTO> items = loadItems(contextVariables);

        if (itemIndex >= 0 && itemIndex < items.size()) {
            items.set(itemIndex, updatedItem);
            contextVariables.put(ITEMS_KEY, items);

            log.debug("Предмет оновлено в замовленні: {}", updatedItem.getName());
            return true;
        } else {
            log.warn("Спроба оновлення неіснуючого предмета з індексом: {}", itemIndex);
            return false;
        }
    }

    /**
     * === КЕРУВАННЯ ПОТОЧНИМ ПРЕДМЕТОМ (під час додавання) ===
     */

    /**
     * Зберегти поточний предмет що редагується.
     */
    public void saveCurrentTempItem(Map<String, Object> contextVariables, TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            log.warn("Спроба збереження null поточного предмета");
            return;
        }

        tempOrderItemService.saveToContext(contextVariables, tempItem);
        contextVariables.put(CURRENT_TEMP_ITEM_KEY, tempItem);

        log.debug("Поточний предмет збережено: {}, крок: {}",
                 tempItem.getName(), tempItem.getWizardStep());
    }

    /**
     * Завантажити поточний предмет що редагується.
     */
    public TempOrderItemDTO loadCurrentTempItem(Map<String, Object> contextVariables) {
        // Спочатку пробуємо завантажити через TempOrderItemService
        TempOrderItemDTO tempItem = tempOrderItemService.loadFromContext(contextVariables);
        if (tempItem != null) {
            return tempItem;
        }

        // Якщо не знайдено, пробуємо альтернативний ключ
        Object data = contextVariables.get(CURRENT_TEMP_ITEM_KEY);
        if (data instanceof TempOrderItemDTO currentItem) {
            return currentItem;
        }

        log.debug("Поточний предмет не знайдено в контексті");
        return null;
    }

    /**
     * Очистити поточний предмет (після додавання до замовлення).
     */
    public void clearCurrentTempItem(Map<String, Object> contextVariables) {
        contextVariables.remove(CURRENT_TEMP_ITEM_KEY);
        contextVariables.remove("tempOrderItem"); // Ключ TempOrderItemService

        log.debug("Поточний предмет очищено");
    }

    /**
     * === ВАЛІДАЦІЯ ЕТАПУ 2 ===
     */

    /**
     * Перевірити готовність етапу 2 до завершення.
     */
    public boolean isStage2Complete(Map<String, Object> contextVariables) {
        List<TempOrderItemDTO> items = loadItems(contextVariables);

        boolean complete = !items.isEmpty() &&
                          items.stream().allMatch(TempOrderItemDTO::isReadyForOrder);

        log.debug("Перевірка завершеності етапу 2: {} предметів готових",
                 items.stream().mapToInt(item -> item.isReadyForOrder() ? 1 : 0).sum());
        return complete;
    }

    /**
     * Валідувати список предметів.
     */
    public Stage2ValidationResult validateItems(Map<String, Object> contextVariables) {
        List<TempOrderItemDTO> items = loadItems(contextVariables);

        if (items.isEmpty()) {
            return new Stage2ValidationResult(false, "Немає доданих предметів до замовлення", 0);
        }

        // Перевіряємо кожен предмет
        for (int i = 0; i < items.size(); i++) {
            TempOrderItemDTO item = items.get(i);
            if (!item.isReadyForOrder()) {
                return new Stage2ValidationResult(false,
                    String.format("Предмет #%d (%s) не готовий до замовлення", i + 1, item.getName()),
                    (i * 100) / items.size());
            }
        }

        return new Stage2ValidationResult(true, null, 100);
    }

    /**
     * === РОЗРАХУНКИ ===
     */

    /**
     * Розрахувати загальну вартість всіх предметів.
     */
    public BigDecimal calculateTotalAmount(Map<String, Object> contextVariables) {
        List<TempOrderItemDTO> items = loadItems(contextVariables);

        BigDecimal total = items.stream()
            .filter(item -> item.getTotalPrice() != null)
            .map(TempOrderItemDTO::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        log.debug("Розраховано загальну вартість предметів: {}", total);
        return total;
    }

    /**
     * Отримати кількість предметів.
     */
    public int getItemsCount(Map<String, Object> contextVariables) {
        return loadItems(contextVariables).size();
    }

    /**
     * Отримати кількість готових предметів.
     */
    public int getReadyItemsCount(Map<String, Object> contextVariables) {
        List<TempOrderItemDTO> items = loadItems(contextVariables);
        return (int) items.stream().filter(TempOrderItemDTO::isReadyForOrder).count();
    }

    /**
     * === СТАТИСТИКА ТА АНАЛІЗ ===
     */

    /**
     * Отримати статистику предметів.
     */
    public Stage2Statistics getItemsStatistics(Map<String, Object> contextVariables) {
        List<TempOrderItemDTO> items = loadItems(contextVariables);

        int totalItems = items.size();
        int readyItems = (int) items.stream().filter(TempOrderItemDTO::isReadyForOrder).count();
        int itemsWithPhotos = (int) items.stream().filter(TempOrderItemDTO::hasPhotos).count();

        BigDecimal totalAmount = calculateTotalAmount(contextVariables);

        // Категорії
        long uniqueCategories = items.stream()
            .filter(item -> item.getCategory() != null)
            .map(TempOrderItemDTO::getCategory)
            .distinct()
            .count();

        return new Stage2Statistics(
            totalItems,
            readyItems,
            itemsWithPhotos,
            totalAmount,
            (int) uniqueCategories,
            totalItems > 0 ? (readyItems * 100) / totalItems : 0
        );
    }

    /**
     * === ОЧИЩЕННЯ ДАНИХ ===
     */

    /**
     * Очистити всі дані етапу 2.
     */
    public void clearStage2Data(Map<String, Object> contextVariables) {
        contextVariables.remove(ITEMS_KEY);
        clearCurrentTempItem(contextVariables);

        log.info("Дані етапу 2 очищено");
    }

    /**
     * Очистити тільки список предметів (зберегти поточний).
     */
    public void clearItemsList(Map<String, Object> contextVariables) {
        contextVariables.remove(ITEMS_KEY);

        log.info("Список предметів очищено");
    }

    /**
     * === ДОПОМІЖНІ КЛАСИ ===
     */

    /**
     * Результат валідації даних етапу 2.
     */
    public record Stage2ValidationResult(
        boolean isValid,
        String errorMessage,
        int completionPercentage
    ) {}

    /**
     * Статистика предметів етапу 2.
     */
    public record Stage2Statistics(
        int totalItems,
        int readyItems,
        int itemsWithPhotos,
        BigDecimal totalAmount,
        int uniqueCategories,
        int completionPercentage
    ) {}
}
