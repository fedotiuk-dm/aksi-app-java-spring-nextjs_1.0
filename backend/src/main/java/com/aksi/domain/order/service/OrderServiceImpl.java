package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exceptions.EntityNotFoundException;

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
                    .orElseThrow(() -> new EntityNotFoundException(
                        "Клієнт не знайдений з ID: " + orderRequest.getClientId()
                    ));
        }
        
        // Створюємо нове замовлення
        OrderEntity order = new OrderEntity();
        order.setTagNumber(orderRequest.getTagNumber());
        // Генеруємо номер квитанції, оскільки він відсутній у запиті
        order.setReceiptNumber(generateReceiptNumber());
        order.setClient(client);
        order.setBranchLocation(orderRequest.getBranchLocation());
        order.setStatus(OrderStatusEnum.NEW);
        order.setCreatedDate(LocalDateTime.now());
        order.setExpectedCompletionDate(orderRequest.getExpectedCompletionDate());
        order.setCustomerNotes(orderRequest.getCustomerNotes());
        order.setInternalNotes(orderRequest.getInternalNotes());
        order.setExpress(orderRequest.isExpress());
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
            OrderItemEntity item = orderMapper.fromDTO(itemDTO);
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
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
        
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
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
        
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
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
        
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
        
        log.info("Збережено чернетку замовлення з ID: {}", draftOrder.getId());
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
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
        
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
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
        
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
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
        
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
     * Генерування унікального номера квитанції.
     */
    private String generateReceiptNumber() {
        // Генеруємо номер формату: AKSI-YYYYMMDD-XXXX, де XXXX - випадкове число
        String datePart = LocalDateTime.now().toString().substring(0, 10).replace("-", "");
        String randomPart = String.format("%04d", (int) (Math.random() * 10000));
        
        return "AKSI-" + datePart + "-" + randomPart;
    }
}
