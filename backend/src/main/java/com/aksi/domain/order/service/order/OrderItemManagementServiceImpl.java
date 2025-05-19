package com.aksi.domain.order.service.order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для управління предметами замовлення.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemManagementServiceImpl implements OrderItemManagementService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderItemDTO> getOrderItems(UUID orderId) {
        log.debug("Отримання предметів замовлення: {}", orderId);
        
        // Використовуємо orderItemRepository для ефективнішого запиту
        List<OrderItemEntity> items = orderItemRepository.findByOrderId(orderId);
        
        return items.stream()
                .map(orderMapper::toOrderItemDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<OrderItemDTO> getOrderItem(UUID orderId, UUID itemId) {
        log.debug("Отримання предмета {} з замовлення {}", itemId, orderId);
        
        OrderEntity order = findOrderById(orderId);
        
        return order.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .map(orderMapper::toOrderItemDTO);
    }
    
    @Override
    @Transactional
    public OrderItemDTO addOrderItem(UUID orderId, OrderItemDTO itemDTO) {
        log.debug("Додавання предмета до замовлення: {}", orderId);
        
        OrderEntity order = findOrderById(orderId);
        
        OrderItemEntity item = orderMapper.toOrderItemEntity(itemDTO);
        order.addItem(item);
        
        // Розрахунок ціни предмета
        item.recalculateTotalPrice();
        
        // Перерахунок загальної суми замовлення
        order.recalculateTotalAmount();
        order.setUpdatedDate(LocalDateTime.now());
        
        // Зберігаємо замовлення разом з новим предметом
        OrderEntity updatedOrder = orderRepository.save(order);
        
        // Шукаємо новий предмет серед предметів замовлення (він матиме ID після збереження)
        OrderItemEntity savedItem = updatedOrder.getItems().stream()
                .filter(i -> i.getName().equals(item.getName()) && 
                             i.getCategory().equals(item.getCategory()) &&
                             ((i.getMaterial() == null && item.getMaterial() == null) || 
                              (i.getMaterial() != null && i.getMaterial().equals(item.getMaterial()))))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Помилка при збереженні предмета замовлення"));
        
        log.info("Додано предмет {} до замовлення {}", savedItem.getId(), orderId);
        
        return orderMapper.toOrderItemDTO(savedItem);
    }
    
    @Override
    @Transactional
    public OrderItemDTO updateOrderItem(UUID orderId, UUID itemId, OrderItemDTO itemDTO) {
        log.debug("Оновлення предмета {} у замовленні {}", itemId, orderId);
        
        OrderEntity order = findOrderById(orderId);
        
        OrderItemEntity existingItem = order.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Предмет замовлення не знайдено", itemId
                ));
        
        // Копіюємо властивості з DTO, але зберігаємо ID та посилання на замовлення
        OrderItemEntity updatedItem = orderMapper.toOrderItemEntity(itemDTO);
        updatedItem.setId(existingItem.getId());
        updatedItem.setOrder(existingItem.getOrder());
        
        // Заміна існуючого предмета на оновлений
        int itemIndex = order.getItems().indexOf(existingItem);
        order.getItems().set(itemIndex, updatedItem);
        
        // Перерахунок ціни предмета та загальної суми замовлення
        updatedItem.recalculateTotalPrice();
        order.recalculateTotalAmount();
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity savedOrder = orderRepository.save(order);
        
        OrderItemEntity savedItem = savedOrder.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Помилка при оновленні предмета замовлення"));
        
        log.info("Оновлено предмет {} у замовленні {}", itemId, orderId);
        
        return orderMapper.toOrderItemDTO(savedItem);
    }
    
    @Override
    @Transactional
    public void deleteOrderItem(UUID orderId, UUID itemId) {
        log.debug("Видалення предмета {} з замовлення {}", itemId, orderId);
        
        OrderEntity order = findOrderById(orderId);
        
        boolean removed = order.getItems().removeIf(item -> item.getId().equals(itemId));
        
        if (!removed) {
            throw EntityNotFoundException.withTypeAndId(
                "Предмет замовлення не знайдено", itemId
            );
        }
        
        // Перерахунок загальної суми замовлення
        order.recalculateTotalAmount();
        order.setUpdatedDate(LocalDateTime.now());
        
        orderRepository.save(order);
        log.info("Видалено предмет {} з замовлення {}", itemId, orderId);
    }
    
    /**
     * Допоміжний метод для пошуку замовлення за ID.
     */
    private OrderEntity findOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
    }
} 