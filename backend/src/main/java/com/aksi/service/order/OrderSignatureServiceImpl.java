package com.aksi.service.order;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.OrderInfo;
import com.aksi.domain.order.OrderEntity;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.OrderRepository;
import com.aksi.service.order.guard.OrderGuard;
import com.aksi.service.order.util.OrderQueryUtils;
import com.aksi.service.order.validator.OrderValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of OrderSignatureService Manages customer signatures for orders */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderSignatureServiceImpl implements OrderSignatureService {

  private final OrderRepository orderRepository;

  private final OrderGuard orderGuard;
  private final OrderValidator orderValidator;
  private final OrderMapper orderMapper;
  private final OrderQueryUtils queryUtils;

  @Override
  public OrderInfo saveSignature(UUID orderId, String signatureBase64) {
    log.info("Saving customer signature for order: {}", orderId);

    // Step 1: Load entity
    OrderEntity order = orderGuard.ensureExists(orderId);

    // Step 2: Validate
    orderValidator.validateCanAddSignature(order);

    // Step 3: Apply signature
    order.setCustomerSignature(signatureBase64);

    // Step 4: Persist
    order = orderRepository.save(order);

    log.info("Saved customer signature for order {}", order.getOrderNumber());

    // Step 5: Map to DTO and enrich with calculated fields
    OrderInfo orderInfo = orderMapper.toOrderInfo(order);
    Integer paidAmount = queryUtils.calculatePaidAmount(order);
    Integer balanceDue = queryUtils.calculateBalanceDue(order);
    orderInfo.getPricing().setPaidAmount(paidAmount);
    orderInfo.getPricing().setBalanceDue(balanceDue);
    return orderInfo;
  }
}
