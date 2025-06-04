package com.aksi.domain.order.statemachine.stage2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.validator.ItemBasicInfoValidator;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для підетапу 2.1 "Основна інформація про предмет".
 *
 * Відповідає за:
 * - Завантаження списку категорій послуг
 * - Завантаження списку предметів для вибраної категорії
 * - Управління вибором категорії та предмета
 * - Розрахунок базової ціни для вибраного предмета
 * - Валідацію введених даних на підетапі 2.1
 * - Збереження даних підетапу в контексті state machine
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemBasicInfoService {

    private final ServiceCategoryService serviceCategoryService;
    private final PriceListService priceListService;
    private final ItemBasicInfoValidator itemBasicInfoValidator;

    /**
     * Ініціалізує підетап 2.1 завантаженням категорій та створенням порожнього DTO.
     */
    public void initializeSubstage(StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація підетапу 2.1 - Основна інформація про предмет");

        try {
            // Завантажуємо список всіх активних категорій
            List<ServiceCategoryDTO> categories = serviceCategoryService.getAllActiveCategories();
            log.debug("Завантажено {} категорій послуг", categories.size());

            // Створюємо порожній DTO для підетапу 2.1
            ItemBasicInfoDTO basicInfo = ItemBasicInfoDTO.builder()
                .availableCategories(categories)
                .availableItems(List.of())
                .quantity(1) // Значення за замовчуванням
                .basePrice(BigDecimal.ZERO)
                .isLoading(false)
                .hasErrors(false)
                .build();

            // Зберігаємо у контексті для доступу з інших методів
            context.getExtendedState().getVariables().put("itemBasicInfo", basicInfo);
            context.getExtendedState().getVariables().put("currentSubstage", "2.1");

            log.info("Підетап 2.1 ініціалізовано успішно з {} категоріями", categories.size());

        } catch (RuntimeException e) {
            log.error("Помилка ініціалізації підетапу 2.1: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося ініціалізувати підетап 2.1: " + e.getMessage(), e);
        }
    }

    /**
     * Обробляє вибір категорії та завантажує відповідні предмети.
     */
    public void selectCategory(UUID categoryId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір категорії: {}", categoryId);

        try {
            // Валідуємо вибір категорії
            ItemBasicInfoValidator.ValidationResult validation =
                itemBasicInfoValidator.validateCategorySelection(categoryId);

            if (!validation.isValid()) {
                updateWithError(context, validation.getErrorMessage());
                return;
            }

            // Отримуємо деталі категорії
            ServiceCategoryDTO selectedCategory = serviceCategoryService.getCategoryById(categoryId);
            log.debug("Вибрано категорію: {} - {}", selectedCategory.getCode(), selectedCategory.getName());

            // Завантажуємо предмети для вибраної категорії
            List<PriceListItemDTO> items = priceListService.getItemsByCategory(categoryId);
            log.debug("Завантажено {} предметів для категорії {}", items.size(), categoryId);

            // Оновлюємо DTO
            ItemBasicInfoDTO basicInfo = getCurrentBasicInfo(context);
            ItemBasicInfoDTO updatedInfo = basicInfo.toBuilder()
                .selectedCategory(selectedCategory)
                .availableItems(items)
                .selectedItem(null) // Скидаємо вибраний предмет при зміні категорії
                .basePrice(BigDecimal.ZERO) // Скидаємо ціну
                .unitOfMeasure(null) // Скидаємо одиницю виміру
                .isLoading(false)
                .hasErrors(false)
                .errorMessage(null)
                .build();

            context.getExtendedState().getVariables().put("itemBasicInfo", updatedInfo);

            log.info("Категорію {} вибрано, завантажено {} предметів", categoryId, items.size());

        } catch (RuntimeException e) {
            log.error("Помилка вибору категорії {}: {}", categoryId, e.getMessage(), e);
            updateWithError(context, "Не вдалося завантажити предмети для вибраної категорії");
        }
    }

    /**
     * Обробляє вибір конкретного предмета та розраховує базову ціну.
     */
    public void selectItem(UUID itemId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір предмета: {}", itemId);

        try {
            ItemBasicInfoDTO basicInfo = getCurrentBasicInfo(context);

            // Валідуємо вибір предмета
            ItemBasicInfoValidator.ValidationResult validation =
                itemBasicInfoValidator.validateItemSelection(itemId, basicInfo.getSelectedCategory());

            if (!validation.isValid()) {
                updateWithError(context, validation.getErrorMessage());
                return;
            }

            // Отримуємо деталі предмета
            PriceListItemDTO selectedItem = priceListService.getItemById(itemId);
            log.debug("Вибрано предмет: {} - {}", selectedItem.getName(), selectedItem.getBasePrice());

            // Розраховуємо базову ціну з урахуванням кількості
            BigDecimal calculatedPrice = calculateBasePrice(selectedItem, basicInfo.getQuantity());

            // Оновлюємо DTO
            ItemBasicInfoDTO updatedInfo = basicInfo.toBuilder()
                .selectedItem(selectedItem)
                .unitOfMeasure(selectedItem.getUnitOfMeasure())
                .basePrice(calculatedPrice)
                .isLoading(false)
                .hasErrors(false)
                .errorMessage(null)
                .build();

            context.getExtendedState().getVariables().put("itemBasicInfo", updatedInfo);

            log.info("Предмет {} вибрано, базова ціна: {}", itemId, calculatedPrice);

        } catch (RuntimeException e) {
            log.error("Помилка вибору предмета {}: {}", itemId, e.getMessage(), e);
            updateWithError(context, "Не вдалося завантажити інформацію про вибраний предмет");
        }
    }

    /**
     * Оновлює кількість та перераховує базову ціну.
     */
    public void updateQuantity(Object quantity, StateContext<OrderState, OrderEvent> context) {
        log.debug("Оновлення кількості: {}", quantity);

        try {
            ItemBasicInfoDTO basicInfo = getCurrentBasicInfo(context);

            // Валідуємо кількість
            ItemBasicInfoValidator.ValidationResult validation =
                itemBasicInfoValidator.validateQuantity(quantity);

            if (!validation.isValid()) {
                updateWithError(context, validation.getErrorMessage());
                return;
            }

            Integer quantityValue = (quantity instanceof Integer intValue) ? intValue :
                (quantity != null ? Integer.valueOf(quantity.toString()) : 1);

            // Перераховуємо базову ціну якщо предмет вибраний
            BigDecimal newBasePrice = BigDecimal.ZERO;
            if (basicInfo.getSelectedItem() != null) {
                newBasePrice = calculateBasePrice(basicInfo.getSelectedItem(), quantityValue);
            }

            // Оновлюємо DTO
            ItemBasicInfoDTO updatedInfo = basicInfo.toBuilder()
                .quantity(quantityValue)
                .basePrice(newBasePrice)
                .isLoading(false)
                .hasErrors(false)
                .errorMessage(null)
                .build();

            context.getExtendedState().getVariables().put("itemBasicInfo", updatedInfo);

            log.debug("Кількість оновлено: {}, нова базова ціна: {}", quantityValue, newBasePrice);

        } catch (RuntimeException e) {
            log.error("Помилка оновлення кількості {}: {}", quantity, e.getMessage(), e);
            updateWithError(context, "Неправильне значення кількості");
        }
    }

    /**
     * Валідує повноту даних підетапу 2.1 для переходу до наступного підетапу.
     */
    public boolean validateSubstageCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація завершення підетапу 2.1");

        try {
            ItemBasicInfoDTO basicInfo = getCurrentBasicInfo(context);

            // Перевіряємо, чи всі обов'язкові поля заповнені
            boolean isComplete = basicInfo.getSelectedCategory() != null &&
                               basicInfo.getSelectedItem() != null &&
                               basicInfo.getQuantity() != null &&
                               basicInfo.getQuantity() > 0 &&
                               basicInfo.getBasePrice() != null &&
                               basicInfo.getBasePrice().compareTo(BigDecimal.ZERO) > 0;

            if (!isComplete) {
                updateWithError(context, "Заповніть всі обов'язкові поля перед продовженням");
                log.warn("Підетап 2.1 не завершено - не всі поля заповнені");
                return false;
            }

            // Очищуємо помилки при успішній валідації
            ItemBasicInfoDTO updatedInfo = basicInfo.toBuilder()
                .hasErrors(false)
                .errorMessage(null)
                .build();

            context.getExtendedState().getVariables().put("itemBasicInfo", updatedInfo);

            log.info("Підетап 2.1 успішно завершено та валідовано");
            return true;

        } catch (RuntimeException e) {
            log.error("Помилка валідації підетапу 2.1: {}", e.getMessage(), e);
            updateWithError(context, "Помилка валідації даних");
            return false;
        }
    }

    /**
     * Отримує поточний стан DTO підетапу з контексту.
     */
    public ItemBasicInfoDTO getCurrentBasicInfo(StateContext<OrderState, OrderEvent> context) {
        Object basicInfoObj = context.getExtendedState().getVariables().get("itemBasicInfo");

        if (!(basicInfoObj instanceof ItemBasicInfoDTO basicInfo)) {
            log.warn("Не знайдено даних підетапу 2.1 в контексті, повертаємо порожній DTO");
            return ItemBasicInfoDTO.builder()
                .availableCategories(List.of())
                .availableItems(List.of())
                .quantity(1)
                .basePrice(BigDecimal.ZERO)
                .isLoading(false)
                .hasErrors(true)
                .errorMessage("Дані підетапу не ініціалізовано")
                .build();
        }

        return basicInfo;
    }

    /**
     * Очищає дані підетапу 2.1 з контексту.
     */
    public void clearSubstageData(StateContext<OrderState, OrderEvent> context) {
        log.debug("Очищення даних підетапу 2.1");

        context.getExtendedState().getVariables().remove("itemBasicInfo");
        context.getExtendedState().getVariables().remove("currentSubstage");

        log.debug("Дані підетапу 2.1 очищено");
    }

    /**
     * Розраховує базову ціну з урахуванням кількості.
     */
    private BigDecimal calculateBasePrice(PriceListItemDTO item, Integer quantity) {
        if (item == null || item.getBasePrice() == null || quantity == null || quantity <= 0) {
            return BigDecimal.ZERO;
        }

        return item.getBasePrice().multiply(BigDecimal.valueOf(quantity));
    }

    /**
     * Оновлює DTO з інформацією про помилку.
     */
    private void updateWithError(StateContext<OrderState, OrderEvent> context, String errorMessage) {
        ItemBasicInfoDTO basicInfo = getCurrentBasicInfo(context);

        ItemBasicInfoDTO updatedInfo = basicInfo.toBuilder()
            .isLoading(false)
            .hasErrors(true)
            .errorMessage(errorMessage)
            .build();

        context.getExtendedState().getVariables().put("itemBasicInfo", updatedInfo);

        log.warn("Оновлено DTO з помилкою: {}", errorMessage);
    }
}
