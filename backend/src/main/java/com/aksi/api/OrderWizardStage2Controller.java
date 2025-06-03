package com.aksi.api;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.statemachine.stage2.dto.OrderSummaryDTO;
import com.aksi.domain.order.statemachine.stage2.dto.StageReadinessDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemManagerMapper;
import com.aksi.domain.order.statemachine.stage2.service.PhotoIntegrationService;

/**
 * REST контролер для етапу 2.0 Order Wizard - головний екран менеджера предметів
 *
 * Цей етап включає:
 * - Відображення таблиці доданих предметів
 * - Видалення предметів з замовлення
 * - Розрахунок загальної вартості
 * - Навігацію до підетапів додавання/редагування предметів
 */
@RestController
@RequestMapping("/order-wizard/stage2")
@CrossOrigin(origins = "*")
public class OrderWizardStage2Controller {

        @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ItemManagerMapper itemManagerMapper;

    @Autowired
    private PhotoIntegrationService photoIntegrationService;

    /**
     * Отримання списку всіх предметів у замовленні з інформацією про фото
     * GET /order-wizard/stage2/{orderId}/items
     */
        @GetMapping("/{orderId}/items")
    public ResponseEntity<List<TempOrderItemDTO>> getOrderItems(@PathVariable UUID orderId) {
        try {
            List<OrderItemEntity> items = orderItemRepository.findByOrderIdOrderByCreatedAt(orderId);
            List<TempOrderItemDTO> tempItems = items.stream()
                .map(item -> itemManagerMapper.toTempOrderItemDto(item))
                .toList();

            return ResponseEntity.ok(tempItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Отримання інформації про конкретний предмет
     * GET /order-wizard/stage2/{orderId}/items/{itemId}
     */
        @GetMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<TempOrderItemDTO> getOrderItem(
            @PathVariable UUID orderId,
            @PathVariable UUID itemId) {
        try {
            Optional<OrderItemEntity> itemOpt = orderItemRepository.findById(itemId);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OrderItemEntity item = itemOpt.get();
            if (!item.getOrder().getId().equals(orderId)) {
                return ResponseEntity.notFound().build();
            }

            TempOrderItemDTO tempItem = itemManagerMapper.toTempOrderItemDto(item);
            return ResponseEntity.ok(tempItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Видалення предмета з замовлення
     * DELETE /order-wizard/stage2/{orderId}/items/{itemId}
     */
        @DeleteMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<Void> deleteOrderItem(
            @PathVariable UUID orderId,
            @PathVariable UUID itemId) {
        try {
            // Перевіряємо, чи належить предмет до цього замовлення
            Optional<OrderItemEntity> itemOpt = orderItemRepository.findById(itemId);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OrderItemEntity item = itemOpt.get();
            if (!item.getOrder().getId().equals(orderId)) {
                return ResponseEntity.notFound().build();
            }

            // Видаляємо предмет
            orderItemRepository.deleteById(itemId);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Отримання загальної вартості замовлення
     * GET /order-wizard/stage2/{orderId}/total-amount
     */
    @GetMapping("/{orderId}/total-amount")
    public ResponseEntity<BigDecimal> getTotalAmount(@PathVariable UUID orderId) {
        try {
            OrderEntity orderEntity = orderService.findOrderEntityById(orderId);
            BigDecimal totalAmount = orderService.calculateOrderTotal(orderEntity).getTotalAmount();
            return ResponseEntity.ok(totalAmount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Отримання статистики по замовленню (кількість предметів, загальна вартість)
     * GET /order-wizard/stage2/{orderId}/summary
     */
        @GetMapping("/{orderId}/summary")
    public ResponseEntity<OrderSummaryDTO> getOrderSummary(@PathVariable UUID orderId) {
        try {
            List<OrderItemEntity> items = orderItemRepository.findByOrderIdOrderByCreatedAt(orderId);
            OrderEntity orderEntity = orderService.findOrderEntityById(orderId);
            BigDecimal totalAmount = orderService.calculateOrderTotal(orderEntity).getTotalAmount();

            int totalItems = items.size();
            int itemsWithPhotos = (int) items.stream()
                .filter(item -> photoIntegrationService.hasPhotos(item.getId()))
                .count();

            OrderSummaryDTO summary = new OrderSummaryDTO(
                totalItems,
                itemsWithPhotos,
                totalAmount
            );

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Перевірка готовності до переходу на наступний етап
     * GET /order-wizard/stage2/{orderId}/ready-for-next-stage
     */
        @GetMapping("/{orderId}/ready-for-next-stage")
    public ResponseEntity<StageReadinessDTO> checkReadinessForNextStage(@PathVariable UUID orderId) {
        try {
            List<OrderItemEntity> items = orderItemRepository.findByOrderIdOrderByCreatedAt(orderId);

            boolean hasItems = !items.isEmpty();
            boolean allItemsValid = items.stream()
                .allMatch(item -> item.getTotalPrice() != null && item.getTotalPrice().compareTo(BigDecimal.ZERO) > 0);

            String message;
            if (!hasItems) {
                message = "Додайте хоча б один предмет до замовлення";
            } else if (!allItemsValid) {
                message = "Перевірте правильність розрахунку ціни для всіх предметів";
            } else {
                message = "Готово до переходу на наступний етап";
            }

            StageReadinessDTO readiness = new StageReadinessDTO(
                hasItems && allItemsValid,
                message,
                items.size()
            );

            return ResponseEntity.ok(readiness);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
