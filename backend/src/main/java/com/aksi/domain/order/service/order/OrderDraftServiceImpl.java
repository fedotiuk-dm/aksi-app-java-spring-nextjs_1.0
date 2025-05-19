package com.aksi.domain.order.service.order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з чернетками замовлень.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderDraftServiceImpl implements OrderDraftService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderManagementService orderManagementService;

    @Override
    @Transactional
    public OrderDTO saveOrderDraft(CreateOrderRequest request) {
        log.debug("Збереження чернетки замовлення");

        request.setDraft(true);
        OrderDTO draftOrder = orderManagementService.createOrder(request);

        log.info("Збережено чернетку замовлення");
        return draftOrder;
    }

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

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getDraftOrders() {
        log.debug("Отримання чернеток замовлень");

        List<OrderEntity> drafts = orderRepository.findByDraftTrue();

        return drafts.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }
}
