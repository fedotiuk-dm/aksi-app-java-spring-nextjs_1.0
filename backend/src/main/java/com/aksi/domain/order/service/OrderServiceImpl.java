package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.branch.repository.BranchLocationRepository;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з замовленнями.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    
    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final BranchLocationRepository branchLocationRepository;
    private final OrderMapper orderMapper;
    
    /**
     * Отримати всі замовлення.
     */
    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        log.debug("Отримання всіх замовлень");
        List<OrderEntity> orders = orderRepository.findAll();
        return orders.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Отримати замовлення за ID.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<OrderDTO> getOrderById(UUID id) {
        log.debug("Отримання замовлення за ID: {}", id);
        return orderRepository.findById(id)
                .map(orderMapper::toDTO);
    }
    
    /**
     * Створення нового замовлення.
     */
    @Override
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest orderRequest) {
        log.debug("Створення нового замовлення: {}", orderRequest);
        
        // Якщо клієнт існує, знаходимо його
        ClientEntity client = null;
        if (orderRequest.getClientId() != null) {
            client = clientRepository.findById(orderRequest.getClientId())
                    .orElseThrow(() -> EntityNotFoundException.withMessage(
                        "Клієнт не знайдений з ID: " + orderRequest.getClientId()
                    ));
        }
        
        // Створюємо нове замовлення
        OrderEntity order = new OrderEntity();
        order.setTagNumber(orderRequest.getTagNumber());
        
        // Встановлюємо пункт прийому замовлень
        BranchLocationEntity branchLocation = branchLocationRepository.findById(orderRequest.getBranchLocationId())
                .orElseThrow(() -> EntityNotFoundException.withMessage(
                    "Пункт прийому замовлень не знайдений з ID: " + orderRequest.getBranchLocationId()
                ));
        order.setBranchLocation(branchLocation);
        
        // Генеруємо номер квитанції, оскільки він відсутній у запиті
        order.setReceiptNumber(generateReceiptNumber(branchLocation));
        order.setClient(client);
        order.setStatus(OrderStatusEnum.NEW);
        order.setCreatedDate(LocalDateTime.now());
        order.setExpectedCompletionDate(orderRequest.getExpectedCompletionDate());
        order.setCustomerNotes(orderRequest.getCustomerNotes());
        order.setInternalNotes(orderRequest.getInternalNotes());
        order.setExpediteType(orderRequest.getExpediteType());
        order.setDraft(orderRequest.isDraft());
        order.setTotalAmount(BigDecimal.ZERO);
        order.setFinalAmount(BigDecimal.ZERO);
        
        // Встановлюємо знижку і предоплату, якщо вони є
        if (orderRequest.getDiscountAmount() != null) {
            order.setDiscountAmount(orderRequest.getDiscountAmount());
        }
        
        if (orderRequest.getPrepaymentAmount() != null) {
            order.setPrepaymentAmount(orderRequest.getPrepaymentAmount());
        }
        
        // Додаємо предмети до замовлення
        for (OrderItemDTO itemDTO : orderRequest.getItems()) {
            OrderItemEntity item = orderMapper.toOrderItemEntity(itemDTO);
            order.addItem(item);
            
            // Розраховуємо вартість предмету
            item.recalculateTotalPrice();
        }
        
        // Оновлюємо суми замовлення
        order.recalculateTotalAmount();
        
        // Зберігаємо в БД
        order = orderRepository.save(order);
        
        // Повертаємо DTO для використання в контролері
        return orderMapper.toDTO(order);
    }
    
    /**
     * Оновлення статусу замовлення.
     */
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(UUID id, OrderStatusEnum status) {
        log.debug("Оновлення статусу замовлення {} на {}", id, status);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setStatus(status);
        order.setUpdatedDate(LocalDateTime.now());
        
        if (status == OrderStatusEnum.COMPLETED) {
            order.setCompletedDate(LocalDateTime.now());
        }
        
        OrderEntity updatedOrder = orderRepository.save(order);
        log.info("Оновлено статус замовлення {} на {}", id, status);
        
        return orderMapper.toDTO(updatedOrder);
    }
    
    /**
     * Скасування замовлення.
     */
    @Override
    @Transactional
    public void cancelOrder(UUID id) {
        log.debug("Скасування замовлення: {}", id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setStatus(OrderStatusEnum.CANCELLED);
        order.setUpdatedDate(LocalDateTime.now());
        
        orderRepository.save(order);
        log.info("Замовлення {} скасовано", id);
    }
    
    /**
     * Відзначення замовлення як виконане.
     */
    @Override
    @Transactional
    public OrderDTO completeOrder(UUID id) {
        log.debug("Відзначення замовлення як виконане: {}", id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setStatus(OrderStatusEnum.COMPLETED);
        order.setCompletedDate(LocalDateTime.now());
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity completedOrder = orderRepository.save(order);
        log.info("Замовлення {} відзначено як виконане", id);
        
        return orderMapper.toDTO(completedOrder);
    }
    
    /**
     * Збереження чернетки замовлення.
     */
    @Override
    @Transactional
    public OrderDTO saveOrderDraft(CreateOrderRequest request) {
        log.debug("Збереження чернетки замовлення");
        
        request.setDraft(true);
        OrderDTO draftOrder = createOrder(request);
        
        // Безпечна робота з logger без доступу до draftOrder.getId()
        // Тимчасовий обхід проблеми з Lombok
        log.info("Збережено чернетку замовлення");
        return draftOrder;
    }
    
    /**
     * Перетворення чернетки на активне замовлення.
     */
    @Override
    @Transactional
    public OrderDTO convertDraftToOrder(UUID id) {
        log.debug("Перетворення чернетки на активне замовлення: {}", id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        if (!order.isDraft()) {
            log.warn("Замовлення {} не є чернеткою", id);
            return orderMapper.toDTO(order);
        }
        
        order.setDraft(false);
        order.setStatus(OrderStatusEnum.NEW);
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity activatedOrder = orderRepository.save(order);
        log.info("Чернетку {} перетворено на активне замовлення", id);
        
        return orderMapper.toDTO(activatedOrder);
    }
    
    /**
     * Додавання знижки до замовлення.
     */
    @Override
    @Transactional
    public OrderDTO applyDiscount(UUID id, BigDecimal discountAmount) {
        log.debug("Додавання знижки {} до замовлення {}", discountAmount, id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setDiscountAmount(discountAmount);
        order.recalculateTotalAmount();
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity updatedOrder = orderRepository.save(order);
        log.info("Додано знижку {} до замовлення {}", discountAmount, id);
        
        return orderMapper.toDTO(updatedOrder);
    }
    
    /**
     * Додавання передоплати до замовлення.
     */
    @Override
    @Transactional
    public OrderDTO addPrepayment(UUID id, BigDecimal prepaymentAmount) {
        log.debug("Додавання передоплати {} до замовлення {}", prepaymentAmount, id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setPrepaymentAmount(prepaymentAmount);
        order.recalculateTotalAmount();
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity updatedOrder = orderRepository.save(order);
        log.info("Додано передоплату {} до замовлення {}", prepaymentAmount, id);
        
        return orderMapper.toDTO(updatedOrder);
    }
    
    /**
     * Отримання поточних активних замовлень.
     */
    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getActiveOrders() {
        log.debug("Отримання активних замовлень");
        
        List<OrderEntity> activeOrders = orderRepository.findByStatusInAndDraftFalse(
                List.of(OrderStatusEnum.NEW, OrderStatusEnum.IN_PROGRESS));
        
        return activeOrders.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Отримання чернеток замовлень.
     */
    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getDraftOrders() {
        log.debug("Отримання чернеток замовлень");
        
        List<OrderEntity> drafts = orderRepository.findByDraftTrue();
        
        return drafts.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Розрахунок вартості замовлення.
     */
    @Override
    @Transactional
    public OrderDTO calculateOrderTotal(OrderEntity order) {
        log.debug("Розрахунок вартості замовлення {}", order.getId());
        
        // Розраховуємо вартість для кожного предмету
        for (OrderItemEntity item : order.getItems()) {
            item.recalculateTotalPrice();
        }
        
        // Оновлюємо суми замовлення
        order.recalculateTotalAmount();
        
        OrderEntity updatedOrder = orderRepository.save(order);
        log.debug("Розраховано вартість замовлення {}: {}", 
                updatedOrder.getId(), updatedOrder.getFinalAmount());
        
        return orderMapper.toDTO(updatedOrder);
    }
    
    /**
     * Отримати всі предмети замовлення.
     */
    @Override
    @Transactional(readOnly = true)
    public List<OrderItemDTO> getOrderItems(UUID orderId) {
        log.debug("Отримання всіх предметів замовлення з ID: {}", orderId);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        return order.getItems().stream()
                .map(orderMapper::toOrderItemDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Отримати конкретний предмет замовлення за ID.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<OrderItemDTO> getOrderItem(UUID orderId, UUID itemId) {
        log.debug("Отримання предмета з ID: {} із замовлення з ID: {}", itemId, orderId);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        return order.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .map(orderMapper::toOrderItemDTO);
    }
    
    /**
     * Додати новий предмет до замовлення.
     */
    @Override
    @Transactional
    public OrderItemDTO addOrderItem(UUID orderId, OrderItemDTO itemDTO) {
        log.debug("Додавання нового предмета до замовлення з ID: {}", orderId);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        // Конвертуємо DTO в Entity
        OrderItemEntity item = orderMapper.toOrderItemEntity(itemDTO);
        
        // Додаємо предмет до замовлення
        order.addItem(item);
        
        // Розрахунок вартості предмета
        item.recalculateTotalPrice();
        
        // Перерахунок загальної вартості замовлення
        order.recalculateTotalAmount();
        
        // Зберігаємо оновлене замовлення
        order = orderRepository.save(order);
        
        // Знаходимо доданий предмет і повертаємо його DTO
        return order.getItems().stream()
                .filter(i -> i.getName().equals(item.getName()) && 
                          i.getQuantity().equals(item.getQuantity()) &&
                          i.getUnitPrice().equals(item.getUnitPrice()))
                .findFirst()
                .map(orderMapper::toOrderItemDTO)
                .orElseThrow(() -> new RuntimeException("Не вдалося знайти щойно доданий предмет"));
    }
    
    /**
     * Оновити існуючий предмет замовлення.
     */
    @Override
    @Transactional
    public OrderItemDTO updateOrderItem(UUID orderId, UUID itemId, OrderItemDTO itemDTO) {
        log.debug("Оновлення предмета з ID: {} у замовленні з ID: {}", itemId, orderId);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        // Знаходимо предмет для оновлення
        OrderItemEntity item = order.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Предмет не знайдено в замовленні", itemId
                ));
        
        // Оновлюємо поля предмету, ігноруючи id та order
        String[] ignoreProperties = {"id", "order"};
        BeanUtils.copyProperties(itemDTO, item, ignoreProperties);
        
        // Перерахунок вартості предмета
        item.recalculateTotalPrice();
        
        // Перерахунок загальної вартості замовлення
        order.recalculateTotalAmount();
        
        // Зберігаємо оновлене замовлення
        orderRepository.save(order);
        
        // Повертаємо оновлений предмет
        return orderMapper.toOrderItemDTO(item);
    }
    
    /**
     * Видалити предмет із замовлення.
     */
    @Override
    @Transactional
    public void deleteOrderItem(UUID orderId, UUID itemId) {
        log.debug("Видалення предмета з ID: {} із замовлення з ID: {}", itemId, orderId);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        // Знаходимо предмет для видалення
        OrderItemEntity itemToRemove = order.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Предмет не знайдено в замовленні", itemId
                ));
        
        // Видаляємо предмет із замовлення
        order.getItems().remove(itemToRemove);
        
        // Перерахунок загальної вартості замовлення
        order.recalculateTotalAmount();
        
        // Зберігаємо оновлене замовлення
        orderRepository.save(order);
    }
    
    /**
     * Генерування унікального номера квитанції.
     * Квитанція має формат: {year}{month}-{branch code}-{counter}
     * Наприклад: 202404-KYV-00001
     * 
     * @param branchLocation пункт прийому замовлення
     * @return унікальний номер квитанції
     */
    private String generateReceiptNumber(BranchLocationEntity branchLocation) {
        LocalDateTime now = LocalDateTime.now();
        int year = now.getYear();
        int month = now.getMonthValue();
        
        // Формуємо першу частину номера квитанції: рік та місяць
        String yearMonthPart = String.format("%d%02d", year, month);
        
        // Отримуємо код філії (branch code)
        String branchCode = branchLocation.getCode();
        
        // Отримуємо останній номер для цього року, місяця та філії
        String yearMonthBranchPrefix = yearMonthPart + "-" + branchCode + "-";
        Integer lastCounter = orderRepository.findMaxCounterByReceiptNumberPrefix(yearMonthBranchPrefix);
        
        // Якщо немає замовлень з таким префіксом, починаємо з 1
        int counter = (lastCounter != null) ? lastCounter + 1 : 1;
        
        // Формуємо кінцевий номер квитанції
        return yearMonthPart + "-" + branchCode + "-" + String.format("%05d", counter);
    }
    
    @Override
    @Transactional
    public OrderDTO updateOrderCompletionParameters(UUID orderId, ExpediteType expediteType, LocalDateTime expectedCompletionDate) {
        log.info("Updating order completion parameters for orderId: {}, expediteType: {}, expectedCompletionDate: {}", 
                orderId, expediteType, expectedCompletionDate);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        order.setExpediteType(expediteType);
        order.setExpectedCompletionDate(expectedCompletionDate);
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity savedOrder = orderRepository.save(order);
        log.info("Order completion parameters updated successfully for orderId: {}", orderId);
        
        return orderMapper.toDTO(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderEntity findOrderEntityById(UUID id) {
        log.debug("Пошук сутності замовлення за ID: {}", id);
        
        return orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
    }
    
    @Override
    @Transactional
    public OrderDTO saveOrder(OrderEntity orderEntity) {
        log.debug("Збереження замовлення з ID: {}", orderEntity.getId());
        
        OrderEntity savedOrder = orderRepository.save(orderEntity);
        log.info("Замовлення {} збережено", savedOrder.getId());
        
        return orderMapper.toDTO(savedOrder);
    }
}
