package com.aksi.domain.order.statemachine.stage2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemManagerMapper;
import com.aksi.domain.order.statemachine.stage2.validator.ItemManagerValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління головним екраном менеджера предметів (етап 2.0).
 *
 * Відповідає за:
 * - Завантаження та відображення списку предметів замовлення
 * - Розрахунок та оновлення загальної вартості замовлення
 * - Управління UI станом головного екрану
 * - Підготовку до переходів в підвізард або до наступного етапу
 * - Валідацію готовності етапу до завершення
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ItemManagerService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ItemManagerMapper itemManagerMapper;
    private final ItemManagerValidator itemManagerValidator;

    /**
     * Завантажує всі предмети замовлення та зберігає їх у контексті state machine.
     */
    public void loadOrderItems(String orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Завантаження предметів для замовлення: {}", orderId);

        UUID orderUuid = UUID.fromString(orderId);
        List<OrderItemEntity> items = orderItemRepository.findByOrderIdOrderByCreatedAt(orderUuid);

        // Зберігаємо список предметів у контексті для відображення в UI
        context.getExtendedState().getVariables().put("orderItems", items);
        context.getExtendedState().getVariables().put("itemsCount", items.size());

        log.info("Завантажено {} предметів для замовлення {}", items.size(), orderId);
    }

    /**
     * Розраховує та оновлює загальну вартість замовлення.
     */
    public void calculateTotalPrice(String orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Розрахунок загальної вартості для замовлення: {}", orderId);

        UUID orderUuid = UUID.fromString(orderId);
        List<OrderItemEntity> items = orderItemRepository.findByOrderIdOrderByCreatedAt(orderUuid);

        BigDecimal totalPrice = items.stream()
            .map(OrderItemEntity::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Зберігаємо загальну вартість у контексті для відображення в UI
        context.getExtendedState().getVariables().put("orderTotalPrice", totalPrice);

        // Оновлюємо вартість в базі даних
        updateOrderTotalPrice(orderUuid, totalPrice);

        log.info("Загальна вартість замовлення {}: {}", orderId, totalPrice);
    }

    /**
     * Ініціалізує UI стан для головного екрану менеджера предметів.
     */
    public void initializeUIState(StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація UI стану головного екрану");

        // Скидаємо стан підвізарда, якщо він був активний
        context.getExtendedState().getVariables().remove("currentItem");
        context.getExtendedState().getVariables().remove("currentItemId");
        context.getExtendedState().getVariables().remove("itemEditMode");

        // Встановлюємо стан головного екрану
        context.getExtendedState().getVariables().put("mainScreenActive", true);
        context.getExtendedState().getVariables().put("selectedItemId", null);

        log.debug("UI стан головного екрану ініціалізовано");
    }

    /**
     * Підготовує новий предмет для додавання через підвізард.
     */
    public void prepareNewItem(StateContext<OrderState, OrderEvent> context) {
        log.debug("Підготовка нового предмета");

        // Створюємо базовий DTO для нового предмета
        TempOrderItemDTO newItem = TempOrderItemDTO.builder()
            .quantity(1)
            .unitPrice(BigDecimal.ZERO)
            .totalPrice(BigDecimal.ZERO)
            .fillerCompressed(false)
            .wizardStep(1)
            .build();

        // Зберігаємо у контексті для підвізарда
        context.getExtendedState().getVariables().put("currentItem", newItem);
        context.getExtendedState().getVariables().put("currentItemId", null);
        context.getExtendedState().getVariables().put("mainScreenActive", false);

        log.debug("Новий предмет підготовлено для додавання");
    }

    /**
     * Підготовує існуючий предмет для редагування через підвізард.
     */
    public void prepareItemForEdit(String itemId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Підготовка предмета для редагування: {}", itemId);

        // Валідуємо існування предмета
        ItemManagerValidator.ValidationResult validation = itemManagerValidator.validateItemForEdit(itemId);
        if (!validation.isValid()) {
            throw new RuntimeException("Неможливо підготувати предмет для редагування: " + validation.getErrorMessage());
        }

        UUID itemUuid = UUID.fromString(itemId);
        OrderItemEntity item = orderItemRepository.findById(itemUuid)
            .orElseThrow(() -> new RuntimeException("Предмет не знайдено: " + itemId));

        // Конвертуємо у тимчасовий об'єкт для редагування
        TempOrderItemDTO tempItem = convertToTempDto(item);

        // Зберігаємо у контексті для підвізарда
        context.getExtendedState().getVariables().put("currentItem", tempItem);
        context.getExtendedState().getVariables().put("currentItemId", itemId);
        context.getExtendedState().getVariables().put("mainScreenActive", false);

        log.debug("Предмет {} підготовлено для редагування", itemId);
    }

    /**
     * Видаляє предмет з замовлення.
     */
    public void deleteItem(String itemId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Видалення предмета: {}", itemId);

        // Валідуємо можливість видалення
        ItemManagerValidator.ValidationResult validation = itemManagerValidator.validateItemForDeletion(itemId);
        if (!validation.isValid()) {
            throw new RuntimeException("Неможливо видалити предмет: " + validation.getErrorMessage());
        }

        UUID itemUuid = UUID.fromString(itemId);

        // Видаляємо з бази даних
        orderItemRepository.deleteById(itemUuid);

        log.info("Предмет {} видалено", itemId);
    }

    /**
     * Оновлює список предметів після змін.
     */
    public void refreshItemsList(String orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Оновлення списку предметів для замовлення: {}", orderId);

        // Перезавантажуємо список предметів
        loadOrderItems(orderId, context);

        log.debug("Список предметів оновлено");
    }

    /**
     * Валідує, чи містить замовлення хоча б один предмет.
     */
    public boolean validateOrderHasItems(String orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація наявності предметів у замовленні: {}", orderId);

        ItemManagerValidator.ValidationResult result = itemManagerValidator.validateCanProceedToNextStage(orderId);

        boolean hasItems = result.isValid();

        // Зберігаємо результат валідації
        context.getExtendedState().getVariables().put("hasItems", hasItems);
        context.getExtendedState().getVariables().put("validationMessage", result.getErrorMessage());

        log.debug("Замовлення {} валідація: {}, повідомлення: {}", orderId, hasItems, result.getErrorMessage());

        return hasItems;
    }

    /**
     * Фіналізує етап 2 перед переходом до наступного етапу.
     */
    public void finalizeStage2(String orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Фіналізація етапу 2 для замовлення: {}", orderId);

        // Очищуємо тимчасові дані
        context.getExtendedState().getVariables().remove("currentItem");
        context.getExtendedState().getVariables().remove("currentItemId");
        context.getExtendedState().getVariables().remove("mainScreenActive");
        context.getExtendedState().getVariables().remove("selectedItemId");
        context.getExtendedState().getVariables().remove("itemEditMode");

        // Зберігаємо фінальний стан етапу
        context.getExtendedState().getVariables().put("stage2Completed", true);
        context.getExtendedState().getVariables().put("stage2CompletedAt", System.currentTimeMillis());

        log.info("Етап 2 фіналізовано для замовлення: {}", orderId);
    }

    /**
     * Оновлює загальну вартість замовлення в базі даних.
     */
    private void updateOrderTotalPrice(UUID orderId, BigDecimal totalPrice) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Замовлення не знайдено: " + orderId));

        order.setTotalAmount(totalPrice);
        orderRepository.save(order);
    }

    /**
     * Конвертує OrderItemEntity у TempOrderItemDto для редагування.
     */
    private TempOrderItemDTO convertToTempDto(OrderItemEntity entity) {
        return itemManagerMapper.toTempOrderItemDto(entity);
    }
}
