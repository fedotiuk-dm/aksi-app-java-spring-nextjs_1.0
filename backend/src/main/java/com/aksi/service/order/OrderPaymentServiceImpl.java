package com.aksi.service.order;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderPaymentEntity;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.OrderRepository;
import com.aksi.service.auth.AuthQueryService;
import com.aksi.service.order.factory.OrderFactory;
import com.aksi.service.order.guard.OrderGuard;
import com.aksi.service.order.util.OrderQueryUtils;
import com.aksi.service.order.validator.OrderValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of OrderPaymentService Manages payments for orders */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderPaymentServiceImpl implements OrderPaymentService {

  private final OrderRepository orderRepository;

  private final OrderGuard orderGuard;
  private final OrderValidator orderValidator;
  private final OrderFactory orderFactory;
  private final OrderMapper orderMapper;
  private final OrderQueryUtils orderQueryUtils;
  private final AuthQueryService authQueryService;

  @Override
  public PaymentInfo addPayment(UUID orderId, AddPaymentRequest request) {
    log.info("Adding payment of {} to order {}", request.getAmount(), orderId);

    // Step 1: Load entity
    OrderEntity order = orderGuard.ensureExists(orderId);

    // Step 2: Validate order status
    orderValidator.validateNotCancelled(order);

    // Step 3: Validate payment amount
    Integer remainingBalance = orderQueryUtils.calculateBalanceDue(order);
    orderValidator.validatePaymentAmount(request.getAmount(), remainingBalance);

    // Step 4: Create payment
    var currentUser = authQueryService.getCurrentUser();
    OrderPaymentEntity payment = orderFactory.createPayment(order, request, currentUser);

    // Step 5: Add to order (payment.setOrderEntity already set in factory)
    order.getPayments().add(payment);

    // Step 6: Persist
    orderRepository.save(order);

    log.info("Added payment of {} to order {}", request.getAmount(), order.getOrderNumber());
    return orderMapper.toPaymentInfo(payment);
  }
}
