package com.aksi.service.order;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.domain.order.ItemCharacteristicsEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.OrderRepository;
import com.aksi.service.order.guard.OrderGuard;
import com.aksi.service.order.validator.OrderValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of OrderItemService Manages order item characteristics and attributes */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {

  private final OrderRepository orderRepository;

  private final OrderGuard orderGuard;
  private final OrderValidator orderValidator;
  private final OrderMapper orderMapper;

  @Override
  public OrderItemInfo updateCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request) {

    log.info("Updating characteristics for item {} in order {}", itemId, orderId);

    // Load and validate
    OrderEntity order = orderGuard.ensureExists(orderId);
    orderValidator.validateOrderModifiable(order);
    OrderItemEntity orderItem = orderGuard.ensureItemExists(order, itemId);

    Optional.ofNullable(request.getCharacteristics())
        .ifPresent(
            dto -> {
              ItemCharacteristicsEntity characteristics =
                  Objects.requireNonNullElseGet(
                      orderItem.getCharacteristics(),
                      () -> {
                        var c = new ItemCharacteristicsEntity();
                        c.setOrderItemEntity(orderItem);
                        orderItem.setCharacteristics(c);
                        return c;
                      });
              orderMapper.applyItemCharacteristics(dto, characteristics);
            });

    Optional.ofNullable(request.getStains())
        .ifPresent(
            list -> {
              orderItem.getStains().clear();
              list.stream().map(orderMapper::toItemStainEntity).forEach(orderItem::addStain);
            });

    Optional.ofNullable(request.getDefects())
        .ifPresent(
            list -> {
              orderItem.getDefects().clear();
              list.stream().map(orderMapper::toItemDefectEntity).forEach(orderItem::addDefect);
            });

    Optional.ofNullable(request.getRisks())
        .ifPresent(
            list -> {
              orderItem.getRisks().clear();
              list.stream().map(orderMapper::toItemRiskEntity).forEach(orderItem::addRisk);
            });

    orderRepository.save(order);

    log.info(
        "Updated characteristics for order item {} in order {}", itemId, order.getOrderNumber());

    return orderMapper.toOrderItemInfo(orderItem);
  }
}
