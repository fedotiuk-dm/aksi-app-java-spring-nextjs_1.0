package com.aksi.domain.order.service.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для фінансових операцій із замовленнями.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderFinancialServiceImpl implements OrderFinancialService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderDTO calculateOrderTotal(OrderEntity order) {
        log.debug("Розрахунок загальної вартості замовлення: {}", order.getId());

        // Перерахунок вартості кожного предмета
        order.getItems().forEach(item -> item.recalculateTotalPrice());

        // Перерахунок загальної вартості замовлення
        order.recalculateTotalAmount();
        order.setUpdatedDate(LocalDateTime.now());

        OrderEntity savedOrder = orderRepository.save(order);
        log.info("Розраховано загальну вартість замовлення: {}", savedOrder.getId());

        return orderMapper.toDTO(savedOrder);
    }

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
}
