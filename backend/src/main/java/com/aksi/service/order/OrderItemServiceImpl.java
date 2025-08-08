package com.aksi.service.order;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.domain.order.ItemCharacteristicsEntity;
import com.aksi.domain.order.ItemDefectEntity;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.ItemRiskEntity;
import com.aksi.domain.order.ItemStainEntity;
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
              list.stream().map(orderMapper::toItemStainEntity).forEach(stain -> addStain(orderItem, stain));
            });

    Optional.ofNullable(request.getDefects())
        .ifPresent(
            list -> {
              orderItem.getDefects().clear();
              list.stream().map(orderMapper::toItemDefectEntity).forEach(defect -> addDefect(orderItem, defect));
            });

    Optional.ofNullable(request.getRisks())
        .ifPresent(
            list -> {
              orderItem.getRisks().clear();
              list.stream().map(orderMapper::toItemRiskEntity).forEach(risk -> addRisk(orderItem, risk));
            });

    orderRepository.save(order);

    log.info(
        "Updated characteristics for order item {} in order {}", itemId, order.getOrderNumber());

    return orderMapper.toOrderItemInfo(orderItem);
  }

  @Override
  public void addStain(OrderItemEntity orderItem, ItemStainEntity stain) {
    orderItem.getStains().add(stain);
    stain.setOrderItemEntity(orderItem);
  }

  @Override
  public void addDefect(OrderItemEntity orderItem, ItemDefectEntity defect) {
    orderItem.getDefects().add(defect);
    defect.setOrderItemEntity(orderItem);
  }

  @Override
  public void addRisk(OrderItemEntity orderItem, ItemRiskEntity risk) {
    orderItem.getRisks().add(risk);
    risk.setOrderItemEntity(orderItem);
  }

  @Override
  public void addPhoto(OrderItemEntity orderItem, ItemPhotoEntity photo) {
    orderItem.getPhotos().add(photo);
    photo.setOrderItemEntity(orderItem);
  }

  @Override
  public void removePhoto(OrderItemEntity orderItem, ItemPhotoEntity photo) {
    orderItem.getPhotos().remove(photo);
    photo.setOrderItemEntity(null);
  }

  @Override
  public void setCharacteristics(OrderItemEntity orderItem, ItemCharacteristicsEntity characteristics) {
    orderItem.setCharacteristics(characteristics);
    if (characteristics != null) {
      characteristics.setOrderItemEntity(orderItem);
    }
  }
}
