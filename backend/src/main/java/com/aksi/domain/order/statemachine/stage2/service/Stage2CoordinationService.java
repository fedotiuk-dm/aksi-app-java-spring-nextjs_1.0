package com.aksi.domain.order.statemachine.stage2.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagementDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemWizardSessionDTO;
import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListDomainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координаційний сервіс для Етапу 2: Менеджер предметів.
 *
 * Використовує готові доменні сервіси для роботи з:
 * - Предметами замовлень (OrderService)
 * - Категоріями та прайс-листом (PriceListDomainService)
 * - Розрахунками цін (PriceCalculationService)
 *
 * Дотримується принципу "тонкого шару організації" -
 * координує готові функції, а не створює нову бізнес-логіку.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Stage2CoordinationService {

    // ========== Готові доменні сервіси ==========

    private final OrderService orderService;
    private final PriceListDomainService priceListDomainService;
    private final ItemWizardManagementService itemWizardManagementService;

    // ========== Ініціалізація та управління етапом 2 ==========

    /**
     * Ініціалізує етап 2 для замовлення.
     * Використовує готові сервіси для отримання поточних предметів.
     */
    @Transactional(readOnly = true)
    public ItemManagementDTO initializeStage2(String wizardId, UUID orderId) {
        log.debug("Ініціалізація етапу 2 для wizardId: {} та orderId: {}", wizardId, orderId);

        try {
            // Використовуємо готовий OrderService для отримання предметів
            List<OrderItemDTO> existingItems = orderService.getOrderItems(orderId);

            // Розраховуємо загальну суму через готовий сервіс
            BigDecimal totalAmount = calculateTotalAmount(existingItems);

            return ItemManagementDTO.builder()
                .addedItems(existingItems)
                .totalAmount(totalAmount)
                .canProceedToNextStage(!existingItems.isEmpty())
                .currentStatus("INITIALIZED")
                .build();

        } catch (Exception e) {
            log.error("Помилка ініціалізації етапу 2: {}", e.getMessage(), e);
            return ItemManagementDTO.builder()
                .currentStatus("ERROR")
                .canProceedToNextStage(false)
                .build();
        }
    }

    /**
     * Завантажує поточний стан етапу 2.
     */
    @Transactional(readOnly = true)
    public ItemManagementDTO loadStage2State(String wizardId, UUID orderId) {
        log.debug("Завантаження стану етапу 2 для wizardId: {}", wizardId);

        return initializeStage2(wizardId, orderId);
    }

    // ========== Управління циклічним підвізардом ==========

    /**
     * Запускає новий Item Wizard для додавання предмета.
     * Координує створення нової сесії підвізарда.
     */
    @Transactional
    public ItemWizardSessionDTO startNewItemWizard(String wizardId) {
        log.debug("Запуск нового Item Wizard для wizardId: {}", wizardId);

        return itemWizardManagementService.createNewSession(wizardId);
    }

    /**
     * Запускає Item Wizard для редагування існуючого предмета.
     * Використовує готовий OrderService для завантаження даних предмета.
     */
    @Transactional
    public ItemWizardSessionDTO startEditItemWizard(String wizardId, String itemId, UUID orderId) {
        log.debug("Запуск редагування предмета {} для wizardId: {}", itemId, wizardId);

        try {
            // Використовуємо готовий сервіс для отримання предмета
            OrderItemDTO existingItem = orderService.getOrderItem(orderId, UUID.fromString(itemId))
                .orElseThrow(() -> new RuntimeException("Предмет не знайдено: " + itemId));

            return itemWizardManagementService.createEditSession(wizardId, itemId, existingItem);

        } catch (Exception e) {
            log.error("Помилка запуску редагування предмета: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося запустити редагування предмета", e);
        }
    }

    /**
     * Завершує Item Wizard та додає предмет до замовлення.
     * Використовує готові сервіси для збереження предмета.
     */
    @Transactional
    public OrderItemDTO completeItemWizard(String wizardId, String itemWizardId, UUID orderId) {
        log.debug("Завершення Item Wizard {} для wizardId: {}", itemWizardId, wizardId);

        try {
            // Збираємо дані з усіх кроків підвізарда
            OrderItemDTO completeItem = itemWizardManagementService.buildCompleteItem(itemWizardId);

            // Використовуємо готовий OrderService для додавання предмета
            OrderItemDTO savedItem = orderService.addOrderItem(orderId, completeItem);

            // Очищуємо сесію підвізарда
            itemWizardManagementService.clearSession(itemWizardId);

            log.info("Предмет успішно додано до замовлення: {}", savedItem.getId());
            return savedItem;

        } catch (Exception e) {
            log.error("Помилка завершення Item Wizard: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося завершити підвізард предмета", e);
        }
    }

    // ========== Управління предметами ==========

    /**
     * Видаляє предмет з замовлення.
     * Використовує готовий OrderService.
     */
    @Transactional
    public boolean deleteItem(String wizardId, String itemId, UUID orderId) {
        log.debug("Видалення предмета {} з замовлення {}", itemId, orderId);

        try {
            // Використовуємо готовий сервіс для видалення
            orderService.deleteOrderItem(orderId, UUID.fromString(itemId));

            log.info("Предмет {} успішно видалено з замовлення {}", itemId, orderId);
            return true;

        } catch (Exception e) {
            log.error("Помилка видалення предмета: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує всі предмети замовлення.
     * Використовує готовий OrderService.
     */
    @Transactional(readOnly = true)
    public List<OrderItemDTO> getAllItems(String wizardId, UUID orderId) {
        log.debug("Отримання всіх предметів для wizardId: {} та orderId: {}", wizardId, orderId);

        return orderService.getOrderItems(orderId);
    }

    // ========== Валідація та завершення етапу ==========

    /**
     * Перевіряє, чи можна завершити етап 2.
     * Використовує готові бізнес-правила з OrderService.
     */
    @Transactional(readOnly = true)
    public boolean canCompleteStage2(String wizardId, UUID orderId) {
        log.debug("Перевірка можливості завершення етапу 2 для wizardId: {}", wizardId);

        try {
            List<OrderItemDTO> items = orderService.getOrderItems(orderId);

            // Бізнес-правило: мінімум 1 предмет в замовленні
            boolean hasMinimumItems = !items.isEmpty();

            // Перевіряємо валідність всіх предметів
            boolean allItemsValid = items.stream()
                .allMatch(this::isItemValid);

            return hasMinimumItems && allItemsValid;

        } catch (Exception e) {
            log.error("Помилка перевірки готовності етапу 2: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Завершує етап 2 та готує дані для етапу 3.
     */
    @Transactional
    public ItemManagementDTO finalizeStage2(String wizardId, UUID orderId) {
        log.debug("Завершення етапу 2 для wizardId: {}", wizardId);

        if (!canCompleteStage2(wizardId, orderId)) {
            throw new RuntimeException("Етап 2 не готовий до завершення");
        }

        List<OrderItemDTO> finalItems = getAllItems(wizardId, orderId);
        BigDecimal finalTotal = calculateTotalAmount(finalItems);

        return ItemManagementDTO.builder()
            .addedItems(finalItems)
            .totalAmount(finalTotal)
            .canProceedToNextStage(true)
            .currentStatus("COMPLETED")
            .build();
    }

    // ========== Допоміжні методи ==========

    /**
     * Розраховує загальну суму предметів.
     * Використовує логіку з OrderItemDTO.
     */
    private BigDecimal calculateTotalAmount(List<OrderItemDTO> items) {
        return items.stream()
            .map(OrderItemDTO::getTotalPrice)
            .filter(price -> price != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Перевіряє валідність предмета.
     */
    private boolean isItemValid(OrderItemDTO item) {
        return item.getName() != null && !item.getName().trim().isEmpty()
            && item.getQuantity() != null && item.getQuantity() > 0
            && item.getUnitPrice() != null && item.getUnitPrice().compareTo(BigDecimal.ZERO) > 0;
    }

    // ========== Інтеграція з готовими доменними сервісами ==========

    /**
     * Отримує категорії послуг.
     * Прямо використовує готовий PriceListDomainService.
     */
    @Transactional(readOnly = true)
    public List<ServiceCategoryDTO> getServiceCategories() {
        log.debug("Отримання категорій послуг для Item Wizard");

        return priceListDomainService.getAllCategories();
    }
}
