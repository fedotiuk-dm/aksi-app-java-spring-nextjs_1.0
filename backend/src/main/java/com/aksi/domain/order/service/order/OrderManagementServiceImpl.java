package com.aksi.domain.order.service.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.branch.repository.BranchLocationRepository;
import com.aksi.domain.branch.service.BranchValidator;
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
import com.aksi.domain.order.service.ReceiptNumberGenerator;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для базового управління замовленнями.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderManagementServiceImpl implements OrderManagementService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final BranchLocationRepository branchLocationRepository;
    private final OrderMapper orderMapper;
    private final ReceiptNumberGenerator receiptNumberGenerator;
    private final BranchValidator branchValidator;

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        log.debug("Отримання всіх замовлень");
        List<OrderEntity> orders = orderRepository.findAll();
        return orders.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderDTO> getOrderById(UUID id) {
        log.debug("Отримання замовлення за ID: {}", id);
        return orderRepository.findById(id)
                .map(orderMapper::toDTO);
    }

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

        // Генеруємо номер квитанції
        String branchCode = branchValidator.getBranchCodeOrDefault(
            mapToBranchLocationDTO(branchLocation), "DEF");
        order.setReceiptNumber(receiptNumberGenerator.generate(branchCode));
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
        log.debug("Збереження замовлення: {}", orderEntity.getId());
        orderEntity.setUpdatedDate(LocalDateTime.now());
        orderEntity.recalculateTotalAmount();
        OrderEntity savedOrder = orderRepository.save(orderEntity);
        return orderMapper.toDTO(savedOrder);
    }

    @Override
    public String generateReceiptNumber(UUID branchLocationId) {
        // Знаходимо філію для отримання її коду
        BranchLocationEntity branchLocation = branchLocationRepository.findById(branchLocationId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Пункт прийому замовлень не знайдено", branchLocationId
                ));

        // Використовуємо єдиний генератор номерів
        String branchCode = branchLocation.getCode() != null ? branchLocation.getCode() : "DEF";
        return receiptNumberGenerator.generate(branchCode);
    }

    /**
     * Конвертує BranchLocationEntity в BranchLocationDTO для роботи з валідатором.
     */
    private com.aksi.domain.branch.dto.BranchLocationDTO mapToBranchLocationDTO(BranchLocationEntity entity) {
        com.aksi.domain.branch.dto.BranchLocationDTO dto = new com.aksi.domain.branch.dto.BranchLocationDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCode(entity.getCode());
        dto.setActive(entity.getActive());
        dto.setAddress(entity.getAddress());
        dto.setPhone(entity.getPhone());
        // email поле може не існувати в entity
        return dto;
    }
}
