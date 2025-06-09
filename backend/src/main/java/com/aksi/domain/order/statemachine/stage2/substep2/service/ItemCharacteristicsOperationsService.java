package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.domain.order.service.OrderService;

/**
 * Сервіс операцій підетапу 2.2 "Характеристики предмета".
 * Тонка обгортка для роботи з доменними сервісами.
 * НЕ містить бізнес-логіки, тільки делегує виклики.
 */
@Service
public class ItemCharacteristicsOperationsService {

    private final OrderService orderService;
    private final ItemCharacteristicsService itemCharacteristicsService;

    public ItemCharacteristicsOperationsService(
            final OrderService orderService,
            final ItemCharacteristicsService itemCharacteristicsService) {
        this.orderService = orderService;
        this.itemCharacteristicsService = itemCharacteristicsService;
    }

    // ========== Операції з предметами замовлення ==========

    /**
     * Отримує поточний предмет замовлення.
     */
    public OrderItemDTO getCurrentOrderItem(final UUID orderId, final UUID itemId) {
        return orderService.getOrderItem(orderId, itemId)
                .orElse(null);
    }

    /**
     * Отримує список всіх предметів замовлення.
     */
    public List<OrderItemDTO> getAllOrderItems(final UUID orderId) {
        return orderService.getOrderItems(orderId);
    }

    /**
     * Оновлює предмет в замовленні.
     */
    public OrderItemDTO updateOrderItem(final UUID orderId, final UUID itemId,
                                        final OrderItemDTO itemDTO) {
        return orderService.updateOrderItem(orderId, itemId, itemDTO);
    }

    /**
     * Додає новий предмет до замовлення.
     */
    public OrderItemDTO addOrderItem(final UUID orderId, final OrderItemDTO itemDTO) {
        return orderService.addOrderItem(orderId, itemDTO);
    }

    /**
     * Видаляє предмет із замовлення.
     */
    public void deleteOrderItem(final UUID orderId, final UUID itemId) {
        orderService.deleteOrderItem(orderId, itemId);
    }

    /**
     * Перевіряє чи існує предмет в замовленні.
     */
    public boolean orderItemExists(final UUID orderId, final UUID itemId) {
        return orderService.getOrderItem(orderId, itemId).isPresent();
    }

    // ========== Операції з характеристиками предметів ==========

    /**
     * Отримує доступні матеріали для категорії.
     */
    public List<String> getAvailableMaterials(final String category) {
        return itemCharacteristicsService.getMaterialsByCategory(category);
    }

    /**
     * Отримує всі доступні кольори.
     */
    public List<String> getAllColors() {
        return itemCharacteristicsService.getAllColors();
    }

    /**
     * Отримує всі типи наповнювачів.
     */
    public List<String> getAllFillerTypes() {
        return itemCharacteristicsService.getAllFillerTypes();
    }

    /**
     * Отримує всі ступені зносу.
     */
    public List<String> getAllWearDegrees() {
        return itemCharacteristicsService.getAllWearDegrees();
    }

    /**
     * Отримує типи плям.
     */
    public List<String> getAllStainTypes() {
        return itemCharacteristicsService.getAllStainTypes();
    }

    /**
     * Отримує дефекти та ризики.
     */
    public List<String> getAllDefectsAndRisks() {
        return itemCharacteristicsService.getAllDefectsAndRisks();
    }

    /**
     * Отримує тільки дефекти.
     */
    public List<String> getDefects() {
        return itemCharacteristicsService.getDefects();
    }

    /**
     * Отримує тільки ризики.
     */
    public List<String> getRisks() {
        return itemCharacteristicsService.getRisks();
    }
}
